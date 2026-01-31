let teachers = JSON.parse(localStorage.getItem('eduData')) || [];

function showPage(p) {
    if(p === 'admin') {
        let pass = prompt("الرجاء إدخال كلمة المرور للوصول للاستمارة:");
        if(pass !== "1234") { alert("كلمة المرور غير صحيحة!"); return; }
    }
    document.getElementById('viewPage').style.display = p === 'view' ? 'block' : 'none';
    document.getElementById('adminPage').style.display = p === 'admin' ? 'block' : 'none';
    document.getElementById('navView').classList.toggle('active', p === 'view');
    document.getElementById('navAdmin').classList.toggle('active', p === 'admin');
    refreshUI();
}

function saveData() {
    const teacher = {
        name: document.getElementById('inName').value,
        subject: document.getElementById('inSubject').value,
        ach: document.getElementById('inAch').value,
        tools: document.getElementById('inTools').value.split(','),
        actions: document.getElementById('inActions').value.split(','),
        impact: document.getElementById('inImpact').value.split(','),
        badge: document.getElementById('inBadge').value
    };

    if(!teacher.name) { alert("يرجى إدخال اسم المعلم على الأقل"); return; }

    const idx = document.getElementById('editIdx').value;
    if(idx === "") teachers.push(teacher);
    else teachers[idx] = teacher;

    localStorage.setItem('eduData', JSON.stringify(teachers));
    alert("تم حفظ البيانات بنجاح!");
    clearForm();
    refreshUI();
}

function refreshUI() {
    const sel = document.getElementById('teacherSelect');
    sel.innerHTML = '<option value="">-- اختر المعلم من القائمة --</option>' + 
        teachers.map((t, i) => `<option value="${i}">${t.name}</option>`).join('');

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = teachers.map((t, i) => `
        <tr>
            <td>${t.name}</td>
            <td>
                <button onclick="editTeacher(${i})" style="color:blue">تعديل</button> | 
                <button onclick="deleteTeacher(${i})" style="color:red">حذف</button>
            </td>
        </tr>
    `).join('');
}

function displayPortfolio() {
    const i = document.getElementById('teacherSelect').value;
    const card = document.getElementById('portfolioCard');
    if(i === "") { card.style.display = 'none'; return; }

    const t = teachers[i];
    document.getElementById('outName').innerText = t.name;
    document.getElementById('outSubject').innerText = t.subject;
    document.getElementById('outAch').innerText = t.ach;
    document.getElementById('outBadge').innerText = "ميثاق التميز: " + t.badge;

    fillList('outTools', t.tools);
    fillList('outActions', t.actions);
    fillList('outImpact', t.impact);
    card.style.display = 'block';
}

function fillList(id, arr) {
    const el = document.getElementById(id);
    el.innerHTML = arr.map(item => item.trim() ? `<li>${item.trim()}</li>` : '').join('');
}

function deleteTeacher(i) {
    if(confirm("هل أنت متأكد من حذف هذا المعلم؟")) {
        teachers.splice(i, 1);
        localStorage.setItem('eduData', JSON.stringify(teachers));
        refreshUI();
    }
}

function editTeacher(i) {
    const t = teachers[i];
    document.getElementById('inName').value = t.name;
    document.getElementById('inSubject').value = t.subject;
    document.getElementById('inAch').value = t.ach;
    document.getElementById('inTools').value = t.tools.join(',');
    document.getElementById('inActions').value = t.actions.join(',');
    document.getElementById('inImpact').value = t.impact.join(',');
    document.getElementById('inBadge').value = t.badge;
    document.getElementById('editIdx').value = i;
    window.scrollTo(0,0);
}

function clearForm() {
    document.querySelectorAll('input, textarea').forEach(el => el.value = "");
    document.getElementById('editIdx').value = "";
}

refreshUI();