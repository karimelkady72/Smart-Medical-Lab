document.addEventListener("DOMContentLoaded", function () {
    // 1. وظيفة الدارك مود (كما هي)
    let toggle = document.getElementById("theme-toggle");
    if (toggle) {
        if (localStorage.getItem("theme") === "dark") {
            document.documentElement.classList.add("dark-mode");
            toggle.checked = true;
        }
        toggle.addEventListener("change", function () {
            if (this.checked) {
                document.documentElement.classList.add("dark-mode");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.classList.remove("dark-mode");
                localStorage.setItem("theme", "light");
            }
        });
    }

    // 2. وظيفة البحث (كما هي)
    let searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            let value = searchInput.value.toLowerCase();
            let items = document.querySelectorAll(".analysis");
            items.forEach(function (item) {
                let text = item.textContent.toLowerCase();
                item.style.display = text.includes(value) ? "" : "none";
            });
        });
    }

    // 3. منيو الموبايل (كما هي)[cite: 28]
    const hamburger = document.getElementById("hamburger");
    const navUl = document.querySelector("nav ul");
    if (hamburger && navUl) {
        hamburger.addEventListener("click", function() {
            navUl.classList.toggle("show-menu");
        });
    }

    // 4. تأمين صفحة التسجيل (الباسورد + طول الموبايل)[cite: 28, 30]
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            const pass = document.getElementById("reg-password").value;
            const confirm = document.getElementById("reg-confirm").value;
            const phone = document.getElementById("phone-number").value;
            const limit = document.getElementById("phone-number").maxLength;
            const isArabic = document.documentElement.lang === "ar";

            if (pass !== confirm) {
                e.preventDefault();
                alert(isArabic ? "❌ كلمتا المرور غير متطابقتين!" : "❌ Passwords do not match!");
                return;
            }

            if (phone.length !== parseInt(limit)) {
                e.preventDefault();
                alert(isArabic ? `❌ رقم الهاتف يجب أن يكون ${limit} أرقام!` : `❌ Phone number must be ${limit} digits!`);
            }
        });
    }

    // 5. وظيفة الـ Book Now (كما هي)[cite: 28]
    const urlParams = new URLSearchParams(window.location.search);
    const testName = urlParams.get('test');
    if (testName) {
        setTimeout(() => {
            const testInput = document.getElementById("test-type-input");
            if (testInput) {
                testInput.value = testName;
                const parentDetails = testInput.closest("details");
                if (parentDetails) parentDetails.open = true;
                testInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 500);
    }

    // 6. نظام الحجز وتخزين البيانات (كما هي)[cite: 28]
    const isArabic = document.documentElement.lang === "ar";
    function setupBooking(formId, serviceAr, serviceEn) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                const dateVal = form.querySelector('input[type="date"]').value;
                const randomHour = Math.floor(Math.random() * (20 - 9 + 1)) + 9;
                const randomMin = ["00", "15", "30", "45"][Math.floor(Math.random() * 4)];
                const finalTime = `${randomHour}:${randomMin}`;
                let appointments = JSON.parse(localStorage.getItem("myAppointments") || "[]");
                appointments.push({ service: isArabic ? serviceAr : serviceEn, date: dateVal, time: finalTime });
                localStorage.setItem("myAppointments", JSON.stringify(appointments));
                alert(isArabic ? `✅ تم حجز ${serviceAr} بنجاح!` : `✅ ${serviceEn} Booked Successfully!`);
                form.reset();
            });
        }
    }
    setupBooking("lab-form", "تحليل المعمل", "Lab Test");
    setupBooking("doctor-form", "كشف الطبيب", "Doctor Appointment");
    setupBooking("home-form", "الزيارة المنزلية", "Home Visit");

    // 7. عرض المواعيد (تم تعديله لإضافة رسالة "لا توجد مواعيد")[cite: 28]
    const appointmentList = document.getElementById("appointment-list");
    if (appointmentList) {
        let appointments = JSON.parse(localStorage.getItem("myAppointments") || "[]");
        if (appointments.length === 0) {
            // إضافة الرسالة هنا[cite: 28]
            appointmentList.innerHTML = isArabic ? "<p>لا توجد مواعيد محجوزة حالياً.</p>" : "<p>No appointments booked yet.</p>";
        } else {
            appointments.forEach((app) => {
                const item = document.createElement("div");
                item.className = "activity-item";
                item.innerHTML = `<strong>${app.service}</strong><br><span>${app.date} | ${app.time}</span>`;
                appointmentList.appendChild(item);
            });
        }
    }
});

// --- وظائف خارج الـ DOMContentLoaded ---

// تعديل: Placeholder هيفضل ثابت "Phone Number"
function updatePhoneLimit() {
    const countrySelect = document.getElementById("country-code");
    const phoneInput = document.getElementById("phone-number");
    if (!countrySelect || !phoneInput) return;
    
    const selectedLen = countrySelect.options[countrySelect.selectedIndex].getAttribute("data-len");
    phoneInput.maxLength = selectedLen;
    phoneInput.minLength = selectedLen;
    // تم حذف سطر تغيير الـ placeholder ليبقى ثابت
    phoneInput.value = ""; 
}

function switchToArabic() { window.location.href = (window.location.pathname.split("/").pop() || "home.html").replace(".html", "-ar.html"); }
function switchToEnglish() { window.location.href = (window.location.pathname.split("/").pop() || "home-ar.html").replace("-ar.html", ".html"); }