document.addEventListener("DOMContentLoaded", () => {
    const adminName = sessionStorage.getItem("adminUserName");
    const sessionAdminName = document.getElementById("sessionAdminName");
    const dashboardAdminMessage = document.getElementById("dashboardAdminMessage");
    const adminLogoutBtn = document.getElementById("adminLogoutBtn");

    if (!adminName) {
        window.location.replace("index.html");
        return;
    }

    if (sessionAdminName) {
        sessionAdminName.textContent = adminName;
    }

    if (dashboardAdminMessage) {
        dashboardAdminMessage.textContent = `${adminName} is authenticated and can now continue to protected admin features.`;
    }

    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("adminUserName");
            window.location.replace("index.html");
        });
    }
});
