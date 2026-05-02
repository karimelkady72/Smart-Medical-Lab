document.addEventListener("DOMContentLoaded", function () {
    // 1. وظيفة الدارك مود
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

    // 2. وظيفة العداد التصاعدي (Counter Animation)
    const stats = document.querySelectorAll('.stat-num');
    const observerOptions = { threshold: 0.5 }; // يبدأ لما 50% من العنصر يظهر

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                let count = 0;
                const speed = target / 100;

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
                observer.unobserve(el); // يشتغل مرة واحدة بس
            }
        });
    }, observerOptions);

    stats.forEach(stat => counterObserver.observe(stat));

    // 3. فحص فورم التسجيل (الباسورد + طول الموبايل)
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

    // 4. عرض المواعيد مع رسالة "لا توجد مواعيد"
    const appointmentList = document.getElementById("appointment-list");
    const isArabicLang = document.documentElement.lang === "ar";
    if (appointmentList) {
        let appointments = JSON.parse(localStorage.getItem("myAppointments") || "[]");
        if (appointments.length === 0) {
            appointmentList.innerHTML = isArabicLang ? "<p>لا توجد مواعيد محجوزة حالياً.</p>" : "<p>No appointments booked yet.</p>";
        } else {
            appointments.forEach(app => {
                const item = document.createElement("div");
                item.className = "activity-item";
                item.innerHTML = `<strong>${app.service}</strong><br><span>${app.date} | ${app.time}</span>`;
                appointmentList.appendChild(item);
            });
        }
    }

    // 5. وظيفة الـ Book Now والبحث (بقية الوظائف كما هي)
    // ... (كود البحث والحجز المعتاد)
});

// وظائف خارج الـ DOMContentLoaded
function updatePhoneLimit() {
    const countrySelect = document.getElementById("country-code");
    const phoneInput = document.getElementById("phone-number");
    if (!countrySelect || !phoneInput) return;
    const selectedLen = countrySelect.options[countrySelect.selectedIndex].getAttribute("data-len");
    phoneInput.maxLength = selectedLen;
    phoneInput.minLength = selectedLen;
    phoneInput.value = ""; 
}

function switchToArabic() { window.location.href = (window.location.pathname.split("/").pop() || "home.html").replace(".html", "-ar.html"); }
function switchToEnglish() { window.location.href = (window.location.pathname.split("/").pop() || "home-ar.html").replace("-ar.html", ".html"); }