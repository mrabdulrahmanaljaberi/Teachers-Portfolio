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

// دالة جلب الـ IP للتوثيق
async function getIP() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch { return "Unknown"; }
}

function showPage(p) {
    if(p === 'admin') {
        let pass = prompt("كلمة مرور الإدارة العامة:");
        if(pass !== "1234") return; // كلمة مرور المشرف العام
    }
    document.getElementById('viewPage').style.display = p === 'view' ? 'block' : 'none';
    document.getElementById('adminPage').style.display = p === 'admin' ? 'block' : 'none';
}

async function saveData() {
    const key = document.getElementById('editKey').value;
    const userIP = await getIP();
    
    const data = {
        name: document.getElementById('inName').value,
        subject: document.getElementById('inSubject').value,
        pass: document.getElementById('inPass').value, // كلمة المرور الخاصة
        ach: document.getElementById('inAch').value,
        tools: document.getElementById('inTools').value,
        actions: document.getElementById('inActions').value,
        impact: document.getElementById('inImpact').value,
        badge: document.getElementById('inBadge').value,
        pdfUrl: document.getElementById('inPdf').value,
        lastEditIP: userIP,
        lastEditTime: new Date().toLocaleString('ar-SA')
    };

    if(!data.name || !data.pass) return alert("الاسم وكلمة المرور مطلوبان");

    if(key) {
        db.ref('teachers/' + key).set(data);
    } else {
        db.ref('teachers').push(data);
    }
    alert("تم حفظ البيانات وتوثيق العملية بنجاح!");
    clearForm();
}

db.ref('teachers').on('value', (snapshot) => {
    teachersData = snapshot.val() || {};
    refreshUI();
});

function refreshUI() {
    const sel = document.getElementById('teacherSelect');
    const tbody = document.getElementById('tableBody');
    sel.innerHTML = '<option value="">-- اختر اسم المعلم --</option>';
    tbody.innerHTML = '';
    for(let key in teachersData) {
        const t = teachersData[key];
        sel.innerHTML += `<option value="${key}">${t.name}</option>`;
        tbody.innerHTML += `<tr><td>${t.name}</td><td>
            <button onclick="checkAuth('${key}', 'edit')">تعديل</button>
            <button onclick="checkAuth('${key}', 'delete')" style="color:red">حذف</button>
        </td></tr>`;
    }
}

// دالة التحقق من هوية المعلم قبل أي تعديل
function checkAuth(key, action) {
    const t = teachersData[key];
    const inputPass = prompt(`يرجى إدخال كلمة المرور الخاصة بالمعلم (${t.name}):`);
    
    if(inputPass === t.pass) {
        if(action === 'edit') editTeacher(key);
        else deleteTeacher(key);
    } else {
        alert("خطأ: كلمة المرور غير صحيحة. لا تملك صلاحية التعديل على هذا الاسم.");
    }
}

function editTeacher(key) {
    const t = teachersData[key];
    document.getElementById('inName').value = t.name;
    document.getElementById('inSubject').value = t.subject;
    document.getElementById('inPass').value = t.pass;
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
    if(confirm("هل أنت متأكد من الحذف النهائي؟")) db.ref('teachers/' + key).remove();
}

function displayPortfolio() {
    const key = document.getElementById('teacherSelect').value;
    const card = document.getElementById('portfolioCard');
    if(!key) { card.style.display = 'none'; return; }

    const t = teachersData[key];
    document.getElementById('outName').innerText = t.name;
    document.getElementById('outSubject').innerText = t.subject;
    document.getElementById('outAch').innerText = t.ach;
    document.getElementById('outBadge').innerText = "ميثاق التميز: " + t.badge;

    const pdfSec = document.getElementById('pdfSection');
    if(t.pdfUrl) {
        document.getElementById('outPdf').href = t.pdfUrl;
        pdfSec.style.display = 'block';
    } else { pdfSec.style.display = 'none'; }

    fillList('outTools', t.tools);
    fillList('outActions', t.actions);
    fillList('outImpact', t.impact);
    card.style.display = 'block';
}

function fillList(id, str) {
    const el = document.getElementById(id);
    el.innerHTML = str.split(',').map(i => i.trim() ? `<li>${i.trim()}</li>` : '').join('');
}

function clearForm() {
    document.querySelectorAll('input, textarea').forEach(el => el.value = "");
    document.getElementById('editKey').value = "";
}
