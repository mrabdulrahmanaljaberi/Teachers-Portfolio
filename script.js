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
    const data = {
        name: document.getElementById('inName').value,
        subject: document.getElementById('inSubject').value,
        ach: document.getElementById('inAch').value,
        tools: document.getElementById('inTools').value,
        actions: document.getElementById('inActions').value,
        impact: document.getElementById('inImpact').value,
        badge: document.getElementById('inBadge').value,
        pdfUrl: document.getElementById('inPdf').value // حفظ الرابط
    };

    if(!data.name) return alert("الاسم مطلوب");

    if(key) {
        db.ref('teachers/' + key).set(data);
    } else {
        db.ref('teachers').push(data);
    }
    alert("تم الحفظ بنجاح!");
    clearForm();
}

db.ref('teachers').on('value', (snapshot) => {
    teachersData = snapshot.val() || {};
    refreshUI();
});

function refreshUI() {
    const sel = document.getElementById('teacherSelect');
    const tbody = document.getElementById('tableBody');
    sel.innerHTML = '<option value="">-- اختر المعلم --</option>';
    tbody.innerHTML = '';
    for(let key in teachersData) {
        const t = teachersData[key];
        sel.innerHTML += `<option value="${key}">${t.name}</option>`;
        tbody.innerHTML += `<tr><td>${t.name}</td><td>
            <button onclick="editTeacher('${key}')">تعديل</button>
            <button onclick="deleteTeacher('${key}')" style="color:red">حذف</button>
        </td></tr>`;
    }
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
    document.getElementById('outBadge').innerText = "ميثاق التميز: " + t.badge;

    // عرض زر الـ PDF إذا كان الرابط موجوداً
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

function editTeacher(key) {
    const t = teachersData[key];
    document.getElementById('inName').value = t.name;
    document.getElementById('inSubject').value = t.subject;
    document.getElementById('inAch').value = t.ach;
    document.getElementById('inTools').value = t.tools;
    document.getElementById('inActions').value = t.actions;
    document.getElementById('inImpact').value = t.impact;
    document.getElementById('inBadge').value = t.badge;
    document.getElementById('inPdf').value = t.pdfUrl || ""; // تعبئة حقل الرابط عند التعديل
    document.getElementById('editKey').value = key;
}

function deleteTeacher(key) {
    if(confirm("حذف نهائي؟")) db.ref('teachers/' + key).remove();
}

function clearForm() {
    document.querySelectorAll('input, textarea').forEach(el => el.value = "");
    document.getElementById('editKey').value = "";
}