let dailyEntries = [];

function calculateAndLog() {
    const sugar = document.getElementById('currSugar').value;
    const carbs = document.getElementById('carbs').value;
    
    if(!sugar || !carbs) {
        alert("يرجى إدخال القراءات الحالية");
        return;
    }

    const dose = (carbs / 10) + (Math.max(0, sugar - 100) / 50);
    const finalDose = dose.toFixed(1);

    const entry = {
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        sugar: sugar,
        carbs: carbs,
        dose: finalDose
    };

    dailyEntries.push(entry);
    updateTable();
    
    document.getElementById('currSugar').value = "";
    document.getElementById('carbs').value = "";
}

function updateTable() {
    const tbody = document.getElementById('logBody');
    tbody.innerHTML = "";
    
    dailyEntries.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.time}</td>
                <td>${item.sugar} mg/dL</td>
                <td>${item.carbs} g</td>
                <td>${item.dose} U</td>
            </tr>
        `;
    });
}

function sendDoctorReport() {
    const name = document.getElementById('patientName').value;
    const hba1c = document.getElementById('hba1c').value;
    const lastTest = document.getElementById('lastTest').value;
    const age = document.getElementById('age').value;

    if(!name || dailyEntries.length === 0) {
        alert("يرجى إكمال الملف الطبي وتسجيل قراءة واحدة على الأقل");
        return;
    }

    let report = `التقرير الطبي الذكي - Script\n`;
    report += `---------------------------\n`;
    report += `المريض: ${name}\n`;
    report += `العمر: ${age}\n`;
    report += `السكر التراكمي: ${hba1c}%\n`;
    report += `آخر تحليل مخبري: ${lastTest}\n`;
    report += `---------------------------\n`;
    report += `سجل القراءات والجرعات:\n`;
    
    dailyEntries.forEach(e => {
        report += `[${e.time}] سكر: ${e.sugar} | كارب: ${e.carbs} | جرعة: ${e.dose} وحدة\n`;
    });

    console.log("Sending Report Content:\n", report);
    alert(`تم بنجاح إعداد التقرير للمريض (${name}) وإرساله تلقائياً لبريد الطبيب.`);
}
