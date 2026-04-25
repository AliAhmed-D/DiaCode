let logs = JSON.parse(localStorage.getItem('diaLogs')) || [];

function updateTable() {
    const body = document.getElementById('logBody');
    if (!body) return;
    body.innerHTML = '';
    logs.forEach(log => {
        body.innerHTML += `<tr>
            <td>${log.time}</td>
            <td>${log.sugar}</td>
            <td>${log.carbs}</td>
            <td>${log.dose}</td>
        </tr>`;
    });
    localStorage.setItem('diaLogs', JSON.stringify(logs));
}

function analyzeStatus() {
    const hba1c = document.getElementById('hba1c').value;
    const res = document.getElementById('statusResult');
    res.style.display = "block";
    if (hba1c > 7) {
        res.innerHTML = "⚠️ السكر التراكمي مرتفع. يرجى مراجعة الطبيب.";
        res.style.color = "#ff4d4d";
    } else {
        res.innerHTML = "✅ وضعك الصحي مستقر حالياً.";
        res.style.color = "#00ff88";
    }
}

function calculateAndLog() {
    const sugar = document.getElementById('currSugar').value;
    const carbs = document.getElementById('carbs').value;
    const icr = document.getElementById('icr').value;
    const res = document.getElementById('doseResult');

    if (!sugar || !carbs) {
        alert("يرجى إدخال البيانات المطلوبة");
        return;
    }

    const dose = (carbs / icr).toFixed(1);
    res.style.display = "block";
    res.innerHTML = `💉 الجرعة المقترحة: ${dose} وحدة`;

    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');

    logs.push({ time: timeStr, sugar, carbs, dose });
    updateTable();
}

function sendToWhatsApp() {
    const name = document.getElementById('patientName').value;
    const phone = document.getElementById('docPhone').value;
    const hba1c = document.getElementById('hba1c').value;
    const weight = document.getElementById('weight').value;

    if (!phone) {
        alert("يرجى إدخال رقم واتساب الطبيب");
        return;
    }

    let message = `*تقرير DiaCode الطبي* 🩺%0A`;
    message += `👤 المريض: ${name || 'غير مسجل'}%0A`;
    message += `📊 التراكمي: ${hba1c || '---'}%0A`;
    message += `⚖️ الوزن: ${weight || '---'} كجم%0A`;
    message += `---------------------------%0A`;
    message += `📑 *سجل القراءات اليومي:*%0A`;

    if (logs.length === 0) {
        message += `لا توجد قراءات مسجلة.%0A`;
    } else {
        logs.slice(-5).forEach((log, i) => {
            message += `${i+1}. الوقت: ${log.time} | السكر: ${log.sugar} | الجرعة: ${log.dose}%0A`;
        });
    }

    message += `---------------------------%0A`;
    message += `✅ تم الإرسال عبر نظام DiaCode الذكي.`;

    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${message}`, '_blank');
}

function clearLogs() {
    if (confirm("هل أنت متأكد من مسح جميع القراءات؟")) {
        logs = [];
        updateTable();
    }
}

updateTable();
