document.addEventListener("DOMContentLoaded", () => {
    // Foreground typing animation that loops forever.
    const typingElement = document.getElementById("typing-text");
    const typingText = "Welcome to Life Flow Blood Donation Online Service Sri Lanka";
    let charIndex = 0;

    function typeWriterLoop() {
        if (!typingElement) {
            return;
        }

        if (charIndex <= typingText.length) {
            typingElement.textContent = typingText.slice(0, charIndex);
            charIndex += 1;
            setTimeout(typeWriterLoop, 90);
        } else {
            setTimeout(() => {
                charIndex = 0;
                typingElement.textContent = "";
                typeWriterLoop();
            }, 1200);
        }
    }

    typeWriterLoop();

    // Auto image slider.
    const slides = document.querySelectorAll(".slider .slide");
    let activeSlideIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });
    }

    if (slides.length > 0) {
        setInterval(() => {
            activeSlideIndex = (activeSlideIndex + 1) % slides.length;
            showSlide(activeSlideIndex);
        }, 3500);
    }

    // Pie chart.
    const pieCanvas = document.getElementById("bloodPieChart");
    if (pieCanvas) {
        const ctxPie = pieCanvas.getContext("2d");
        new Chart(ctxPie, {
            type: "pie",
            data: {
                labels: ["O+", "O-", "AB+", "A+", "A-", "B+"],
                datasets: [
                    {
                        data: [30, 10, 5, 25, 15, 15],
                        backgroundColor: ["#e74c3c", "#c0392b", "#9b59b6", "#3498db", "#2980b9", "#f1c40f"]
                    }
                ]
            }
        });
    }

    // Bar chart.
    const barCanvas = document.getElementById("bloodBarChart");
    if (barCanvas) {
        const ctxBar = barCanvas.getContext("2d");
        new Chart(ctxBar, {
            type: "bar",
            data: {
                labels: ["O+", "O-", "AB", "A+", "A-"],
                datasets: [
                    {
                        label: "Available Stock",
                        data: [12, 19, 3, 5, 2],
                        backgroundColor: "#e74c3c"
                    },
                    {
                        label: "Needed Value",
                        data: [20, 15, 10, 15, 8],
                        backgroundColor: "#bdc3c7"
                    }
                ]
            }
        });
    }

    // Scroll-to-top button behavior.
    const topBtn = document.getElementById("scrollToTop");
    if (topBtn) {
        window.addEventListener("scroll", () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                topBtn.style.display = "block";
            } else {
                topBtn.style.display = "none";
            }
        });

        topBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Admin login modal behavior.
    const openAdminLogin = document.getElementById("openAdminLogin");
    const closeAdminLogin = document.getElementById("closeAdminLogin");
    const adminModal = document.getElementById("adminModal");
    const adminPassword = document.getElementById("adminPassword");
    const toggleAdminPassword = document.getElementById("toggleAdminPassword");

    function openModal() {
        if (!adminModal) {
            return;
        }
        adminModal.classList.add("active");
        adminModal.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
        if (!adminModal) {
            return;
        }
        adminModal.classList.remove("active");
        adminModal.setAttribute("aria-hidden", "true");
    }

    if (openAdminLogin) {
        openAdminLogin.addEventListener("click", openModal);
    }

    if (closeAdminLogin) {
        closeAdminLogin.addEventListener("click", closeModal);
    }

    if (adminModal) {
        adminModal.addEventListener("click", (event) => {
            if (event.target === adminModal) {
                closeModal();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && adminModal && adminModal.classList.contains("active")) {
            closeModal();
        }
    });

    if (toggleAdminPassword && adminPassword) {
        toggleAdminPassword.addEventListener("click", () => {
            const isPassword = adminPassword.getAttribute("type") === "password";
            adminPassword.setAttribute("type", isPassword ? "text" : "password");
            toggleAdminPassword.innerHTML = isPassword
                ? '<i class="fas fa-eye-slash"></i>'
                : '<i class="fas fa-eye"></i>';
            toggleAdminPassword.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
        });
    }
});
