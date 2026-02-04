const firebaseConfig = {
    apiKey: "AIzaSyDoDs_wxYRk9gK1Iw-62p5zY8pKfvg9zTw",
    authDomain: "teacherportfolioproject-1382f.firebaseapp.com",
    databaseURL: "https://teacherportfolioproject-1382f-default-rtdb.firebaseio.com/",
    projectId: "teacherportfolioproject-1382f"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const criteriaBase = [
    { id: 4, title: "تنوع استراتيجيات التدريس", icon: "fa-lightbulb" },
    { id: 6, title: "إعداد وتنفيذ خطة التعلم", icon: "fa-book-open" },
    { id: 7, title: "توظيف تقنيات التعليم", icon: "fa-laptop-code" },
    { id: 11, title: "تنوع أساليب التقويم", icon: "fa-clipboard-check" }
];

const unitKnowledge = {
    unit1: { 4: "استراتيجية التعلم باللعب (Unit 1)", 6: "تحضير دروس الوحدة الأولى", 7: "تطبيق Quizizz للوحدة الأولى", 11: "اختبار قصير Unit 1" },
    unit2: { 4: "تبادل الأدوار لدرس Family", 6: "خطة التدريس الأسبوعية - و2", 7: "استخدام السبورة التفاعلية", 11: "سجل متابعة مهارات الوحدة 2" }
};

// معالج روابط Drive
function fixDriveLink(url, isFolder = false) {
    if (!url || !url.includes('drive.google.com')) return url;
    if (isFolder) return url.replace('/view', '/preview').replace('?usp=sharing', '');
    const id = url.match(/\/d\/([^/]+)/);
    return id ? `https://drive.google.com/uc?export=view&id=${id[1]}` : url;
}

window.onload = () => {
    db.ref('myPortfolio').on('value', snap => {
        const data = snap.val() || {};
        renderProfile(data.profile || {});
        renderApprovedTable(data.approvedEvidence || {});
        document.getElementById('loading').style.display = 'none';
    });
};

function renderProfile(p) {
    const pic = fixDriveLink(p.pic);
    document.getElementById('picDisplay').innerHTML = pic ? `<img src="${pic}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">` : `<i class="fa-solid fa-user-tie"></i>`;
    document.getElementById('profName').innerText = p.name || "اسم المعلم";
    document.getElementById('editName').value = p.name || "";
    document.getElementById('editPic').value = p.pic || "";
}

function generateSmartSuggestions() {
    const unit = document.getElementById('unitSelector').value;
    const area = document.getElementById('suggestionsArea');
    if (!unit) return;

    area.innerHTML = criteriaBase.map(c => `
        <div class="suggestion-card">
            <h4><i class="fa-solid ${c.icon}"></i> ${c.title}</h4>
            <input type="text" id="name${c.id}" value="${unitKnowledge[unit][c.id] || ''}" placeholder="اسم الشاهد">
            <input type="text" id="link${c.id}" placeholder="رابط مجلد قوقل درايف">
            <label class="approve-label"><input type="checkbox" id="check${c.id}"> اعتماد للنشر</label>
        </div>
    `).join('');
}

function saveAllApproved() {
    const profile = { name: document.getElementById('editName').value, pic: document.getElementById('editPic').value };
    const evidence = {};
    criteriaBase.forEach(c => {
        if (document.getElementById(`check${c.id}`).checked) {
            evidence[`item${c.id}`] = {
                name: document.getElementById(`name${c.id}`).value,
                link: document.getElementById(`link${c.id}`).value
            };
        }
    });
    db.ref('myPortfolio/profile').update(profile);
    db.ref('myPortfolio/approvedEvidence').set(evidence).then(() => {
        alert("تم الاعتماد والنشر!");
        showPage('view');
    });
}

function renderApprovedTable(data) {
    const tbody = document.getElementById('approvedTableBody');
    tbody.innerHTML = criteriaBase.map(c => {
        const item = data[`item${c.id}`];
        if (!item) return '';
        return `<tr><td>${c.title}</td><td>${item.name}</td><td><button class="btn-view" onclick="openGallery('${item.link}')">👁️ عرض</button></td></tr>`;
    }).join('');
}

function openGallery(url) {
    document.getElementById('galleryIframe').src = fixDriveLink(url, true);
    document.getElementById('galleryModal').style.display = "flex";
}

function closeGallery() { document.getElementById('galleryModal').style.display = "none"; document.getElementById('galleryIframe').src = ""; }

function showPage(p) {
    if (p === 'admin' && prompt("كلمة المرور:") !== "123") return;
    document.getElementById('viewPage').style.display = p === 'view' ? 'block' : 'none';
    document.getElementById('adminPage').style.display = p === 'admin' ? 'block' : 'none';
}