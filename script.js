const firebaseConfig = {
  apiKey: "AIzaSyDoDs_wxYRk9gK1Iw-62p5zY8pKfvg9zTw",
  authDomain: "teacherportfolioproject-1382f.firebaseapp.com",
  databaseURL: "https://teacherportfolioproject-1382f-default-rtdb.firebaseio.com/",
  projectId: "teacherportfolioproject-1382f",
  storageBucket: "teacherportfolioproject-1382f.firebasestorage.app",
  messagingSenderId: "732846804242",
  appId: "1:732846804242:web:33453e7243ea1132ddb7cb"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let teachersData = {};

function showPage(p) {
    if(p === 'admin') {
        let pass = prompt("كلمة مرور الإدارة:");
        if(pass !== "1234") return;
    }
    document.getElementById('viewPage').style.display = p === 'view' ? 'block' : 'none';
    document.getElementById('adminPage').style.display = p === 'admin' ? 'block' : 'none';
}

function saveData() {
    const key = document.getElementById('editKey').value;
    const timestamp = new Date().toLocaleString('ar-SA');
    const achievementID = key ? key : "ACH-" + Date.now(); // رقم فريد لكل إنجاز

    const data = {
        name: document.getElementById('inName').value,
        subject: document.getElementById('inSubject').value,
        ach: document.getElementById('inAch').value,
        tools: document.getElementById('inTools').value,
        actions: document.getElementById('inActions').value,
        impact: document.getElementById('inImpact').value,
        badge: document.getElementById('inBadge').value,
        pdfUrl: document.getElementById('inPdf').value,
        date: timestamp,
        idNumber: achievementID
    };

    if (!data.name || !data.ach) {
        alert("يرجى ملء اسم المعلم ونوع الإنجاز على الأقل");
        return;
    }

    // الحفظ في قاعدة البيانات
    db.ref('teachers/' + achievementID).set(data).then(() => {
        alert("تم حفظ الإنجاز بنجاح برقم: " + achievementID);
        resetForm();
    });
}

function resetForm() {
    document.getElementById('editKey').value = "";
    document.querySelectorAll('#adminPage input, #adminPage textarea').forEach(el => el.value = "");
}

// تحديث البيانات في الوقت الفعلي
db.ref('teachers').on('value', (snapshot) => {
    teachersData = snapshot.val() || {};
    updateSelectors();
    updateAdminTable();
});

function updateSelectors() {
    const sel = document.getElementById('teacherSelect');
    sel.innerHTML = '<option value="">-- اختر الإنجاز (بالرقم والمعلم) --</option>';
    
    // ترتيب الإنجازات من الأحدث للأقدم
    Object.keys(teachersData).reverse().forEach(key => {
        const t = teachersData[key];
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = `${t.idNumber} - ${t.name} (${t.ach.substring(0, 20)}...)`;
        sel.appendChild(opt);
    });
}

function displayPortfolio() {
    const key = document.getElementById('teacherSelect').value;
    const card = document.getElementById('portfolioCard');
    const pdfSec = document.getElementById('pdfSection');
    
    if(!key) { card.style.display = 'none'; return; }

    const t = teachersData[key];
    document.getElementById('outName').innerText = t.name;
    document.getElementById('outSubject').innerText = t.subject;
    document.getElementById('outAch').innerText = t.ach;
    document.getElementById('outDate').innerText = "تاريخ الإدراج: " + t.date;
    document.getElementById('outID').innerText = "رقم الإنجاز المرجعي: " + t.idNumber;
    document.getElementById('outBadge').innerText = "ميثاق التميز: " + t.badge;

    if(t.pdfUrl && t.pdfUrl.trim() !== "") {
        document.getElementById('outPdf').href = t.pdfUrl;
        pdfSec.style.display = 'block';
    } else {
        pdfSec.style.display = 'none';
    }

    fillList('outTools', t.tools);
    fillList('outActions', t.actions);
    fillList('outImpact', t.impact);
    card.style.display = 'block';
}

function fillList(id, str) {
    const el = document.getElementById(id);
    el.innerHTML = str.split(',').map(i => i.trim() ? `<li>${i.trim()}</li>` : '').join('');
}

function updateAdminTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = "";
    Object.keys(teachersData).forEach(key => {
        const t = teachersData[key];
        tbody.innerHTML += `
            <tr>
                <td>${t.name} <br> <small>${t.idNumber}</small></td>
                <td>
                    <button onclick="editTeacher('${key}')">تعديل</button>
                    <button onclick="deleteTeacher('${key}')" style="background:red">حذف</button>
                </td>
            </tr>
        `;
    });
}

function editTeacher(key) {
    const t = teachersData[key];
    document.getElementById('inName').value = t.name;
    document.getElementById('inSubject').value = t.subject;
    document.getElementById('inAch').value = t.ach;
    document.getElementById('inTools').value = t.tools;
    document.getElementById('inActions').value = t.actions;
    document.getElementById('inImpact').value = t.impact;
    document.getElementById('inBadge').value = t.badge;
    document.getElementById('inPdf').value = t.pdfUrl || "";
    document.getElementById('editKey').value = key;
    window.scrollTo(0,0);
}

function deleteTeacher(key) {
    if(confirm("هل أنت متأكد من حذف هذا الإنجاز نهائياً؟")) {
        db.ref('teachers/' + key).remove();
    }
}