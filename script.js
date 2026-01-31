let teachers = JSON.parse(localStorage.getItem('eduData')) || [];

function showPage(p) {
    if(p === 'admin') {
        let pass = prompt("كلمة المرور:");
        if(pass !== "1234") return;
    }
    document.getElementById('viewPage').style.display = p === 'view' ? 'block' : 'none';
    document.getElementById('adminPage').style.display = p === 'admin' ? 'block' : 'none';
    document.getElementById('navView').classList.toggle('active', p === 'view');
    document.getElementById('navAdmin').classList.toggle('active', p === 'admin');
    refreshUI();
}

function saveData() {
    const t = {
        name: document.getElementById('inName').value,
        subject: document.getElementById('inSubject').value,
        ach: document.getElementById('inAch').value,
        tools: document.getElementById('inTools').value.split(','),
        actions: document.getElementById('inActions').value.split(','),
        impact: document.getElementById('inImpact').value.split(','),
        badge: document.getElementById('inBadge').value
    };
    const idx = document.getElementById('editIdx').value;
    if(idx === "") teachers.push(t); else teachers[idx] = t;
    localStorage.setItem('eduData', JSON.stringify(teachers));
    refreshUI();
    clearForm();
}

function refreshUI() {
    const sel = document.getElementById('teacherSelect');
    sel.innerHTML = '<option value="">-- اختر المعلم --</option>' + teachers.map((t,i)=>`<option value="${i}">${t.name}</option>`).join('');
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = teachers.map((t,i)=>`<tr><td>${t.name}</td><td><button onclick="editT(${i})">📝</button><button onclick="deleteT(${i})">❌</button></td></tr>`).join('');
}

function displayPortfolio() {
    const i = document.getElementById('teacherSelect').value;
    if(i === "") { document.getElementById('portfolioCard').style.display='none'; return; }
    const t = teachers[i];
    document.getElementById('outName').innerText = t.name;
    document.getElementById('outSubject').innerText = t.subject;
    document.getElementById('outAch').innerText = t.ach;
    document.getElementById('outTools').innerHTML = t.tools.map(x=>`<li>${x}</li>`).join('');
    document.getElementById('outActions').innerHTML = t.actions.map(x=>`<li>${x}</li>`).join('');
    document.getElementById('outImpact').innerHTML = t.impact.map(x=>`<li>${x}</li>`).join('');
    document.getElementById('outBadge').innerText = "المؤشر: " + t.badge;
    document.getElementById('portfolioCard').style.display='block';
}

function deleteT(i) { teachers.splice(i,1); localStorage.setItem('eduData', JSON.stringify(teachers)); refreshUI(); }
function editT(i) {
    const t = teachers[i];
    document.getElementById('inName').value = t.name;
    document.getElementById('inSubject').value = t.subject;
    document.getElementById('inAch').value = t.ach;
    document.getElementById('inTools').value = t.tools.join(',');
    document.getElementById('editIdx').value = i;
}
function clearForm() { document.querySelectorAll('input, textarea').forEach(e=>e.value=""); document.getElementById('editIdx').value=""; }
refreshUI();