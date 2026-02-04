const firebaseConfig = {
    apiKey: "AIzaSyDoDs_wxYRk9gK1Iw-62p5zY8pKfvg9zTw",
    authDomain: "teacherportfolioproject-1382f.firebaseapp.com",
    databaseURL: "https://teacherportfolioproject-1382f-default-rtdb.firebaseio.com/",
    projectId: "teacherportfolioproject-1382f"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const criteriaBase = [
    { id: 1, title: "أداء الواجبات الوظيفية", weight: "10%", hint: "سجل الدوام، خطة المنهج" },
    { id: 2, title: "التفاعل مع المجتمع المحلي", weight: "10%", hint: "مبادرات، ورش عمل" },
    { id: 3, title: "التفاعل مع أولياء الأمور", weight: "10%", hint: "سجل التواصل" },
    { id: 4, title: "التنوع في استراتيجيات التدريس", weight: "10%", hint: "نماذج دروس، استراتيجيات" },
    { id: 5, title: "تحسين نتائج المتعلمين", weight: "10%", hint: "تحليل نتائج، خطط علاجية" },
    { id: 6, title: "إعداد وتنفيذ خطة التعلم", weight: "10%", hint: "تحضير، واجبات" },
    { id: 7, title: "توظيف تقنيات التعليم", weight: "10%", hint: "تطبيقات، وسائل تقنية" },
    { id: 8, title: "تهيئة البيئة التعليمية", weight: "5%", hint: "تحفيز، إدارة بيئة" },
    { id: 9, title: "الإدارة الصفية", weight: "5%", hint: "ضبط سلوك، متابعة" },
    { id: 10, title: "تحليل نتائج المتعلمين", weight: "10%", hint: "تقارير إحصائية" },
    { id: 11, title: "تنوع أساليب التقويم", weight: "10%", hint: "اختبارات، مشاريع" }
];

// تحميل البيانات الأولية
window.onload = () => {
    db.ref('myPortfolio').on('value', snapshot => {
        const data = snapshot.val() || {};
        updateYearSelect(data.years);
        renderProfile(data.profile);
        document.getElementById('loading').style.display = 'none';
    });
    generateAdminFields();
};

function generateAdminFields() {
    const container = document.getElementById('adminFormContainer');
    container.innerHTML = criteriaBase.map(c => `
        <div class="admin-item">
            <h4>${c.title} (${c.weight})</h4>
            <input type="text" id="evName${c.id}" placeholder="اسم الشاهد">
            <input type="url" id="evLink${c.id}" placeholder="رابط مجلد الصور">
        </div>
    `).join('');
}

function autoFillCriteria() {
    criteriaBase.forEach(c => {
        document.getElementById(`evName${c.id}`).value = "شاهد: " + c.hint.split('،')[0];
    });
}

function saveAllData() {
    const year = document.getElementById('yearSelect').value || "2026";
    const update = {
        profile: {
            name: document.getElementById('editName').value,
            subj: document.getElementById('editSubj').value,
            vision: document.getElementById('editVision').value,
            mission: document.getElementById('editMission').value
        }
    };

    const yearData = {};
    criteriaBase.forEach(c => {
        yearData[`item${c.id}`] = {
            name: document.getElementById(`evName${c.id}`).value,
            link: document.getElementById(`evLink${c.id}`).value
        };
    });

    db.ref(`myPortfolio/profile`).set(update.profile);
    db.ref(`myPortfolio/years/${year}`).set(yearData);
    alert("تم الأرشفة والحفظ بنجاح!");
}

function loadYearData() {
    const year = document.getElementById('yearSelect').value;
    db.ref(`myPortfolio/years/${year}`).once('value', snap => {
        const data = snap.val() || {};
        const tbody = document.getElementById('viewTableBody');
        tbody.innerHTML = criteriaBase.map(c => {
            const item = data[`item${c.id}`] || {};
            return `
                <tr>
                    <td>${c.title}</td>
                    <td><span class="badge">${c.weight}</span></td>
                    <td>${item.name || '---'}</td>
                    <td>${item.link ? `<button onclick="openGallery('${item.link}')">🖼️ عرض</button>` : '❌'}</td>
                </tr>`;
        }).join('');
    });
}

function openGallery(url) {
    document.getElementById('galleryIframe').src = url;
    document.getElementById('galleryModal').style.display = "block";
}

function closeGallery() {
    document.getElementById('galleryModal').style.display = "none";
}

function showPage(p) {
    if(p==='admin') { if(prompt("كلمة المرور:") !== "123") return; }
    document.getElementById('viewPage').style.display = p==='view'?'block':'none';
    document.getElementById('adminPage').style.display = p==='admin'?'block':'none';
}
// دوال مساعدة إضافية لتحديث القوائم...
