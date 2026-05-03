// أول ما الصفحة تخلص تحميل بنشغل كل الكود عشان العناصر تكون موجودة في الصفحة
document.addEventListener("DOMContentLoaded", function () {

    // ====== DARK MODE ======
    // الجزء ده مسؤول عن تشغيل الوضع الليلي وحفظ اختيار المستخدم
    let toggle = document.getElementById("theme-toggle");

    if (toggle) {

        // لو المستخدم كان مفعّل الدارك مود قبل كده، بنرجعه تلقائي
        if (localStorage.getItem("theme") === "dark") {
            document.documentElement.classList.add("dark-mode");
            toggle.checked = true;
        }

        // لما المستخدم يغير بين light و dark
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

    // ====== COUNTER ANIMATION ======
    // الجزء ده بيعمل عدادات الأرقام اللي بتزيد لما تظهر في الشاشة
    const stats = document.querySelectorAll('.stat-num');

    const observerOptions = { threshold: 0.5 };

    const counterObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            // لما الرقم يظهر في الشاشة يبدأ العد
            if (entry.isIntersecting) {

                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target')) || 0;
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';

                let count = 0;
                const speed = target / 100;

                // دالة بتزود الرقم تدريجي لحد ما يوصل للهدف
                const updateCount = () => {
                    count += speed;

                    if (count < target) {
                        el.innerText = prefix + Math.ceil(count).toLocaleString() + suffix;
                        setTimeout(updateCount, 20);
                    } else {
                        el.innerText = prefix + target.toLocaleString() + suffix;
                    }
                };

                updateCount();

                // عشان العداد مايعيدش نفسه تاني
                observer.unobserve(el);
            }
        });

    }, observerOptions);

    stats.forEach(stat => counterObserver.observe(stat));

    // ====== SEARCH FILTER ======
    // الجزء ده بيعمل بحث مباشر داخل العناصر ويخفي أو يظهر النتائج
    let searchInput = document.getElementById("searchInput");

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            let value = searchInput.value.toLowerCase();
            let items = document.querySelectorAll(".analysis");

            // بنقارن كل عنصر بالبحث ونخفي اللي مش مطابق
            items.forEach(function (item) {
                let text = item.textContent.toLowerCase();
                item.style.display = text.includes(value) ? "" : "none";
            });
        });
    }

    // ====== MOBILE MENU ======
    // الجزء ده مسؤول عن فتح وقفل المنيو في الموبايل
    const hamburger = document.getElementById("hamburger");
    const navUl = document.querySelector("nav ul");

    if (hamburger && navUl) {
        hamburger.addEventListener("click", function () {
            navUl.classList.toggle("show-menu");
        });
    }

    // ====== REGISTER VALIDATION ======
    // الجزء ده بيتأكد إن بيانات التسجيل صحيحة قبل الإرسال
    const registerForm = document.getElementById("register-form");

    if (registerForm) {

        registerForm.addEventListener("submit", function (e) {

            const pass = document.getElementById("reg-password").value;
            const confirm = document.getElementById("reg-confirm").value;
            const phone = document.getElementById("phone-number").value;
            const limit = document.getElementById("phone-number").maxLength;

            const isArabic = document.documentElement.lang === "ar";

            // التأكد إن الباسوردين نفس بعض
            if (pass !== confirm) {
                e.preventDefault();
                alert(isArabic ? "❌ كلمتا المرور غير متطابقتين!" : "❌ Passwords do not match!");
                return;
            }

            // التأكد من طول رقم التليفون
            if (phone.length !== parseInt(limit)) {
                e.preventDefault();
                alert(isArabic ? `❌ لازم الرقم يكون ${limit} أرقام!` : `❌ Phone must be ${limit} digits!`);
            }
        });
    }

    // ====== BOOK NOW AUTO FILL ======
    // الجزء ده بيجيب اسم التحليل من اللينك ويحطه تلقائي في الفورم
    const urlParams = new URLSearchParams(window.location.search);
    const testName = urlParams.get('test');

    if (testName) {

        setTimeout(() => {

            const testInput = document.getElementById("test-type-input");

            if (testInput) {

                testInput.value = testName;

                // بيفتح الجزء اللي فيه الفورم تلقائي
                const parentDetails = testInput.closest("details");
                if (parentDetails) parentDetails.open = true;

                // بينزل المستخدم للفورم مباشرة
                testInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

        }, 500);
    }

    // ====== BOOKING SYSTEM ======
    // الجزء ده مسؤول عن حجز المواعيد وتخزينها في المتصفح
    const isArabic = document.documentElement.lang === "ar";

    function setupBooking(formId, serviceAr, serviceEn) {

        const form = document.getElementById(formId);

        if (form) {

            form.addEventListener("submit", function (e) {
                e.preventDefault();

                const dateVal = form.querySelector('input[type="date"]').value;
                const timeInput = form.querySelector('input[type="time"]');
                const timeVal = timeInput ? timeInput.value : "00:00";

                let appointments = JSON.parse(localStorage.getItem("myAppointments") || "[]");

                // بنضيف الحجز الجديد في الذاكرة
                appointments.push({
                    service: isArabic ? serviceAr : serviceEn,
                    date: dateVal,
                    time: timeVal
                });

                localStorage.setItem("myAppointments", JSON.stringify(appointments));

                alert(isArabic ? `✅ تم الحجز بنجاح!` : `✅ Booked Successfully!`);

                form.reset();
            });
        }
    }

    setupBooking("lab-form", "تحليل المعمل", "Lab Test");
    setupBooking("doctor-form", "كشف الطبيب", "Doctor Appointment");
    setupBooking("home-form", "الزيارة المنزلية", "Home Visit");

    // ====== SHOW APPOINTMENTS ======
    // الجزء ده بيعرض المواعيد اللي اتخزنت قبل كده
    const appointmentList = document.getElementById("appointment-list");
    const isArabicLang = document.documentElement.lang === "ar";

    if (appointmentList) {

        let appointments = JSON.parse(localStorage.getItem("myAppointments") || "[]");

        // لو مفيش مواعيد
        if (appointments.length === 0) {
            appointmentList.innerHTML = isArabicLang
                ? "<p>مفيش مواعيد محجوزة حالياً.</p>"
                : "<p>No appointments booked yet.</p>";
        } else {

            // عرض كل موعد في شكل كارت
            appointments.forEach((app) => {
                const item = document.createElement("div");
                item.className = "activity-item";

                item.innerHTML = `<strong>${app.service}</strong><br><span>${app.date} | ${app.time}</span>`;
                appointmentList.appendChild(item);
            });
        }
    }
});


// ====== OUTSIDE FUNCTIONS ======

// تغيير طول رقم التليفون حسب الدولة
function updatePhoneLimit() {
    const countrySelect = document.getElementById("country-code");
    const phoneInput = document.getElementById("phone-number");

    if (!countrySelect || !phoneInput) return;

    const selectedLen = countrySelect.options[countrySelect.selectedIndex].getAttribute("data-len");

    phoneInput.maxLength = selectedLen;
    phoneInput.minLength = selectedLen;
    phoneInput.value = "";
}

// تحويل الموقع للعربي
function switchToArabic() {
    let pageName = window.location.pathname.split("/").pop() || "home.html";

    if (pageName.indexOf("-ar.html") === -1) {
        window.location.href = pageName.replace(".html", "-ar.html");
    }
}

// تحويل الموقع للإنجليزي
function switchToEnglish() {
    let pageName = window.location.pathname.split("/").pop() || "home-ar.html";

    if (pageName.indexOf("-ar.html") !== -1) {
        window.location.href = pageName.replace("-ar.html", ".html");
    }
}

function goHome() {

    // نفترض إنك بتخزن اللغة في localStorage
    let lang = localStorage.getItem("lang");

    // لو اللغة عربي
    if (lang === "ar") {
        window.location.href = "home-ar.html";
    }
    // لو إنجليزي أو أي حاجة تانية
    else {
        window.location.href = "home.html";
    }
}