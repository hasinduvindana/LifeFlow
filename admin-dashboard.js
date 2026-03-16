document.addEventListener("DOMContentLoaded", () => {
    const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const adminName = sessionStorage.getItem("adminUserName");
    const sessionAdminName = document.getElementById("sessionAdminName");
    const dashboardAdminMessage = document.getElementById("dashboardAdminMessage");
    const dashboardFlashMessage = document.getElementById("dashboardFlashMessage");
    const adminLogoutBtn = document.getElementById("adminLogoutBtn");
    const donorFilterForm = document.getElementById("donorFilterForm");
    const resetDonorFilters = document.getElementById("resetDonorFilters");
    const donorTableBody = document.getElementById("donorTableBody");
    const stockTableBody = document.getElementById("stockTableBody");
    const emergencyNoticeForm = document.getElementById("emergencyNoticeForm");
    const noticeList = document.getElementById("noticeList");

    let allDonors = [];

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

    function showFlash(message, type) {
        if (!dashboardFlashMessage) {
            return;
        }

        dashboardFlashMessage.hidden = false;
        dashboardFlashMessage.textContent = message;
        dashboardFlashMessage.classList.remove("is-success", "is-error");
        dashboardFlashMessage.classList.add(type === "error" ? "is-error" : "is-success");

        window.setTimeout(() => {
            dashboardFlashMessage.hidden = true;
        }, 2600);
    }

    function normalizeDateValue(rawValue) {
        if (!rawValue) {
            return "";
        }

        if (typeof rawValue === "string") {
            return rawValue.slice(0, 10);
        }

        if (rawValue && typeof rawValue.toDate === "function") {
            const parsed = rawValue.toDate();
            return parsed.toISOString().slice(0, 10);
        }

        if (rawValue instanceof Date) {
            return rawValue.toISOString().slice(0, 10);
        }

        return "";
    }

    function donorField(donor, options) {
        for (const key of options) {
            if (donor[key] !== undefined && donor[key] !== null) {
                return donor[key];
            }
        }
        return "";
    }

    function renderDonorRows(donors) {
        if (!donorTableBody) {
            return;
        }

        if (!donors.length) {
            donorTableBody.innerHTML = '<tr><td colspan="8">No donors found for selected filters.</td></tr>';
            return;
        }

        donorTableBody.innerHTML = donors.map((donor) => {
            const firstName = donorField(donor, ["firstName", "firstname", "first_name"]);
            const lastName = donorField(donor, ["lastName", "lastname", "last_name"]);
            const bloodGroup = donorField(donor, ["bloodGroup", "bloodgroup"]);
            const dateOfBirth = normalizeDateValue(donorField(donor, ["dateOfBirth", "dob", "dateofbirth"]));
            const address = donorField(donor, ["address"]);
            const gender = donorField(donor, ["gender"]);
            const contactNumber = donorField(donor, ["contactNumber", "contact", "phone"]);
            const email = donorField(donor, ["email"]);

            return `
                <tr>
                    <td>${firstName || "-"}</td>
                    <td>${lastName || "-"}</td>
                    <td>${bloodGroup || "-"}</td>
                    <td>${dateOfBirth || "-"}</td>
                    <td>${address || "-"}</td>
                    <td>${gender || "-"}</td>
                    <td>${contactNumber || "-"}</td>
                    <td>${email || "-"}</td>
                </tr>
            `;
        }).join("");
    }

    function applyDonorFilters() {
        const dobInput = document.getElementById("filterDob");
        const addressInput = document.getElementById("filterAddress");
        const bloodGroupInput = document.getElementById("filterBloodGroup");
        const genderInput = document.getElementById("filterGender");

        const filterDob = (dobInput ? dobInput.value : "").trim();
        const filterAddress = (addressInput ? addressInput.value : "").trim().toLowerCase();
        const filterBloodGroup = (bloodGroupInput ? bloodGroupInput.value : "").trim().toLowerCase();
        const filterGender = (genderInput ? genderInput.value : "").trim().toLowerCase();

        const filtered = allDonors.filter((donor) => {
            const donorDob = normalizeDateValue(donorField(donor, ["dateOfBirth", "dob", "dateofbirth"]));
            const donorAddress = String(donorField(donor, ["address"]) || "").toLowerCase();
            const donorBloodGroup = String(donorField(donor, ["bloodGroup", "bloodgroup"]) || "").toLowerCase();
            const donorGender = String(donorField(donor, ["gender"]) || "").toLowerCase();

            const dobMatch = !filterDob || donorDob === filterDob;
            const addressMatch = !filterAddress || donorAddress.includes(filterAddress);
            const bloodGroupMatch = !filterBloodGroup || donorBloodGroup === filterBloodGroup;
            const genderMatch = !filterGender || donorGender === filterGender;

            return dobMatch && addressMatch && bloodGroupMatch && genderMatch;
        });

        renderDonorRows(filtered);
    }

    function renderStockRows(stockMap) {
        if (!stockTableBody) {
            return;
        }

        stockTableBody.innerHTML = BLOOD_GROUPS.map((group) => {
            const stockData = stockMap[group] || {};
            const availableStock = Number.isFinite(stockData.availableStock) ? stockData.availableStock : "";
            const neededValue = Number.isFinite(stockData.neededValue) ? stockData.neededValue : "";

            return `
                <tr>
                    <td>${group}</td>
                    <td><input type="number" min="0" class="stock-input" data-field="availableStock" data-group="${group}" value="${availableStock}"></td>
                    <td><input type="number" min="0" class="stock-input" data-field="neededValue" data-group="${group}" value="${neededValue}"></td>
                    <td><button type="button" class="dashboard-primary-btn save-stock-btn" data-group="${group}">Save</button></td>
                </tr>
            `;
        }).join("");
    }

    function formatNoticeDate(rawValue) {
        const normalized = normalizeDateValue(rawValue);
        return normalized || "-";
    }

    function renderNotices(notices) {
        if (!noticeList) {
            return;
        }

        if (!notices.length) {
            noticeList.innerHTML = "<li>No emergency notices yet.</li>";
            return;
        }

        noticeList.innerHTML = notices.map((notice) => {
            const neededGroups = Array.isArray(notice.neededBloodGroups)
                ? notice.neededBloodGroups.join(", ")
                : "-";

            return `
                <li>
                    <strong>${notice.title || "Untitled"}</strong>
                    <p>${notice.description || "No description"}</p>
                    <p><span>Blood Groups:</span> ${neededGroups}</p>
                    <p><span>Needed Before:</span> ${formatNoticeDate(notice.neededBefore)}</p>
                </li>
            `;
        }).join("");
    }

    async function loadDonors() {
        if (typeof window.lifeFlowFetchDonors !== "function") {
            showFlash("Firebase helpers are not loaded for donor view.", "error");
            return;
        }

        try {
            allDonors = await window.lifeFlowFetchDonors();
            renderDonorRows(allDonors);
        } catch (error) {
            console.error("Unable to load donors", error);
            showFlash("Unable to load donor records. Check Firestore permissions.", "error");
        }
    }

    async function loadStock() {
        if (typeof window.lifeFlowFetchBloodStockMap !== "function") {
            showFlash("Firebase helpers are not loaded for stock update.", "error");
            return;
        }

        try {
            const stockMap = await window.lifeFlowFetchBloodStockMap();
            renderStockRows(stockMap);
        } catch (error) {
            console.error("Unable to load blood stock", error);
            showFlash("Unable to load blood stock values.", "error");
        }
    }

    async function loadNotices() {
        if (typeof window.lifeFlowFetchEmergencyNotices !== "function") {
            showFlash("Firebase helpers are not loaded for emergency notices.", "error");
            return;
        }

        try {
            const notices = await window.lifeFlowFetchEmergencyNotices();
            renderNotices(notices);
        } catch (error) {
            console.error("Unable to load emergency notices", error);
            showFlash("Unable to load emergency notices.", "error");
        }
    }

    if (donorFilterForm) {
        donorFilterForm.addEventListener("submit", (event) => {
            event.preventDefault();
            applyDonorFilters();
        });
    }

    if (resetDonorFilters && donorFilterForm) {
        resetDonorFilters.addEventListener("click", () => {
            donorFilterForm.reset();
            renderDonorRows(allDonors);
        });
    }

    if (stockTableBody) {
        stockTableBody.addEventListener("click", async (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement) || !target.classList.contains("save-stock-btn")) {
                return;
            }

            const bloodGroup = target.getAttribute("data-group");
            if (!bloodGroup) {
                return;
            }

            const availableInput = stockTableBody.querySelector(`input[data-group="${bloodGroup}"][data-field="availableStock"]`);
            const neededInput = stockTableBody.querySelector(`input[data-group="${bloodGroup}"][data-field="neededValue"]`);

            const availableStock = Number(availableInput && "value" in availableInput ? availableInput.value : 0);
            const neededValue = Number(neededInput && "value" in neededInput ? neededInput.value : 0);

            if (!Number.isFinite(availableStock) || availableStock < 0 || !Number.isFinite(neededValue) || neededValue < 0) {
                showFlash("Stock values must be non-negative numbers.", "error");
                return;
            }

            if (typeof window.lifeFlowUpsertBloodStock !== "function") {
                showFlash("Firebase helpers are not loaded for stock update.", "error");
                return;
            }

            try {
                await window.lifeFlowUpsertBloodStock(bloodGroup, availableStock, neededValue, adminName);
                showFlash(`Updated ${bloodGroup} values successfully.`, "success");
            } catch (error) {
                console.error("Unable to update stock values", error);
                showFlash(`Failed to update ${bloodGroup}.`, "error");
            }
        });
    }

    if (emergencyNoticeForm) {
        emergencyNoticeForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const titleInput = document.getElementById("noticeTitle");
            const descriptionInput = document.getElementById("noticeDescription");
            const neededBeforeInput = document.getElementById("noticeNeededBefore");

            const title = titleInput ? titleInput.value.trim() : "";
            const description = descriptionInput ? descriptionInput.value.trim() : "";
            const neededBefore = neededBeforeInput ? neededBeforeInput.value : "";
            const selectedGroups = Array.from(
                emergencyNoticeForm.querySelectorAll('input[name="neededBloodGroup"]:checked')
            ).map((checkbox) => checkbox.value);

            if (!title || !description || !neededBefore || selectedGroups.length === 0) {
                showFlash("Fill all emergency notice fields and select blood groups.", "error");
                return;
            }

            if (typeof window.lifeFlowAddEmergencyNotice !== "function") {
                showFlash("Firebase helpers are not loaded for emergency notices.", "error");
                return;
            }

            try {
                await window.lifeFlowAddEmergencyNotice({
                    title,
                    description,
                    neededBloodGroups: selectedGroups,
                    neededBefore,
                    createdBy: adminName
                });

                emergencyNoticeForm.reset();
                showFlash("Emergency notice published.", "success");
                await loadNotices();
            } catch (error) {
                console.error("Unable to publish emergency notice", error);
                showFlash("Failed to publish emergency notice.", "error");
            }
        });
    }

    loadDonors();
    loadStock();
    loadNotices();

    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("adminUserName");
            window.location.replace("index.html");
        });
    }
});
