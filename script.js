
const productsCatalog = [
    "ACHILLEA",
    "AGAPANTHUS",
    "ALLIUM",
    "ALSTROMERIA",
    "AMARANTHUS",
    "AMMI",
    "ANEMONE",
    "ARALIA",
    "ASTER",
    "BUPLEURUM",
    "BUTTON POM",
    "CALLA",
    "CARNATION STANDARD",
    "CHRYSANTHEMUM",
    "COCCULUS",
    "CRASPEDIA",
    "CURLY WILLOW",
    "CUSHION POM",
    "DAISY POM",
    "DELPHINIUM",
    "DENDROBIUM",
    "DISBUD",
    "DUSTY MILLER",
    "ERYNGIUM",
    "EUCALYPTUS",
    "FREESIA",
    "GERBERA",
    "GYPSOPHILA",
    "HYDRANGEA",
    "HYPERICUM",
    "IRIS",
    "LEPIDIUM",
    "LEUCADENDRON",
    "LILY GRASS",
    "LIMONIUM",
    "LISIANTHUS",
    "MATRICARIA",
    "MICRO POM",
    "MINI CALLA",
    "MINI GREEN",
    "MINI HYDRANGEA",
    "MOLUCELLA",
    "PEONY",
    "PINCUSHION",
    "PISTACIA",
    "PITTOSPORUM",
    "PROTEA",
    "RANUNCULUS",
    "ROBELINI",
    "ROSE",
    "RUSCUS",
    "SCABIOSA",
    "SNAPDRAGON",
    "SOLIDAGO",
    "SPRAY CARNATION",
    "SPRAY ROSE",
    "STATICE",
    "STOCK",
    "SUNFLOWER",
    "TULIP",
    "TWEEDIA",
    "VERONICA",
    "WAXFLOWER"
];

    const productSelect = new TomSelect("#product", {
        options: productsCatalog.map(function (product) {
            return {
                value: product,
                text: product
            };
        }),

        valueField: "value",
        labelField: "text",
        searchField: ["text"],

        create: false,
        maxItems: 1,
        closeAfterSelect: true,
        placeholder: "Add Product",

        render: {
            option: function (data, escape) {
                return '<div>🌸 ' + escape(data.text) + '</div>';
            },

            item: function (data, escape) {
                return '<div>' + escape(data.text) + '</div>';
            }
        }
    });
    



const addBtn = document.getElementById("addBtn");
const todayBtn = document.getElementById("todayBtn");
const table = document.getElementById("inventoryTable");
const mobileInventoryList = document.getElementById("mobileInventoryList");
const activityTimeline = document.getElementById("activityTimeline");
const historySearch = document.getElementById("historySearch");
const historyDate = document.getElementById("historyDate");
const historyTodayBtn = document.getElementById("historyTodayBtn");
const searchInput = document.getElementById("search");

const activityBtn = document.getElementById("activityBtn");

const rotateModal = document.getElementById("rotateModal");
const closeRotateModal = document.getElementById("closeRotateModal");
const confirmRotateBtn = document.getElementById("confirmRotateBtn");
const rotateAllBtn = document.getElementById("rotateAllBtn");
const settingsBtn =
    document.getElementById("settingsBtn");

const settingsModal =
    document.getElementById("settingsModal");

const closeSettingsModal =
    document.getElementById("closeSettingsModal");

const usersBtn =
    document.getElementById("usersBtn");

const productsBtn =
    document.getElementById("productsBtn");

const articlesBtn =
    document.getElementById("articlesBtn");

const exportInventorySettingsBtn =
    document.getElementById("exportInventorySettingsBtn");

const exportActivitySettingsBtn =
    document.getElementById("exportActivitySettingsBtn");

const logoutBtn =
    document.getElementById("logoutBtn");
const activityModal = document.getElementById("activityModal");
const closeModal = document.getElementById("closeModal");
const catalogModal = document.getElementById("catalogModal");
const closeCatalogModal = document.getElementById("closeCatalogModal");

const catalogSearch = document.getElementById("catalogSearch");
const catalogVariety = document.getElementById("catalogVariety");
const catalogFamily = document.getElementById("catalogFamily");
const catalogCode = document.getElementById("catalogCode");

const saveCatalogArticleBtn =
    document.getElementById("saveCatalogArticleBtn");

const catalogList =
    document.getElementById("catalogList");

const catalogMessage =
    document.getElementById("catalogMessage");

const editModal = document.getElementById("editModal");
const closeEditModal = document.getElementById("closeEditModal");
const closeProductHistoryModal = document.getElementById("closeProductHistoryModal");
const saveEditBtn = document.getElementById("saveEditBtn");

const exportInventoryBtn = document.getElementById("exportInventoryBtn");
const exportHistoryBtn = document.getElementById("exportHistoryBtn");
const toggleRemovedBtn = document.getElementById("toggleRemovedBtn");
const todayProductionBtn = document.getElementById("todayProductionBtn");
const todayProductionModal = document.getElementById("todayProductionModal");
const closeTodayProductionModal = document.getElementById("closeTodayProductionModal");

const productionPreview = document.getElementById("productionPreview") || new Image();
const productionPlaceholder = document.getElementById("productionPlaceholder");
const productionDropZone = document.getElementById("productionDropZone");
const clearProductionImageBtn = document.getElementById("clearProductionImageBtn");
const productionLoaded = document.getElementById("productionLoaded");
const viewProductionImageBtn = document.getElementById("viewProductionImageBtn");
const viewOcrCropBtn = document.getElementById("viewOcrCropBtn");
const productionPreviewViewport = document.getElementById("productionPreviewViewport");
const analyzeProductionBtn = document.getElementById("analyzeProductionBtn");
let productionImageScale = 1;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let nextId = Number(localStorage.getItem("nextId")) || 1;
let editingIndex = null;
let rotatingIndex = null;
let showRemoved = false;
let learnedProductAliases =
    JSON.parse(localStorage.getItem("learnedProductAliases")) || {};
    let flowerFamilies = [];
let learnedProductionAliases = [];
let activeProductionReservations = new Map();
const PRODUCTION_PICK_LIST_TABLE = "production_pick_lists";
const PRODUCTION_PICK_ITEM_TABLE = "production_pick_items";
const PRODUCTION_PICK_ASSIGNMENT_TABLE = "production_pick_assignments";
const APP_NOTIFICATION_TABLE = "app_notifications";
let appNotifications = [];
let notificationRefreshTimer = null;


async function loadProductionAliases() {

    const { data, error } = await supabaseClient
        .from("production_aliases")
        .select("id, alias, family, confirmed_by, active")
        .eq("active", true)
        .order("alias", { ascending: true });

    if (error) {
        console.error("Error loading learned production aliases:", error);
        learnedProductionAliases = [];
        return;
    }

    learnedProductionAliases = (data || [])
        .map(function (item) {
            return {
                id: item.id,
                alias: normalizeMatchText(item.alias),
                family: normalizeMatchText(item.family),
                confirmedBy: item.confirmed_by || "",
                active: item.active !== false
            };
        })
        .filter(function (item) {
            return item.alias && item.family;
        });

    console.log(
        "FloraFlow Brain ready:",
        learnedProductionAliases.length,
        "learned aliases"
    );
}

async function saveProductionAliasLearning(alias, family) {

    const normalizedAlias = normalizeMatchText(alias);
    const normalizedFamily = normalizeMatchText(family);

    if (!normalizedAlias || !normalizedFamily) {
        throw new Error("The alias or family is empty.");
    }

    const { data: existingRows, error: selectError } = await supabaseClient
        .from("production_aliases")
        .select("id")
        .ilike("alias", normalizedAlias)
        .limit(1);

    if (selectError) {
        throw selectError;
    }

    let saveError = null;

    if (existingRows && existingRows.length > 0) {
        const result = await supabaseClient
            .from("production_aliases")
            .update({
                alias: normalizedAlias,
                family: normalizedFamily,
                confirmed_by: currentUser || "Harsson",
                active: true
            })
            .eq("id", existingRows[0].id);

        saveError = result.error;
    } else {
        const result = await supabaseClient
            .from("production_aliases")
            .insert([{
                alias: normalizedAlias,
                family: normalizedFamily,
                confirmed_by: currentUser || "Harsson",
                active: true
            }]);

        saveError = result.error;
    }

    if (saveError) {
        throw saveError;
    }

    await loadProductionAliases();
}

function syncProductCatalogFromFlowerFamilies() {

    const dynamicFamilies = (flowerFamilies || [])
        .map(function (item) {
            return normalizeMatchText(item.family);
        })
        .filter(Boolean);

    dynamicFamilies.forEach(function (family) {
        if (!productsCatalog.includes(family)) {
            productsCatalog.push(family);
        }
    });

    productsCatalog.sort(function (a, b) {
        return a.localeCompare(b);
    });

    if (!productSelect) {
        return;
    }

    productsCatalog.forEach(function (family) {
        if (!productSelect.options[family]) {
            productSelect.addOption({
                value: family,
                text: family
            });
        }
    });

    productSelect.refreshOptions(false);
}

async function loadFlowerFamilies() {

    const { data, error } = await supabaseClient
        .from("flower_families")
        .select("id, family, aliases, active")
        .eq("active", true)
        .order("family", { ascending: true });

    if (error) {
        alert(
            "Error loading flower families: " +
            error.message
        );
        console.error(error);
        return;
    }

    flowerFamilies = (data || []).map(function (item) {

        const aliases = String(item.aliases || "")
            .split(",")
            .map(function (alias) {
                return alias.trim().toUpperCase();
            })
            .filter(Boolean);

        return {
            id: item.id,
            family: String(item.family || "")
                .trim()
                .toUpperCase(),

            aliases: aliases,
            active: item.active !== false
        };
    });

    syncProductCatalogFromFlowerFamilies();

}
let lexiflorCatalog = [];
let lexiflorSearchCatalog = [];
let lexiflorCatalogByFamily = new Map();
let lexiflorFamilyProfiles = [];

async function loadLexiflorCatalog() {

    const pageSize = 1000;
    let start = 0;
    let allArticles = [];

    while (true) {

        const { data, error } = await supabaseClient
            .from("lexiflor_articles")
            .select(`
                code,
                article_name,
                proposed_family,
                proposed_color,
                proposed_variety
            `)
            .range(start, start + pageSize - 1);

        if (error) {
            alert(
                "Error loading Lexiflor catalog: " +
                error.message
            );
            console.error(error);
            return;
        }

        if (!data || data.length === 0) {
            break;
        }

        allArticles = allArticles.concat(data);

        if (data.length < pageSize) {
            break;
        }

        start += pageSize;
    }

    lexiflorCatalog = allArticles;

    lexiflorSearchCatalog = allArticles
        .map(function (item) {

            const articleName = normalizeMatchText(
                item.article_name
            );

            if (!articleName) {
                return null;
            }

            const proposedFamily = normalizeMatchText(
                item.proposed_family
            );

            const family = resolveOperationalFamily(
                articleName,
                proposedFamily
            );

            return {
                code: String(item.code || ""),
                product: articleName,
                articleName: articleName,
                searchText: prepareArticleSearchText(articleName),
                family: family,
                color: normalizeMatchText(item.proposed_color),
                variety: normalizeMatchText(item.proposed_variety)
            };
        })
        .filter(Boolean);

    buildLexiflorFamilyIndexes();

    console.log(
        "FloraFlow catalog ready:",
        lexiflorSearchCatalog.length,
        "articles"
    );
}

const fallbackUsers = [
    "Harsson", "Ender", "Henry", "Maidelyn", "Mark", "Paulina",
    "Sandra", "Dayan", "Sarymed", "Thalia", "Laura", "Liudmila", "Orlando"
];

let appUsers = [];
let currentUser = "";
let currentUserProfile = null;
let currentAuthUser = null;
const userSelect = document.getElementById("userSelect");

function normalizeAppRole(value) {
    const role = String(value || "user").toLowerCase();
    return ["admin", "manager", "user"].includes(role) ? role : "user";
}

function canManageProducts() {
    const name = normalizeMatchText(currentUser);
    return normalizeAppRole(currentUserProfile?.role) === "admin" ||
        name === "HARSSON" || name === "MARK";
}

function canManageUsers() {
    return normalizeAppRole(currentUserProfile?.role) === "admin";
}

function getCurrentUserName() {
    return currentUser || currentUserProfile?.full_name || currentAuthUser?.email || "Unknown";
}

function setLegacyUserSelectVisibility() {
    if (!userSelect) return;
    const wrapper = userSelect.closest(".form-group, label, div") || userSelect;
    wrapper.style.display = "none";
    userSelect.disabled = true;
}

function syncLegacyUserSelect() {
    if (!userSelect) return;
    userSelect.innerHTML = "";
    const option = document.createElement("option");
    option.value = getCurrentUserName();
    option.textContent = getCurrentUserName();
    userSelect.appendChild(option);
    userSelect.value = getCurrentUserName();
}

async function loadAppUsers() {
    const { data, error } = await supabaseClient
        .from("app_profiles")
        .select("id, full_name, email, role, active, department, created_at, access_type, access_expires_at, must_change_password, last_sign_in_at")
        .order("full_name", { ascending: true });

    if (error) {
        console.error("Could not load app users:", error);
        appUsers = fallbackUsers.map(function (name) {
            return { full_name: name, email: "", role: "user", active: true };
        });
        return appUsers;
    }

    appUsers = data || [];
    return appUsers;
}

async function loadCurrentUserProfile(authUser) {
    const { data, error } = await supabaseClient
        .from("app_profiles")
        .select("id, full_name, email, role, active, department, access_type, access_expires_at, must_change_password, last_sign_in_at")
        .eq("id", authUser.id)
        .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Your FloraFlow profile has not been created yet.");
    if (data.active === false) throw new Error("This FloraFlow account is inactive.");
    if (String(data.access_type || "permanent").toLowerCase() === "temporary" && data.access_expires_at) {
        const expiration = new Date(String(data.access_expires_at).slice(0, 10) + "T23:59:59");
        if (!Number.isNaN(expiration.getTime()) && expiration.getTime() < Date.now()) {
            throw new Error("This temporary FloraFlow account has expired.");
        }
    }

    currentAuthUser = authUser;
    currentUserProfile = data;
    currentUser = data.full_name || authUser.email || "Unknown";
    localStorage.setItem("currentUser", currentUser);
    syncLegacyUserSelect();
    setLegacyUserSelectVisibility();
    updateSettingsCurrentUserPanel();
    applyUserPermissions();
    return data;
}

function ensureLoginOverlay() {
    let overlay = document.getElementById("floraFlowLoginOverlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "floraFlowLoginOverlay";
    overlay.style.cssText = "position:fixed;inset:0;z-index:200000;background:#f1f5f9;display:none;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;";
    overlay.innerHTML = `
        <form id="floraFlowLoginForm" style="width:min(420px,100%);background:white;border-radius:18px;padding:24px;box-shadow:0 24px 70px rgba(15,23,42,.16);">
            <div style="font-size:12px;font-weight:800;letter-spacing:.12em;color:#166534;text-transform:uppercase;">FloraFlow</div>
            <h1 style="margin:6px 0 4px;font-size:27px;color:#0f172a;">Sign in</h1>
            <p style="margin:0 0 18px;color:#64748b;font-size:14px;line-height:1.5;">Use your company account to continue.</p>
            <label style="display:block;font-weight:700;font-size:14px;margin-bottom:12px;">Email
                <input id="floraFlowLoginEmail" type="email" required autocomplete="username" style="width:100%;box-sizing:border-box;margin-top:6px;padding:12px;border:1px solid #cbd5e1;border-radius:10px;">
            </label>
            <label style="display:block;font-weight:700;font-size:14px;margin-bottom:14px;">Password
                <input id="floraFlowLoginPassword" type="password" required autocomplete="current-password" style="width:100%;box-sizing:border-box;margin-top:6px;padding:12px;border:1px solid #cbd5e1;border-radius:10px;">
            </label>
            <button id="floraFlowLoginButton" type="submit" style="width:100%;padding:13px;border:none;border-radius:10px;background:#166534;color:white;font-weight:800;font-size:15px;">Sign in</button>
            <div id="floraFlowLoginMessage" style="min-height:20px;margin-top:12px;font-size:13px;color:#b91c1c;"></div>
        </form>`;
    document.body.appendChild(overlay);

    overlay.querySelector("#floraFlowLoginForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        const button = overlay.querySelector("#floraFlowLoginButton");
        const message = overlay.querySelector("#floraFlowLoginMessage");
        button.disabled = true;
        button.textContent = "Signing in...";
        message.textContent = "";
        try {
            const email = overlay.querySelector("#floraFlowLoginEmail").value.trim();
            const password = overlay.querySelector("#floraFlowLoginPassword").value;
            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) throw error;
            await loadCurrentUserProfile(data.user);
            await loadAppUsers();
            overlay.style.display = "none";
            window.dispatchEvent(new CustomEvent("floraflow-auth-ready"));
        } catch (error) {
            message.textContent = error?.message || String(error);
        } finally {
            button.disabled = false;
            button.textContent = "Sign in";
        }
    });
    return overlay;
}

async function initializeFloraFlowAuth() {
    const overlay = ensureLoginOverlay();
    const { data } = await supabaseClient.auth.getSession();
    const authUser = data?.session?.user || null;

    if (authUser) {
        try {
            await loadCurrentUserProfile(authUser);
            await loadAppUsers();
            overlay.style.display = "none";
            return;
        } catch (error) {
            console.error("FloraFlow profile error:", error);
            await supabaseClient.auth.signOut();
        }
    }

    overlay.style.display = "flex";
    await new Promise(function (resolve) {
        window.addEventListener("floraflow-auth-ready", resolve, { once: true });
    });
}

function ensureSettingsCurrentUserPanel() {
    if (!settingsModal || document.getElementById("settingsCurrentUserPanel")) return;
    const panel = document.createElement("div");
    panel.id = "settingsCurrentUserPanel";
    panel.style.cssText = "margin:14px 0;padding:14px;border:1px solid #dbe4ea;border-radius:12px;background:#f8fafc;";
    const content = settingsModal.querySelector(".modal-content") || settingsModal;
    content.insertBefore(panel, content.children[1] || null);
    updateSettingsCurrentUserPanel();
}

function updateSettingsCurrentUserPanel() {
    const panel = document.getElementById("settingsCurrentUserPanel");
    if (!panel) return;
    panel.innerHTML = `
        <div style="font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.08em;">Current user</div>
        <div style="font-size:18px;font-weight:800;color:#0f172a;margin-top:4px;">${getCurrentUserName()}</div>
        <div style="font-size:13px;color:#64748b;margin-top:3px;">${currentUserProfile?.email || ""} · ${normalizeAppRole(currentUserProfile?.role)}</div>`;

    updateNotificationCurrentUser();
}

function updateNotificationCurrentUser() {
    const nameElement = document.getElementById("floraFlowNotificationUserName");
    if (nameElement) {
        nameElement.textContent = getCurrentUserName();
    }
}

function applyUserPermissions() {
    if (productsBtn) productsBtn.style.display = canManageProducts() ? "" : "none";
    if (usersBtn) usersBtn.style.display = canManageUsers() ? "" : "none";
}


function getCurrentAuthUserId() {
    return currentAuthUser?.id || currentUserProfile?.id || "";
}

function installSafeBackdropClose(overlay, closeHandler) {
    if (!overlay || typeof closeHandler !== "function" || overlay.dataset.safeBackdropClose === "true") {
        return;
    }

    overlay.dataset.safeBackdropClose = "true";

    let startedOnBackdrop = false;
    let moved = false;
    let startX = 0;
    let startY = 0;

    overlay.addEventListener("pointerdown", function (event) {
        startedOnBackdrop = event.target === overlay;
        moved = false;
        startX = event.clientX;
        startY = event.clientY;
    });

    overlay.addEventListener("pointermove", function (event) {
        if (!startedOnBackdrop) return;

        if (Math.abs(event.clientX - startX) > 6 || Math.abs(event.clientY - startY) > 6) {
            moved = true;
        }
    });

    overlay.addEventListener("pointerup", function (event) {
        const shouldClose = startedOnBackdrop && !moved && event.target === overlay;
        startedOnBackdrop = false;
        moved = false;

        if (shouldClose) {
            closeHandler();
        }
    });

    overlay.addEventListener("pointercancel", function () {
        startedOnBackdrop = false;
        moved = false;
    });
}

function formatNotificationTime(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function ensureNotificationCenter() {
    let launcher = document.getElementById("floraFlowNotificationLauncher");
    if (launcher) return launcher;

    if (!document.getElementById("floraFlowNotificationResponsiveStyles")) {
        const style = document.createElement("style");
        style.id = "floraFlowNotificationResponsiveStyles";
        style.textContent = `
            #floraFlowNotificationLauncher {
                position: fixed;
                top: 16px;
                right: 18px;
                z-index: 90000;
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 7px;
                border: 1px solid rgba(148, 163, 184, .35);
                border-radius: 16px;
                background: rgba(255, 255, 255, .96);
                box-shadow: 0 10px 30px rgba(15, 23, 42, .16);
                backdrop-filter: blur(12px);
            }

            #floraFlowNotificationBell {
                position: relative;
                width: 44px;
                height: 44px;
                border: 0;
                border-radius: 12px;
                background: #166534;
                color: #fff;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                box-shadow: 0 4px 12px rgba(22, 101, 52, .25);
            }

            #floraFlowNotificationUser {
                max-width: 180px;
                padding-right: 8px;
                line-height: 1.15;
            }

            #floraFlowNotificationPanel {
                width: min(480px, calc(100vw - 32px));
                max-height: min(86vh, 760px);
                overflow: auto;
                margin: 72px 18px 0 auto;
                background: #f8fafc;
                border-radius: 18px;
                box-shadow: 0 24px 70px rgba(15, 23, 42, .28);
            }

            @media (max-width: 720px) {
                #floraFlowNotificationLauncher {
                    top: auto;
                    right: 14px;
                    bottom: calc(14px + env(safe-area-inset-bottom));
                    padding: 6px;
                    border-radius: 999px;
                }

                #floraFlowNotificationUser {
                    display: none;
                }

                #floraFlowNotificationBell {
                    width: 52px;
                    height: 52px;
                    border-radius: 999px;
                    font-size: 22px;
                }

                #floraFlowNotificationPanel {
                    width: 100%;
                    max-height: 88vh;
                    margin: 12vh 0 0;
                    border-radius: 22px 22px 0 0;
                }

                #floraFlowNotificationOverlay {
                    padding: 0 !important;
                    align-items: flex-end;
                }

                #floraFlowNotificationHeader {
                    padding: 15px !important;
                }

                #floraFlowMarkAllReadBtn {
                    font-size: 12px;
                    padding: 8px 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    launcher = document.createElement("div");
    launcher.id = "floraFlowNotificationLauncher";
    launcher.innerHTML = `
        <button id="floraFlowNotificationBell" type="button" aria-label="Open notifications" title="Notifications">
            <span aria-hidden="true">🔔</span>
            <span id="floraFlowNotificationBadge" style="
                display:none;
                position:absolute;
                top:-5px;
                right:-5px;
                min-width:21px;
                height:21px;
                padding:0 5px;
                box-sizing:border-box;
                border-radius:999px;
                background:#b91c1c;
                color:white;
                font-size:11px;
                font-weight:800;
                align-items:center;
                justify-content:center;
                border:2px solid white;
            "></span>
        </button>
        <div id="floraFlowNotificationUser">
            <div style="font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.08em;">FloraFlow</div>
            <div id="floraFlowNotificationUserName" style="font-size:14px;font-weight:800;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeProductionPickHtml(getCurrentUserName())}</div>
        </div>
    `;
    document.body.appendChild(launcher);

    const overlay = document.createElement("div");
    overlay.id = "floraFlowNotificationOverlay";
    overlay.style.cssText = `
        display:none;
        position:fixed;
        inset:0;
        z-index:100000;
        background:rgba(15,23,42,.46);
        padding:18px;
        box-sizing:border-box;
    `;
    overlay.innerHTML = `
        <section id="floraFlowNotificationPanel">
            <header id="floraFlowNotificationHeader" style="
                position:sticky;
                top:0;
                z-index:2;
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:12px;
                padding:17px 18px;
                background:white;
                border-bottom:1px solid #e2e8f0;
            ">
                <div>
                    <div style="font-size:20px;font-weight:850;color:#0f172a;">Notifications</div>
                    <div style="font-size:13px;color:#64748b;margin-top:2px;">Pick lists and internal updates</div>
                </div>
                <div style="display:flex;gap:8px;align-items:center;">
                    <button type="button" id="floraFlowMarkAllReadBtn">Mark all read</button>
                    <button type="button" id="floraFlowNotificationCloseBtn" aria-label="Close notifications" style="width:42px;height:42px;border:0;border-radius:11px;background:#e2e8f0;color:#0f172a;font-size:25px;cursor:pointer;">×</button>
                </div>
            </header>
            <div id="floraFlowNotificationList" style="padding:14px;"></div>
        </section>
    `;
    document.body.appendChild(overlay);

    const bell = launcher.querySelector("#floraFlowNotificationBell");
    const close = function () { overlay.style.display = "none"; };

    bell.addEventListener("click", async function () {
        overlay.style.display = "block";
        await loadAppNotifications();
    });

    overlay.querySelector("#floraFlowNotificationCloseBtn")
        .addEventListener("click", close);

    installSafeBackdropClose(overlay, close);

    overlay.addEventListener("touchmove", function (event) {
        if (event.target === overlay) {
            event.preventDefault();
        }
    }, { passive: false });

    overlay.querySelector("#floraFlowMarkAllReadBtn")
        .addEventListener("click", async function () {
            await markAllNotificationsRead();
        });

    return launcher;
}

function renderAppNotifications() {
    ensureNotificationCenter();
    const list = document.getElementById("floraFlowNotificationList");
    const badge = document.getElementById("floraFlowNotificationBadge");
    if (!list || !badge) return;

    const unreadCount = appNotifications.filter(function (item) {
        return !item.is_read;
    }).length;

    badge.textContent = unreadCount > 99 ? "99+" : String(unreadCount);
    badge.style.display = unreadCount > 0 ? "flex" : "none";

    if (appNotifications.length === 0) {
        list.innerHTML = `
            <div style="padding:34px 18px;text-align:center;color:#64748b;background:white;border-radius:14px;">
                No notifications yet.
            </div>
        `;
        return;
    }

    list.innerHTML = "";
    appNotifications.forEach(function (item) {
        const card = document.createElement("button");
        card.type = "button";
        card.style.cssText = `
            width:100%;
            text-align:left;
            border:1px solid ${item.is_read ? "#e2e8f0" : "#86efac"};
            border-left:5px solid ${item.is_read ? "#cbd5e1" : "#166534"};
            border-radius:13px;
            padding:14px;
            margin-bottom:10px;
            background:${item.is_read ? "white" : "#f0fdf4"};
            cursor:pointer;
        `;
        card.innerHTML = `
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
                <div style="font-weight:800;color:#0f172a;">${escapeProductionPickHtml(item.title || "Notification")}</div>
                <div style="font-size:11px;color:#64748b;white-space:nowrap;">${escapeProductionPickHtml(formatNotificationTime(item.created_at))}</div>
            </div>
            <div style="font-size:13px;color:#475569;line-height:1.5;margin-top:5px;">${escapeProductionPickHtml(item.message || "")}</div>
            ${item.sender_name ? `<div style="font-size:12px;color:#64748b;margin-top:7px;">From: ${escapeProductionPickHtml(item.sender_name)}</div>` : ""}
        `;
        card.addEventListener("click", async function () {
            await openAppNotification(item);
        });
        list.appendChild(card);
    });
}

async function loadAppNotifications() {
    const userId = getCurrentAuthUserId();
    if (!userId) return [];

    const { data, error } = await supabaseClient
        .from(APP_NOTIFICATION_TABLE)
        .select("id, user_id, sender_id, sender_name, title, message, type, reference_id, action_url, is_read, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) {
        console.error("Could not load notifications:", error);
        return [];
    }

    appNotifications = data || [];
    renderAppNotifications();
    return appNotifications;
}

async function markNotificationRead(notificationId) {
    if (!notificationId) return;
    const { error } = await supabaseClient
        .from(APP_NOTIFICATION_TABLE)
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", notificationId)
        .eq("user_id", getCurrentAuthUserId());
    if (error) throw error;
}

async function markAllNotificationsRead() {
    const userId = getCurrentAuthUserId();
    if (!userId) return;
    const { error } = await supabaseClient
        .from(APP_NOTIFICATION_TABLE)
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("is_read", false);
    if (error) {
        alert("Notifications could not be updated. " + error.message);
        return;
    }
    await loadAppNotifications();
}

async function openAppNotification(item) {
    try {
        if (!item.is_read) {
            await markNotificationRead(item.id);
            item.is_read = true;
            renderAppNotifications();
        }
        if (item.action_url) {
            window.location.href = item.action_url;
        }
    } catch (error) {
        console.error("Notification open error:", error);
    }
}

function startNotificationRefresh() {
    ensureNotificationCenter();
    if (notificationRefreshTimer) {
        clearInterval(notificationRefreshTimer);
    }
    loadAppNotifications();
    notificationRefreshTimer = setInterval(loadAppNotifications, 60000);
}

function getAssignableAppUsers() {
    return (appUsers || []).filter(function (user) {
        return user.active !== false && user.id && user.id !== getCurrentAuthUserId();
    });
}

async function assignProductionPickListInternally(pickList, recipientIds) {
    const uniqueRecipientIds = Array.from(new Set(recipientIds || [])).filter(Boolean);
    if (uniqueRecipientIds.length === 0) return;

    const assignments = uniqueRecipientIds.map(function (userId) {
        return {
            pick_list_id: pickList.id,
            assigned_to: userId,
            assigned_by: getCurrentAuthUserId(),
            status: "PENDING"
        };
    });

    const { error: assignmentError } = await supabaseClient
        .from(PRODUCTION_PICK_ASSIGNMENT_TABLE)
        .insert(assignments);
    if (assignmentError) throw assignmentError;

    const isManualPickup = String(pickList.order || "").startsWith("99");
    const actionUrl = window.location.origin + window.location.pathname + "?pick=" + encodeURIComponent(pickList.token) + (isManualPickup ? "&mode=pickup" : "");
    const notifications = uniqueRecipientIds.map(function (userId) {
        return {
            user_id: userId,
            sender_id: getCurrentAuthUserId(),
            sender_name: getCurrentUserName(),
            title: isManualPickup ? "New pickup request" : "New production pick list",
            message: isManualPickup
                ? "A leftover pickup request is waiting for acceptance."
                : "Production Order #" + pickList.order + " is ready for review and pickup confirmation.",
            type: isManualPickup ? "LEFTOVER_PICKUP_REQUEST" : "PRODUCTION_PICK_LIST",
            reference_id: String(pickList.id),
            action_url: actionUrl,
            is_read: false
        };
    });

    const { error: notificationError } = await supabaseClient
        .from(APP_NOTIFICATION_TABLE)
        .insert(notifications);
    if (notificationError) throw notificationError;
}

async function initializeFloraFlow() {

    await initializeFloraFlowAuth();
    ensureSettingsCurrentUserPanel();

    const urlParams = new URLSearchParams(window.location.search);
    const hasPickLink = Boolean(urlParams.get("pick"));

    // Fast-link mode: show the requested Pick List before loading the
    // complete inventory, catalog, history and progress modules.
    if (hasPickLink) {
        await openProductionPickListFromUrl();

        Promise.allSettled([
            loadInventoryFromSupabase(),
            loadHistoryFromSupabase(),
            loadFlowerFamilies(),
            loadProductionAliases(),
            loadLexiflorCatalog(),
            loadActiveProductionReservations()
        ]).then(function () {
            startNotificationRefresh();
            ensureProductionProgressCenter();
            startProductionProgressRefresh();
            console.log("FloraFlow background loading complete.");
        });

        return;
    }

    await Promise.all([
        loadInventoryFromSupabase(),
        loadHistoryFromSupabase(),
        loadFlowerFamilies(),
        loadProductionAliases(),
        loadLexiflorCatalog(),
        loadActiveProductionReservations()
    ]);

    startNotificationRefresh();
    ensureProductionProgressCenter();
    startProductionProgressRefresh();

    // Warm up the PDF reader without blocking the main screen.
    const warmPdfReader = function () {
        loadFloraFlowPdfJs().catch(function (error) {
            console.warn("PDF reader preload skipped:", error);
        });
    };

    if ("requestIdleCallback" in window) {
        window.requestIdleCallback(warmPdfReader, { timeout: 2500 });
    } else {
        setTimeout(warmPdfReader, 800);
    }

    console.log(
        "FloraFlow ready. Catalog:",
        lexiflorCatalog.length
    );
}

initializeFloraFlow();

function findFamilyFromAlias(word) {

    const search = String(word || "")
        .trim()
        .toUpperCase();

    for (const item of flowerFamilies) {

        const familyName = String(item.family || "")
            .trim()
            .toUpperCase();

        const aliases = Array.isArray(item.aliases)
            ? item.aliases
            : String(item.aliases || "").split(",");

        const normalizedAliases = aliases
            .map(function (alias) {
                return String(alias || "")
                    .trim()
                    .toUpperCase();
            })
            .filter(Boolean);

        if (familyName === search) {
            return familyName;
        }

        if (normalizedAliases.includes(search)) {
            return familyName;
        }
    }

    return null;
}
function replaceFamilyAliasesInLine(line) {

    const originalLine = String(line || "")
        .trim()
        .toUpperCase();

    if (!originalLine || !Array.isArray(flowerFamilies)) {
        return originalLine;
    }

    const candidates = [];

    flowerFamilies.forEach(function (item) {

        const familyName = String(item.family || "")
            .trim()
            .toUpperCase();

        if (!familyName) {
            return;
        }

        const aliases = Array.isArray(item.aliases)
            ? item.aliases
            : String(item.aliases || "").split(",");

        const allNames = [
            familyName,
            ...aliases
        ];

        allNames.forEach(function (alias) {

            const cleanAlias = String(alias || "")
                .trim()
                .toUpperCase();

            if (!cleanAlias) {
                return;
            }

            const escapedAlias = cleanAlias.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            const pattern = new RegExp(
                "\\b" + escapedAlias + "\\b",
                "i"
            );

            const match = originalLine.match(pattern);

            if (match) {
                candidates.push({
                    alias: cleanAlias,
                    family: familyName,
                    index: match.index,
                    length: cleanAlias.length
                });
            }
        });
    });

    if (candidates.length === 0) {
        return originalLine;
    }

    candidates.sort(function (a, b) {

        if (b.length !== a.length) {
            return b.length - a.length;
        }

        return a.index - b.index;
    });

    const bestMatch = candidates[0];

    const escapedBestAlias = bestMatch.alias.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

    const bestPattern = new RegExp(
        "\\b" + escapedBestAlias + "\\b",
        "i"
    );

    return originalLine
        .replace(bestPattern, bestMatch.family)
        .replace(/\s+/g, " ")
        .trim();
}
function extractProductionColor(line) {

    const text = normalizeMatchText(line);

    if (!text) {
        return "";
    }

    const colorRules = [
        {
            color: "HOT PINK",
            aliases: ["HOT PINK", "HOTPNK", "HPINK", "HPNK", "HTP"]
        },
        {
            color: "DARK PINK",
            aliases: ["DARK PINK", "DK PINK", "DPI"]
        },
        {
            color: "LIGHT PINK",
            aliases: ["LIGHT PINK", "LT PINK", "LTPINK"]
        },
        {
            color: "PINK",
            aliases: ["PASTEL PINK", "PINK", "PNK", "PK"]
        },
        {
            color: "YELLOW ORANGE",
            aliases: ["YELLOW ORANGE", "YEL ORANGE", "YLW ORANGE"]
        },
        {
            color: "OLIVE GREEN",
            aliases: ["OLIVE GREEN"]
        },
        {
            color: "BLUE PURPLE",
            aliases: ["BLUE PURPLE"]
        },
        {
            color: "YELLOW",
            aliases: ["YELLOW", "YELLO", "YELOW", "VELLOW", "YEL", "YLW", "YLLW"]
        },
        {
            color: "WHITE",
            aliases: ["WHITE", "WHIITE", "WHITTE", "WIRTTE", "WHIT", "WHT", "WI"]
        },
        {
            color: "PURPLE",
            aliases: ["PURPLE", "PURALE", "PLRPLE", "PRPLE", "PURP", "PRPL", "PU"]
        },
        {
            color: "LAVENDER",
            aliases: ["LAVENDER", "LAVANDER", "LAV", "LAVNDR"]
        },
        {
            color: "ORANGE",
            aliases: ["ORANGE", "ORNGE", "ORG"]
        },
        {
            color: "GREEN",
            aliases: ["GREEN", "GRN", "GR"]
        },
        {
            color: "CREAM",
            aliases: ["CREAM", "CRM"]
        },
        {
            color: "BLUE",
            aliases: ["BLUE", "BLU", "BL"]
        },
        {
            color: "BURGUNDY",
            aliases: ["BURGUNDY", "BURG", "BU"]
        },
        {
            color: "BRONZE",
            aliases: ["BRONZE", "BZ"]
        },
        {
            color: "BROWN",
            aliases: ["BROWN"]
        },
        {
            color: "PEACH",
            aliases: ["PEACH"]
        },
        {
            color: "CORAL",
            aliases: ["CORAL"]
        },
        {
            color: "GOLD",
            aliases: ["GOLD", "GOL"]
        },
        {
            color: "GRAY",
            aliases: ["GRAY", "GREY"]
        },
        {
            color: "RED",
            aliases: ["RED"]
        }
    ];

    for (const rule of colorRules) {
        for (const alias of rule.aliases) {
            const normalizedAlias = normalizeMatchText(alias);

            if (
                (" " + text + " ").includes(
                    " " + normalizedAlias + " "
                )
            ) {
                return rule.color;
            }
        }
    }

    return "";
}
activityBtn.addEventListener("click", function () {
    activityModal.style.display = "block";
});
settingsBtn.addEventListener("click", function () {
    ensureSettingsCurrentUserPanel();
    updateSettingsCurrentUserPanel();
    applyUserPermissions();
    settingsModal.style.display = "block";
});
closeSettingsModal.addEventListener("click", function () {

    settingsModal.style.display = "none";

});

window.addEventListener("click", function (event) {

    if (event.target === settingsModal) {

        settingsModal.style.display = "none";

    }

});

const PRODUCTION_SELECTION_STORAGE_KEY = "floraFlowProductionSelection";

let productionSelectionImage = null;
let productionSelection = null;
let productionSelectionDraft = null;
let productionSelectionDragging = false;
let productionSelectionEnabled = false;
let productionSelectionPointerId = null;
let productionSelectionCanvas = null;
let productionSelectionContext = null;
let productionDetectedText = null;
let productionSelectionStatus = null;
let productionRememberArea = null;
let productionReadAreaBtn = null;
let productionFindLeftoversBtn = null;
let productionSelectAreaBtn = null;
let productionSelectAgainBtn = null;
let productionOrderInput = null;
let productionDetectOrderBtn = null;

function ensureProductionSelectionUI() {

    let tool = document.getElementById("productionSelectionTool");

    if (tool) {
        return tool;
    }

    tool = document.createElement("div");
    tool.id = "productionSelectionTool";
    tool.innerHTML = `
        <div style="
            margin-top:16px;
            padding:16px;
            background:#f8fafc;
            border:1px solid #dbe4ea;
            border-radius:14px;
        ">
            <div style="font-size:18px;font-weight:700;margin-bottom:6px;">
                Select the product area
            </div>

            <div style="font-size:14px;color:#52606d;line-height:1.5;margin-bottom:12px;">
                Paste the screenshot, press <strong>Select Product Area</strong>,
                and drag a rectangle only around the product names.
            </div>

            <div id="productionSelectionStage" style="
                display:none;
                position:relative;
                width:100%;
                max-height:62vh;
                overflow:auto;
                background:#111827;
                border-radius:12px;
                border:1px solid #cbd5e1;
                touch-action:none;
            ">
                <canvas id="productionSelectionCanvas" style="
                    display:block;
                    max-width:none;
                    cursor:crosshair;
                    touch-action:none;
                "></canvas>
            </div>

            <div style="
                display:flex;
                flex-wrap:wrap;
                gap:8px;
                margin-top:12px;
                align-items:center;
            ">
                <button type="button" id="productionSelectAreaBtn">
                    Select Product Area
                </button>

                <button type="button" id="productionSelectAgainBtn" disabled>
                    Select Area Again
                </button>

                <button type="button" id="productionReadAreaBtn" disabled>
                    Read Selected Area
                </button>

                <button type="button" id="productionFindLeftoversBtn" disabled>
                    Find Leftovers
                </button>

                <label style="
                    display:flex;
                    gap:6px;
                    align-items:center;
                    font-size:14px;
                    margin-left:4px;
                ">
                    <input type="checkbox" id="productionRememberArea">
                    Remember this area
                </label>
            </div>

            <div style="
                display:grid;
                grid-template-columns:minmax(180px, 1fr) auto;
                gap:8px;
                margin-top:14px;
                align-items:end;
            ">
                <label style="display:block;font-weight:700;font-size:14px;">
                    Production Order #
                    <input type="text" id="productionOrderInput" inputmode="numeric" autocomplete="off" style="
                        width:100%;
                        box-sizing:border-box;
                        margin-top:6px;
                        padding:11px 12px;
                        border:2px solid #166534;
                        border-radius:10px;
                        font-size:18px;
                        font-weight:800;
                        color:#14532d;
                        background:#f0fdf4;
                    " placeholder="Confirm the order number">
                </label>
                <button type="button" id="productionDetectOrderBtn" style="min-height:44px;">
                    Detect Order #
                </button>
            </div>

            <div id="productionSelectionStatus" style="
                margin-top:10px;
                min-height:22px;
                font-size:14px;
                color:#475569;
            "></div>

            <label for="productionDetectedText" style="
                display:block;
                margin-top:14px;
                margin-bottom:6px;
                font-weight:700;
            ">
                Text detected — correct it here before searching
            </label>

            <textarea id="productionDetectedText" rows="8" spellcheck="false" style="
                width:100%;
                box-sizing:border-box;
                resize:vertical;
                padding:12px;
                border:1px solid #cbd5e1;
                border-radius:10px;
                font-family:Consolas, Monaco, monospace;
                font-size:14px;
                line-height:1.45;
                background:white;
            " placeholder="The text read from the selected area will appear here."></textarea>
        </div>
    `;

    const referenceNode =
        document.getElementById("productionRecommendations") ||
        productionLoaded ||
        analyzeProductionBtn;

    if (referenceNode && referenceNode.parentNode) {
        referenceNode.parentNode.insertBefore(tool, referenceNode.nextSibling);
    } else {
        todayProductionModal.appendChild(tool);
    }

    productionSelectionCanvas =
        document.getElementById("productionSelectionCanvas");

    productionSelectionContext =
        productionSelectionCanvas.getContext("2d");

    productionDetectedText =
        document.getElementById("productionDetectedText");

    productionSelectionStatus =
        document.getElementById("productionSelectionStatus");

    productionRememberArea =
        document.getElementById("productionRememberArea");

    productionReadAreaBtn =
        document.getElementById("productionReadAreaBtn");

    productionFindLeftoversBtn =
        document.getElementById("productionFindLeftoversBtn");

    productionSelectAreaBtn =
        document.getElementById("productionSelectAreaBtn");

    productionSelectAgainBtn =
        document.getElementById("productionSelectAgainBtn");

    productionOrderInput =
        document.getElementById("productionOrderInput");

    productionDetectOrderBtn =
        document.getElementById("productionDetectOrderBtn");

    productionSelectAreaBtn.addEventListener("click", function () {
        beginProductionAreaSelection();
    });

    productionSelectAgainBtn.addEventListener("click", function () {
        beginProductionAreaSelection();
    });

    productionReadAreaBtn.addEventListener("click", async function () {
        await readSelectedProductionArea();
    });

    productionFindLeftoversBtn.addEventListener("click", async function () {
        await findLeftoversFromDetectedText();
    });

    productionDetectedText.addEventListener("input", function () {
        productionFindLeftoversBtn.disabled =
            productionDetectedText.value.trim() === "";
    });

    productionOrderInput.addEventListener("input", function () {
        this.value = String(this.value || "")
            .replace(/[^0-9]/g, "")
            .slice(0, 8);
    });

    productionDetectOrderBtn.addEventListener("click", async function () {
        await detectProductionOrderFromImage();
    });

    productionSelectionCanvas.addEventListener(
        "pointerdown",
        handleProductionSelectionPointerDown
    );

    productionSelectionCanvas.addEventListener(
        "pointermove",
        handleProductionSelectionPointerMove
    );

    productionSelectionCanvas.addEventListener(
        "pointerup",
        handleProductionSelectionPointerUp
    );

    productionSelectionCanvas.addEventListener(
        "pointercancel",
        handleProductionSelectionPointerUp
    );

    if (analyzeProductionBtn) {
        analyzeProductionBtn.style.display = "none";
    }

    if (viewProductionImageBtn) {
        viewProductionImageBtn.style.display = "none";
    }

    if (viewOcrCropBtn) {
        viewOcrCropBtn.style.display = "none";
    }

    if (productionPreviewViewport) {
        productionPreviewViewport.style.display = "none";
    }

    configureTodayProductionWorkspace();

    return tool;
}

function setProductionSelectionStatus(message, type) {

    ensureProductionSelectionUI();

    const colors = {
        success: "#166534",
        error: "#b91c1c",
        working: "#1d4ed8",
        info: "#475569"
    };

    productionSelectionStatus.style.color =
        colors[type] || colors.info;

    productionSelectionStatus.textContent = message || "";
}

function getRememberedProductionSelection() {

    try {
        const stored = JSON.parse(
            localStorage.getItem(PRODUCTION_SELECTION_STORAGE_KEY)
        );

        if (
            stored &&
            Number.isFinite(stored.x) &&
            Number.isFinite(stored.y) &&
            Number.isFinite(stored.width) &&
            Number.isFinite(stored.height) &&
            stored.width > 0 &&
            stored.height > 0
        ) {
            return stored;
        }
    } catch (error) {
        console.warn("Could not read the remembered production area.", error);
    }

    return null;
}

function saveRememberedProductionSelection() {

    if (!productionSelection || !productionRememberArea?.checked) {
        return;
    }

    localStorage.setItem(
        PRODUCTION_SELECTION_STORAGE_KEY,
        JSON.stringify(productionSelection)
    );
}

function clearRememberedProductionSelection() {
    localStorage.removeItem(PRODUCTION_SELECTION_STORAGE_KEY);
}

function resetProductionSelectionTool(options = {}) {

    ensureProductionSelectionUI();

    productionSelectionEnabled = false;
    productionSelectionDragging = false;
    productionSelectionPointerId = null;
    productionSelectionDraft = null;

    if (options.clearSelection !== false) {
        productionSelection = null;
    }

    if (options.clearText !== false) {
        productionDetectedText.value = "";
    }

    productionReadAreaBtn.disabled = !productionSelection;
    productionFindLeftoversBtn.disabled = true;
    productionSelectAgainBtn.disabled = !productionSelectionImage;

    drawProductionSelectionCanvas();
}

function getProductionCanvasPoint(event) {

    const rect = productionSelectionCanvas.getBoundingClientRect();

    const scaleX = rect.width
        ? productionSelectionCanvas.width / rect.width
        : 1;

    const scaleY = rect.height
        ? productionSelectionCanvas.height / rect.height
        : 1;

    return {
        x: Math.max(
            0,
            Math.min(
                productionSelectionCanvas.width,
                (event.clientX - rect.left) * scaleX
            )
        ),
        y: Math.max(
            0,
            Math.min(
                productionSelectionCanvas.height,
                (event.clientY - rect.top) * scaleY
            )
        )
    };
}

function normalizeProductionSelectionRect(startPoint, endPoint) {

    const left = Math.min(startPoint.x, endPoint.x);
    const top = Math.min(startPoint.y, endPoint.y);
    const right = Math.max(startPoint.x, endPoint.x);
    const bottom = Math.max(startPoint.y, endPoint.y);

    return {
        x: left / productionSelectionCanvas.width,
        y: top / productionSelectionCanvas.height,
        width: (right - left) / productionSelectionCanvas.width,
        height: (bottom - top) / productionSelectionCanvas.height
    };
}

function handleProductionSelectionPointerDown(event) {

    if (!productionSelectionEnabled || !productionSelectionImage) {
        return;
    }

    event.preventDefault();

    productionSelectionPointerId = event.pointerId;
    productionSelectionCanvas.setPointerCapture(event.pointerId);

    const point = getProductionCanvasPoint(event);

    productionSelectionDragging = true;
    productionSelectionDraft = {
        start: point,
        end: point
    };

    drawProductionSelectionCanvas();
}

function handleProductionSelectionPointerMove(event) {

    if (
        !productionSelectionDragging ||
        event.pointerId !== productionSelectionPointerId
    ) {
        return;
    }

    event.preventDefault();

    productionSelectionDraft.end =
        getProductionCanvasPoint(event);

    drawProductionSelectionCanvas();
}

function handleProductionSelectionPointerUp(event) {

    if (
        !productionSelectionDragging ||
        event.pointerId !== productionSelectionPointerId
    ) {
        return;
    }

    event.preventDefault();

    productionSelectionDraft.end =
        getProductionCanvasPoint(event);

    const normalizedRect = normalizeProductionSelectionRect(
        productionSelectionDraft.start,
        productionSelectionDraft.end
    );

    productionSelectionDragging = false;
    productionSelectionPointerId = null;
    productionSelectionDraft = null;

    if (
        normalizedRect.width < 0.02 ||
        normalizedRect.height < 0.02
    ) {
        setProductionSelectionStatus(
            "The selected area is too small. Drag a larger rectangle.",
            "error"
        );
        drawProductionSelectionCanvas();
        return;
    }

    productionSelection = normalizedRect;
    productionSelectionEnabled = false;
    productionReadAreaBtn.disabled = false;
    productionSelectAgainBtn.disabled = false;

    saveRememberedProductionSelection();
    drawProductionSelectionCanvas();

    setProductionSelectionStatus(
        "Area selected. Press Read Selected Area.",
        "success"
    );
}

function drawProductionSelectionCanvas() {

    if (
        !productionSelectionCanvas ||
        !productionSelectionContext ||
        !productionSelectionImage
    ) {
        return;
    }

    const canvas = productionSelectionCanvas;
    const ctx = productionSelectionContext;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        productionSelectionImage,
        0,
        0,
        canvas.width,
        canvas.height
    );

    let rect = productionSelection;

    if (productionSelectionDraft) {
        rect = normalizeProductionSelectionRect(
            productionSelectionDraft.start,
            productionSelectionDraft.end
        );
    }

    if (!rect) {
        return;
    }

    const x = rect.x * canvas.width;
    const y = rect.y * canvas.height;
    const width = rect.width * canvas.width;
    const height = rect.height * canvas.height;

    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.58)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(x, y, width, height);
    ctx.drawImage(
        productionSelectionImage,
        x / canvas.width * productionSelectionImage.naturalWidth,
        y / canvas.height * productionSelectionImage.naturalHeight,
        width / canvas.width * productionSelectionImage.naturalWidth,
        height / canvas.height * productionSelectionImage.naturalHeight,
        x,
        y,
        width,
        height
    );
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = Math.max(3, canvas.width / 350);
    ctx.setLineDash([12, 8]);
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
}

async function loadProductionImageIntoSelector(imageUrl) {

    ensureProductionSelectionUI();

    const image = new Image();
    image.src = imageUrl;

    await new Promise(function (resolve, reject) {
        image.onload = resolve;
        image.onerror = reject;
    });

    productionSelectionImage = image;

    const stage = document.getElementById("productionSelectionStage");
    const maximumDisplayWidth = Math.min(
        1200,
        Math.max(640, todayProductionModal.clientWidth - 60)
    );

    const displayWidth = Math.min(
        image.naturalWidth,
        maximumDisplayWidth
    );

    const displayHeight = Math.round(
        displayWidth * image.naturalHeight / image.naturalWidth
    );

    productionSelectionCanvas.width = displayWidth;
    productionSelectionCanvas.height = displayHeight;
    productionSelectionCanvas.style.width = displayWidth + "px";
    productionSelectionCanvas.style.height = displayHeight + "px";

    stage.style.display = "block";

    const rememberedSelection =
        getRememberedProductionSelection();

    if (rememberedSelection) {
        productionSelection = rememberedSelection;
        productionRememberArea.checked = true;
        productionReadAreaBtn.disabled = false;
        productionSelectAgainBtn.disabled = false;

        setProductionSelectionStatus(
            "The remembered area was applied. Review the green rectangle or select it again.",
            "info"
        );
    } else {
        productionSelection = null;
        productionRememberArea.checked = false;
        productionReadAreaBtn.disabled = true;
        productionSelectAgainBtn.disabled = false;

        setProductionSelectionStatus(
            "Press Select Product Area and drag around the product names.",
            "info"
        );
    }

    productionDetectedText.value = "";
    productionFindLeftoversBtn.disabled = true;
    drawProductionSelectionCanvas();

    setTimeout(function () {
        detectProductionOrderFromImage({ silent: true });
    }, 100);
}

function beginProductionAreaSelection() {

    ensureProductionSelectionUI();

    if (!productionSelectionImage) {
        alert("Please paste a production screenshot first.");
        return;
    }

    productionSelection = null;
    productionSelectionDraft = null;
    productionSelectionEnabled = true;
    productionReadAreaBtn.disabled = true;
    productionFindLeftoversBtn.disabled = true;
    productionDetectedText.value = "";

    if (!productionRememberArea.checked) {
        clearRememberedProductionSelection();
    }

    drawProductionSelectionCanvas();

    setProductionSelectionStatus(
        "Drag from one corner to the opposite corner around only the product names.",
        "working"
    );
}

function cleanDetectedProductionText(value) {

    return String(value || "")
        .split(/\r?\n/)
        .map(function (line) {
            return line
                .replace(/[|]/g, "I")
                .replace(/\s+/g, " ")
                .trim();
        })
        .filter(Boolean)
        .join("\n")
        .trim();
}

todayProductionBtn.addEventListener("click", function () {
    todayProductionModal.style.display = "block";
    ensureProductionSelectionUI();
    configureTodayProductionWorkspace();

    // Start loading the PDF engine immediately while the user chooses a file.
    loadFloraFlowPdfJs().catch(function (error) {
        console.warn("PDF reader preload skipped:", error);
    });
});

closeTodayProductionModal.addEventListener("click", function () {
    todayProductionModal.style.display = "none";
});

clearProductionImageBtn.addEventListener("click", function () {

    productionPreview.src = "";
    window.originalProductionImage = "";
    window.lastOcrCrop = "";

    productionPlaceholder.style.display = "block";
    productionLoaded.style.display = "none";

    productionPreview.style.display = "none";
    productionPreviewViewport.style.display = "none";

    productionImageScale = 1;
    productionPreview.style.transform = "scale(1)";

    productionSelectionImage = null;
    productionSelection = null;

    ensureProductionSelectionUI();

    const stage = document.getElementById("productionSelectionStage");
    stage.style.display = "none";

    resetProductionSelectionTool({
        clearSelection: true,
        clearText: true
    });

    setProductionSelectionStatus(
        "Paste a production screenshot to begin.",
        "info"
    );

    const resultsContainer =
        document.getElementById("productionRecommendations");

    if (resultsContainer) {
        resultsContainer.innerHTML = "";
    }
});

document.addEventListener("paste", async function (event) {

    if (todayProductionModal.style.display !== "block") {
        return;
    }

    const items = event.clipboardData?.items;

    if (!items) {
        return;
    }

    for (const item of items) {

        if (!item.type.startsWith("image/")) {
            continue;
        }

        const imageFile = item.getAsFile();

        if (!imageFile) {
            return;
        }

        const imageUrl = URL.createObjectURL(imageFile);

        productionPreview.src = imageUrl;
        window.originalProductionImage = imageUrl;
        productionPreview.onload = function () {

    ensureProductionSelectionUI();

    productionSelectionCanvas.style.cursor = "crosshair";

    setProductionSelectionStatus(
        "Drag over the product names to select the area.",
        "info"
    );

    setTimeout(function () {

        beginProductionAreaSelection();

        const selectionTool =
            document.getElementById("productionSelectionTool");

        if (selectionTool) {
            selectionTool.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    }, 150);
};

        productionPlaceholder.style.display = "none";
        productionLoaded.style.display = "block";

        productionPreview.style.display = "none";
        productionPreviewViewport.style.display = "none";

        try {
            await loadProductionImageIntoSelector(imageUrl);
        } catch (error) {
            console.error("Could not load the production screenshot.", error);
            alert("The pasted image could not be loaded.");
        }

        return;
    }

    alert("No image was found in the clipboard. Press Prt Sc first.");
});

if (analyzeProductionBtn) {
    analyzeProductionBtn.addEventListener("click", async function () {
        await readSelectedProductionArea();
    });
}

toggleRemovedBtn.addEventListener("click", function () {
    showRemoved = !showRemoved;

    toggleRemovedBtn.textContent = showRemoved
        ? "Hide Removed"
        : "Show Removed";

    renderInventory();
});
closeModal.addEventListener("click", function () {
    activityModal.style.display = "none";
});

closeEditModal.addEventListener("click", function () {
    editModal.style.display = "none";
});

closeProductHistoryModal.addEventListener("click", function () {
    document.getElementById("productHistoryModal").style.display = "none";
});

todayBtn.addEventListener("click", function () {
    document.getElementById("date").value = getToday();
});

addBtn.addEventListener("click", async function () {
    const product = productSelect.getValue();
    const color = toTitleCase(
    document.getElementById("color").value.trim()
);
    const quantity = document.getElementById("quantity").value;
    const caseNumber = document.getElementById("case").value;
    const date = document.getElementById("date").value;
    const notes = document.getElementById("notes").value;

   if (!product || !productsCatalog.includes(product)) {
    alert("Please select a valid product from the list.");
    productSelect.focus();
    return;
}

if (color.trim() === "" || quantity === "") {
    alert("Please enter Color and Quantity.");
    return;
}

if (Number(quantity) <= 0) {
    alert("Quantity must be greater than 0.");
    return;
}

    const leftoverCode = "LO-" + Date.now();

    const { data, error } = await supabaseClient
        .from("inventory")
        .insert([
            {
                leftover_code: leftoverCode,
                product: product,
                color: color,
                quantity: Number(quantity),
                case_number: caseNumber,
                date_received: date,
                notes: notes,
                status: "Available",
                created_by: getCurrentUserName()            }
        ])
        .select()
        .single();

    if (error) {
        alert("Error saving to Supabase: " + error.message);
        console.error(error);
        return;
    }

    inventory.push({
        id: data.id,
        leftover_code: data.leftover_code,
        product: data.product,
        color: data.color,
        quantity: data.quantity,
        caseNumber: data.case_number,
        date: data.date_received,
        notes: data.notes,
        status: data.status
    });

    history.push({
        date: getToday(),
        time: getTime(),
        id: data.id,
        action: "ADD",
        product: data.product,
        color: data.color,
        caseNumber: data.case_number,
        beforeQty: "-",
        quantity: data.quantity,
        afterQty: data.quantity
    });
    await addHistory(
    data.id,
    "ADD",
    data.product,
    data.color,
    data.case_number,
    "-",
    data.quantity,
    data.quantity
);

    renderInventory();
    renderHistory();
    updateDashboard();
    clearForm();
const successMessage = document.getElementById("successMessage");

successMessage.style.display = "block";

setTimeout(function () {
    successMessage.style.display = "none";
}, 2500);
});

function renderInventory() {
    table.innerHTML = "";
    mobileInventoryList.innerHTML = "";
const inventorySearch = searchInput.value.toLowerCase().trim();

const visibleInventory = inventory.filter(function (item) {

    const matchesRemoved =
        showRemoved || item.status !== "Removed from Inventory";

    const matchesSearch =
        inventorySearch === "" ||
        (item.product ?? "").toLowerCase().includes(inventorySearch) ||
        (item.color ?? "").toLowerCase().includes(inventorySearch) ||
        String(item.caseNumber ?? "").toLowerCase().includes(inventorySearch) ||
        (item.notes ?? "").toLowerCase().includes(inventorySearch) ||
        (item.status ?? "").toLowerCase().includes(inventorySearch);

    return matchesRemoved && matchesSearch;
});

visibleInventory.forEach(function (item) {

    const index = inventory.findIndex(function (inventoryItem) {
        return inventoryItem.id === item.id;
    });
        const row = table.insertRow();

        if (item.status === "Removed from Inventory") {
            row.classList.add("removed-row");
        }

        const productCell = row.insertCell(0);

const productLink = document.createElement("button");
productLink.innerHTML = item.product;
productLink.className = "product-history-link";

productLink.onclick = function () {
    openProductHistory(item);
};

productCell.appendChild(productLink);
        row.insertCell(1).innerHTML = item.color;
        row.insertCell(2).innerHTML = item.quantity;
        row.insertCell(3).innerHTML = item.caseNumber;
        row.insertCell(4).innerHTML = item.date;
        row.insertCell(5).innerHTML = item.notes;
        row.insertCell(6).innerHTML = getStatusBadge(item.status);

        const actionsCell = row.insertCell(7);

        if (item.status !== "Removed from Inventory") {
            const rotateBtn = document.createElement("button");
            rotateBtn.innerHTML = "Rotate";
            rotateBtn.onclick = function () {
                rotateProduct(index);
            };
            actionsCell.appendChild(rotateBtn);
        }

        const editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.style.marginLeft = "6px";
        editBtn.onclick = function () {
            openEditModal(index);
        };

        actionsCell.appendChild(editBtn);
        const mobileCard = document.createElement("div");
mobileCard.className = "mobile-inventory-card";

mobileCard.innerHTML = `
    <button class="mobile-copy-btn" title="Copy product information">
        📋
    </button>
    <button class="mobile-product-title">
        🌸 ${item.product || ""}
    </button>

    <div class="mobile-product-details">
        <span>🎨 ${item.color || ""}</span>
        <span>📦 Case ${item.caseNumber || ""}</span>
        <span>🌿 ${item.quantity ?? 0} stems</span>
        <span>📅 ${item.date || ""}</span>
    </div>

    <div class="mobile-product-status">
        ${getStatusBadge(item.status)}
    </div>
`;
mobileCard
    .querySelector(".mobile-copy-btn")
    .addEventListener("click", async function () {
        const productText =
`🌸 ${item.product || ""}
🎨 ${item.color || ""}
📦 Case ${item.caseNumber || ""}
🌿 ${item.quantity ?? 0} stems
📅 ${item.date || ""}
Status: ${item.status || ""}`;

        try {
            await navigator.clipboard.writeText(productText);

            const copyBtn = mobileCard.querySelector(".mobile-copy-btn");
            copyBtn.textContent = "✓";

            setTimeout(function () {
                copyBtn.textContent = "📋";
            }, 1200);

        } catch (error) {
            alert("Could not copy the product information.");
        }
    });

mobileCard
    .querySelector(".mobile-product-title")
    .addEventListener("click", function () {
        openProductHistory(item);
    });

const mobileActions = document.createElement("div");
mobileActions.className = "mobile-inventory-actions";

if (item.status !== "Removed from Inventory") {
    const mobileRotateBtn = document.createElement("button");
    mobileRotateBtn.textContent = "🔄 Rotate";
    mobileRotateBtn.addEventListener("click", function () {
        rotateProduct(index);
    });

    mobileActions.appendChild(mobileRotateBtn);
}

const mobileEditBtn = document.createElement("button");
mobileEditBtn.textContent = "✏️ Edit";
mobileEditBtn.addEventListener("click", function () {
    openEditModal(index);
});

mobileActions.appendChild(mobileEditBtn);
mobileCard.appendChild(mobileActions);
mobileInventoryList.appendChild(mobileCard);
    });
}
async function rotateProduct(index) {
    const item = inventory[index];

    rotatingIndex = index;

    document.getElementById("rotateProductName").textContent =
        item.product || "";

    document.getElementById("rotateProductColor").textContent =
        item.color || "";

    document.getElementById("rotateProductCase").textContent =
        item.caseNumber || "";

    document.getElementById("rotateAvailableQty").textContent =
        item.quantity || 0;

    document.getElementById("rotateQuantity").value = "";

    document
        .querySelectorAll('input[name="rotateReason"]')
        .forEach(function (option) {
            option.checked = false;
        });

    rotateModal.style.display = "block";
}
rotateAllBtn.addEventListener("click", function () {
    if (rotatingIndex === null) {
        return;
    }

    const item = inventory[rotatingIndex];

    document.getElementById("rotateQuantity").value =
        Number(item.quantity);
});
closeRotateModal.addEventListener("click", function () {
    rotateModal.style.display = "none";
    rotatingIndex = null;
});
confirmRotateBtn.addEventListener("click", async function () {
    if (rotatingIndex === null) {
        alert("No product selected.");
        return;
    }

    const item = inventory[rotatingIndex];
    const currentQty = Number(item.quantity);

    const rotatedQty = Number(
        document.getElementById("rotateQuantity").value
    );

    const selectedReason = document.querySelector(
        'input[name="rotateReason"]:checked'
    );

    if (!rotatedQty || rotatedQty <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    if (rotatedQty > currentQty) {
        alert("You cannot rotate more stems than available.");
        return;
    }

    if (!selectedReason) {
        alert("Please select Production, Samples or OLD.");
        return;
    }

    const usageReason = selectedReason.value;
    const newQty = currentQty - rotatedQty;

    const newStatus =
        newQty === 0
            ? "Removed from Inventory"
            : "Available";

    const { error } = await supabaseClient
        .from("inventory")
        .update({
            quantity: newQty,
            status: newStatus
        })
        .eq("id", item.id);

    if (error) {
        alert("Error updating inventory: " + error.message);
        console.error(error);
        return;
    }

    item.quantity = newQty;
    item.status = newStatus;

    const rotationDetails =
        "Used for: " + usageReason;

    await addHistory(
        item.id,
        "ROTATE",
        item.product,
        item.color,
        item.caseNumber,
        currentQty,
        rotatedQty,
        newQty,
        rotationDetails
    );

    await loadHistoryFromSupabase();

    rotateModal.style.display = "none";
    rotatingIndex = null;

    renderInventory();
    renderHistory();
    updateDashboard();
});

function openProductHistory(item) {

    document.getElementById("historyProductName").textContent = item.product || "";
    document.getElementById("historyProductColor").textContent = item.color || "";
    document.getElementById("historyProductCase").textContent = item.caseNumber || "";
    document.getElementById("historyProductQty").textContent = item.quantity ?? 0;

    const timeline = document.getElementById("productHistoryTimeline");
    timeline.innerHTML = "";

const itemHistory = history
    .filter(record => record.id === item.id)
    .reverse();
    if (itemHistory.length === 0) {

        timeline.innerHTML =
        "<p style='text-align:center;color:#777;'>No history available.</p>";

    } else {

        itemHistory.forEach(function(record, index){
            const card = document.createElement("div");
            card.className = "timeline-card";

            let icon = "⚪";
            let color = "#999";
            let description = "";

            switch(record.action){

                case "ADD":
                    icon = "🟢";
                    color = "#2ecc71";
                    description = "Added " + (record.quantity || 0) + " stems";
                    break;

                case "EDIT":
                    icon = "🟡";
                    color = "#f1c40f";
                    description = (record.beforeQty || 0) + " → " + (record.afterQty || 0) + " stems";
                    break;

                case "ROTATE":
                    icon = "🔵";
                    color = "#3498db";
                    description = (record.beforeQty || 0) + " → " + (record.afterQty || 0) + " stems";
                    break;

                case "REMOVE":
                    icon = "🔴";
                    color = "#e74c3c";
                    description = "Removed from Inventory";
                    break;
            }

card.innerHTML = `
<div style="
    border-left:6px solid ${color};
    padding:15px;
    margin-bottom:12px;
    background:white;
    border-radius:10px;
    box-shadow:0 2px 6px rgba(0,0,0,.08);
">

    <h3 style="margin:0 0 10px 0;">
        ${icon} ${record.action}
    </h3>

    <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:15px;">

        <span>👤 ${record.userName || "Unknown"}</span>

        <span>🕒 ${record.date || ""} ${record.time || ""}</span>

    </div>

    ${
    record.details && record.details !== record.action
    ? `
    <div style="
        background:#f8f9fa;
        border-radius:8px;
        padding:10px;
        margin-bottom:15px;
        font-size:14px;
        line-height:1.5;
        white-space:pre-line;
    ">
        ${record.details.split(" | ").join("<br>")}
    </div>
    `
    : ""
}
    <div style="text-align:center;">

        <div style="font-size:20px;font-weight:bold;">
            ${record.beforeQty ?? record.quantity ?? 0} stems
        </div>

        <div style="
            font-size:28px;
            color:${color};
            line-height:22px;
            margin:8px 0;
        ">
            │<br>▼
        </div>

        <div style="
            font-size:20px;
            font-weight:bold;
            color:${color};
        ">
            ${
                record.action === "ADD"
                ? "Entered Inventory"
                : (record.afterQty ?? 0) + " stems"
            }
        </div>

    </div>

</div>
`;

timeline.appendChild(card);
            if(index < itemHistory.length-1){

                const arrow = document.createElement("div");

                arrow.innerHTML = `
                    <div style="
                        text-align:center;
                        font-size:26px;
                        color:#999;
                        margin:5px 0 15px 0;
                    ">
                        │
                        <br>
                        ▼
                    </div>
                `;

                timeline.appendChild(arrow);

            }

        });

    }

    document.getElementById("productHistoryModal").style.display = "block";

}
function openEditModal(index) {
    editingIndex = index;
    const item = inventory[index];

    document.getElementById("editProduct").value = item.product;
    document.getElementById("editColor").value = item.color;
    document.getElementById("editQuantity").value = item.quantity;
    document.getElementById("editCase").value = item.caseNumber;
    document.getElementById("editDate").value = item.date;
    document.getElementById("editNotes").value = item.notes;

    editModal.style.display = "block";
}

saveEditBtn.addEventListener("click", async function () {

    if (editingIndex === null) return;

    const item = inventory[editingIndex];
    const oldQty = item.quantity;
    const oldProduct = item.product;
    const oldColor = item.color;
    const oldCase = item.caseNumber;
    const oldDate = item.date;
    const oldNotes = item.notes;

    const updatedProduct = document.getElementById("editProduct").value;
    const updatedColor = document.getElementById("editColor").value;
    const updatedQuantity = Number(document.getElementById("editQuantity").value);
    const updatedCase = document.getElementById("editCase").value;
    const updatedDate = document.getElementById("editDate").value;
    const updatedNotes = document.getElementById("editNotes").value;
const changes = [];

if (oldProduct !== updatedProduct) {
    changes.push(`Product: ${oldProduct} → ${updatedProduct}`);
}

if (oldColor !== updatedColor) {
    changes.push(`Color: ${oldColor} → ${updatedColor}`);
}

if (Number(oldQty) !== updatedQuantity) {
    changes.push(`Quantity: ${oldQty} → ${updatedQuantity}`);
}

if (oldCase !== updatedCase) {
    changes.push(`Case: ${oldCase || "(empty)"} → ${updatedCase || "(empty)"}`);
}

if (oldDate !== updatedDate) {
    changes.push(`Date: ${oldDate || "(empty)"} → ${updatedDate || "(empty)"}`);
}

if (oldNotes !== updatedNotes) {
    changes.push(`Notes: ${oldNotes || "(empty)"} → ${updatedNotes || "(empty)"}`);
}

const editDetails = changes.length > 0
    ? changes.join(" | ")
    : "No changes detected";

    const newStatus = updatedQuantity === 0
        ? "Removed from Inventory"
        : "Available";

    const { error } = await supabaseClient
        .from("inventory")
        .update({
            product: updatedProduct,
            color: updatedColor,
            quantity: updatedQuantity,
            case_number: updatedCase,
            date_received: updatedDate,
            notes: updatedNotes,
            status: newStatus
        })
        .eq("id", item.id);

    if (error) {
        alert("Error updating inventory: " + error.message);
        console.error(error);
        return;
    }

    item.product = updatedProduct;
    item.color = updatedColor;
    item.quantity = updatedQuantity;
    item.caseNumber = updatedCase;
    item.date = updatedDate;
    item.notes = updatedNotes;
    item.status = newStatus;

await addHistory(
    item.id,
    "EDIT",
    item.product,
    item.color,
    item.caseNumber,
    oldQty,
    "-",
    updatedQuantity,
    editDetails
);
    await loadHistoryFromSupabase();

    renderInventory();
    renderHistory();
    updateDashboard();

    editModal.style.display = "none";
    editingIndex = null;

});
async function addHistory(
    id,
    action,
    product,
    color,
    caseNumber,
    beforeQty,
    quantity,
    afterQty,
    details = action
) {
    const { data, error } = await supabaseClient
        .from("activity")
        .insert([
            {
                inventory_id: id,
                action: action,
                product: product,
                color: color,
                case_number: caseNumber,
                before_qty: beforeQty === "-" ? null : beforeQty,
                quantity_used: quantity === "-" ? null : quantity,
                after_qty: afterQty === "-" ? null : afterQty,
                user_name: getCurrentUserName(),
                details: details
            }
        ])
        .select()
        .single();

    console.log("Activity error:", error);
    console.log("Activity data:", data);

    if (error) {
        alert("Error saving activity: " + error.message);
        console.error(error);
        return;
    }
}
async function loadHistoryFromSupabase() {
    const { data, error } = await supabaseClient
        .from("activity")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        alert("Error loading activity: " + error.message);
        console.error(error);
        return;
    }

    history = data.map(item => ({
        date: item.created_at ? item.created_at.split("T")[0] : "",
        time: item.created_at
            ? new Date(item.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
            : "",
        id: item.inventory_id,
        action: item.action, userName: item.user_name,
        product: item.product,
        color: item.color,
        caseNumber: item.case_number,
        beforeQty: item.before_qty,
        quantity: item.quantity_used,
        afterQty: item.after_qty,
        details: item.details
    }));

    renderHistory();
    updateDashboard();
}
function renderHistory() {

    activityTimeline.innerHTML = "";

    const search = historySearch.value.toLowerCase().trim();
    const selectedDate = historyDate.value;

    const filteredHistory = history.filter(function (item) {

const matchesSearch =
    search === "" ||
    (item.action ?? "").toLowerCase().includes(search) ||
    (item.userName ?? "").toLowerCase().includes(search) ||
    (item.product ?? "").toLowerCase().includes(search) ||
    (item.color ?? "").toLowerCase().includes(search) ||
    String(item.caseNumber ?? "").toLowerCase().includes(search) ||
    (item.details ?? "").toLowerCase().includes(search);

const matchesDate =
    selectedDate === "" ||
    item.date === selectedDate;

return matchesSearch && matchesDate;
    });

    if (filteredHistory.length === 0) {

        activityTimeline.innerHTML = `
            <p style="
                text-align:center;
                color:#777;
                padding:25px;
            ">
                No activity found.
            </p>
        `;

        return;
    }

    filteredHistory.forEach(function (item, index) {

        let icon = "⚪";
        let color = "#999";
        let quantityText = "";

        switch (item.action) {

            case "ADD":
                icon = "🟢";
                color = "#2ecc71";
                quantityText = `${item.quantity ?? item.afterQty ?? 0} stems added`;
                break;

            case "EDIT":
    icon = "🟡";
    color = "#f1c40f";

    if (item.details && item.details !== "EDIT") {
        quantityText = "✏️ Changes made";
    } else {
        quantityText = `${item.beforeQty ?? 0} → ${item.afterQty ?? 0} stems`;
    }

    break;
            case "ROTATE":
                icon = "🔵";
                color = "#3498db";
                quantityText = `${item.beforeQty ?? 0} → ${item.afterQty ?? 0} stems`;
                break;

            case "REMOVE":
                icon = "🔴";
                color = "#e74c3c";
                quantityText = "Removed from Inventory";
                break;
        }

        const card = document.createElement("div");

        card.innerHTML = `
            <div style="
                background:white;
                border-left:6px solid ${color};
                border-radius:12px;
                padding:16px;
                margin-bottom:12px;
                box-shadow:0 2px 8px rgba(0,0,0,.08);
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:12px;
                ">
                    <h3 style="margin:0;">
                        ${icon} ${item.action}
                    </h3>

                    <span style="
                        font-size:13px;
                        color:#777;
                    ">
                        ${item.date} ${item.time}
                    </span>

                </div>

<div style="
    font-size:14px;
    color:#555;
    margin-bottom:12px;
    line-height:1.7;
">
    👤 <strong>${item.userName || "Unknown"}</strong>
    &nbsp;•&nbsp;
    🌸 <strong>${item.product || ""}</strong>
    &nbsp;•&nbsp;
    🎨 ${item.color || ""}
    &nbsp;•&nbsp;
    📦 ${item.caseNumber || ""}
</div>
                
${
    item.action === "EDIT" &&
    item.details &&
    item.details !== "EDIT"
        ? `
            <div style="
                background:#fff9e6;
                border:1px solid #f1c40f;
                border-radius:10px;
                padding:12px;
                margin-bottom:12px;
                font-size:14px;
                line-height:1.7;
            ">
                <div style="
                    font-weight:bold;
                    margin-bottom:6px;
                    color:#8a6d00;
                ">
                    ✏️ Changes
                </div>

                ${item.details
                    .split(" | ")
                    .map(function (change) {
                        return `<div>• ${change}</div>`;
                    })
                    .join("")}
            </div>
        `
        : ""
}

${
    item.action !== "EDIT" ||
    !item.details ||
    item.details === "EDIT"
        ? `
            <div style="
                text-align:center;
                font-size:18px;
                font-weight:bold;
                color:${color};
            ">
${
    item.action === "EDIT" && item.details && item.details !== "EDIT"
        ? item.details.split(" | ").join("<br>• ")
        : quantityText
}
            </div>
        `
        : ""
}
            </div>
        `;

        activityTimeline.appendChild(card);


    });

}
function getStatusBadge(status) {
    if (status === "Available") {
        return `<span class="status-badge status-available">Available</span>`;
    }

    if (status === "Rotated") {
        return `<span class="status-badge status-rotated">Rotated</span>`;
    }

    if (status === "Removed from Inventory") {
        return `<span class="status-badge status-removed">Removed from Inventory</span>`;
    }

    return status;
}

function saveData() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("nextId", nextId);
}
function clearForm() {

    productSelect.clear();

    document.getElementById("color").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("notes").value = "";

    productSelect.focus();

}
function toTitleCase(text) {
    if (!text) return "";

    return text
        .toLowerCase()
        .split(/\s+/)
        .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}function getToday() {
    return new Date().toISOString().split("T")[0];
}

function getTime() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

searchInput.addEventListener("input", renderInventory);
exportInventorySettingsBtn.addEventListener("click", function () {
    exportToCSV(inventory, "FloraFlow_Inventory.csv");
});

exportActivitySettingsBtn.addEventListener("click", function () {
    exportToCSV(history, "FloraFlow_Activity.csv");
});
function exportToCSV(data, filename) {
    if (data.length === 0) {
        alert("No data to export.");
        return;
    }

    const headers = Object.keys(data[0]);
    const rows = data.map(item =>
        headers.map(header => `"${item[header]}"`).join(",")
    );

    const csvContent = [
        headers.join(","),
        ...rows
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
function updateDashboard() {

    const available = inventory.filter(item =>
        item.status === "Available"
    ).length;

    const totalStems = inventory
        .filter(item => item.status === "Available")
        .reduce((sum, item) => sum + Number(item.quantity), 0);

    const removed = inventory.filter(item =>
        item.status === "Removed from Inventory"
    ).length;

    const today = getToday();

    const rotationsToday = history.filter(item =>
        item.date === today &&
        item.action === "ROTATE"
    ).length;

    document.getElementById("availableCount").innerHTML = available;
    document.getElementById("totalStems").innerHTML = totalStems;
    document.getElementById("rotationsToday").innerHTML = rotationsToday;
    document.getElementById("removedCount").innerHTML = removed;

}
async function loadInventoryFromSupabase() {
    const { data, error } = await supabaseClient
        .from("inventory")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        alert("Error loading inventory from Supabase: " + error.message);
        console.error(error);
        return;
    }

    inventory = data.map(item => ({
        id: item.id,
        leftover_code: item.leftover_code,
        product: item.product,
        color: item.color,
        quantity: item.quantity,
        caseNumber: item.case_number,
        date: item.date_received,
        notes: item.notes,
        status: item.status
    }));

    renderInventory();
    updateDashboard();
}
historySearch.addEventListener("input", renderHistory);
historyDate.addEventListener("change", renderHistory);
const colorInput = document.getElementById("color");

colorInput.addEventListener("blur", function () {
    this.value = toTitleCase(this.value.trim());
});
historyTodayBtn.addEventListener("click", function () {
    historyDate.value = getToday();
    renderHistory();
});
let pullDistance = 0;
let isPulling = false;


document.addEventListener("touchstart", function (event) {
    if (window.matchMedia("(max-width: 720px)").matches) return;
    if (window.scrollY === 0) {
        pullStartY = event.touches[0].clientY;
        isPulling = true;
    }
});

document.addEventListener("touchmove", function (event) {
    if (window.matchMedia("(max-width: 720px)").matches) return;
    if (!isPulling) return;

    const currentY = event.touches[0].clientY;
    pullDistance = currentY - pullStartY;

    if (pullDistance > 0 && window.scrollY === 0) {
        event.preventDefault();

        pullToRefresh.style.display = "block";

        if (pullDistance > 90) {
            pullToRefresh.textContent = "↻ Release to refresh";
        } else {
            pullToRefresh.textContent = "↓ Pull to refresh";
        }
    }
}, { passive: false });
async function analyzeProduction() {
    await readSelectedProductionArea();
}

async function startProductionAnalysis() {
    await findLeftoversFromDetectedText();
}

function getSelectedProductionSourceRect() {

    if (!productionSelectionImage || !productionSelection) {
        return null;
    }

    const imageWidth = productionSelectionImage.naturalWidth;
    const imageHeight = productionSelectionImage.naturalHeight;

    const x = Math.max(
        0,
        Math.round(productionSelection.x * imageWidth)
    );

    const y = Math.max(
        0,
        Math.round(productionSelection.y * imageHeight)
    );

    const width = Math.max(
        1,
        Math.min(
            imageWidth - x,
            Math.round(productionSelection.width * imageWidth)
        )
    );

    const height = Math.max(
        1,
        Math.min(
            imageHeight - y,
            Math.round(productionSelection.height * imageHeight)
        )
    );

    return {
        x: x,
        y: y,
        width: width,
        height: height
    };
}

function calculateProductionOcrScale(sourceWidth, sourceHeight) {

    const widthScale = 1800 / Math.max(1, sourceWidth);
    const heightScale = 900 / Math.max(1, sourceHeight);

    return Math.max(
        2,
        Math.min(5, Math.max(widthScale, heightScale))
    );
}

async function readSelectedProductionArea() {

    ensureProductionSelectionUI();

    if (!window.originalProductionImage || !productionSelectionImage) {
        alert("Please paste a production screenshot first.");
        return;
    }

    if (!productionSelection) {
        alert("Please select the product area first.");
        return;
    }

    const sourceRect = getSelectedProductionSourceRect();

    if (!sourceRect) {
        alert("The selected area is not valid.");
        return;
    }

    productionReadAreaBtn.disabled = true;
    productionFindLeftoversBtn.disabled = true;

    setProductionSelectionStatus(
        "Reading only the selected product area...",
        "working"
    );

    try {
        const scale = calculateProductionOcrScale(
            sourceRect.width,
            sourceRect.height
        );

        const selectedCanvas = createEnhancedOcrCanvas(
            productionSelectionImage,
            sourceRect.x,
            sourceRect.y,
            sourceRect.width,
            sourceRect.height,
            scale
        );

        window.lastOcrCrop = selectedCanvas.toDataURL("image/png");

        const articleResult = await Tesseract.recognize(
            selectedCanvas,
            "eng",
            {
                preserve_interword_spaces: "1",
                tessedit_pageseg_mode: 6,
                tessedit_char_whitelist:
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -/"
            }
        );

        const detectedText = cleanDetectedProductionText(
            articleResult?.data?.text || ""
        );

        const separatedProductionData =
            separateProductionOrderAndArticles(detectedText);

        window.lastProductionFullOcrText =
            separatedProductionData.fullText;

        if (
            productionOrderInput &&
            separatedProductionData.orderNumber
        ) {
            productionOrderInput.value =
                separatedProductionData.orderNumber;
        }

        productionDetectedText.value =
            separatedProductionData.articleText;

        productionFindLeftoversBtn.disabled =
            separatedProductionData.articleText === "";

        saveRememberedProductionSelection();

        if (!detectedText) {
            setProductionSelectionStatus(
                "No readable text was found. Select the product area again or make the rectangle tighter.",
                "error"
            );
            return;
        }

        const lineCount = separatedProductionData.articleText
            .split(/\r?\n/)
            .filter(Boolean)
            .length;

        const orderMessage = separatedProductionData.orderNumber
            ? " Production Order #" +
                separatedProductionData.orderNumber +
                " was detected automatically."
            : " Enter the Production Order number manually if it was not included in the selection.";

        setProductionSelectionStatus(
            "Detected " + lineCount +
            " product line(s)." + orderMessage +
            " Review the products below, then press Find Leftovers.",
            "success"
        );

    } catch (error) {
        console.error("Selected-area OCR error:", error);

        setProductionSelectionStatus(
            "The selected area could not be read.",
            "error"
        );

        alert(
            "The selected area could not be read. " +
            (error?.message || String(error))
        );
    } finally {
        productionReadAreaBtn.disabled = false;
    }
}

async function findLeftoversFromDetectedText() {

    ensureProductionSelectionUI();

    const editedText = productionDetectedText.value.trim();
    const fullOcrText = String(
        window.lastProductionFullOcrText || editedText
    );

    if (!editedText) {
        alert("Read the selected area or type the product lines first.");
        return;
    }

    if (
        !Array.isArray(lexiflorSearchCatalog) ||
        lexiflorSearchCatalog.length === 0
    ) {
        await loadLexiflorCatalog();
    }

    productionFindLeftoversBtn.disabled = true;

    setProductionSelectionStatus(
        "Comparing the confirmed text with product rules and inventory...",
        "working"
    );

    try {
        const products = normalizeProductionText(editedText);
        const matches = findInventoryMatches(products);
        const confirmedOrderNumber = normalizeProductionOrderNumber(
            productionOrderInput?.value
        );
        const productionOrderNumber =
            confirmedOrderNumber ||
            extractProductionLot(fullOcrText, { strict: true }) ||
            extractProductionLot(editedText, { strict: true });

        if (productionOrderInput && productionOrderNumber) {
            productionOrderInput.value = productionOrderNumber;
        }

        showProductionRecommendations(
    matches,
    productionOrderNumber
);
const resultsContainer =
    document.getElementById("productionRecommendations");

const selectorTool =
    document.getElementById("productionSelectionTool");

if (resultsContainer) {

    resultsContainer.style.display = "block";
    resultsContainer.style.visibility = "visible";
    resultsContainer.style.width = "100%";
    resultsContainer.style.boxSizing = "border-box";
    resultsContainer.style.marginTop = "16px";

    if (
        selectorTool &&
        selectorTool.parentNode
    ) {
        selectorTool.parentNode.insertBefore(
            resultsContainer,
            selectorTool.nextSibling
        );
    }

    setTimeout(function () {
        resultsContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 150);
}


        if (products.length === 0) {
            setProductionSelectionStatus(
                "No flower lines were recognized. Check the text and try again.",
                "error"
            );
            return;
        }

        setProductionSelectionStatus(
            "Analysis completed using the confirmed text below.",
            "success"
        );

    } catch (error) {
        console.error("Production text analysis error:", error);

        setProductionSelectionStatus(
            "The confirmed text could not be analyzed.",
            "error"
        );

        alert(
            "The confirmed text could not be analyzed. " +
            (error?.message || String(error))
        );
    } finally {
        productionFindLeftoversBtn.disabled =
            productionDetectedText.value.trim() === "";
    }
}


function appendFloraFlowBrainCard(card, match) {

    if (!match?.learningSuggested) {
        return;
    }

    const brainCard = document.createElement("div");
    brainCard.style.marginTop = "14px";
    brainCard.style.padding = "16px";
    brainCard.style.border = "1px solid #d1d5db";
    brainCard.style.borderRadius = "12px";
    brainCard.style.background = "#ffffff";
    brainCard.style.boxShadow = "0 2px 8px rgba(15,23,42,.08)";

    const canTeach =
        canManageProducts();

    brainCard.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;font-weight:800;color:#166534;margin-bottom:10px;">
            <span style="display:inline-flex;width:28px;height:28px;border-radius:8px;background:#dcfce7;align-items:center;justify-content:center;font-size:15px;">FF</span>
            FloraFlow Learning
        </div>
        <div style="font-size:14px;line-height:1.6;color:#3f3f46;">
            OCR read: <strong>${match.learningAlias}</strong><br>
            Closest known alias: <strong>${match.learningExpectedAlias}</strong><br>
            Family: <strong>${match.learningFamily}</strong><br>
            Similarity: <strong>${match.learningScore}%</strong>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
            <button type="button" class="flora-brain-confirm" ${canTeach ? "" : "disabled"}>
                ✅ Confirm and Learn
            </button>
            <button type="button" class="flora-brain-ignore">
                Ignore for now
            </button>
        </div>
        ${
            canTeach
                ? ""
                : `<div style="font-size:12px;color:#7c2d12;margin-top:8px;">
                    Only authorized managers can confirm new learning rules.
                   </div>`
        }
    `;

    const confirmButton =
        brainCard.querySelector(".flora-brain-confirm");

    const ignoreButton =
        brainCard.querySelector(".flora-brain-ignore");

    if (confirmButton && canTeach) {
        confirmButton.addEventListener("click", async function () {

            confirmButton.disabled = true;
            confirmButton.textContent = "Saving...";

            try {
                await saveProductionAliasLearning(
                    match.learningAlias,
                    match.learningFamily
                );

                confirmButton.textContent = "✓ Learned";
                setProductionSelectionStatus(
                    match.learningAlias +
                    " was saved as " +
                    match.learningFamily + ".",
                    "success"
                );

                setTimeout(function () {
                    findLeftoversFromDetectedText();
                }, 350);

            } catch (error) {
                console.error("FloraFlow Brain save error:", error);
                confirmButton.disabled = false;
                confirmButton.textContent = "✅ Confirm and Learn";
                alert(
                    "The learning rule could not be saved. " +
                    (error?.message || String(error))
                );
            }
        });
    }

    if (ignoreButton) {
        ignoreButton.addEventListener("click", function () {
            brainCard.remove();
        });
    }

    card.appendChild(brainCard);
}


function getTeachFloraFlowFamilies() {

    const families = new Set(productsCatalog.map(normalizeMatchText));

    getRuntimeOperationalFamilyRules().forEach(function (rule) {
        const family = normalizeMatchText(rule.family);
        if (family) {
            families.add(family);
        }
    });

    return Array.from(families)
        .filter(Boolean)
        .sort(function (a, b) {
            return a.localeCompare(b);
        });
}

function getSuggestedProductionAlias(match) {

    const original = normalizeMatchText(
        match?.originalOcrLine || match?.product || ""
    );

    if (!original) {
        return "";
    }

    let alias = cleanProductionLine(original);
    alias = removeArticleColors(alias);

    return normalizeMatchText(alias || original);
}

function ensureTeachFloraFlowModal() {

    let overlay = document.getElementById("teachFloraFlowOverlay");

    if (overlay) {
        return overlay;
    }

    overlay = document.createElement("div");
    overlay.id = "teachFloraFlowOverlay";
    overlay.style.cssText = [
        "display:none",
        "position:fixed",
        "inset:0",
        "z-index:100000",
        "background:rgba(15,23,42,.62)",
        "padding:18px",
        "box-sizing:border-box",
        "overflow:auto"
    ].join(";");

    overlay.innerHTML = `
        <div style="
            width:min(560px,100%);
            margin:5vh auto;
            background:white;
            border-radius:16px;
            padding:20px;
            box-shadow:0 24px 70px rgba(0,0,0,.28);
        ">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;">
                <div>
                    <div style="font-size:21px;font-weight:800;color:#4c1d95;">
                        🧠 Teach FloraFlow
                    </div>
                    <div style="font-size:13px;color:#64748b;margin-top:4px;">
                        Save what Production writes and the correct flower family.
                    </div>
                </div>
                <button type="button" id="teachFloraFlowCloseBtn" style="font-size:20px;">✕</button>
            </div>

            <label style="display:block;font-weight:700;margin-top:18px;margin-bottom:6px;">
                Production text / alias
            </label>
            <input id="teachFloraFlowAlias" type="text" autocomplete="off" style="
                width:100%;box-sizing:border-box;padding:11px;border:1px solid #cbd5e1;border-radius:9px;
            ">

            <label style="display:block;font-weight:700;margin-top:14px;margin-bottom:6px;">
                Correct family
            </label>
            <select id="teachFloraFlowFamily" style="
                width:100%;box-sizing:border-box;padding:11px;border:1px solid #cbd5e1;border-radius:9px;background:white;
            "></select>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div>
                    <label style="display:block;font-weight:700;margin-top:14px;margin-bottom:6px;">
                        Color detected
                    </label>
                    <input id="teachFloraFlowColor" type="text" style="
                        width:100%;box-sizing:border-box;padding:11px;border:1px solid #cbd5e1;border-radius:9px;
                    ">
                </div>
                <div>
                    <label style="display:block;font-weight:700;margin-top:14px;margin-bottom:6px;">
                        Variety (optional)
                    </label>
                    <input id="teachFloraFlowVariety" type="text" style="
                        width:100%;box-sizing:border-box;padding:11px;border:1px solid #cbd5e1;border-radius:9px;
                    ">
                </div>
            </div>

            <div id="teachFloraFlowMessage" style="min-height:20px;margin-top:12px;font-size:13px;color:#475569;"></div>

            <div style="display:flex;justify-content:flex-end;gap:9px;margin-top:14px;flex-wrap:wrap;">
                <button type="button" id="teachFloraFlowCancelBtn">Cancel</button>
                <button type="button" id="teachFloraFlowSaveBtn" style="font-weight:800;">
                    💾 Save and Analyze Again
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = function () {
        overlay.style.display = "none";
        overlay.dataset.originalLine = "";
    };

    overlay.querySelector("#teachFloraFlowCloseBtn")
        .addEventListener("click", close);

    overlay.querySelector("#teachFloraFlowCancelBtn")
        .addEventListener("click", close);

    installSafeBackdropClose(overlay, close);

    overlay.querySelector("#teachFloraFlowSaveBtn")
        .addEventListener("click", async function () {

            const saveButton = this;
            const aliasInput = overlay.querySelector("#teachFloraFlowAlias");
            const familyInput = overlay.querySelector("#teachFloraFlowFamily");
            const colorInput = overlay.querySelector("#teachFloraFlowColor");
            const varietyInput = overlay.querySelector("#teachFloraFlowVariety");
            const message = overlay.querySelector("#teachFloraFlowMessage");

            const alias = normalizeMatchText(aliasInput.value);
            const family = normalizeMatchText(familyInput.value);
            const color = normalizeMatchText(colorInput.value);
            const variety = normalizeMatchText(varietyInput.value);

            if (!alias || !family) {
                message.style.color = "#b91c1c";
                message.textContent = "Production text and family are required.";
                return;
            }

            if (!canManageProducts()) {
                message.style.color = "#b91c1c";
                message.textContent = "Only authorized managers can save new production rules.";
                return;
            }

            saveButton.disabled = true;
            saveButton.textContent = "Saving...";
            message.style.color = "#1d4ed8";
            message.textContent = "Saving the new shared rule in FloraFlow Brain...";

            try {
                await saveProductionAliasLearning(alias, family);

                message.style.color = "#166534";
                message.textContent =
                    alias + " was saved as " + family +
                    (color ? " | Color: " + color : "") +
                    (variety ? " | Variety: " + variety : "") + ".";

                setProductionSelectionStatus(
                    alias + " is now recognized as " + family + ".",
                    "success"
                );

                setTimeout(async function () {
                    close();
                    await findLeftoversFromDetectedText();
                }, 450);

            } catch (error) {
                console.error("Teach FloraFlow save error:", error);
                message.style.color = "#b91c1c";
                message.textContent =
                    "The rule could not be saved. " +
                    (error?.message || String(error));
                saveButton.disabled = false;
                saveButton.textContent = "💾 Save and Analyze Again";
            }
        });

    return overlay;
}

function openTeachFloraFlowModal(match) {

    const overlay = ensureTeachFloraFlowModal();
    const aliasInput = overlay.querySelector("#teachFloraFlowAlias");
    const familyInput = overlay.querySelector("#teachFloraFlowFamily");
    const colorInput = overlay.querySelector("#teachFloraFlowColor");
    const varietyInput = overlay.querySelector("#teachFloraFlowVariety");
    const message = overlay.querySelector("#teachFloraFlowMessage");
    const saveButton = overlay.querySelector("#teachFloraFlowSaveBtn");

    familyInput.innerHTML = `
        <option value="">Select the correct family</option>
        ${getTeachFloraFlowFamilies()
            .map(function (family) {
                return `<option value="${family}">${family}</option>`;
            })
            .join("")}
    `;

    const suggestedFamily = normalizeMatchText(match?.product || "");
    if (suggestedFamily && getTeachFloraFlowFamilies().includes(suggestedFamily)) {
        familyInput.value = suggestedFamily;
    }

    aliasInput.value = getSuggestedProductionAlias(match);
    colorInput.value = normalizeMatchText(
        match?.color || extractProductionColor(match?.originalOcrLine || "")
    );
    varietyInput.value = "";
    message.textContent = "Review the alias before saving. Keep only the production name or code.";
    message.style.color = "#475569";
    saveButton.disabled = !canManageProducts();
    saveButton.textContent = "💾 Save and Analyze Again";

    overlay.dataset.originalLine = match?.originalOcrLine || "";
    overlay.style.display = "block";

    setTimeout(function () {
        aliasInput.focus();
        aliasInput.select();
    }, 50);
}

function appendTeachFloraFlowButton(card, match) {

    if (!match || match.inventoryFound) {
        return;
    }

    const canTeach = canManageProducts();
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Teach FloraFlow";
    button.disabled = !canTeach;
    button.style.cssText = `
        margin-top:12px;
        min-height:42px;
        padding:10px 16px;
        border:none;
        border-radius:10px;
        background:#166534;
        color:white;
        font-size:14px;
        font-weight:700;
        letter-spacing:.01em;
        cursor:pointer;
        box-shadow:0 2px 6px rgba(22,101,52,.20);
        transition:transform .15s ease, box-shadow .15s ease, background .15s ease;
    `;

    button.addEventListener("mouseenter", function () {
        if (!button.disabled) {
            button.style.background = "#14532d";
            button.style.boxShadow = "0 4px 10px rgba(22,101,52,.25)";
        }
    });

    button.addEventListener("mouseleave", function () {
        button.style.background = "#166534";
        button.style.boxShadow = "0 2px 6px rgba(22,101,52,.20)";
    });

    button.addEventListener("click", function () {
        openTeachFloraFlowModal(match);
    });

    card.appendChild(button);

    if (!canTeach) {
        const note = document.createElement("div");
        note.textContent = "Only authorized managers can add new production rules.";
        note.style.cssText = "font-size:12px;color:#7c2d12;margin-top:6px;";
        card.appendChild(note);
    }
}


function configureTodayProductionWorkspace() {

    if (!todayProductionModal) {
        return;
    }

    const modalContent =
        todayProductionModal.querySelector(".modal-content");

    todayProductionModal.style.overflow = "hidden";

    if (modalContent) {
        modalContent.style.width = "min(1100px, 96vw)";
        modalContent.style.maxWidth = "1100px";
        modalContent.style.height = "min(92vh, 920px)";
        modalContent.style.maxHeight = "92vh";
        modalContent.style.overflowY = "auto";
        modalContent.style.overflowX = "hidden";
        modalContent.style.boxSizing = "border-box";
        modalContent.style.padding = "22px";
        modalContent.style.scrollBehavior = "smooth";
        modalContent.style.overscrollBehavior = "contain";
        modalContent.style.position = "relative";
    }

    if (closeTodayProductionModal) {
        closeTodayProductionModal.textContent = "×";
        closeTodayProductionModal.setAttribute(
            "aria-label",
            "Close Today's Production"
        );
        closeTodayProductionModal.title = "Close Today's Production";
        closeTodayProductionModal.style.cssText += `
            position:sticky;
            top:0;
            float:right;
            z-index:50;
            width:46px;
            height:46px;
            min-width:46px;
            min-height:46px;
            border:none;
            border-radius:12px;
            background:#b91c1c;
            color:white;
            font-size:30px;
            font-weight:900;
            line-height:1;
            display:flex;
            align-items:center;
            justify-content:center;
            cursor:pointer;
            box-shadow:0 4px 12px rgba(0,0,0,.18);
            margin-left:12px;
        `;
    }

    const stage = document.getElementById("productionSelectionStage");

    if (stage) {
        stage.style.maxHeight = "none";
        stage.style.overflow = "auto hidden";
        stage.style.overscrollBehavior = "contain";
        stage.style.scrollbarGutter = "stable";
    }

    const results = document.getElementById("productionRecommendations");

    if (results) {
        results.style.maxHeight = "none";
        results.style.overflow = "visible";
    }
}

function normalizeProductionOrderNumber(value) {

    const digits = String(value || "")
        .toUpperCase()
        .replace(/O/g, "0")
        .replace(/[IL]/g, "1")
        .replace(/[^0-9]/g, "");

    return digits.length >= 4 && digits.length <= 8
        ? digits
        : "";
}

async function detectProductionOrderFromImage(options = {}) {

    ensureProductionSelectionUI();

    if (!productionSelectionImage) {
        if (!options.silent) {
            alert("Paste a production screenshot first.");
        }
        return "";
    }

    const button = productionDetectOrderBtn;
    const previousText = button?.textContent || "Detect Order #";

    if (button) {
        button.disabled = true;
        button.textContent = "Detecting...";
    }

    try {
        const image = productionSelectionImage;
        const cropHeight = Math.max(
            160,
            Math.round(image.naturalHeight * 0.55)
        );

        const headerCanvas = createEnhancedOcrCanvas(
            image,
            0,
            0,
            image.naturalWidth,
            Math.min(cropHeight, image.naturalHeight),
            Math.max(1.5, Math.min(3, 1600 / image.naturalWidth))
        );

        const result = await Tesseract.recognize(
            headerCanvas,
            "eng",
            {
                preserve_interword_spaces: "1",
                tessedit_pageseg_mode: 6,
                tessedit_char_whitelist:
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -:#"
            }
        );

        const headerText = String(result?.data?.text || "");
        const detected = extractProductionLot(headerText, {
            strict: true
        });

        if (detected) {
            productionOrderInput.value = detected;
            setProductionSelectionStatus(
                "Production Order #" + detected +
                " detected. Confirm it before sharing.",
                "success"
            );
            return detected;
        }

        if (!options.silent) {
            setProductionSelectionStatus(
                "The order number was not detected. Enter it manually before searching.",
                "error"
            );
            productionOrderInput.focus();
        }

        return "";

    } catch (error) {
        console.error("Production order OCR error:", error);

        if (!options.silent) {
            setProductionSelectionStatus(
                "The order number could not be detected. Enter it manually.",
                "error"
            );
        }

        return "";

    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = previousText;
        }
    }
}

function formatProductionShareDate(value) {

    const source = String(value || "").trim();

    if (!source) {
        return "Not specified";
    }

    const isoMatch = source.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (isoMatch) {
        return isoMatch[2] + "/" + isoMatch[3] + "/" + isoMatch[1];
    }

    return source;
}

function getSelectedProductionMatches(resultsContainer, matches) {

    if (!resultsContainer || !Array.isArray(matches)) {
        return [];
    }

    const selectedIndexes = Array.from(
        resultsContainer.querySelectorAll(
            '.production-share-checkbox:checked'
        )
    )
        .map(function (checkbox) {
            return Number(checkbox.dataset.matchIndex);
        })
        .filter(Number.isInteger);

    return selectedIndexes
        .map(function (index) {
            return matches[index];
        })
        .filter(function (match) {
            return Boolean(match && match.inventoryFound);
        });
}

function buildProductionShareText(
    productionOrderNumber,
    selectedMatches
) {

    const lines = [
        "FLORAFLOW - PRODUCTION LEFTOVERS",
        "Production Order: " +
            (productionOrderNumber || "Not detected"),
        ""
    ];

    selectedMatches.forEach(function (match, index) {

        lines.push(
            (index + 1) + ". " +
            (match.product || match.requestedProduct || "Product")
        );

        lines.push(
            "   Color: " +
            (match.color || match.requestedColor || "Not specified")
        );

        lines.push(
            "   Case: " +
            (match.caseNumber || "Not specified")
        );

        lines.push(
            "   Available: " +
            (match.quantity ?? 0) + " stems"
        );

        lines.push(
            "   Date received: " +
            formatProductionShareDate(match.date)
        );

        if (match.articleName) {
            lines.push("   Article: " + match.articleName);
        }

        lines.push("");
    });

    lines.push("Prepared with FloraFlow");

    return lines.join("\n").trim();
}

async function shareProductionList(
    productionOrderNumber,
    selectedMatches,
    statusElement
) {

    if (!Array.isArray(selectedMatches) || selectedMatches.length === 0) {
        alert("Select at least one leftover product first.");
        return;
    }

    const shareText = buildProductionShareText(
        productionOrderNumber,
        selectedMatches
    );

    try {
        if (navigator.share) {
            await navigator.share({
                title:
                    "Production Order " +
                    (productionOrderNumber || ""),
                text: shareText
            });

            if (statusElement) {
                statusElement.textContent = "List shared successfully.";
            }
            return;
        }

        await navigator.clipboard.writeText(shareText);

        if (statusElement) {
            statusElement.textContent =
                "List copied. Paste it into WhatsApp or another app.";
        }
    } catch (error) {
        if (error?.name === "AbortError") {
            return;
        }

        console.error("Production share error:", error);

        try {
            await navigator.clipboard.writeText(shareText);

            if (statusElement) {
                statusElement.textContent =
                    "List copied. Paste it into WhatsApp or another app.";
            }
        } catch (clipboardError) {
            alert("The production list could not be shared or copied.");
        }
    }
}

function appendProductionShareControls(
    resultsContainer,
    matches,
    productionOrderNumber
) {

    const foundCount = matches.filter(function (match) {
        return match?.inventoryFound;
    }).length;

    if (foundCount === 0) {
        return;
    }

    const controls = document.createElement("div");
    controls.style.cssText = `
        background:white;
        border:1px solid #bbf7d0;
        border-radius:12px;
        padding:12px;
        margin-bottom:15px;
    `;

    controls.innerHTML = `
        <div style="font-weight:800;margin-bottom:9px;color:#166534;">
            📤 Build production list
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <button type="button" class="production-select-all">
                Select All
            </button>
            <button type="button" class="production-clear-selection">
                Clear
            </button>
            <button type="button" class="production-share-list" style="font-weight:800;">
                📤 Share List
            </button>
            <span class="production-share-count" style="font-size:13px;color:#475569;"></span>
        </div>
        <div class="production-share-status" style="font-size:13px;color:#166534;margin-top:8px;"></div>
    `;

    resultsContainer.appendChild(controls);

    const countElement = controls.querySelector(
        ".production-share-count"
    );

    const statusElement = controls.querySelector(
        ".production-share-status"
    );

    const updateCount = function () {
        const selected = getSelectedProductionMatches(
            resultsContainer,
            matches
        );

        countElement.textContent =
            selected.length + " of " + foundCount + " selected";
    };

    controls
        .querySelector(".production-select-all")
        .addEventListener("click", function () {
            resultsContainer
                .querySelectorAll(".production-share-checkbox")
                .forEach(function (checkbox) {
                    checkbox.checked = true;
                });
            updateCount();
        });

    controls
        .querySelector(".production-clear-selection")
        .addEventListener("click", function () {
            resultsContainer
                .querySelectorAll(".production-share-checkbox")
                .forEach(function (checkbox) {
                    checkbox.checked = false;
                });
            updateCount();
        });

    controls
        .querySelector(".production-share-list")
        .addEventListener("click", async function () {
            const selected = getSelectedProductionMatches(
                resultsContainer,
                matches
            );

            await shareProductionList(
                productionOrderNumber,
                selected,
                statusElement
            );
        });

    resultsContainer.addEventListener("change", function (event) {
        if (event.target?.classList.contains("production-share-checkbox")) {
            updateCount();
        }
    });

    setTimeout(updateCount, 0);
}


// ============================================================
// INLINE PRODUCTION MATCH CORRECTION
// Edit, remove or ignore a family directly from Today's Production.
// ============================================================

function getProductionCorrectionAlias(match) {
    return normalizeMatchText(
        match?.learningAlias ||
        match?.familyObservedAlias ||
        match?.familyAlias ||
        getSuggestedProductionAlias(match) ||
        match?.originalOcrLine ||
        match?.product ||
        ""
    );
}

async function removeAliasFromFlowerFamilies(alias) {
    const normalizedAlias = normalizeMatchText(alias);
    if (!normalizedAlias) return 0;

    let changedRows = 0;

    for (const familyRow of (flowerFamilies || [])) {
        const aliases = Array.isArray(familyRow.aliases)
            ? familyRow.aliases.map(normalizeMatchText).filter(Boolean)
            : [];

        if (!aliases.includes(normalizedAlias)) continue;

        const updatedAliases = aliases.filter(function (value) {
            return value !== normalizedAlias;
        });

        const query = supabaseClient
            .from("flower_families")
            .update({ aliases: updatedAliases.join(", ") });

        const result = familyRow.id
            ? await query.eq("id", familyRow.id)
            : await query.ilike("family", familyRow.family);

        if (result.error) throw result.error;
        changedRows++;
    }

    return changedRows;
}

async function deactivateProductionAlias(alias) {
    const normalizedAlias = normalizeMatchText(alias);
    if (!normalizedAlias) {
        throw new Error("No production alias was found for this result.");
    }

    const { data: rows, error: selectError } = await supabaseClient
        .from("production_aliases")
        .select("id, alias")
        .eq("active", true)
        .ilike("alias", normalizedAlias);

    if (selectError) throw selectError;

    let disabledCount = 0;
    for (const row of (rows || [])) {
        const { error } = await supabaseClient
            .from("production_aliases")
            .update({ active: false })
            .eq("id", row.id);

        if (error) throw error;
        disabledCount++;
    }

    const familyAliasCount = await removeAliasFromFlowerFamilies(normalizedAlias);

    await loadProductionAliases();
    await loadFlowerFamilies();

    return disabledCount + familyAliasCount;
}

function ensureProductionCorrectionModal() {
    let overlay = document.getElementById("productionCorrectionOverlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "productionCorrectionOverlay";
    overlay.style.cssText = [
        "display:none",
        "position:fixed",
        "inset:0",
        "z-index:180000",
        "background:rgba(15,23,42,.60)",
        "padding:18px",
        "box-sizing:border-box",
        "overflow:auto"
    ].join(";");

    overlay.innerHTML = `
        <div style="width:min(560px,100%);margin:5vh auto;background:white;border-radius:18px;padding:20px;box-shadow:0 24px 70px rgba(0,0,0,.28);">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
                <div>
                    <div style="font-size:11px;font-weight:900;letter-spacing:.12em;color:#a11375;text-transform:uppercase;">Today's Production</div>
                    <div style="font-size:22px;font-weight:850;color:#111827;margin-top:4px;">Correct product family</div>
                    <div style="font-size:13px;color:#64748b;margin-top:4px;line-height:1.45;">Fix the result here without leaving the production order.</div>
                </div>
                <button id="productionCorrectionClose" type="button" style="width:42px;height:42px;padding:0;font-size:24px;">×</button>
            </div>

            <div style="margin-top:16px;padding:13px;border-radius:12px;background:#fdf2f8;border:1px solid #fbcfe8;">
                <div style="font-size:12px;font-weight:800;color:#9d174d;">Production text / alias</div>
                <div id="productionCorrectionAliasText" style="font-size:17px;font-weight:850;color:#4a044e;margin-top:4px;word-break:break-word;"></div>
                <div id="productionCorrectionCurrentFamily" style="font-size:13px;color:#64748b;margin-top:5px;"></div>
            </div>

            <label style="display:block;font-weight:800;margin-top:16px;margin-bottom:7px;">Correct family</label>
            <select id="productionCorrectionFamily" style="width:100%;box-sizing:border-box;padding:12px;border:1px solid #cbd5e1;border-radius:10px;background:white;"></select>

            <div id="productionCorrectionMessage" style="min-height:20px;margin-top:11px;font-size:13px;color:#475569;"></div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:14px;">
                <button id="productionCorrectionSave" type="button" style="min-height:46px;background:#a11375;">✓ Save correction</button>
                <button id="productionCorrectionRemove" type="button" style="min-height:46px;background:#fff;color:#b91c1c;border:1px solid #fecaca;">Remove wrong rule</button>
            </div>
            <button id="productionCorrectionIgnore" type="button" style="width:100%;margin-top:9px;min-height:44px;background:#f1f5f9;color:#334155;">Ignore only this result</button>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = function () {
        overlay.style.display = "none";
        overlay._match = null;
        overlay._card = null;
    };

    overlay.querySelector("#productionCorrectionClose").addEventListener("click", close);
    installSafeBackdropClose(overlay, close);

    overlay.querySelector("#productionCorrectionIgnore").addEventListener("click", function () {
        if (overlay._card) overlay._card.remove();
        close();
        setProductionSelectionStatus("The result was ignored for this analysis only.", "info");
    });

    overlay.querySelector("#productionCorrectionSave").addEventListener("click", async function () {
        const button = this;
        const message = overlay.querySelector("#productionCorrectionMessage");
        const family = normalizeMatchText(overlay.querySelector("#productionCorrectionFamily").value);
        const alias = getProductionCorrectionAlias(overlay._match);

        if (!alias || !family) {
            message.style.color = "#b91c1c";
            message.textContent = "Choose a correct family before saving.";
            return;
        }

        button.disabled = true;
        message.style.color = "#1d4ed8";
        message.textContent = "Saving the correction...";

        try {
            await saveProductionAliasLearning(alias, family);
            message.style.color = "#166534";
            message.textContent = alias + " is now recognized as " + family + ".";
            setProductionSelectionStatus(message.textContent, "success");
            setTimeout(async function () {
                close();
                await findLeftoversFromDetectedText();
            }, 350);
        } catch (error) {
            console.error("Inline production correction error:", error);
            message.style.color = "#b91c1c";
            message.textContent = error?.message || String(error);
            button.disabled = false;
        }
    });

    overlay.querySelector("#productionCorrectionRemove").addEventListener("click", async function () {
        const button = this;
        const message = overlay.querySelector("#productionCorrectionMessage");
        const alias = getProductionCorrectionAlias(overlay._match);

        if (!alias) {
            message.style.color = "#b91c1c";
            message.textContent = "No removable alias was found for this result.";
            return;
        }

        if (!window.confirm('Remove the learned rule for "' + alias + '"?')) return;

        button.disabled = true;
        message.style.color = "#1d4ed8";
        message.textContent = "Removing the incorrect rule...";

        try {
            const removed = await deactivateProductionAlias(alias);
            message.style.color = "#166534";
            message.textContent = removed > 0
                ? "The incorrect rule was removed."
                : "No saved rule used that exact alias. You can still save the correct family.";
            setProductionSelectionStatus(message.textContent, removed > 0 ? "success" : "info");
            setTimeout(async function () {
                close();
                await findLeftoversFromDetectedText();
            }, 450);
        } catch (error) {
            console.error("Remove production rule error:", error);
            message.style.color = "#b91c1c";
            message.textContent = error?.message || String(error);
            button.disabled = false;
        }
    });

    return overlay;
}

function openProductionCorrectionModal(match, card) {
    if (!canManageProducts()) {
        alert("Only authorized managers can edit production families.");
        return;
    }

    const overlay = ensureProductionCorrectionModal();
    const alias = getProductionCorrectionAlias(match);
    const families = getTeachFloraFlowFamilies();
    const familySelect = overlay.querySelector("#productionCorrectionFamily");

    familySelect.innerHTML = '<option value="">Select the correct family</option>' +
        families.map(function (family) {
            return '<option value="' + family + '">' + family + '</option>';
        }).join("");

    const currentFamily = normalizeMatchText(match?.product || match?.family || match?.learningFamily || "");
    if (currentFamily && families.includes(currentFamily)) {
        familySelect.value = currentFamily;
    }

    overlay.querySelector("#productionCorrectionAliasText").textContent = alias || "Unknown alias";
    overlay.querySelector("#productionCorrectionCurrentFamily").textContent = currentFamily
        ? "Currently shown as: " + currentFamily
        : "No family is currently assigned.";
    overlay.querySelector("#productionCorrectionMessage").textContent = "Choose the right family, remove the wrong rule, or ignore this result once.";
    overlay.querySelector("#productionCorrectionMessage").style.color = "#475569";
    overlay.querySelector("#productionCorrectionSave").disabled = false;
    overlay.querySelector("#productionCorrectionRemove").disabled = false;

    overlay._match = match;
    overlay._card = card;
    overlay.style.display = "block";
}

function appendProductionCorrectionControls(card, match) {
    if (!card || !match) return;

    const wrap = document.createElement("div");
    wrap.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;padding-top:11px;border-top:1px solid #e2e8f0;";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit family";
    editButton.disabled = !canManageProducts();
    editButton.style.cssText = "min-height:40px;padding:9px 14px;background:#a11375;color:white;border-radius:10px;";
    editButton.addEventListener("click", function () {
        openProductionCorrectionModal(match, card);
    });

    const ignoreButton = document.createElement("button");
    ignoreButton.type = "button";
    ignoreButton.textContent = "Ignore once";
    ignoreButton.style.cssText = "min-height:40px;padding:9px 14px;background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;border-radius:10px;";
    ignoreButton.addEventListener("click", function () {
        card.remove();
        setProductionSelectionStatus("The result was ignored for this analysis only.", "info");
    });

    wrap.appendChild(editButton);
    wrap.appendChild(ignoreButton);
    card.appendChild(wrap);
}

function showProductionRecommendations(
    matches,
    productionOrderNumber
) {

    let resultsContainer =
        document.getElementById("productionRecommendations");

    const selectionTool =
        document.getElementById("productionSelectionTool");

    const modalContent =
        todayProductionModal.querySelector(".modal-content");

    const resultsParent =
        selectionTool?.parentNode ||
        modalContent ||
        todayProductionModal;

    if (!resultsContainer) {
        resultsContainer = document.createElement("div");
        resultsContainer.id = "productionRecommendations";
        resultsContainer.style.marginTop = "20px";
        resultsContainer.style.padding = "15px";
        resultsContainer.style.background = "#f8f9fa";
        resultsContainer.style.borderRadius = "12px";
        resultsContainer.style.maxHeight = "none";
        resultsContainer.style.overflow = "visible";
    }

    // Keep the results inside the visible modal content.
    if (resultsContainer.parentNode !== resultsParent) {
        resultsParent.appendChild(resultsContainer);
    }

    resultsContainer.style.display = "block";
    resultsContainer.innerHTML = "";

    const orderHeader = document.createElement("div");

    orderHeader.innerHTML = `
        <div style="
            background:#f0fdf4;
            border:1px solid #86efac;
            border-left:5px solid #166534;
            border-radius:12px;
            padding:15px 16px;
            margin-bottom:15px;
            font-size:19px;
            font-weight:800;
            color:#14532d;
        ">
            📋 Production Order:
            ${productionOrderNumber || "Not detected"}
        </div>
    `;

    resultsContainer.appendChild(orderHeader);

    if (Array.isArray(matches) && matches.length > 0) {
        appendProductionShareControls(
            resultsContainer,
            matches,
            productionOrderNumber
        );
    }

    if (!Array.isArray(matches) || matches.length === 0) {
        resultsContainer.innerHTML += `
            <div style="
                text-align:center;
                padding:20px;
                color:#777;
            ">
                No production flowers were detected.
            </div>
        `;

        requestAnimationFrame(function () {
            resultsContainer.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        });

        return;
    }

    matches.forEach(function (match, matchIndex) {

        const card = document.createElement("div");

        card.style.background = "white";
        card.style.borderRadius = "10px";
        card.style.padding = "15px";
        card.style.marginBottom = "12px";
        card.style.boxShadow = "0 2px 6px rgba(0,0,0,.08)";

        if (match.inventoryFound) {

            card.innerHTML = `
                <label style="
                    display:flex;
                    align-items:center;
                    gap:9px;
                    font-size:18px;
                    font-weight:bold;
                    margin-bottom:10px;
                    color:#166534;
                    cursor:pointer;
                ">
                    <input
                        type="checkbox"
                        class="production-share-checkbox"
                        data-match-index="${matchIndex}"
                        checked
                        style="width:19px;height:19px;"
                    >
                    ✅ ${match.product || ""}
                </label>

                <div style="
                    line-height:1.8;
                    font-size:14px;
                ">
                    🎨 Color: ${match.color || match.requestedColor || "Not specified"}<br>
                    📦 Case: ${match.caseNumber || "Not specified"}<br>
                    🌿 Available: ${match.quantity ?? 0} stems<br>
                    📅 Date received: ${formatProductionShareDate(match.date)}<br>
                    ${
                        match.articleName
                            ? `📝 Article: ${match.articleName}<br>`
                            : ""
                    }
                    🔎 OCR: ${match.originalOcrLine || ""}
                </div>
            `;

        } else {

            const recognizedArticle =
                match.articleName || "";

            let message = "No leftover found";

            if (match.needsReview) {
                message = "Product not recognized — review this line";
            } else if (match.colorMismatch) {
                message = "No leftover found for this color";
            }

            card.innerHTML = `
                <div style="
                    font-size:18px;
                    font-weight:bold;
                    margin-bottom:8px;
                    color:#b45309;
                ">
                    ⚠️ ${match.product || "Unrecognized product"}
                </div>

                ${
                    recognizedArticle
                        ? `
                            <div style="
                                font-size:14px;
                                color:#444;
                                margin-bottom:5px;
                            ">
                                Article: ${recognizedArticle}
                            </div>
                        `
                        : ""
                }

                ${
                    match.color
                        ? `
                            <div style="
                                font-size:14px;
                                color:#444;
                                margin-bottom:5px;
                            ">
                                Color: ${match.color}
                            </div>
                        `
                        : ""
                }

                <div style="
                    font-size:14px;
                    color:#777;
                    margin-bottom:5px;
                ">
                    ${message}
                </div>

                <div style="
                    font-size:13px;
                    color:#999;
                ">
                    OCR: ${match.originalOcrLine || ""}
                </div>
            `;
        }

        appendFloraFlowBrainCard(card, match);
        appendTeachFloraFlowButton(card, match);
        appendProductionCorrectionControls(card, match);
        resultsContainer.appendChild(card);
    });

    requestAnimationFrame(function () {
        resultsContainer.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    });
}
function extractProductionLot(text, options = {}) {

    const source = String(text || "").toUpperCase();

    if (!source) {
        return null;
    }

    const normalizeDigits = function (value) {
        return normalizeProductionOrderNumber(value);
    };

    const cleanedSource = source
        .replace(/[^A-Z0-9#:\-\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const orderPatterns = [
        /PRODUCTION\s*(?:ORDER|0RDER|ORD ER)\s*(?:NUMBER|NUM|NO|#)?\s*[-:#]?\s*([0-9OIL]{4,8})/,
        /(?:ORDER|0RDER)\s*(?:NUMBER|NUM|NO|#)?\s*[-:#]?\s*([0-9OIL]{4,8})/,
        /(?:PROD|PRODUCTION)\s*[-:#]?\s*([0-9OIL]{4,8})/,
        /([0-9OIL]{4,8})\s*[-:#]?\s*(?:PRODUCTION\s*)?(?:ORDER|0RDER)/
    ];

    for (const pattern of orderPatterns) {
        const match = cleanedSource.match(pattern);

        if (!match) {
            continue;
        }

        const orderNumber = normalizeDigits(match[1]);

        if (orderNumber) {
            return orderNumber;
        }
    }

    if (options.strict) {
        return null;
    }

    return null;
}

function createEnhancedOcrCanvas(
    img,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    scale
) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", {
        willReadFrequently: true
    });

    const outputScale = Number(scale || 2.5);

    canvas.width = Math.max(
        1,
        Math.round(sourceWidth * outputScale)
    );

    canvas.height = Math.max(
        1,
        Math.round(sourceHeight * outputScale)
    );

    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const pixels = imageData.data;

    for (let index = 0; index < pixels.length; index += 4) {
        const gray =
            pixels[index] * 0.299 +
            pixels[index + 1] * 0.587 +
            pixels[index + 2] * 0.114;

        const contrasted = Math.max(
            0,
            Math.min(255, (gray - 128) * 1.65 + 128)
        );

        pixels[index] = contrasted;
        pixels[index + 1] = contrasted;
        pixels[index + 2] = contrasted;
    }

    ctx.putImageData(imageData, 0, 0);

    return canvas;
}

async function readProductionScreenshot() {

    ensureProductionSelectionUI();

    if (!productionDetectedText) {
        return {
            lotText: "",
            articleText: ""
        };
    }

    return {
        lotText: "",
        articleText: productionDetectedText.value || ""
    };
}


function separateProductionOrderAndArticles(text) {

    const fullText = String(text || "");
    const detectedOrder = extractProductionLot(fullText, {
        strict: true
    }) || "";

    const headerPatterns = [
        /\bPRODUCTION\s*(?:ORDER|0RDER|ORD\s*ER)\b/i,
        /\b(?:ORDER|0RDER)\s*(?:NUMBER|NUM|NO|#)\b/i,
        /\bGENERAL\s+BILL\b/i,
        /\bBILL\s+OF\s+MATERIALS?\b/i,
        /\bARTICLE\s+COLOR\s+REQUIRED\b/i,
        /^\s*(?:ARTICLE|COLOR|REQUIRED|QUANTITY|QTY|LENGTH|DESCRIPTION)\s*$/i,
        /\bCUSTOMER\b/i,
        /\bPROJECT\b/i,
        /\bDELIVERY\s+DATE\b/i,
        /\bCREATED\s+(?:BY|ON)\b/i
    ];

    const articleLines = fullText
        .split(/\r?\n/)
        .map(function (line) {
            return String(line || "")
                .replace(/\s+/g, " ")
                .trim();
        })
        .filter(Boolean)
        .filter(function (line) {

            const normalizedLine = normalizeMatchText(line);

            if (!normalizedLine) {
                return false;
            }

            if (headerPatterns.some(function (pattern) {
                return pattern.test(line);
            })) {
                return false;
            }

            if (/^[#:\-\s0-9OIL]+$/i.test(line)) {
                return false;
            }

            if (
                detectedOrder &&
                normalizeProductionOrderNumber(line) === detectedOrder
            ) {
                return false;
            }

            return true;
        });

    return {
        orderNumber: detectedOrder,
        articleText: articleLines.join("\n").trim(),
        fullText: fullText
    };
}

function normalizeProductionText(text) {

    const normalizedProducts = String(text || "")
        .split("\n")
        .map(function (rawLine) {

            const raw = normalizeMatchText(rawLine);

            if (!raw || isProductionMaterialLine(raw)) {
                return null;
            }
let cleaned = cleanProductionLine(rawLine);

cleaned = fixProductionOcrWords(cleaned);

return {
    raw: raw,
    cleaned: cleaned
};
        })
        .filter(Boolean)
        .filter(function (lineInfo) {

            const cleanLine = normalizeMatchText(
                lineInfo.cleaned
            );

            if (!cleanLine || cleanLine.length < 3) {
                return false;
            }

            if (
                cleanLine.includes("PRODUCTION ORDER") ||
                cleanLine.includes("BILL OF MATERIAL") ||
                cleanLine.includes("GENERAL BILL") ||
                cleanLine.includes("ARTICLE COLOR REQUIRED") ||
                cleanLine === "ARTICLE" ||
                cleanLine === "COLOR" ||
                cleanLine === "REQUIRED"
            ) {
                return false;
            }

            const directFamily =
                detectOperationalFamilyFromLine(cleanLine);

            if (directFamily) {
                return true;
            }

            const preparedLine =
                prepareArticleSearchText(cleanLine);

            const preparedTokens =
                getUsefulArticleTokens(preparedLine);

            if (preparedTokens.length === 0) {
                return false;
            }

            const catalogFamily =
                detectBestCatalogFamily(preparedLine);

            if (catalogFamily) {
                return true;
            }

            // Keep plausible unknown flower lines so Harsson can teach FloraFlow.
            // Material/header lines were already removed above.
            return preparedTokens.some(function (token) {
                return /[A-Z]/.test(token) && token.length >= 3;
            });
        })
        .map(function (lineInfo) {
            return normalizeProductionLine(
                lineInfo.cleaned
            );
        })
        .filter(function (product) {
            return Boolean(
                product &&
                prepareArticleSearchText(product.original)
            );
        });

    const uniqueProducts = [];
    const seenLines = new Set();

    normalizedProducts.forEach(function (product) {

        const key = prepareArticleSearchText(
            product.original
        );

        if (!key || seenLines.has(key)) {
            return;
        }

        seenLines.add(key);
        uniqueProducts.push(product);
    });

    return uniqueProducts;
}
function fixProductionOcrWords(text) {
    const corrections = {

        // ===== PEONIES =====
        "FPAEQ": "PAEO",
        "FAEQ": "PAEO",
        "PAEQ": "PAEO",
        "FAED": "PAEO",

        // ===== COLORS =====
        "GREEM": "GREEN",
        "WHlTE": "WHITE",
        "YELL0W": "YELLOW",

        // ===== PRODUCTS =====
        "HYDE": "HYDR",
        "LELICAD": "LEUCAD",
        "LILV": "LILY",

        // ===== GENERAL =====
        "AS50RTED": "ASSORTED",

        "EM LEEM VD MARK": "MARK",
    };

    for (const [wrong, correct] of Object.entries(corrections)) {

        text = text.replace(
            new RegExp(`\\b${wrong}\\b`, "gi"),
            correct
        );
    }
    return text;
}
function normalizeProductionLine(line) {

    const rawLine = String(line || "");

    const cleanOcrText =
        window.flowerBrain &&
        typeof window.flowerBrain.cleanOCRText === "function"
            ? window.flowerBrain.cleanOCRText(rawLine)
            : normalizeMatchText(rawLine);

let correctedLine =
    window.flowerBrain &&
    typeof window.flowerBrain.fixCommonOcrErrors === "function"
        ? window.flowerBrain.fixCommonOcrErrors(cleanOcrText)
        : cleanOcrText;
        correctedLine = fixProductionOcrWords(correctedLine);
        



let articleLine = correctedLine;
let colorCode = "";
    
    if (
        window.flowerBrain &&
        typeof window.flowerBrain.extractColorCode === "function"
    ) {
        const colorInfo =
            window.flowerBrain.extractColorCode(
                correctedLine
            ) || {};

        articleLine =
            colorInfo.articleText || correctedLine;

        colorCode =
            colorInfo.colorCode || "";
    } else {

        const words = normalizeMatchText(correctedLine)
            .split(" ")
            .filter(Boolean);

        const possibleCode =
            words[words.length - 1] || "";

        if (getProductionColorFromCode(possibleCode)) {
            colorCode = possibleCode;
            words.pop();
            articleLine = words.join(" ");
        }
    }

    const learnedAlias =
        getLearnedProductAlias(
            normalizeMatchText(articleLine)
        );

    if (learnedAlias) {
        articleLine = learnedAlias;
    }

    let parsed = {};

    if (
        window.flowerBrain &&
        typeof window.flowerBrain.parseLine === "function"
    ) {
        parsed =
            window.flowerBrain.parseLine(articleLine) || {};
    }

    const directFamily =
        detectOperationalFamilyFromLine(articleLine) ||
        detectOperationalFamilyFromLine(
            parsed.product || ""
        );

    const familyNeedsReview = Boolean(
        directFamily?.needsReview
    );

    const explicitColor =
        extractProductionColor(articleLine) ||
        extractProductionColor(parsed.color || "");

    const codedColor =
        getProductionColorFromCode(colorCode);

let detectedColor =
    explicitColor ||
    codedColor ||
    "";

if (
    directFamily?.family === "TULIP" &&
    /\bMARK\b/.test(normalizeMatchText(articleLine))
) {
    detectedColor = "MARK";
}

    return {
        original: normalizeMatchText(correctedLine),
        cleanedArticle: normalizeMatchText(articleLine),
        product:
            familyNeedsReview
                ? ""
                : (
                    directFamily?.family ||
                    normalizeMatchText(parsed.product || "")
                ),
        family:
            familyNeedsReview
                ? ""
                : (directFamily?.family || ""),
        familyAlias:
            directFamily?.alias || "",
        familyObservedAlias:
            directFamily?.observedAlias || "",
        familySource:
            directFamily?.source || "",
        familyConfidence:
            directFamily?.score || 0,
        familyNeedsReview: familyNeedsReview,
        familyAlternatives:
            directFamily?.alternatives || [],
        variety:
            normalizeMatchText(
                parsed.variety || articleLine
            ),
        color: detectedColor,
        colorCode: normalizeMatchText(colorCode),
        length:
            parsed.length || null
    };
}

function normalizeMatchText(value) {

    return String(value || "")
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Z0-9 ]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getMatchTokens(value) {

    return normalizeMatchText(value)
        .split(" ")
        .filter(function (word) {
            return word.length > 1;
        });
}

function levenshteinDistance(first, second) {

    const a = normalizeMatchText(first);
    const b = normalizeMatchText(second);

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {

        for (let j = 1; j <= a.length; j++) {

            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

function calculateStringSimilarity(first, second) {

    const a = normalizeMatchText(first);
    const b = normalizeMatchText(second);

    if (!a || !b) {
        return 0;
    }

    if (a === b) {
        return 100;
    }

    const longestLength = Math.max(a.length, b.length);

    if (longestLength === 0) {
        return 100;
    }

    const distance = levenshteinDistance(a, b);

    return Math.max(
        0,
        Math.round(
            (1 - distance / longestLength) * 100
        )
    );
}

function calculateTokenSimilarity(first, second) {

    const firstTokens = getMatchTokens(first);
    const secondTokens = getMatchTokens(second);

    if (
        firstTokens.length === 0 ||
        secondTokens.length === 0
    ) {
        return 0;
    }

    let matchedTokens = 0;

    firstTokens.forEach(function (firstToken) {

        const tokenMatched = secondTokens.some(function (secondToken) {

            if (firstToken === secondToken) {
                return true;
            }

            const similarity = calculateStringSimilarity(
                firstToken,
                secondToken
            );

            return similarity >= 70;
        });

        if (tokenMatched) {
            matchedTokens++;
        }
    });

    return Math.round(
        matchedTokens /
        Math.max(firstTokens.length, secondTokens.length) *
        100
    );
}

function calculateInventoryMatchScore(
    productionProduct,
    inventoryItem
) {

    const requestedName = normalizeMatchText(
        [
            productionProduct.product,
            productionProduct.variety
        ]
            .filter(Boolean)
            .join(" ")
    );

    const inventoryName = normalizeMatchText(
        inventoryItem.product
    );

    const requestedColor = normalizeMatchText(
        productionProduct.color
    );

    const inventoryColor = normalizeMatchText(
        inventoryItem.color
    );

    const directSimilarity = calculateStringSimilarity(
        requestedName,
        inventoryName
    );

    const tokenSimilarity = calculateTokenSimilarity(
        requestedName,
        inventoryName
    );

    let score =
        directSimilarity * 0.45 +
        tokenSimilarity * 0.55;

    if (
        requestedName &&
        inventoryName &&
        (
            requestedName.includes(inventoryName) ||
            inventoryName.includes(requestedName)
        )
    ) {
        score += 12;
    }

    if (requestedColor) {

        if (requestedColor === inventoryColor) {
            score += 18;
        } else if (
            inventoryColor.includes(requestedColor) ||
            requestedColor.includes(inventoryColor)
        ) {
            score += 10;
        } else {
            score -= 12;
        }
    }

    return Math.max(
        0,
        Math.min(100, Math.round(score))
    );
}

function getConfidenceLevel(score) {

    if (score >= 90) {
        return "HIGH";
    }

    if (score >= 75) {
        return "PROBABLE";
    }

    return "REVIEW";
}
function getOperationalFamilyRules() {

    return [
        {
    family: "PEONY",
    names: [
        "PAEO",
        "PAEO",
        "PAEO ENHANCED",
        "PEONY",
        "PEONIES"
    ]
},
        {
            family: "MINI HYDRANGEA",
            names: [
                "MINI HYDRANGEA",
                "HYDRANGEA MINI",
                "HYDR MINI",
                "HYOR MINI",
                "HDR MINI",
                "MINI HYDR",
                "HYDR M",
                "HYOR M",
                "HDR M"
            ]
        },
        {
            family: "CUSHION POM",
            names: [
                "CUSHION POM",
                "POM CUSHION",
                "CUSHION"
            ]
        },
        {
            family: "BUTTON POM",
            names: [
                "BUTTON POM",
                "POM BUTTON"
            ]
        },
        {
            family: "MICRO POM",
            names: [
                "MICRO POM",
                "POM MICRO"
            ]
        },
        {
            family: "DAISY POM",
            names: [
                "DAISY POM",
                "POM DAISY"
            ]
        },
        {
            family: "SPRAY ROSE",
            names: [
                "SPRAY ROSES",
                "SPRAY ROSE",
                "ROSE SPRAY",
                "SPRY ROSE",
                "SPRAI ROSE"
            ]
        },
        {
            family: "SPRAY CARNATION",
            names: [
                "SPRAY CARNATION",
                "CARNATION SPRAY"
            ]
        },
        {
            family: "CARNATION STANDARD",
            names: [
                "CARNATION STANDARD",
                "STANDARD CARNATION",
                "CARNATION"
            ]
        },
        {
            family: "EUCALYPTUS",
            names: [
                "EUCALYPTUS SILVER DOLLAR",
                "EUCALYPTUS",
                "EUCALIPTUS",
                "ECA CINEREA",
                "SILVER DOLLAR",
                "CINEREA",
                "EUCAL",
                "ECA"
            ]
        },
        {
            family: "LEUCADENDRON",
            names: [
                "LEUCADENDRON",
                "LEUCAD",
                "LEUCA"
            ]
        },
        {
            family: "HYDRANGEA",
            names: [
                "HYDRANGEA",
                "HYDR",
                "HYOR",
                "HDR"
            ]
        },
        {
            family: "SUNFLOWER",
            names: [
                "SUNFLOWER",
                "SUNFL",
                "SUNE",
                "SUNF"
            ]
        },
        {
            family: "SOLIDAGO",
            names: [
                "SOLIDAGO GOLDEN GLORY",
                "GOLDEN GLORY",
                "SOLIDAGO",
                "SOLI"
            ]
        },
        {
            family: "STOCK",
            names: [
                "STOCK",
                "STOC"
            ]
        },
        {
            family: "PISTACIA",
            names: [
                "PISTACHIA",
                "PISTACIA",
                "PIST"
            ]
        },
        {
            family: "CURLY WILLOW",
            names: [
                "CURLY WILLOW",
                "CURLY WILOW"
            ]
        },
        {
            family: "HYPERICUM",
            names: [
                "HYPERICUM",
                "HYPERIC",
                "HYPER",
                "HYP"
            ]
        },
        {
            family: "DELPHINIUM",
            names: [
                "DELPHINIUM",
                "DELPH",
                "DELP"
            ]
        },
        {
            family: "DENDROBIUM",
            names: [
                "DENDROBIUM",
                "DENDR"
            ]
        },
        {
            family: "ROBELINI",
            names: [
                "ROBELIN PHOENIX",
                "ROBELINI",
                "ROBELIN"
            ]
        },
        {
            family: "MINI CALLA",
            names: [
                "MINI CALLA",
                "CALLA MINI"
            ]
        },
        {
            family: "ERYNGIUM",
            names: [
                "ERYNGIUM",
                "ERYNG",
                "ERINGYM",
                "ERYNGYM",
                "ERG"
            ]
        },
        {
            family: "SCABIOSA",
            names: [
                "SCABIOSA",
                "SCAB"
            ]
        },
        {
            family: "TWEEDIA",
            names: [
                "TWEEDIA",
                "TWEEDA"
            ]
        },
        {
            family: "AGAPANTHUS",
            names: [
                "AGAPANTHUS",
                "AGAPANTUS"
            ]
        },
        {
            family: "ALSTROMERIA",
            names: [
                "ALSTROMERIA",
                "ALSTROE",
                "ALSTRO"
            ]
        },
        {
            family: "LIMONIUM",
            names: [
                "LIMONIUM",
                "LIM"
            ]
        },
        {
            family: "LEPIDIUM",
            names: [
                "LEPIDIUM",
                "LIPIDIUM",
                "LEPID"
            ]
        },
        {
            family: "PITTOSPORUM",
            names: [
                "PITTOSPORUM",
                "PITOSPORUM",
                "PITTOS"
            ]
        },
        {
            family: "COCCULUS",
            names: [
                "COCCULUS",
                "COCCULOS",
                "COCULUS"
            ]
        },
        {
            family: "MOLUCELLA",
            names: [
                "MOLUCELLA",
                "MOLUCELAS",
                "MOLUCELLA"
            ]
        },
        {
            family: "LISIANTHUS",
            names: [
                "LISIANTHUS",
                "LISIANTHUS",
                "LISI"
            ]
        },
        {
            family: "RUSCUS",
            names: [
                "RUSCUS ISRAELI",
                "RUSCUS ISRAILI",
                "RUSCUS"
            ]
        },
        {
            family: "ROSE",
            names: [
                "ROSES HTP",
                "ROSES",
                "ROSE"
            ]
        },
        {
            family: "CALLA",
            names: [
                "CALLAS",
                "CALLA"
            ]
        },
        {
            family: "MINI GREEN",
            names: [
                "MINI GREEN"
            ]
        },
        {
            family: "DUSTY MILLER",
            names: [
                "DUSTY MILLER"
            ]
        },
        {
            family: "LILY GRASS",
            names: [
                "LILY GRASS"
            ]
        },
        {
            family: "BUPLEURUM",
            names: [
                "BUPLEURUM"
            ]
        },
        {
            family: "CRASPEDIA",
            names: [
                "CRASPEDIA",
                "CRASPEDA"
            ]
        },
        {
            family: "MATRICARIA",
            names: [
                "MATRICARIA"
            ]
        },
        {
            family: "PINCUSHION",
            names: [
                "PINCUSHION"
            ]
        },
        {
            family: "STATICE",
            names: [
                "STATICE"
            ]
        },
        {
            family: "ACHILLEA",
            names: ["ACHILLEA", "ACHIL"]
        },
        {
            family: "ARALIA",
            names: ["ARALIA"]
        },
        {
            family: "ASTER",
            names: ["ASTER", "JASTER"]
        },
        {
            family: "DISBUD",
            names: ["DISBUD"]
        },
        {
            family: "FREESIA",
            names: ["FREESIA"]
        },
        {
            family: "GERBERA",
            names: ["GERBERA"]
        },
        {
            family: "GYPSOPHILA",
            names: ["GYPSOPHILA", "GYPSO"]
        },
        {
            family: "IRIS",
            names: ["IRIS"]
        },
        {
            family: "PEONY",
            names: ["PEONY"]
        },
        {
            family: "PROTEA",
            names: ["PROTEA"]
        },
        {
            family: "RANUNCULUS",
            names: ["RANUNCULUS"]
        },
        {
            family: "SNAPDRAGON",
            names: ["SNAPDRAGON", "SNAP"]
        },
       {
    family: "TULIP",
    names: [
        "TULIP",
        "TU"
    ]
},
        {
            family: "VERONICA",
            names: ["VERONICA"]
        },
        {
            family: "WAXFLOWER",
            names: ["WAXFLOWER", "WAX FLOWER"]
        },
        {
            family: "CHRYSANTHEMUM",
            names: ["CHRYSANTHEMUM", "CHRYS"]
        }
    ];
}

function addFamilyRuleName(ruleMap, family, name) {

    const normalizedFamily =
        normalizeMatchText(family);

    const normalizedName =
        normalizeMatchText(name);

    if (!normalizedFamily || !normalizedName) {
        return;
    }

    if (!ruleMap.has(normalizedFamily)) {
        ruleMap.set(normalizedFamily, new Set());
    }

    ruleMap.get(normalizedFamily).add(
        normalizedName
    );
}

function getRuntimeOperationalFamilyRules() {

    const ruleMap = new Map();

    getOperationalFamilyRules().forEach(function (rule) {

        addFamilyRuleName(
            ruleMap,
            rule.family,
            rule.family
        );

        (rule.names || []).forEach(function (name) {
            addFamilyRuleName(
                ruleMap,
                rule.family,
                name
            );
        });
    });

    (learnedProductionAliases || []).forEach(function (item) {
        addFamilyRuleName(
            ruleMap,
            item.family,
            item.alias
        );
    });

    (flowerFamilies || []).forEach(function (item) {

        addFamilyRuleName(
            ruleMap,
            item.family,
            item.family
        );

        (item.aliases || []).forEach(function (alias) {
            addFamilyRuleName(
                ruleMap,
                item.family,
                alias
            );
        });
    });

    if (window.flowerBrain) {

        (window.flowerBrain.productFamilies || [])
            .forEach(function (item) {

                addFamilyRuleName(
                    ruleMap,
                    item.product,
                    item.product
                );

                (item.aliases || [])
                    .forEach(function (alias) {
                        addFamilyRuleName(
                            ruleMap,
                            item.product,
                            alias
                        );
                    });
            });

        Object.entries(
            window.flowerBrain.productPhrases || {}
        ).forEach(function (entry) {
            addFamilyRuleName(
                ruleMap,
                entry[1],
                entry[0]
            );
        });

        Object.entries(
            window.flowerBrain.productAliases || {}
        ).forEach(function (entry) {
            addFamilyRuleName(
                ruleMap,
                entry[1],
                entry[0]
            );
        });
    }

    productsCatalog.forEach(function (product) {
        addFamilyRuleName(
            ruleMap,
            product,
            product
        );
    });

    return Array.from(ruleMap.entries())
        .map(function (entry) {
            return {
                family: entry[0],
                names: Array.from(entry[1])
            };
        });
}

function containsNormalizedPhrase(text, phrase) {

    const normalizedText =
        normalizeMatchText(text);

    const normalizedPhrase =
        normalizeMatchText(phrase);

    if (!normalizedText || !normalizedPhrase) {
        return false;
    }

    return (
        " " + normalizedText + " "
    ).includes(
        " " + normalizedPhrase + " "
    );
}

function getAllowedAliasDistance(aliasToken) {

    const length = normalizeMatchText(aliasToken).length;

    if (length <= 4) {
        return 0;
    }

    if (length <= 11) {
        return 2;
    }

    return 3;
}

function compareOcrTokenToAlias(ocrToken, aliasToken) {

    const observed = normalizeMatchText(ocrToken);
    const expected = normalizeMatchText(aliasToken);

    if (!observed || !expected) {
        return null;
    }

    if (observed === expected) {
        return {
            distance: 0,
            score: 100,
            exact: true
        };
    }

    const allowedDistance =
        getAllowedAliasDistance(expected);

    // Short codes such as HYDR, POM, ROSE or ECA must be exact.
    if (allowedDistance === 0) {
        return null;
    }

    if (
        Math.abs(observed.length - expected.length) >
        allowedDistance
    ) {
        return null;
    }

    const distance = levenshteinDistance(
        observed,
        expected
    );

    if (distance > allowedDistance) {
        return null;
    }

    const longestLength = Math.max(
        observed.length,
        expected.length
    );

    const score = Math.max(
        0,
        Math.round(
            (1 - distance / longestLength) * 100
        )
    );

    return {
        distance: distance,
        score: score,
        exact: false
    };
}

function findFuzzyAliasPhraseMatch(line, alias) {

    const lineTokens = normalizeMatchText(line)
        .split(" ")
        .filter(Boolean);

    const aliasTokens = normalizeMatchText(alias)
        .split(" ")
        .filter(Boolean);

    if (
        aliasTokens.length === 0 ||
        lineTokens.length < aliasTokens.length
    ) {
        return null;
    }

    let bestMatch = null;

    for (
        let startIndex = 0;
        startIndex <= lineTokens.length - aliasTokens.length;
        startIndex++
    ) {
        let totalScore = 0;
        let totalDistance = 0;
        let fuzzyTokenCount = 0;
        let matched = true;

        for (
            let aliasIndex = 0;
            aliasIndex < aliasTokens.length;
            aliasIndex++
        ) {
            const comparison = compareOcrTokenToAlias(
                lineTokens[startIndex + aliasIndex],
                aliasTokens[aliasIndex]
            );

            if (!comparison) {
                matched = false;
                break;
            }

            totalScore += comparison.score;
            totalDistance += comparison.distance;

            if (!comparison.exact) {
                fuzzyTokenCount++;
            }
        }

        if (!matched || fuzzyTokenCount === 0) {
            continue;
        }

        const averageScore = Math.round(
            totalScore / aliasTokens.length
        );

        const currentMatch = {
            score: averageScore,
            distance: totalDistance,
            fuzzyTokenCount: fuzzyTokenCount,
            startIndex: startIndex,
            observedAlias: lineTokens
                .slice(
                    startIndex,
                    startIndex + aliasTokens.length
                )
                .join(" ")
        };

        if (
            !bestMatch ||
            currentMatch.score > bestMatch.score ||
            (
                currentMatch.score === bestMatch.score &&
                currentMatch.distance < bestMatch.distance
            )
        ) {
            bestMatch = currentMatch;
        }
    }

    return bestMatch;
}

function sortFamilyCandidates(candidates) {

    return candidates.sort(function (a, b) {

        if (b.wordCount !== a.wordCount) {
            return b.wordCount - a.wordCount;
        }

        if (b.length !== a.length) {
            return b.length - a.length;
        }

        if (b.score !== a.score) {
            return b.score - a.score;
        }

        if ((a.distance || 0) !== (b.distance || 0)) {
            return (a.distance || 0) - (b.distance || 0);
        }

        return a.priority - b.priority;
    });
}

function detectOperationalFamilyFromLine(value) {

    const normalizedLine =
        normalizeMatchText(value);

    if (!normalizedLine) {
        return null;
    }

    const exactCandidates = [];
    const fuzzyCandidates = [];

    getRuntimeOperationalFamilyRules()
        .forEach(function (rule, ruleIndex) {

            (rule.names || []).forEach(function (name) {

                const normalizedName =
                    normalizeMatchText(name);

                if (!normalizedName) {
                    return;
                }

                const baseCandidate = {
                    family:
                        normalizeMatchText(rule.family),
                    alias: normalizedName,
                    priority: ruleIndex,
                    wordCount:
                        normalizedName.split(" ").length,
                    length:
                        normalizedName.length
                };

                if (
                    containsNormalizedPhrase(
                        normalizedLine,
                        normalizedName
                    )
                ) {
                    exactCandidates.push({
                        ...baseCandidate,
                        source: "ALIAS_RULE",
                        score: 100,
                        distance: 0,
                        needsReview: false
                    });
                    return;
                }

                const fuzzyMatch =
                    findFuzzyAliasPhraseMatch(
                        normalizedLine,
                        normalizedName
                    );

                if (!fuzzyMatch) {
                    return;
                }

                fuzzyCandidates.push({
                    ...baseCandidate,
                    source: "FUZZY_ALIAS_RULE",
                    score: fuzzyMatch.score,
                    distance: fuzzyMatch.distance,
                    observedAlias: fuzzyMatch.observedAlias || "",
                    needsReview: false
                });
            });
        });

    if (exactCandidates.length > 0) {
        sortFamilyCandidates(exactCandidates);
        return exactCandidates[0];
    }

    if (fuzzyCandidates.length === 0) {
        return null;
    }

    sortFamilyCandidates(fuzzyCandidates);

    const best = fuzzyCandidates[0];

    const competingFamily = fuzzyCandidates.find(
        function (candidate) {
            return candidate.family !== best.family;
        }
    );

    const isAmbiguous = Boolean(
        competingFamily &&
        competingFamily.wordCount === best.wordCount &&
        Math.abs(competingFamily.length - best.length) <= 2 &&
        Math.abs(competingFamily.score - best.score) <= 5 &&
        Math.abs(
            (competingFamily.distance || 0) -
            (best.distance || 0)
        ) <= 1
    );

    if (isAmbiguous) {
        return {
            family: "",
            alias: best.alias,
            source: "FUZZY_ALIAS_AMBIGUOUS",
            score: best.score,
            distance: best.distance,
            needsReview: true,
            alternatives: [
                {
                    family: best.family,
                    alias: best.alias,
                    score: best.score
                },
                {
                    family: competingFamily.family,
                    alias: competingFamily.alias,
                    score: competingFamily.score
                }
            ]
        };
    }

    return best;
}

function resolveInventoryFamilyName(value) {

    const detected =
        detectOperationalFamilyFromLine(value);

    return detected
        ? detected.family
        : normalizeMatchText(value);
}

function getProductionColorFromCode(code) {

    const normalizedCode =
        normalizeMatchText(code);

    const colorCodes = {
        AN: "ANTIQUE",
        BL: "BLUE",
        BP: "BLUE PURPLE",
        BR: "BROWN",
        BU: "BURGUNDY",
        BZ: "BRONZE",
        CR: "CREAM",
        DPI: "DARK PINK",
        GE: "YELLOW",
        GO: "YELLOW ORANGE",
        GOL: "GOLD",
        GR: "GREEN",
        GRN: "GREEN",
        HP: "HOT PINK",
        HPNK: "HOT PINK",
        LV: "LAVENDER",
        OR: "ORANGE",
        ORG: "ORANGE",
        PE: "PEACH",
        PI: "PINK",
        PK: "PINK",
        PNK: "PINK",
        PR: "PURPLE",
        PU: "PURPLE",
        RD: "RED",
        RE: "RED",
        WH: "WHITE",
        WI: "WHITE",
        WHT: "WHITE",
        YE: "YELLOW",
        YEL: "YELLOW",
        YLW: "YELLOW"
    };

    return colorCodes[normalizedCode] || "";
}

function normalizeColorForMatching(value) {

    const normalized =
        normalizeMatchText(value)
            .replace(/\bLAVANDER\b/g, "LAVENDER");

    return extractProductionColor(normalized) ||
        normalized;
}

function doProductionColorsMatch(
    requestedColor,
    inventoryColor
) {

    const requested =
        normalizeColorForMatching(requestedColor);

    const available =
        normalizeColorForMatching(inventoryColor);

    if (!requested) {
        return true;
    }

    if (!available) {
        return false;
    }

    if (requested === available) {
        return true;
    }

    return (
        containsNormalizedPhrase(
            inventoryColor,
            requested
        ) &&
        !(
            requested === "PINK" &&
            available === "HOT PINK"
        )
    );
}

function isProductionMaterialLine(line) {

    const text = normalizeMatchText(line);

    if (!text) {
        return false;
    }

    const materialPatterns = [
        /\bSHEET\b/,
        /\bPAPER\b/,
        /\bSL CLEAR\b/,
        /\bNONWOVEN\b/,
        /\bSLEEVE\b/,
        /\bBOXES?\b/,
        /\bCARTONS?\b/,
        /\bLABELS?\b/,
        /\bFLOWER FOOD\b/,
        /\bFLOWERFOOD\b/,
        /\bPRESERVATIVE\b/,
        /\bCHRYSAL\b/,
        /\bFLORALIFE\b/,
        /\bCELLOPHANE\b/,
        /\bRIBBON\b/,
        /\bTAPE\b/,
        /\bWIRE\b/,
        /\bFOAM\b/,
        /\bBAGS?\b/
    ];

    return materialPatterns.some(function (pattern) {
        return pattern.test(text);
    });
}
function resolveOperationalFamily(
    articleName,
    proposedFamily
) {

    const normalizedArticle =
        normalizeMatchText(articleName);

    const normalizedProposed =
        normalizeMatchText(proposedFamily);

    const sortedRules =
        getOperationalFamilyRules()
            .flatMap(function (rule) {
                return (rule.names || [])
                    .concat([rule.family])
                    .map(function (name) {
                        return {
                            family:
                                normalizeMatchText(
                                    rule.family
                                ),
                            name:
                                normalizeMatchText(name)
                        };
                    });
            })
            .filter(function (rule) {
                return rule.name;
            })
            .sort(function (a, b) {
                return b.name.length - a.name.length;
            });

    const articleRule =
        sortedRules.find(function (rule) {
            return containsNormalizedPhrase(
                normalizedArticle,
                rule.name
            );
        });

    if (articleRule) {
        return articleRule.family;
    }

    const proposedRule =
        sortedRules.find(function (rule) {
            return (
                normalizedProposed === rule.family ||
                normalizedProposed === rule.name
            );
        });

    if (proposedRule) {
        return proposedRule.family;
    }

    return normalizedProposed;
}

function isArticleMeasurementToken(token) {

    const value = normalizeMatchText(token);

    if (!value) {
        return true;
    }

    if (/^\d{2,3}(?:CM|MM|AM)$/.test(value)) {
        return true;
    }

    if (/^(?:CM|MM)$/.test(value)) {
        return true;
    }

    if (/^(?:SOON|SOC|SOEM|S0CM|SOM|6OCM|8OCM)$/.test(value)) {
        return true;
    }

    if (/^(?:30|35|40|45|50|55|60|65|70|75|80|85|90|100|110|120)$/.test(value)) {
        return true;
    }

    return false;
}

function normalizeArticleColorToken(token) {

    const value = normalizeMatchText(token);

    const colorAliases = {
        YELLO: "YELLOW",
        VELLOW: "YELLOW",
        YELOW: "YELLOW",
        YLLW: "YELLOW",
        PURALE: "PURPLE",
        PLRPLE: "PURPLE",
        PRPLE: "PURPLE",
        PURP: "PURPLE",
        WIRTTE: "WHITE",
        WHITTE: "WHITE",
        WHIT: "WHITE",
        WHT: "WHITE",
        PNK: "PINK",
        GRN: "GREEN",
        ORNGE: "ORANGE",
        ORG: "ORANGE",
        LAV: "LAVENDER",
        LAVNDR: "LAVENDER"
    };

    return colorAliases[value] || value;
}

function getArticleNoiseTokens() {
    return new Set([
        "PRODUCTION",
        "ORDER",
        "GENERAL",
        "BILL",
        "MATERIAL",
        "MATERIALS",
        "ARTICLE",
        "REQUIRED",
        "NUMBER",
        "NEW",
        "PROJ",
        "PROJECT",
        "STEM",
        "STEMS",
        "BUNCH",
        "BUNCHES",
        "BOX",
        "BOXES",
        "CASE",
        "CASES",
        "PCS",
        "CLEAR",
        "SLEEVE",
        "LES",
        "LOS",
        "LQS",
        "SE6",
        "ITY",
        "URE",
        "FBI",
        "NY",
        "SER",
        "HONWOVE"
    ]);
}

function prepareArticleSearchText(value) {

    let normalized = normalizeMatchText(value)
        .replace(/\b\d{2,3}\s*(?:CM|MM|AM)\b/g, " ")
        .replace(/\b(?:SOON|SOC|SOEM|S0CM|SOM|6OCM|8OCM)\b/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (!normalized) {
        return "";
    }

    const noiseTokens = getArticleNoiseTokens();
    const resultTokens = [];

    normalized.split(/\s+/).forEach(function (rawToken) {

        if (!rawToken || rawToken.length <= 1) {
            return;
        }

        if (isArticleMeasurementToken(rawToken)) {
            return;
        }

        if (/^(?=.*[A-Z])(?=.*\d)[A-Z0-9]+$/.test(rawToken)) {
            return;
        }

        if (noiseTokens.has(rawToken)) {
            return;
        }

        if (
            /^(?:POMSUTRON|POMBUTTON|POMCUSHION|POMMICRO|POMDAISY)/.test(
                rawToken
            )
        ) {
            resultTokens.push("POM");
            resultTokens.push(
                normalizeArticleColorToken(rawToken.slice(3))
            );
            return;
        }

        if (rawToken.startsWith("RUSCUS")) {
            resultTokens.push("RUSCUS");
            return;
        }

        resultTokens.push(
            normalizeArticleColorToken(rawToken)
        );
    });

    return resultTokens
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}

function getUsefulArticleTokens(value) {
    return prepareArticleSearchText(value)
        .split(/\s+/)
        .filter(function (token) {
            return token && token.length > 1;
        });
}

function getKnownArticleColors() {
    return new Set([
        "WHITE",
        "YELLOW",
        "PINK",
        "RED",
        "ORANGE",
        "PURPLE",
        "GREEN",
        "BLUE",
        "CREAM",
        "LAVENDER",
        "BRONZE",
        "CORAL",
        "PEACH",
        "TINTED",
        "NOVELTY",
        "ASSORTED",
        "MIXED"
    ]);
}

function removeArticleColors(value) {

    const colors = getKnownArticleColors();

    return getUsefulArticleTokens(value)
        .filter(function (token) {
            return !colors.has(token);
        })
        .join(" ");
}

function calculateFuzzyTokenSimilarity(searchText, catalogText) {

    const searchTokens = getUsefulArticleTokens(searchText);
    const catalogTokens = getUsefulArticleTokens(catalogText);

    if (
        searchTokens.length === 0 ||
        catalogTokens.length === 0
    ) {
        return 0;
    }

    const searchCoverage = searchTokens.reduce(
        function (total, searchToken) {

            const bestTokenScore = Math.max(
                ...catalogTokens.map(function (catalogToken) {
                    return calculateStringSimilarity(
                        searchToken,
                        catalogToken
                    );
                })
            );

            return total + bestTokenScore;
        },
        0
    ) / searchTokens.length;

    const catalogCoverage = catalogTokens.reduce(
        function (total, catalogToken) {

            const bestTokenScore = Math.max(
                ...searchTokens.map(function (searchToken) {
                    return calculateStringSimilarity(
                        catalogToken,
                        searchToken
                    );
                })
            );

            return total + bestTokenScore;
        },
        0
    ) / catalogTokens.length;

    return Math.round(
        searchCoverage * 0.35 +
        catalogCoverage * 0.65
    );
}

function buildLexiflorFamilyIndexes() {

    lexiflorCatalogByFamily = new Map();

    const profileMap = new Map();

    lexiflorSearchCatalog.forEach(function (article) {

        const family = normalizeMatchText(article.family);

        if (!family) {
            return;
        }

        if (!lexiflorCatalogByFamily.has(family)) {
            lexiflorCatalogByFamily.set(family, []);
        }

        lexiflorCatalogByFamily.get(family).push(article);

        if (!profileMap.has(family)) {
            profileMap.set(family, {
                family: family,
                clues: new Set([family])
            });
        }

        const profile = profileMap.get(family);
        const identityTokens = getUsefulArticleTokens(
            removeArticleColors(article.searchText)
        );

        if (
            identityTokens[0] &&
            identityTokens[0].length >= 4
        ) {
            profile.clues.add(identityTokens[0]);
        }

        if (identityTokens.length >= 2) {
            profile.clues.add(
                identityTokens.slice(0, 2).join(" ")
            );
        }
    });

    flowerFamilies.forEach(function (item) {

        const family = normalizeMatchText(item.family);
        const profile = profileMap.get(family);

        if (!profile) {
            return;
        }

        (item.aliases || []).forEach(function (alias) {
            const normalizedAlias = prepareArticleSearchText(alias);

            if (normalizedAlias.length >= 4) {
                profile.clues.add(normalizedAlias);
            }
        });
    });

    getOperationalFamilyRules().forEach(function (rule) {

        const profile = profileMap.get(rule.family);

        if (!profile) {
            return;
        }

        rule.names.forEach(function (name) {
            profile.clues.add(name);
        });
    });

    lexiflorFamilyProfiles = Array.from(profileMap.values())
        .map(function (profile) {
            return {
                family: profile.family,
                clues: Array.from(profile.clues)
                    .filter(function (clue) {
                        return (
                            clue.includes(" ") ||
                            clue.length >= 4
                        );
                    })
                    .sort(function (a, b) {
                        return b.length - a.length;
                    })
            };
        });
}

function detectBestCatalogFamily(value) {

    const identityText = removeArticleColors(
        prepareArticleSearchText(value)
    );

    if (
        !identityText ||
        lexiflorFamilyProfiles.length === 0
    ) {
        return null;
    }

    const directFamily =
        detectOperationalFamilyFromLine(identityText);

    if (directFamily) {
        return {
            family: directFamily.family,
            score: 100,
            directMatch: true,
            source: directFamily.source
        };
    }

    const results = lexiflorFamilyProfiles
        .map(function (profile) {

            let bestScore = 0;

            profile.clues.forEach(function (clue) {

                const normalizedClue =
                    prepareArticleSearchText(clue);

                if (!normalizedClue) {
                    return;
                }

                const fuzzyScore =
                    calculateFuzzyTokenSimilarity(
                        identityText,
                        normalizedClue
                    );

                const directScore =
                    calculateStringSimilarity(
                        identityText,
                        normalizedClue
                    );

                bestScore = Math.max(
                    bestScore,
                    fuzzyScore,
                    Math.round(directScore * 0.9)
                );
            });

            return {
                family: profile.family,
                score: bestScore,
                directMatch: false,
                source: "STRICT_CATALOG_FALLBACK"
            };
        })
        .sort(function (a, b) {
            return b.score - a.score;
        });

    const best = results[0];
    const second = results[1];

    if (!best) {
        return null;
    }

    const margin = second
        ? best.score - second.score
        : best.score;

    if (best.score >= 90 && margin >= 12) {
        return best;
    }

    return null;
}

function calculateCatalogArticleScore(
    searchName,
    catalogItem,
    detectedFamily
) {

    const articleName = catalogItem.searchText;

    const searchIdentity = removeArticleColors(searchName);
    const articleIdentity = removeArticleColors(articleName);

    const identityScore = calculateFuzzyTokenSimilarity(
        searchIdentity,
        articleIdentity
    );

    const fullTokenScore = calculateFuzzyTokenSimilarity(
        searchName,
        articleName
    );

    const directScore = calculateStringSimilarity(
        searchName,
        articleName
    );

    const requestedColor = extractProductionColor(searchName);
    const catalogColor = normalizeMatchText(catalogItem.color);

    let colorScore = 60;

    if (requestedColor) {
        colorScore = catalogColor
            ? calculateStringSimilarity(
                requestedColor,
                catalogColor
            )
            : calculateStringSimilarity(
                requestedColor,
                articleName
            );
    }

    let score =
        identityScore * 0.55 +
        fullTokenScore * 0.25 +
        directScore * 0.10 +
        colorScore * 0.10;

    if (
        detectedFamily &&
        catalogItem.family === detectedFamily.family
    ) {
        score += 10;
    }

    if (
        searchName === articleName ||
        searchName.includes(articleName) ||
        articleName.includes(searchName)
    ) {
        score += 10;
    }

    if (!detectedFamily && identityScore < 65) {
        score = Math.min(score, 34);
    }

    return Math.max(
        0,
        Math.min(100, Math.round(score))
    );
}

function findBestCatalogProduct(
    productionProduct,
    catalog
) {

    if (productionProduct?.familyNeedsReview) {
        return {
            detectedFamily: null,
            best: null,
            alternatives:
                productionProduct.familyAlternatives || []
        };
    }

    const searchName = prepareArticleSearchText(
        [
            productionProduct.cleanedArticle,
            productionProduct.original,
            productionProduct.variety,
            productionProduct.color
        ]
            .filter(Boolean)
            .join(" ")
    );

    if (!searchName || !Array.isArray(catalog)) {
        return null;
    }

    let detectedFamily = null;

    const explicitFamily =
        productionProduct.family ||
        productionProduct.product ||
        "";

    if (explicitFamily) {
        const canonicalFamily =
            resolveInventoryFamilyName(
                explicitFamily
            );

        if (canonicalFamily) {
            detectedFamily = {
                family: canonicalFamily,
                score:
                    productionProduct.familyConfidence ||
                    100,
                directMatch: true,
                source:
                    productionProduct.familySource ||
                    "PARSED_FAMILY"
            };
        }
    }

    if (!detectedFamily) {
        detectedFamily =
            detectBestCatalogFamily(searchName);
    }

    const familyCatalog = detectedFamily
        ? (
            lexiflorCatalogByFamily.get(
                detectedFamily.family
            ) || []
        )
        : [];

    const candidates = familyCatalog
        .map(function (catalogItem) {
            return {
                product: catalogItem.articleName,
                articleName: catalogItem.articleName,
                family: catalogItem.family,
                color: catalogItem.color,
                variety: catalogItem.variety,
                score: calculateCatalogArticleScore(
                    searchName,
                    catalogItem,
                    detectedFamily
                )
            };
        })
        .sort(function (a, b) {
            return b.score - a.score;
        });

    const bestCandidate =
        candidates[0] &&
        candidates[0].score >= 55
            ? candidates[0]
            : null;

    return {
        detectedFamily: detectedFamily,
        best: bestCandidate,
        alternatives: candidates.slice(1, 4)
    };
}


function getProductionLearningSuggestion(productionProduct) {

    if (
        !productionProduct ||
        productionProduct.familySource !== "FUZZY_ALIAS_RULE" ||
        !productionProduct.family ||
        !productionProduct.familyObservedAlias ||
        !productionProduct.familyAlias
    ) {
        return null;
    }

    const observedAlias = normalizeMatchText(
        productionProduct.familyObservedAlias
    );

    const expectedAlias = normalizeMatchText(
        productionProduct.familyAlias
    );

    if (!observedAlias || observedAlias === expectedAlias) {
        return null;
    }

    return {
        learningSuggested: true,
        learningAlias: observedAlias,
        learningExpectedAlias: expectedAlias,
        learningFamily: normalizeMatchText(
            productionProduct.family
        ),
        learningScore: Number(
            productionProduct.familyConfidence || 0
        )
    };
}

function findInventoryMatches(products) {

    if (
        !Array.isArray(products) ||
        !Array.isArray(inventory)
    ) {
        return [];
    }

    const availableInventory =
        inventory.filter(function (item) {

            const status =
                normalizeMatchText(item.status);

            const inventoryId = String(item.id ?? "");

            return (
                Number(item.quantity || 0) > 0 &&
                status !== "REMOVED FROM INVENTORY" &&
                status !== "REMOVED" &&
                !activeProductionReservations.has(inventoryId)
            );
        });

    const results = [];

    products.forEach(function (productionProduct) {

        const learningData =
            getProductionLearningSuggestion(productionProduct) || {};

        const catalogResult =
            findBestCatalogProduct(
                productionProduct,
                lexiflorSearchCatalog
            );

        const detectedFamily =
            productionProduct.family ||
            catalogResult?.detectedFamily?.family ||
            "";

        const recognizedFamily =
            resolveInventoryFamilyName(
                detectedFamily
            );

        if (!recognizedFamily) {
            results.push({
                ...learningData,
                product:
                    prepareArticleSearchText(
                        productionProduct.original
                    ) ||
                    "UNRECOGNIZED PRODUCT",
                articleName: "",
                color:
                    productionProduct.color || "",
                confidence: 0,
                confidenceLevel: "REVIEW",
                inventoryFound: false,
                needsReview: true,
                originalOcrLine:
                    productionProduct.original || "",
                alternatives:
                    catalogResult?.alternatives || []
            });
            return;
        }

        const catalogBest =
            catalogResult?.best || null;

        const recognizedArticle =
            catalogBest &&
            catalogBest.score >= 70
                ? catalogBest.articleName
                : "";

        const recognizedColor =
            productionProduct.color ||
            (
                catalogBest &&
                catalogBest.score >= 75
                    ? normalizeMatchText(
                        catalogBest.color
                    )
                    : ""
            ) ||
            "";

        const familyInventory =
            availableInventory.filter(function (item) {
                return (
                    resolveInventoryFamilyName(
                        item.product
                    ) === recognizedFamily
                );
            });

        const matchingInventory =
            familyInventory.filter(function (item) {
                return doProductionColorsMatch(
                    recognizedColor,
                    item.color
                );
            });

        if (matchingInventory.length === 0) {
            results.push({
                ...learningData,
                product: recognizedFamily,
                articleName: recognizedArticle,
                color: recognizedColor,
                confidence:
                    catalogResult?.detectedFamily?.score ||
                    productionProduct.familyConfidence ||
                    100,
                confidenceLevel:
                    recognizedFamily
                        ? "HIGH"
                        : "REVIEW",
                inventoryFound: false,
                needsReview: false,
                colorMismatch:
                    Boolean(
                        recognizedColor &&
                        familyInventory.length > 0
                    ),
                originalOcrLine:
                    productionProduct.original || "",
                alternatives:
                    catalogResult?.alternatives || []
            });
            return;
        }

        matchingInventory.forEach(function (bestItem) {

            results.push({
                ...learningData,
                inventoryIndex:
                    inventory.indexOf(bestItem),
                id: bestItem.id,
                product:
                    bestItem.product ||
                    recognizedFamily,
                normalizedProduct:
                    recognizedFamily,
                color: bestItem.color,
                quantity: bestItem.quantity,
                caseNumber: bestItem.caseNumber,
                date: bestItem.date || "",
                status: bestItem.status,
                articleName: recognizedArticle,
                requestedProduct:
                    recognizedFamily,
                requestedVariety:
                    productionProduct.variety || "",
                requestedColor:
                    recognizedColor,
                originalOcrLine:
                    productionProduct.original || "",
                confidence:
                    catalogResult?.detectedFamily?.score ||
                    productionProduct.familyConfidence ||
                    100,
                confidenceLevel: "HIGH",
                inventoryFound: true,
                needsReview: false,
                alternatives:
                    catalogResult?.alternatives || []
            });
        });
    });

    return results;
}

function saveLearnedProductAlias(axerrioName, floraFlowName) {

    const sourceName = axerrioName.trim().toUpperCase();
    const targetName = floraFlowName.trim().toUpperCase();

    if (!sourceName || !targetName) {
        return;
    }

    learnedProductAliases[sourceName] = targetName;

    localStorage.setItem(
        "learnedProductAliases",
        JSON.stringify(learnedProductAliases)
    );

}
function getLearnedProductAlias(axerrioName) {

    const sourceName = axerrioName.trim().toUpperCase();

    return learnedProductAliases[sourceName] || null;

}
function cleanProductionLine(line) {

    return String(line || "")
        .toUpperCase()

        // Remove quantities, measurements and table noise.
        .replace(/\b\d+(?:-\d+)?\s*(?:CM|MM|AM)\b/g, " ")
        .replace(/\b\d+\s*GRAMS?\b/g, " ")
        .replace(/\b\d+\s*X\s*\d+\b/g, " ")
        .replace(/\bSTEMS?\b/g, " ")
        .replace(/\bBUNCH(?:ES)?\b/g, " ")
        .replace(/\bPCS\b/g, " ")
        .replace(/\bCASE\b/g, " ")
        .replace(/\bREQUIRED\b/g, " ")
        .replace(/\bDELIVERED\b/g, " ")

        // Clean punctuation but preserve words.
        .replace(/[.,;:()[\]{}"'|]/g, " ")
        .replace(/[_/\\-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


// ============================================================
// USER ACCOUNTS MANAGEMENT
// Permanent and temporary accounts, role, status and password reset.
// ============================================================
const USER_ADMIN_FUNCTION = "manage-floraflow-user";

function formatUserAccessDate(value) {
    if (!value) return "No expiration";
    const date = new Date(value + (String(value).length === 10 ? "T12:00:00" : ""));
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
}

function isUserAccessExpired(user) {
    if (String(user?.access_type || "permanent").toLowerCase() !== "temporary") return false;
    if (!user?.access_expires_at) return false;
    const expires = new Date(String(user.access_expires_at).slice(0, 10) + "T23:59:59");
    return !Number.isNaN(expires.getTime()) && expires.getTime() < Date.now();
}

function getUserVisualStatus(user) {
    if (user?.active === false) return { label: "Inactive", icon: "🔴", bg: "#fef2f2", color: "#991b1b", border: "#fecaca" };
    if (isUserAccessExpired(user)) return { label: "Expired", icon: "🔴", bg: "#fff7ed", color: "#9a3412", border: "#fed7aa" };
    if (String(user?.access_type || "permanent").toLowerCase() === "temporary") return { label: "Temporary", icon: "🟡", bg: "#fffbeb", color: "#92400e", border: "#fde68a" };
    return { label: "Active", icon: "🟢", bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" };
}

async function invokeUserAdminAction(action, payload) {
    const { data, error } = await supabaseClient.functions.invoke(USER_ADMIN_FUNCTION, {
        body: Object.assign({ action: action }, payload || {})
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data || {};
}

function setUsersManagementMessage(text, type) {
    const message = document.getElementById("usersManagementMessage");
    if (!message) return;
    const colors = { success: "#166534", error: "#b91c1c", working: "#1d4ed8", info: "#475569" };
    message.style.color = colors[type] || colors.info;
    message.textContent = text || "";
}

function ensureUsersManagementStyles() {
    if (document.getElementById("floraFlowUsersManagementStyles")) return;
    const style = document.createElement("style");
    style.id = "floraFlowUsersManagementStyles";
    style.textContent = `
      #usersManagementOverlay input, #usersManagementOverlay select { min-height:44px; box-sizing:border-box; }
      .ff-user-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
      .ff-user-actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:14px; }
      .ff-user-actions button { min-height:40px; padding:9px 12px; border-radius:10px; border:1px solid #cbd5e1; background:white; color:#334155; font-weight:750; cursor:pointer; }
      .ff-user-actions button.primary { background:#a11375; border-color:#a11375; color:white; }
      .ff-user-actions button.danger { color:#b91c1c; border-color:#fecaca; background:#fff; }
      .ff-user-card { padding:16px; border:1px solid #e2e8f0; border-radius:15px; background:white; box-shadow:0 3px 12px rgba(15,23,42,.06); }
      @media (max-width:720px) {
        #usersManagementOverlay { padding:0 !important; }
        #usersManagementPanel { width:100% !important; min-height:100%; margin:0 !important; border-radius:0 !important; padding:16px !important; }
        .ff-user-grid { grid-template-columns:1fr; }
        .ff-user-actions button { flex:1 1 calc(50% - 8px); }
      }
    `;
    document.head.appendChild(style);
}

function ensureUsersManagementModal() {
    let overlay = document.getElementById("usersManagementOverlay");
    if (overlay) return overlay;
    ensureUsersManagementStyles();
    overlay = document.createElement("div");
    overlay.id = "usersManagementOverlay";
    overlay.style.cssText = "display:none;position:fixed;inset:0;z-index:160000;background:rgba(15,23,42,.62);padding:18px;box-sizing:border-box;overflow:auto;";
    overlay.innerHTML = `
      <div id="usersManagementPanel" style="width:min(980px,100%);margin:3vh auto;background:#f8fafc;border-radius:20px;padding:20px;box-shadow:0 24px 70px rgba(0,0,0,.28);box-sizing:border-box;">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;position:sticky;top:0;z-index:3;background:#f8fafc;padding-bottom:12px;">
          <div><div style="font-size:23px;font-weight:850;color:#0f172a;">User Management</div><div style="font-size:13px;color:#64748b;margin-top:3px;">Create accounts and control access to FloraFlow.</div></div>
          <button id="closeUsersManagementBtn" type="button" style="width:44px;height:44px;border:none;border-radius:12px;background:#0f172a;color:white;font-size:24px;">×</button>
        </div>

        <div style="margin-top:8px;padding:17px;border:1px solid #dbe4ea;border-radius:15px;background:white;">
          <div style="font-weight:850;margin-bottom:12px;color:#0f172a;">Create account</div>
          <div class="ff-user-grid">
            <input id="newUserName" placeholder="Full name" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;">
            <input id="newUserEmail" type="email" placeholder="Email" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;">
            <input id="newUserPassword" type="password" placeholder="Temporary password (8+ characters)" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;">
            <select id="newUserRole" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;background:white;"><option value="user">User</option><option value="manager">Manager</option><option value="admin">Admin</option></select>
          </div>
          <label style="display:flex;align-items:center;gap:9px;margin-top:13px;font-weight:750;color:#334155;">
            <input id="newUserTemporary" type="checkbox" style="width:19px;height:19px;min-height:auto;"> Temporary account
          </label>
          <div id="newUserExpirationWrap" style="display:none;margin-top:10px;max-width:360px;">
            <label style="display:block;font-size:13px;font-weight:750;color:#475569;margin-bottom:5px;">Access expiration date</label>
            <input id="newUserExpiration" type="date" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:10px;">
          </div>
          <button id="createUserAccountBtn" type="button" style="margin-top:14px;padding:11px 17px;border:none;border-radius:10px;background:#a11375;color:white;font-weight:850;">Create Account</button>
          <div id="usersManagementMessage" style="min-height:20px;margin-top:9px;font-size:13px;color:#475569;"></div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:18px;gap:10px;flex-wrap:wrap;">
          <div><div style="font-size:19px;font-weight:850;color:#0f172a;">All users</div><div id="usersManagementCount" style="font-size:12px;color:#64748b;margin-top:2px;"></div></div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <input id="usersManagementSearch" type="search" placeholder="Search users" style="padding:9px 11px;border:1px solid #cbd5e1;border-radius:10px;min-width:190px;">
            <button id="refreshUsersBtn" type="button">Refresh</button>
          </div>
        </div>
        <div id="usersManagementList" style="margin-top:10px;display:grid;gap:10px;"></div>
      </div>`;
    document.body.appendChild(overlay);

    const close = function () { overlay.style.display = "none"; };
    overlay.querySelector("#closeUsersManagementBtn").addEventListener("click", close);
    installSafeBackdropClose(overlay, close);
    overlay.querySelector("#refreshUsersBtn").addEventListener("click", refreshUsersManagement);
    overlay.querySelector("#createUserAccountBtn").addEventListener("click", createUserAccountFromSettings);
    overlay.querySelector("#newUserTemporary").addEventListener("change", function () {
        overlay.querySelector("#newUserExpirationWrap").style.display = this.checked ? "block" : "none";
        if (this.checked && !overlay.querySelector("#newUserExpiration").value) {
            const date = new Date();
            date.setDate(date.getDate() + 30);
            overlay.querySelector("#newUserExpiration").value = date.toISOString().slice(0, 10);
        }
    });
    overlay.querySelector("#usersManagementSearch").addEventListener("input", renderUsersManagementList);
    return overlay;
}

async function createUserAccountFromSettings() {
    const overlay = ensureUsersManagementModal();
    const button = overlay.querySelector("#createUserAccountBtn");
    if (!canManageUsers()) { setUsersManagementMessage("Only administrators can create accounts.", "error"); return; }
    const full_name = overlay.querySelector("#newUserName").value.trim();
    const email = overlay.querySelector("#newUserEmail").value.trim().toLowerCase();
    const password = overlay.querySelector("#newUserPassword").value;
    const role = normalizeAppRole(overlay.querySelector("#newUserRole").value);
    const temporary = overlay.querySelector("#newUserTemporary").checked;
    const access_expires_at = temporary ? overlay.querySelector("#newUserExpiration").value : null;
    if (!full_name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
        setUsersManagementMessage("Enter a name, valid email and a temporary password of at least 8 characters.", "error"); return;
    }
    if (temporary && !access_expires_at) {
        setUsersManagementMessage("Choose an expiration date for the temporary account.", "error"); return;
    }
    button.disabled = true; button.textContent = "Creating..."; setUsersManagementMessage("Creating the account...", "working");
    try {
        const { data, error } = await supabaseClient.functions.invoke("create-floraflow-user", {
            body: { full_name, email, password, role, access_type: temporary ? "temporary" : "permanent", access_expires_at, must_change_password: true }
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        await loadAppUsers();
        const createdUser = appUsers.find(function (user) { return String(user.email || "").toLowerCase() === email; });
        if (createdUser?.id) {
            const { error: profileError } = await supabaseClient.from("app_profiles").update({
                access_type: temporary ? "temporary" : "permanent",
                access_expires_at: temporary ? access_expires_at : null,
                must_change_password: true,
                active: true
            }).eq("id", createdUser.id);
            if (profileError) throw profileError;
        }

        setUsersManagementMessage(full_name + " was created successfully.", "success");
        ["#newUserName", "#newUserEmail", "#newUserPassword", "#newUserExpiration"].forEach(function (selector) { overlay.querySelector(selector).value = ""; });
        overlay.querySelector("#newUserRole").value = "user";
        overlay.querySelector("#newUserTemporary").checked = false;
        overlay.querySelector("#newUserExpirationWrap").style.display = "none";
        await refreshUsersManagement();
    } catch (error) {
        console.error("Create user error:", error);
        setUsersManagementMessage(error?.message || String(error), "error");
    } finally { button.disabled = false; button.textContent = "Create Account"; }
}

async function updateUserProfileFields(userId, changes, successMessage) {
    const { error } = await supabaseClient.from("app_profiles").update(changes).eq("id", userId);
    if (error) throw error;
    setUsersManagementMessage(successMessage || "User updated.", "success");
    await refreshUsersManagement();
}

async function resetManagedUserPassword(user) {
    const password = window.prompt("Enter a new temporary password for " + (user.full_name || user.email) + ". It must contain at least 8 characters.");
    if (password === null) return;
    if (password.length < 8) { alert("The temporary password must contain at least 8 characters."); return; }
    await invokeUserAdminAction("reset_password", { user_id: user.id, password: password });
    await updateUserProfileFields(user.id, { must_change_password: true }, "Temporary password updated. The user must change it after signing in.");
}

async function changeManagedUserRole(user, role) {
    await updateUserProfileFields(user.id, { role: normalizeAppRole(role) }, "Role updated for " + (user.full_name || user.email) + ".");
}

async function toggleManagedUserActive(user) {
    const nextActive = user.active === false;
    if (!nextActive && user.id === getCurrentAuthUserId()) {
        alert("You cannot deactivate your own account while you are signed in.");
        return;
    }
    await updateUserProfileFields(user.id, { active: nextActive }, (user.full_name || user.email) + (nextActive ? " was activated." : " was deactivated."));
}

async function makeManagedUserPermanent(user) {
    await updateUserProfileFields(user.id, { access_type: "permanent", access_expires_at: null, active: true }, (user.full_name || user.email) + " now has permanent access.");
}

async function extendManagedUserAccess(user) {
    const current = user.access_expires_at ? String(user.access_expires_at).slice(0, 10) : "";
    const value = window.prompt("Enter the new expiration date in YYYY-MM-DD format.", current);
    if (value === null) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) { alert("Use the date format YYYY-MM-DD."); return; }
    await updateUserProfileFields(user.id, { access_type: "temporary", access_expires_at: value, active: true }, "Temporary access extended until " + formatUserAccessDate(value) + ".");
}

function renderUsersManagementList() {
    const list = document.getElementById("usersManagementList");
    if (!list) return;
    const query = String(document.getElementById("usersManagementSearch")?.value || "").trim().toLowerCase();
    const users = (appUsers || []).filter(function (user) {
        return !query || [user.full_name, user.email, user.role, user.access_type].some(function (value) { return String(value || "").toLowerCase().includes(query); });
    });
    const count = document.getElementById("usersManagementCount");
    if (count) count.textContent = users.length + " user" + (users.length === 1 ? "" : "s");
    list.innerHTML = "";
    if (users.length === 0) {
        list.innerHTML = '<div style="padding:25px;text-align:center;color:#64748b;background:white;border-radius:14px;">No users found.</div>';
        return;
    }

    users.forEach(function (user) {
        const status = getUserVisualStatus(user);
        const card = document.createElement("div");
        card.className = "ff-user-card";
        card.innerHTML = `
          <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;">
            <div style="min-width:0;">
              <div style="font-size:18px;font-weight:850;color:#0f172a;word-break:break-word;">👤 ${escapeProductionPickHtml(user.full_name || user.email || "Unknown user")}</div>
              <div style="font-size:13px;color:#64748b;margin-top:4px;word-break:break-all;">${escapeProductionPickHtml(user.email || "")}</div>
            </div>
            <span style="display:inline-flex;align-items:center;gap:5px;padding:7px 10px;border-radius:999px;background:${status.bg};color:${status.color};border:1px solid ${status.border};font-size:12px;font-weight:850;">${status.icon} ${status.label}</span>
          </div>
          <div class="ff-user-grid" style="margin-top:14px;">
            <label style="font-size:12px;font-weight:800;color:#64748b;">Role
              <select class="managed-user-role" style="width:100%;margin-top:5px;padding:9px;border:1px solid #cbd5e1;border-radius:9px;background:white;"><option value="user">User</option><option value="manager">Manager</option><option value="admin">Admin</option></select>
            </label>
            <div style="font-size:12px;font-weight:800;color:#64748b;">Access
              <div style="font-size:14px;font-weight:750;color:#334155;margin-top:9px;">${String(user.access_type || "permanent").toLowerCase() === "temporary" ? "Temporary · expires " + formatUserAccessDate(user.access_expires_at) : "Permanent account"}</div>
            </div>
          </div>
          ${user.must_change_password ? '<div style="margin-top:10px;padding:9px 10px;border-radius:9px;background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:750;">🔑 Password change required at next sign-in</div>' : ""}
          <div class="ff-user-actions">
            <button type="button" class="managed-reset-password">🔑 Reset Password</button>
            ${String(user.access_type || "permanent").toLowerCase() === "temporary" ? '<button type="button" class="managed-make-permanent primary">✓ Make Permanent</button><button type="button" class="managed-extend-access">📅 Extend</button>' : '<button type="button" class="managed-make-temporary">📅 Make Temporary</button>'}
            <button type="button" class="managed-toggle-active ${user.active === false ? "primary" : "danger"}">${user.active === false ? "✓ Activate" : "🚫 Deactivate"}</button>
          </div>`;

        const roleSelect = card.querySelector(".managed-user-role");
        roleSelect.value = normalizeAppRole(user.role);
        roleSelect.addEventListener("change", async function () {
            try { await changeManagedUserRole(user, this.value); } catch (error) { alert("Could not update the role: " + (error?.message || error)); await refreshUsersManagement(); }
        });
        card.querySelector(".managed-reset-password").addEventListener("click", async function () {
            try { await resetManagedUserPassword(user); } catch (error) { alert("Could not reset the password: " + (error?.message || error)); }
        });
        card.querySelector(".managed-toggle-active").addEventListener("click", async function () {
            try { await toggleManagedUserActive(user); } catch (error) { alert("Could not update the account: " + (error?.message || error)); }
        });
        const permanentButton = card.querySelector(".managed-make-permanent");
        if (permanentButton) permanentButton.addEventListener("click", async function () {
            try { await makeManagedUserPermanent(user); } catch (error) { alert("Could not make the account permanent: " + (error?.message || error)); }
        });
        const extendButton = card.querySelector(".managed-extend-access");
        if (extendButton) extendButton.addEventListener("click", async function () {
            try { await extendManagedUserAccess(user); } catch (error) { alert("Could not extend access: " + (error?.message || error)); }
        });
        const temporaryButton = card.querySelector(".managed-make-temporary");
        if (temporaryButton) temporaryButton.addEventListener("click", async function () {
            try { await extendManagedUserAccess(user); } catch (error) { alert("Could not make the account temporary: " + (error?.message || error)); }
        });
        list.appendChild(card);
    });
}

async function refreshUsersManagement() {
    setUsersManagementMessage("Refreshing users...", "working");
    await loadAppUsers();
    renderUsersManagementList();
    setUsersManagementMessage("", "info");
}

if (usersBtn) {
    usersBtn.addEventListener("click", async function () {
        if (!canManageUsers()) return;
        const overlay = ensureUsersManagementModal();
        overlay.style.display = "block";
        settingsModal.style.display = "none";
        await refreshUsersManagement();
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
        await supabaseClient.auth.signOut();
        localStorage.removeItem("currentUser");
        window.location.reload();
    });
}

// ============================================================
// PRODUCTS / FLOWER FAMILIES MANAGEMENT
// ============================================================

function ensureProductsManagementModal() {
    let overlay = document.getElementById("productsManagementOverlay");

    if (overlay) {
        return overlay;
    }

    overlay = document.createElement("div");
    overlay.id = "productsManagementOverlay";
    overlay.style.cssText = [
        "display:none",
        "position:fixed",
        "inset:0",
        "z-index:100000",
        "background:rgba(15,23,42,.62)",
        "padding:18px",
        "box-sizing:border-box",
        "overflow:auto"
    ].join(";");

    overlay.innerHTML = `
        <div style="
            width:min(850px,100%);
            margin:4vh auto;
            background:white;
            border-radius:16px;
            padding:20px;
            box-shadow:0 24px 70px rgba(0,0,0,.28);
        ">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;">
                <div>
                    <div style="font-size:22px;font-weight:800;color:#166534;">
                        🌼 Products & Families
                    </div>
                    <div style="font-size:13px;color:#64748b;margin-top:3px;">
                        Add products, review every flower family, and manage Production aliases.
                    </div>
                </div>
                <button type="button" id="closeProductsManagementBtn" style="
                    border:none;
                    background:#15803d;
                    color:white;
                    width:38px;
                    height:38px;
                    border-radius:9px;
                    font-size:18px;
                    cursor:pointer;
                ">✕</button>
            </div>

            <div style="
                margin-top:18px;
                padding:16px;
                border:1px solid #bbf7d0;
                background:#f0fdf4;
                border-radius:12px;
            ">
                <div style="font-weight:800;margin-bottom:12px;color:#166534;">
                    ➕ Add New Product / Family
                </div>

                <div style="display:grid;grid-template-columns:1fr 1.3fr;gap:12px;">
                    <label style="font-size:13px;font-weight:700;">
                        Product family
                        <input id="newProductFamilyInput" type="text" placeholder="Example: PUSSY WILLOW" style="
                            width:100%;box-sizing:border-box;margin-top:5px;padding:10px;
                            border:1px solid #cbd5e1;border-radius:8px;text-transform:uppercase;
                        ">
                    </label>

                    <label style="font-size:13px;font-weight:700;">
                        Production aliases (optional)
                        <input id="newProductAliasesInput" type="text" placeholder="Example: PUS, PUSSYWILLOW" style="
                            width:100%;box-sizing:border-box;margin-top:5px;padding:10px;
                            border:1px solid #cbd5e1;border-radius:8px;text-transform:uppercase;
                        ">
                    </label>
                </div>

                <div style="font-size:12px;color:#64748b;margin-top:8px;">
                    Separate several aliases with commas. The family will also be added to the Add Product dropdown.
                </div>

                <div style="display:flex;gap:10px;align-items:center;margin-top:12px;flex-wrap:wrap;">
                    <button type="button" id="saveNewProductFamilyBtn" style="
                        border:none;background:#15803d;color:white;padding:10px 16px;
                        border-radius:9px;font-weight:800;cursor:pointer;
                    ">💾 Save Product</button>
                    <span id="productsManagementMessage" style="font-size:13px;color:#475569;"></span>
                </div>
            </div>

            <div style="margin-top:18px;display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;">
                <div style="font-size:18px;font-weight:800;color:#0f172a;">
                    All Families
                    <span id="productsFamilyCount" style="font-size:13px;color:#64748b;font-weight:600;"></span>
                </div>
                <input id="productsFamilySearch" type="search" placeholder="Search family or alias..." style="
                    width:min(330px,100%);padding:10px;border:1px solid #cbd5e1;border-radius:9px;
                ">
            </div>

            <div id="productsFamiliesList" style="
                margin-top:12px;
                max-height:38vh;
                overflow:auto;
                border:1px solid #e2e8f0;
                border-radius:12px;
                background:#f8fafc;
                padding:10px;
            "></div>

            <div style="margin-top:20px;padding-top:18px;border-top:1px solid #e2e8f0;">
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;">
                    <div>
                        <div style="font-size:18px;font-weight:800;color:#0f172a;">Learned Production Rules</div>
                        <div style="font-size:12px;color:#64748b;margin-top:3px;">Correct or remove an alias that FloraFlow learned with the wrong family.</div>
                    </div>
                    <input id="productionRulesSearch" type="search" placeholder="Search alias or family..." style="
                        width:min(330px,100%);padding:10px;border:1px solid #cbd5e1;border-radius:9px;
                    ">
                </div>
                <div id="productionRulesList" style="
                    margin-top:12px;max-height:34vh;overflow:auto;border:1px solid #e2e8f0;
                    border-radius:12px;background:#f8fafc;padding:10px;
                "></div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector("#closeProductsManagementBtn")
        .addEventListener("click", function () {
            overlay.style.display = "none";
        });

    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            overlay.style.display = "none";
        }
    });

    overlay.querySelector("#productsFamilySearch")
        .addEventListener("input", renderProductsFamiliesList);

    overlay.querySelector("#productionRulesSearch")
        .addEventListener("input", renderProductionRulesList);

    overlay.querySelector("#saveNewProductFamilyBtn")
        .addEventListener("click", saveNewProductFamilyFromSettings);

    return overlay;
}

function addFamilyToProductDropdown(family) {
    const normalizedFamily = normalizeMatchText(family);

    if (!normalizedFamily) {
        return;
    }

    if (!productsCatalog.includes(normalizedFamily)) {
        productsCatalog.push(normalizedFamily);
        productsCatalog.sort(function (a, b) {
            return a.localeCompare(b);
        });
    }

    if (productSelect && !productSelect.options[normalizedFamily]) {
        productSelect.addOption({
            value: normalizedFamily,
            text: normalizedFamily
        });
        productSelect.refreshOptions(false);
    }
}

async function refreshProductsManagementData() {
    const message = document.getElementById("productsManagementMessage");

    if (message) {
        message.textContent = "Loading families...";
        message.style.color = "#475569";
    }

    await loadFlowerFamilies();

    flowerFamilies.forEach(function (item) {
        addFamilyToProductDropdown(item.family);
    });

    await loadProductionAliases();
    renderProductsFamiliesList();
    renderProductionRulesList();

    if (message) {
        message.textContent = "";
    }
}

function renderProductsFamiliesList() {
    const list = document.getElementById("productsFamiliesList");
    const count = document.getElementById("productsFamilyCount");
    const searchInput = document.getElementById("productsFamilySearch");

    if (!list) {
        return;
    }

    const search = normalizeMatchText(searchInput?.value || "");

    const families = (flowerFamilies || [])
        .slice()
        .sort(function (a, b) {
            return String(a.family || "").localeCompare(String(b.family || ""));
        })
        .filter(function (item) {
            const family = normalizeMatchText(item.family);
            const aliases = normalizeMatchText((item.aliases || []).join(" "));

            return !search || family.includes(search) || aliases.includes(search);
        });

    if (count) {
        count.textContent = "(" + families.length + ")";
    }

    list.innerHTML = "";

    if (families.length === 0) {
        list.innerHTML = `
            <div style="padding:24px;text-align:center;color:#64748b;">
                No families found.
            </div>
        `;
        return;
    }

    families.forEach(function (item) {
        const family = normalizeMatchText(item.family);
        const aliases = (item.aliases || [])
            .map(normalizeMatchText)
            .filter(Boolean);

        const card = document.createElement("div");
        card.style.cssText = [
            "background:white",
            "border:1px solid #e2e8f0",
            "border-radius:10px",
            "padding:12px",
            "margin-bottom:8px",
            "display:flex",
            "justify-content:space-between",
            "gap:12px",
            "align-items:flex-start"
        ].join(";");

        card.innerHTML = `
            <div>
                <div style="font-weight:800;color:#166534;">🌸 ${family}</div>
                <div style="font-size:13px;color:#64748b;margin-top:5px;line-height:1.5;">
                    ${aliases.length > 0
                        ? "Aliases: " + aliases.join(", ")
                        : "No production aliases saved"}
                </div>
            </div>
            <div style="display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end;">
                <button type="button" class="edit-family-aliases-btn" style="
                    border:1px solid #d8b4d8;background:#fff7fc;color:#86156d;border-radius:8px;
                    padding:7px 10px;cursor:pointer;white-space:nowrap;
                ">Edit aliases</button>
                <button type="button" class="disable-family-btn" style="
                    border:1px solid #fecaca;background:#fff7f7;color:#b91c1c;border-radius:8px;
                    padding:7px 10px;cursor:pointer;white-space:nowrap;
                ">Disable</button>
                <button type="button" class="copy-family-name-btn" style="
                    border:1px solid #cbd5e1;background:white;color:#334155;border-radius:8px;
                    padding:7px 10px;cursor:pointer;white-space:nowrap;
                ">📋 Copy</button>
            </div>
        `;

        card.querySelector(".edit-family-aliases-btn")
            .addEventListener("click", async function () {
                const currentAliases = aliases.join(", ");
                const edited = window.prompt(
                    "Edit aliases for " + family + ". Separate aliases with commas. Remove a wrong alias from this list.",
                    currentAliases
                );

                if (edited === null) return;

                const cleanedAliases = String(edited)
                    .split(",")
                    .map(normalizeMatchText)
                    .filter(Boolean)
                    .filter(function (value, index, array) {
                        return array.indexOf(value) === index;
                    });

                const { error } = await supabaseClient
                    .from("flower_families")
                    .update({ aliases: cleanedAliases.join(", ") })
                    .eq("id", item.id);

                if (error) {
                    alert("The aliases could not be updated. " + error.message);
                    return;
                }

                await loadFlowerFamilies();
                renderProductsFamiliesList();
                alert("Aliases updated for " + family + ".");
            });

        card.querySelector(".disable-family-btn")
            .addEventListener("click", async function () {
                const confirmed = window.confirm(
                    "Disable " + family + "? It will disappear from Add Product and future family matching. Existing inventory records will not be deleted."
                );

                if (!confirmed) return;

                const { error } = await supabaseClient
                    .from("flower_families")
                    .update({ active: false })
                    .eq("id", item.id);

                if (error) {
                    alert("The family could not be disabled. " + error.message);
                    return;
                }

                if (productSelect?.options?.[family]) {
                    productSelect.removeOption(family);
                    productSelect.refreshOptions(false);
                }

                const catalogIndex = productsCatalog.indexOf(family);
                if (catalogIndex >= 0) productsCatalog.splice(catalogIndex, 1);

                await loadFlowerFamilies();
                renderProductsFamiliesList();
            });

        card.querySelector(".copy-family-name-btn")
            .addEventListener("click", async function () {
                try {
                    await navigator.clipboard.writeText(family);
                    this.textContent = "✓ Copied";
                    setTimeout(() => {
                        this.textContent = "📋 Copy";
                    }, 1000);
                } catch (error) {
                    alert("Could not copy the family name.");
                }
            });

        list.appendChild(card);
    });
}


function renderProductionRulesList() {
    const list = document.getElementById("productionRulesList");
    const searchInput = document.getElementById("productionRulesSearch");
    if (!list) return;

    const search = normalizeMatchText(searchInput?.value || "");
    const rules = (learnedProductionAliases || [])
        .filter(function (rule) {
            return !search ||
                normalizeMatchText(rule.alias).includes(search) ||
                normalizeMatchText(rule.family).includes(search);
        })
        .sort(function (a, b) {
            return String(a.alias || "").localeCompare(String(b.alias || ""));
        });

    list.innerHTML = "";

    if (rules.length === 0) {
        list.innerHTML = `<div style="padding:24px;text-align:center;color:#64748b;">No learned rules found.</div>`;
        return;
    }

    rules.forEach(function (rule) {
        const card = document.createElement("div");
        card.style.cssText = [
            "background:white",
            "border:1px solid #e2e8f0",
            "border-radius:10px",
            "padding:12px",
            "margin-bottom:8px",
            "display:flex",
            "justify-content:space-between",
            "gap:12px",
            "align-items:center"
        ].join(";");

        card.innerHTML = `
            <div style="min-width:0;">
                <div style="font-weight:800;color:#86156d;word-break:break-word;">${escapeProductionPickHtml(rule.alias || "")}</div>
                <div style="font-size:13px;color:#64748b;margin-top:4px;">
                    Assigned family: <strong>${escapeProductionPickHtml(rule.family || "")}</strong>
                </div>
            </div>
            <div style="display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end;">
                <button type="button" class="edit-production-rule-btn" style="border:1px solid #d8b4d8;background:#fff7fc;color:#86156d;border-radius:8px;padding:7px 10px;cursor:pointer;">Correct</button>
                <button type="button" class="remove-production-rule-btn" style="border:1px solid #fecaca;background:#fff7f7;color:#b91c1c;border-radius:8px;padding:7px 10px;cursor:pointer;">Remove</button>
            </div>`;

        card.querySelector(".edit-production-rule-btn").addEventListener("click", async function () {
            const families = getTeachFloraFlowFamilies();
            const correctedFamily = normalizeMatchText(window.prompt(
                "Correct family for " + rule.alias + ":\n\nExamples: CHRYSANTHEMUM, CURLY WILLOW, HYDRANGEA",
                rule.family || ""
            ));

            if (!correctedFamily) return;

            if (!families.includes(correctedFamily)) {
                const proceed = window.confirm(
                    correctedFamily + " is not currently in the family list. Save it anyway?"
                );
                if (!proceed) return;
            }

            const { error } = await supabaseClient
                .from("production_aliases")
                .update({
                    family: correctedFamily,
                    confirmed_by: getCurrentUserName(),
                    active: true
                })
                .eq("id", rule.id);

            if (error) {
                alert("The rule could not be corrected. " + error.message);
                return;
            }

            await loadProductionAliases();
            renderProductionRulesList();
            alert(rule.alias + " now maps to " + correctedFamily + ".");
        });

        card.querySelector(".remove-production-rule-btn").addEventListener("click", async function () {
            const confirmed = window.confirm(
                "Remove the learned rule " + rule.alias + " → " + rule.family + "? FloraFlow will stop forcing this assignment."
            );
            if (!confirmed) return;

            const { error } = await supabaseClient
                .from("production_aliases")
                .update({ active: false })
                .eq("id", rule.id);

            if (error) {
                alert("The rule could not be removed. " + error.message);
                return;
            }

            await loadProductionAliases();
            renderProductionRulesList();
        });

        list.appendChild(card);
    });
}

async function saveNewProductFamilyFromSettings() {
    const familyInput = document.getElementById("newProductFamilyInput");
    const aliasesInput = document.getElementById("newProductAliasesInput");
    const saveButton = document.getElementById("saveNewProductFamilyBtn");
    const message = document.getElementById("productsManagementMessage");

    const family = normalizeMatchText(familyInput?.value || "");
    const aliases = String(aliasesInput?.value || "")
        .split(",")
        .map(normalizeMatchText)
        .filter(Boolean)
        .filter(function (alias, index, array) {
            return array.indexOf(alias) === index;
        });

    if (!family) {
        alert("Enter the product family name.");
        familyInput?.focus();
        return;
    }

    saveButton.disabled = true;
    saveButton.textContent = "Saving...";
    message.textContent = "";

    try {
        const { data: existingRows, error: selectError } = await supabaseClient
            .from("flower_families")
            .select("family, aliases")
            .ilike("family", family)
            .limit(1);

        if (selectError) {
            throw selectError;
        }

        if (existingRows && existingRows.length > 0) {
            const existingAliases = String(existingRows[0].aliases || "")
                .split(",")
                .map(normalizeMatchText)
                .filter(Boolean);

            const mergedAliases = Array.from(
                new Set(existingAliases.concat(aliases))
            );

            const { error: updateError } = await supabaseClient
                .from("flower_families")
                .update({
                    aliases: mergedAliases.join(", "),
                    active: true
                })
                .ilike("family", family);

            if (updateError) {
                throw updateError;
            }

            message.textContent = family + " already existed. Its aliases were updated.";
        } else {
            const { error: insertError } = await supabaseClient
                .from("flower_families")
                .insert([{
                    family: family,
                    aliases: aliases.join(", "),
                    active: true
                }]);

            if (insertError) {
                throw insertError;
            }

            message.textContent = family + " was added successfully.";
        }

        message.style.color = "#166534";

        familyInput.value = "";
        aliasesInput.value = "";

        await loadFlowerFamilies();
        renderProductsFamiliesList();

        message.textContent += " It is now available in Add Product, Today's Production and Teach FloraFlow.";

    } catch (error) {
        console.error("Products management save error:", error);
        message.style.color = "#b91c1c";
        message.textContent = "Could not save the product.";
        alert(
            "The product could not be saved. " +
            (error?.message || String(error))
        );
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = "💾 Save Product";
    }
}

if (productsBtn) {
    productsBtn.addEventListener("click", async function () {
        const overlay = ensureProductsManagementModal();
        overlay.style.display = "block";
        settingsModal.style.display = "none";
        await refreshProductsManagementData();
        document.getElementById("newProductFamilyInput")?.focus();
    });
}


// ============================================================
// PRODUCTION PICK LINKS AND SHARED CONFIRMATION WORKFLOW
// ============================================================

function createProductionPickToken() {
    if (window.crypto?.randomUUID) {
        return window.crypto.randomUUID().replace(/-/g, "").toUpperCase();
    }

    return (
        Date.now().toString(36) +
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2)
    ).toUpperCase();
}

function getProductionPickLink(token) {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("pick", token);
    return url.toString();
}

async function loadActiveProductionReservations() {
    const { data, error } = await supabaseClient
        .from(PRODUCTION_PICK_ITEM_TABLE)
        .select("inventory_id, pick_list_id, reserved_quantity, status")
        .in("status", ["RESERVED", "PENDING"]);

    if (error) {
        console.warn("Could not load active production reservations:", error);
        activeProductionReservations = new Map();
        return;
    }

    activeProductionReservations = new Map();

    (data || []).forEach(function (item) {
        const inventoryId = String(item.inventory_id ?? "");

        if (!inventoryId) {
            return;
        }

        activeProductionReservations.set(inventoryId, {
            pickListId: item.pick_list_id,
            quantity: Number(item.reserved_quantity || 0),
            status: item.status
        });
    });
}

async function createProductionPickList(productionOrderNumber, selectedMatches) {
    const normalizedOrder = normalizeProductionOrderNumber(
        productionOrderNumber
    );

    if (!normalizedOrder) {
        throw new Error("Confirm the Production Order number first.");
    }

    const uniqueMatches = [];
    const seenIds = new Set();

    selectedMatches.forEach(function (match) {
        const inventoryId = String(match?.id ?? "");

        if (!inventoryId || seenIds.has(inventoryId)) {
            return;
        }

        seenIds.add(inventoryId);
        uniqueMatches.push(match);
    });

    if (uniqueMatches.length === 0) {
        throw new Error("Select at least one leftover product.");
    }

    await loadActiveProductionReservations();

    const alreadyReserved = uniqueMatches.find(function (match) {
        return activeProductionReservations.has(String(match.id));
    });

    if (alreadyReserved) {
        throw new Error(
            "Case " + (alreadyReserved.caseNumber || "") +
            " is already reserved for another production list. Refresh and try again."
        );
    }

    const token = createProductionPickToken();

    const { data: pickList, error: listError } = await supabaseClient
        .from(PRODUCTION_PICK_LIST_TABLE)
        .insert([{
            token: token,
            production_order: normalizedOrder,
            status: "PENDING",
            created_by: currentUser || "Unknown"
        }])
        .select("id, token, production_order")
        .single();

    if (listError) {
        throw listError;
    }

    const rows = uniqueMatches.map(function (match) {
        return {
            pick_list_id: pickList.id,
            inventory_id: match.id,
            product: match.product || match.requestedProduct || "",
            color: match.color || match.requestedColor || "",
            case_number: match.caseNumber || "",
            date_received: match.date || null,
            available_quantity: Number(match.quantity || 0),
            reserved_quantity: Number(match.quantity || 0),
            article_name: match.articleName || "",
            status: "RESERVED"
        };
    });

    const { error: itemError } = await supabaseClient
        .from(PRODUCTION_PICK_ITEM_TABLE)
        .insert(rows);

    if (itemError) {
        await supabaseClient
            .from(PRODUCTION_PICK_LIST_TABLE)
            .delete()
            .eq("id", pickList.id);
        throw itemError;
    }

    await loadActiveProductionReservations();

    return {
        id: pickList.id,
        token: token,
        order: normalizedOrder,
        link: getProductionPickLink(token)
    };
}

function buildProductionPickShareText(productionOrderNumber, selectedMatches, link) {
    const lines = [
        "FLORAFLOW - PRODUCTION PICK LIST",
        "Production Order: " + productionOrderNumber,
        "",
        "Products reserved:"
    ];

    selectedMatches.forEach(function (match, index) {
        lines.push(
            (index + 1) + ". " +
            (match.product || match.requestedProduct || "Product") +
            " | " +
            (match.color || match.requestedColor || "No color") +
            " | Case " +
            (match.caseNumber || "Not specified") +
            " | " +
            (match.quantity ?? 0) + " stems"
        );
    });

    lines.push("");
    lines.push("Open this link to confirm what was physically taken:");
    lines.push(link);

    return lines.join("\n");
}

async function shareProductionList(
    productionOrderNumber,
    selectedMatches,
    statusElement,
    shareButton,
    recipientIds = []
) {
    if (!Array.isArray(selectedMatches) || selectedMatches.length === 0) {
        alert("Select at least one leftover product first.");
        return;
    }

    const orderNumber = normalizeProductionOrderNumber(
        productionOrderInput?.value || productionOrderNumber
    );

    if (!orderNumber) {
        alert("Confirm the Production Order number before creating the pick list.");
        productionOrderInput?.focus();
        return;
    }

    const previousText = shareButton?.textContent || "Create & Share Pick List";

    if (shareButton) {
        shareButton.disabled = true;
        shareButton.textContent = "Creating reservation...";
    }

    if (statusElement) {
        statusElement.textContent =
            "Reserving the selected boxes so they cannot appear in another order...";
    }

    try {
        const pickList = await createProductionPickList(
            orderNumber,
            selectedMatches
        );

        await assignProductionPickListInternally(
            pickList,
            recipientIds
        );

        const shareText = buildProductionPickShareText(
            orderNumber,
            selectedMatches,
            pickList.link
        );

        let externalShareCancelled = false;

        // Internal delivery and external sharing are separate actions.
        // When recipients were selected, do not force the phone/computer share menu.
        if (recipientIds.length === 0) {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: "Production Order " + orderNumber,
                        text: shareText
                    });
                } catch (error) {
                    if (error?.name === "AbortError") {
                        externalShareCancelled = true;
                    } else {
                        throw error;
                    }
                }
            } else {
                await navigator.clipboard.writeText(shareText);
            }
        }

        if (statusElement) {
            statusElement.innerHTML = `
                <div style="padding:12px;border:1px solid #86efac;border-radius:10px;background:#f0fdf4;">
                    <strong>Pick list created and boxes reserved.</strong><br>
                    ${recipientIds.length
                        ? `<span>Sent internally to ${recipientIds.length} user(s). They will receive it in FloraFlow.</span><br>`
                        : externalShareCancelled
                            ? `<span>The external share window was closed, but the Pick List was still created.</span><br>`
                            : `<span>The Pick List is ready to share.</span><br>`}
                    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:9px;">
                        <a href="${pickList.link}" target="_blank" rel="noopener" style="font-weight:800;">
                            Open confirmation link
                        </a>
                        <button type="button" class="copy-created-pick-link" style="padding:7px 10px;">
                            Copy link
                        </button>
                        <button type="button" class="share-created-pick-list" style="padding:7px 10px;">
                            Share externally
                        </button>
                    </div>
                </div>
            `;

            const copyButton = statusElement.querySelector(".copy-created-pick-link");
            const externalShareButton = statusElement.querySelector(".share-created-pick-list");

            copyButton?.addEventListener("click", async function () {
                await navigator.clipboard.writeText(pickList.link);
                copyButton.textContent = "Copied";
                setTimeout(function () {
                    copyButton.textContent = "Copy link";
                }, 1200);
            });

            externalShareButton?.addEventListener("click", async function () {
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: "Production Order " + orderNumber,
                            text: shareText
                        });
                    } catch (error) {
                        if (error?.name !== "AbortError") {
                            alert("The Pick List could not be shared. " + (error?.message || String(error)));
                        }
                    }
                } else {
                    await navigator.clipboard.writeText(shareText);
                    externalShareButton.textContent = "Copied";
                    setTimeout(function () {
                        externalShareButton.textContent = "Share externally";
                    }, 1200);
                }
            });
        }

        await loadActiveProductionReservations();
        await loadInventoryFromSupabase();

        // Keep the confirmation and link visible. The user can close or refresh
        // Today's Production manually when finished reviewing the created list.

    } catch (error) {
        console.error("Production pick-list error:", error);
        alert(
            "The pick list could not be created. " +
            (error?.message || String(error))
        );

        if (statusElement) {
            statusElement.textContent = "The pick list was not created.";
        }
    } finally {
        if (shareButton) {
            shareButton.disabled = false;
            shareButton.textContent = previousText;
        }
    }
}

function appendProductionShareControls(
    resultsContainer,
    matches,
    productionOrderNumber
) {
    const foundCount = matches.filter(function (match) {
        return match?.inventoryFound;
    }).length;

    if (foundCount === 0) {
        return;
    }

    const controls = document.createElement("div");
    controls.style.cssText = `
        background:white;
        border:1px solid #bbf7d0;
        border-radius:14px;
        padding:14px;
        margin-bottom:15px;
        box-shadow:0 2px 8px rgba(15,23,42,.06);
    `;

    controls.innerHTML = `
        <div style="font-weight:800;margin-bottom:5px;color:#14532d;">
            Create production pick list
        </div>
        <div style="font-size:13px;color:#475569;margin-bottom:11px;line-height:1.5;">
            Selected boxes will be reserved immediately and removed from future recommendations.
            The shared link lets the warehouse confirm quantities and destination.
        </div>
        <div class="production-internal-recipients" style="margin-bottom:12px;">
            <div style="font-size:13px;font-weight:800;color:#334155;margin-bottom:7px;">Send internally to</div>
            <div class="production-recipient-list" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
            <div style="font-size:12px;color:#64748b;margin-top:6px;">Optional. Selected users receive a notification inside FloraFlow.</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <button type="button" class="production-select-all">Select All</button>
            <button type="button" class="production-clear-selection">Clear</button>
            <button type="button" class="production-share-list" style="
                font-weight:800;
                background:#166534;
                color:white;
                border:none;
                border-radius:9px;
                padding:10px 14px;
            ">
                Create & Share Pick List
            </button>
            <span class="production-share-count" style="font-size:13px;color:#475569;"></span>
        </div>
        <div class="production-share-status" style="font-size:13px;color:#166534;margin-top:9px;line-height:1.5;"></div>
    `;

    resultsContainer.appendChild(controls);

    const countElement = controls.querySelector(".production-share-count");
    const statusElement = controls.querySelector(".production-share-status");
    const shareButton = controls.querySelector(".production-share-list");
    const recipientList = controls.querySelector(".production-recipient-list");

    getAssignableAppUsers().forEach(function (user) {
        const label = document.createElement("label");
        label.style.cssText = "display:flex;align-items:center;gap:6px;padding:8px 10px;border:1px solid #cbd5e1;border-radius:999px;background:#f8fafc;font-size:13px;cursor:pointer;";
        label.innerHTML = `
            <input type="checkbox" class="production-recipient-checkbox" value="${escapeProductionPickHtml(user.id)}">
            <span>${escapeProductionPickHtml(user.full_name || user.email || "User")}</span>
        `;
        recipientList.appendChild(label);
    });

    if (getAssignableAppUsers().length === 0) {
        recipientList.innerHTML = `<span style="font-size:13px;color:#64748b;">No other active users are available.</span>`;
    }

    const updateCount = function () {
        const selected = getSelectedProductionMatches(resultsContainer, matches);
        countElement.textContent = selected.length + " of " + foundCount + " selected";
    };

    controls.querySelector(".production-select-all")
        .addEventListener("click", function () {
            resultsContainer.querySelectorAll(".production-share-checkbox")
                .forEach(function (checkbox) {
                    checkbox.checked = true;
                });
            updateCount();
        });

    controls.querySelector(".production-clear-selection")
        .addEventListener("click", function () {
            resultsContainer.querySelectorAll(".production-share-checkbox")
                .forEach(function (checkbox) {
                    checkbox.checked = false;
                });
            updateCount();
        });

    shareButton.addEventListener("click", async function () {
        const selected = getSelectedProductionMatches(resultsContainer, matches);
        const recipientIds = Array.from(
            controls.querySelectorAll(".production-recipient-checkbox:checked")
        ).map(function (checkbox) {
            return checkbox.value;
        });

        await shareProductionList(
            productionOrderNumber,
            selected,
            statusElement,
            shareButton,
            recipientIds
        );
    });

    resultsContainer.addEventListener("change", function (event) {
        if (event.target?.classList.contains("production-share-checkbox")) {
            updateCount();
        }
    });

    setTimeout(updateCount, 0);
}

function escapeProductionPickHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function fetchProductionPickList(token) {
    const { data: list, error: listError } = await supabaseClient
        .from(PRODUCTION_PICK_LIST_TABLE)
        .select("id, token, production_order, status, created_by, created_at, completed_by, completed_at")
        .eq("token", token)
        .single();

    if (listError) {
        throw listError;
    }

    const { data: items, error: itemError } = await supabaseClient
        .from(PRODUCTION_PICK_ITEM_TABLE)
        .select("*")
        .eq("pick_list_id", list.id)
        .order("id", { ascending: true });

    if (itemError) {
        throw itemError;
    }

    return { list: list, items: items || [] };
}

function buildProductionPickPage(data) {
    const list = data.list;
    const items = data.items;
    const params = new URLSearchParams(window.location.search);
    const isManualPickup = params.get("mode") === "pickup" || String(list.production_order || "").startsWith("99");
    const isClosed = list.status === "COMPLETED" || list.status === "CANCELLED";
    const requiresAcceptance = !isClosed && list.status === "PENDING";

    const overlay = document.createElement("div");
    overlay.id = "productionPickPage";
    overlay.style.cssText = `
        position:fixed;
        inset:0;
        z-index:99999;
        background:#f1f5f9;
        overflow:auto;
        padding:18px;
        box-sizing:border-box;
    `;

    overlay.innerHTML = `
        <div style="max-width:780px;margin:0 auto;">
            <div style="position:relative;background:white;border-radius:18px;padding:18px 64px 18px 18px;box-shadow:0 8px 30px rgba(15,23,42,.1);margin-bottom:14px;">
                <button type="button" id="pickPageCloseButton" aria-label="Close confirmation" title="Close" style="position:absolute;top:12px;right:12px;width:42px;height:42px;padding:0;border:0;border-radius:12px;background:#f4e8f1;color:#6f155e;font-size:27px;line-height:1;display:grid;place-items:center;">×</button>
                <div style="font-size:13px;font-weight:800;letter-spacing:.08em;color:#8a0f75;text-transform:uppercase;">
                    ${isManualPickup ? "FloraFlow Pickup Request" : "FloraFlow Pick Confirmation"}
                </div>
                <h1 style="font-size:25px;margin:6px 0;color:#0f172a;">
                    ${isManualPickup ? "Leftover Pickup" : "Production Order #" + escapeProductionPickHtml(list.production_order)}
                </h1>
                <div style="font-size:14px;color:#64748b;line-height:1.6;">
                    Created by ${escapeProductionPickHtml(list.created_by || "Unknown")}<br>
                    Status: <strong>${escapeProductionPickHtml(list.status)}</strong>
                </div>
            </div>

            <div style="background:white;border-radius:18px;padding:16px;box-shadow:0 8px 30px rgba(15,23,42,.08);">
                ${isClosed ? `
                    <div style="padding:18px;border-radius:12px;background:#ecfdf5;color:#166534;font-weight:800;text-align:center;">
                        ${list.status === "CANCELLED" ? "This order was closed because no product was taken." : "This pick list has already been completed."}
                    </div>
                ` : `
                    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
                        <button type="button" id="pickSelectAll" style="padding:10px 14px;">Select All</button>
                        <button type="button" id="pickClearAll" style="padding:10px 14px;">Clear</button>
                    </div>
                    <div style="font-size:13px;color:#64748b;margin-bottom:14px;line-height:1.5;">
                        ${requiresAcceptance
                            ? "Accept this task to reveal the case number. Product, color, quantity and date remain visible."
                            : "Check the products physically taken. Unchecked products will be released back to inventory."}
                    </div>
                    ${requiresAcceptance ? `
                        <button type="button" id="pickAcceptButton" style="width:100%;margin-bottom:14px;padding:14px;border-radius:12px;background:#173f35;color:white;font-weight:800;">
                            Accept Task &amp; View Case Number
                        </button>
                    ` : ""}
                `}
                <div id="pickItems"></div>
                ${isClosed ? "" : `
                    <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e2e8f0;">
                        <div style="padding:11px 12px;border:1px solid #cbd5e1;border-radius:10px;margin-bottom:12px;background:#f8fafc;">
                            <div style="font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;">Confirmed by</div>
                            <div id="pickConfirmedByName" style="font-weight:800;color:#0f172a;margin-top:3px;"></div>
                        </div>
                        <label style="display:flex;gap:9px;align-items:flex-start;font-size:14px;line-height:1.45;margin-bottom:14px;">
                            <input type="checkbox" id="pickPhysicalCheck" style="width:19px;height:19px;margin-top:1px;">
                            I physically verified which products were taken and the quantities shown below.
                        </label>
                        <div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:stretch;">
                            <button type="button" id="pickConfirmButton" disabled style="
                                width:100%;padding:14px;border:none;border-radius:11px;background:#8a0f75;color:white;font-size:16px;font-weight:800;
                            ">
                                Confirm Pick and Update Inventory
                            </button>
                            <button type="button" id="pickCloseWithoutPickupButton" style="padding:12px 14px;border:1px solid #d8bfd2;border-radius:11px;background:#fff7fb;color:#6f155e;font-weight:800;">
                                Nothing Taken
                            </button>
                        </div>
                        <div id="pickPageStatus" style="margin-top:10px;font-size:14px;color:#475569;"></div>
                    </div>
                `}
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    const closePickPage = function () {
        overlay.remove();
        document.body.style.overflow = "";
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
    };

    overlay.querySelector("#pickPageCloseButton")?.addEventListener("click", closePickPage);

    const itemsContainer = overlay.querySelector("#pickItems");

    items.forEach(function (item) {
        const available = Number(item.available_quantity || 0);
        const completed = item.status !== "RESERVED" && item.status !== "PENDING";
        const card = document.createElement("div");
        card.className = "production-pick-item";
        card.dataset.itemId = item.id;
        card.dataset.inventoryId = item.inventory_id;
        card.style.cssText = `
            border:1px solid #dbe4ea;
            border-radius:14px;
            padding:14px;
            margin-bottom:12px;
            background:${completed ? "#f8fafc" : "white"};
        `;

        card.innerHTML = `
            <label style="display:flex;gap:10px;align-items:flex-start;cursor:${isClosed ? "default" : "pointer"};">
                ${isClosed ? "" : `<input type="checkbox" class="pick-item-selected" checked style="width:20px;height:20px;margin-top:3px;">`}
                <div style="flex:1;min-width:0;">
                    <div style="font-size:18px;font-weight:800;color:#0f172a;">
                        ${escapeProductionPickHtml(item.product)}
                    </div>
                    <div style="font-size:14px;color:#475569;line-height:1.6;margin-top:4px;">
                        Color: ${escapeProductionPickHtml(item.color || "Not specified")}<br>
                        Case: <span class="pick-case-value" data-case="${escapeProductionPickHtml(item.case_number || "Not specified")}">${requiresAcceptance ? "••••••" : escapeProductionPickHtml(item.case_number || "Not specified")}</span><br>
                        Available: ${available} stems<br>
                        Date received: ${escapeProductionPickHtml(formatProductionShareDate(item.date_received))}
                    </div>
                </div>
            </label>
            ${isClosed ? `
                <div style="margin-top:10px;font-weight:700;color:#166534;">
                    ${escapeProductionPickHtml(item.status)} — ${Number(item.quantity_taken || 0)} stems
                </div>
            ` : `
                <div class="pick-item-controls" style="display:grid;grid-template-columns:minmax(110px,1fr) minmax(150px,1fr);gap:10px;margin-top:12px;">
                    <label style="font-size:13px;font-weight:700;">
                        Stems taken
                        <input type="number" class="pick-quantity" min="0" max="${available}" value="${available}" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid #cbd5e1;border-radius:9px;margin-top:5px;">
                    </label>
                    <label style="font-size:13px;font-weight:700;">
                        Destination
                        <select class="pick-destination" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:9px;margin-top:5px;">
                            <option value="PRODUCTION">Production</option>
                            <option value="OLD">OLD</option>
                            <option value="QC_REVIEW">QC Review</option>
                            <option value="SAMPLES">Samples</option>
                            <option value="NOT_TAKEN">Not taken / Order changed</option>
                        </select>
                    </label>
                </div>
            `}
        `;

        itemsContainer.appendChild(card);
    });

    if (isClosed) {
        return overlay;
    }

    const acceptButton = overlay.querySelector("#pickAcceptButton");
    if (acceptButton) {
        overlay.querySelectorAll(".pick-item-controls, #pickSelectAll, #pickClearAll, #pickPhysicalCheck, #pickConfirmButton").forEach(function (element) {
            element.style.display = "none";
        });
        acceptButton.addEventListener("click", async function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (acceptButton.dataset.accepting === "true") {
                return;
            }

            acceptButton.dataset.accepting = "true";
            acceptButton.disabled = true;
            acceptButton.textContent = "Accepting task...";

            try {
                const { data: acceptedList, error } = await supabaseClient
                    .from(PRODUCTION_PICK_LIST_TABLE)
                    .update({ status: "IN_PROGRESS" })
                    .eq("id", list.id)
                    .eq("status", "PENDING")
                    .select("id, status")
                    .maybeSingle();

                if (error) throw error;

                // The task may already have been accepted in another tab/device.
                // In either case, keep this confirmation page open and reveal the case.
                list.status = acceptedList?.status || "IN_PROGRESS";

                const caseValues = Array.from(
                    overlay.querySelectorAll(".pick-case-value")
                );

                caseValues.forEach(function (element) {
                    element.textContent = element.dataset.case || "Not specified";
                    element.style.fontWeight = "900";
                    element.style.color = "#8a0f75";
                    element.style.background = "#fff1f8";
                    element.style.padding = "2px 7px";
                    element.style.borderRadius = "7px";
                });

                overlay.querySelectorAll(
                    ".pick-item-controls, #pickSelectAll, #pickClearAll, #pickPhysicalCheck, #pickConfirmButton"
                ).forEach(function (element) {
                    element.style.display = "";
                });

                const instruction = acceptButton.previousElementSibling;
                if (instruction) {
                    instruction.textContent =
                        "Task accepted. The case number is now visible. Confirm what was physically taken when finished.";
                    instruction.style.color = "#166534";
                    instruction.style.fontWeight = "800";
                }

                const acceptedNotice = document.createElement("div");
                acceptedNotice.id = "pickAcceptedNotice";
                acceptedNotice.style.cssText =
                    "margin:0 0 14px;padding:12px 14px;border:1px solid #86efac;border-radius:12px;background:#ecfdf5;color:#166534;font-weight:800;line-height:1.45;";
                acceptedNotice.textContent =
                    "Task accepted. Case number revealed below — this page will remain open until you close or confirm it.";
                acceptButton.replaceWith(acceptedNotice);

                const firstCase = caseValues[0];
                if (firstCase) {
                    setTimeout(function () {
                        firstCase.closest(".production-pick-item")?.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });
                    }, 80);
                }
            } catch (error) {
                acceptButton.dataset.accepting = "false";
                acceptButton.disabled = false;
                acceptButton.textContent = "Accept Task & View Case Number";
                alert("The task could not be accepted. " + (error?.message || String(error)));
            }
        });
    }

    const confirmedByName = overlay.querySelector("#pickConfirmedByName");
    if (confirmedByName) {
        confirmedByName.textContent = getCurrentUserName();
    }

    const toggleCardControls = function (card) {
        const selected = card.querySelector(".pick-item-selected")?.checked;
        const controls = card.querySelector(".pick-item-controls");
        if (controls) {
            controls.style.opacity = selected ? "1" : ".45";
            controls.querySelectorAll("input, select").forEach(function (field) {
                field.disabled = !selected;
            });
        }
    };

    overlay.querySelectorAll(".production-pick-item").forEach(toggleCardControls);

    overlay.addEventListener("change", function (event) {
        if (event.target.classList.contains("pick-item-selected")) {
            toggleCardControls(event.target.closest(".production-pick-item"));
        }
    });

    overlay.querySelector("#pickSelectAll").addEventListener("click", function () {
        overlay.querySelectorAll(".pick-item-selected").forEach(function (checkbox) {
            checkbox.checked = true;
            toggleCardControls(checkbox.closest(".production-pick-item"));
        });
    });

    overlay.querySelector("#pickClearAll").addEventListener("click", function () {
        overlay.querySelectorAll(".pick-item-selected").forEach(function (checkbox) {
            checkbox.checked = false;
            toggleCardControls(checkbox.closest(".production-pick-item"));
        });
    });

    const physicalCheck = overlay.querySelector("#pickPhysicalCheck");
    const confirmButton = overlay.querySelector("#pickConfirmButton");
    physicalCheck.addEventListener("change", function () {
        confirmButton.disabled = !physicalCheck.checked;
    });

    confirmButton.addEventListener("click", async function () {
        await confirmProductionPickList(
            list,
            items,
            overlay,
            getCurrentUserName()
        );
    });

    const closeWithoutPickupButton = overlay.querySelector("#pickCloseWithoutPickupButton");
    closeWithoutPickupButton?.addEventListener("click", async function () {
        if (!confirm("Close this order because nothing was taken? All reserved products will return to available inventory.")) return;
        closeWithoutPickupButton.disabled = true;
        closeWithoutPickupButton.textContent = "Closing...";
        const statusElement = overlay.querySelector("#pickPageStatus");
        try {
            const now = new Date().toISOString();
            const itemUpdates = items.map(function (item) {
                return supabaseClient
                    .from(PRODUCTION_PICK_ITEM_TABLE)
                    .update({
                        status: "NOT_TAKEN",
                        destination: "NOT_TAKEN",
                        quantity_taken: 0,
                        confirmed_by: getCurrentUserName(),
                        confirmed_at: now
                    })
                    .eq("id", item.id);
            });
            const itemResults = await Promise.all(itemUpdates);
            const itemFailure = itemResults.find(function (result) { return result.error; });
            if (itemFailure) throw itemFailure.error;

            const { error: listError } = await supabaseClient
                .from(PRODUCTION_PICK_LIST_TABLE)
                .update({
                    status: "CANCELLED",
                    completed_by: getCurrentUserName(),
                    completed_at: now
                })
                .eq("id", list.id)
                .in("status", ["PENDING", "IN_PROGRESS"]);
            if (listError) throw listError;

            await Promise.all([
                loadActiveProductionReservations(),
                loadInventoryFromSupabase(),
                loadHistoryFromSupabase()
            ]);
            if (typeof loadProductionProgressLists === "function") {
                loadProductionProgressLists();
            }
            statusElement.innerHTML = '<div style="padding:14px;border-radius:10px;background:#fff7fb;color:#6f155e;font-weight:800;">Order closed. Nothing was taken and all reservations were released.</div>';
            closeWithoutPickupButton.textContent = "Closed";
        } catch (error) {
            console.error("Close order error:", error);
            closeWithoutPickupButton.disabled = false;
            closeWithoutPickupButton.textContent = "Nothing Taken";
            alert("The order could not be closed. " + (error?.message || String(error)));
        }
    });

    return overlay;
}

async function confirmProductionPickList(list, items, overlay, confirmedBy) {
    const statusElement = overlay.querySelector("#pickPageStatus");
    const confirmButton = overlay.querySelector("#pickConfirmButton");
    const decisions = [];

    for (const item of items) {
        const card = overlay.querySelector(
            `.production-pick-item[data-item-id="${item.id}"]`
        );
        const selected = Boolean(card?.querySelector(".pick-item-selected")?.checked);
        const available = Number(item.available_quantity || 0);
        const quantity = selected
            ? Number(card.querySelector(".pick-quantity").value || 0)
            : 0;
        const destination = selected
            ? card.querySelector(".pick-destination").value
            : "RETURN";

        if (selected && destination !== "NOT_TAKEN" && (!Number.isFinite(quantity) || quantity <= 0 || quantity > available)) {
            alert(
                "Enter a valid quantity for " + item.product +
                " between 1 and " + available + "."
            );
            return;
        }

        decisions.push({ item, selected, quantity, destination });
    }

    const selectedCount = decisions.filter(function (decision) {
        return decision.selected;
    }).length;

    if (!confirm(
        selectedCount + " product(s) will be processed. " +
        (decisions.length - selectedCount) +
        " unselected product(s) will return to available inventory. Continue?"
    )) {
        return;
    }

    confirmButton.disabled = true;
    confirmButton.textContent = "Updating inventory...";
    statusElement.textContent = "Saving the confirmation. Do not close this page.";

    try {
        const { data: claimedList, error: claimError } = await supabaseClient
            .from(PRODUCTION_PICK_LIST_TABLE)
            .update({
                status: "PROCESSING",
                completed_by: confirmedBy
            })
            .eq("id", list.id)
            .in("status", ["PENDING", "IN_PROGRESS"])
            .select("id")
            .maybeSingle();

        if (claimError) {
            throw claimError;
        }

        if (!claimedList) {
            throw new Error("This pick list was already processed by another user.");
        }

        for (const decision of decisions) {
            const item = decision.item;

            if (!decision.selected || decision.destination === "NOT_TAKEN") {
                const notTaken = decision.destination === "NOT_TAKEN";
                const { error } = await supabaseClient
                    .from(PRODUCTION_PICK_ITEM_TABLE)
                    .update({
                        status: notTaken ? "NOT_TAKEN" : "RETURNED",
                        destination: notTaken ? "NOT_TAKEN" : "RETURN",
                        quantity_taken: 0,
                        confirmed_by: confirmedBy,
                        confirmed_at: new Date().toISOString()
                    })
                    .eq("id", item.id);

                if (error) throw error;
                continue;
            }

            const inventoryItem = inventory.find(function (candidate) {
                return String(candidate.id) === String(item.inventory_id);
            });

            let currentQuantity = inventoryItem
                ? Number(inventoryItem.quantity || 0)
                : Number(item.available_quantity || 0);

            const newQuantity = Math.max(0, currentQuantity - decision.quantity);
            const newStatus = newQuantity === 0
                ? "Removed from Inventory"
                : "Available";

            const { error: inventoryError } = await supabaseClient
                .from("inventory")
                .update({
                    quantity: newQuantity,
                    status: newStatus
                })
                .eq("id", item.inventory_id)
                .eq("quantity", currentQuantity);

            if (inventoryError) {
                throw inventoryError;
            }

            const action = decision.destination === "PRODUCTION"
                ? "ROTATE"
                : "REMOVE";

            await addHistory(
                item.inventory_id,
                action,
                item.product,
                item.color,
                item.case_number,
                currentQuantity,
                decision.quantity,
                newQuantity,
                "Production Order #" + list.production_order +
                " | Destination: " + decision.destination +
                " | Confirmed from Pick Link"
            );

            const { error: itemUpdateError } = await supabaseClient
                .from(PRODUCTION_PICK_ITEM_TABLE)
                .update({
                    status: "COMPLETED",
                    destination: decision.destination,
                    quantity_taken: decision.quantity,
                    confirmed_by: confirmedBy,
                    confirmed_at: new Date().toISOString()
                })
                .eq("id", item.id);

            if (itemUpdateError) throw itemUpdateError;
        }

        const { error: completeError } = await supabaseClient
            .from(PRODUCTION_PICK_LIST_TABLE)
            .update({
                status: "COMPLETED",
                completed_by: confirmedBy,
                completed_at: new Date().toISOString()
            })
            .eq("id", list.id);

        if (completeError) {
            throw completeError;
        }

        await loadActiveProductionReservations();
        await loadInventoryFromSupabase();
        await loadHistoryFromSupabase();

        statusElement.innerHTML = `
            <div style="padding:14px;border-radius:10px;background:#ecfdf5;color:#166534;font-weight:800;">
                Pick confirmed. Inventory and activity history were updated.
            </div>
        `;
        confirmButton.textContent = "Completed";

        setTimeout(function () {
            overlay.remove();
            document.body.style.overflow = "";
            window.history.replaceState({}, "", window.location.origin + window.location.pathname);
            if (typeof loadProductionProgressLists === "function") {
                loadProductionProgressLists();
            }
        }, 350);

    } catch (error) {
        console.error("Pick confirmation error:", error);

        await supabaseClient
            .from(PRODUCTION_PICK_LIST_TABLE)
            .update({ status: list.status === "IN_PROGRESS" ? "IN_PROGRESS" : "PENDING" })
            .eq("id", list.id)
            .eq("status", "PROCESSING");

        confirmButton.disabled = false;
        confirmButton.textContent = "Confirm Pick and Update Inventory";
        statusElement.textContent = "The confirmation failed. Nothing else should be changed until this is reviewed.";
        alert(
            "The pick could not be confirmed. " +
            (error?.message || String(error))
        );
    }
}

async function openProductionPickListFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const token = normalizeMatchText(params.get("pick") || "").replace(/\s/g, "");

    if (!token) {
        return;
    }

    try {
        const data = await fetchProductionPickList(token);
        buildProductionPickPage(data);
    } catch (error) {
        console.error("Could not open production pick list:", error);
        alert(
            "This pick-list link is invalid, expired, or unavailable. " +
            (error?.message || "")
        );
    }
}

let productionProgressRefreshTimer = null;
let productionProgressLists = [];

function getProductionProgressLabel(status) {
    const value = String(status || "PENDING").toUpperCase();
    const labels = {
        PENDING: "Waiting",
        IN_PROGRESS: "In progress",
        PROCESSING: "Updating inventory",
        COMPLETED: "Completed",
        CANCELLED: "Cancelled"
    };
    return labels[value] || value.replace(/_/g, " ");
}

function getProductionProgressColors(status) {
    const value = String(status || "PENDING").toUpperCase();
    const colors = {
        PENDING: { background: "#fff7ed", text: "#9a3412", border: "#fdba74" },
        IN_PROGRESS: { background: "#eff6ff", text: "#1d4ed8", border: "#93c5fd" },
        PROCESSING: { background: "#faf5ff", text: "#7e22ce", border: "#d8b4fe" },
        COMPLETED: { background: "#ecfdf5", text: "#166534", border: "#86efac" },
        CANCELLED: { background: "#f8fafc", text: "#475569", border: "#cbd5e1" }
    };
    return colors[value] || colors.PENDING;
}

function calculateProductionPickProgress(items) {
    const list = Array.isArray(items) ? items : [];
    const total = list.length;
    const resolvedStatuses = new Set(["COMPLETED", "RETURNED", "CANCELLED", "NOT_TAKEN"]);
    const resolved = list.filter(function (item) {
        return resolvedStatuses.has(String(item.status || "").toUpperCase());
    }).length;
    const percentage = total > 0 ? Math.round((resolved / total) * 100) : 0;
    return { total: total, resolved: resolved, percentage: percentage };
}

function formatProgressCenterTime(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function ensureProductionProgressCenter() {
    let launcher = document.getElementById("floraFlowProductionProgressLauncher");
    if (launcher) return launcher;

    if (!document.getElementById("floraFlowProductionProgressStyles")) {
        const style = document.createElement("style");
        style.id = "floraFlowProductionProgressStyles";
        style.textContent = `
            #floraFlowProductionProgressLauncher {
                position: fixed;
                top: 82px;
                right: 18px;
                z-index: 89990;
                border: 1px solid rgba(148,163,184,.35);
                border-radius: 14px;
                background: rgba(255,255,255,.97);
                box-shadow: 0 10px 30px rgba(15,23,42,.14);
                padding: 7px;
            }
            #floraFlowProductionProgressButton {
                min-height: 42px;
                border: 0;
                border-radius: 10px;
                background: #0f172a;
                color: white;
                font-weight: 800;
                padding: 0 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #floraFlowProductionProgressPanel {
                width: min(900px, calc(100vw - 32px));
                max-height: min(88vh, 860px);
                overflow-y: auto;
                overflow-x: hidden;
                overscroll-behavior: contain;
                -webkit-overflow-scrolling: touch;
                touch-action: pan-y;
                margin: 6vh auto 0;
                background: #f8fafc;
                border-radius: 20px;
                box-shadow: 0 24px 70px rgba(15,23,42,.3);
            }
            body.flora-progress-open {
                position: fixed;
                width: 100%;
                overflow: hidden;
                touch-action: none;
            }
            @media (max-width: 720px) {
                /* Progress is opened from the bottom navigation on phones. */
                #floraFlowProductionProgressLauncher {
                    display: none !important;
                }
                #floraFlowProductionProgressButton {
                    width: 52px;
                    height: 52px;
                    min-height: 52px;
                    border-radius: 999px;
                    padding: 0;
                    justify-content: center;
                    font-size: 0;
                }
                #floraFlowProductionProgressButton .progress-icon {
                    font-size: 22px;
                }
                #floraFlowProductionProgressPanel {
                    width: 100%;
                    max-height: 92vh;
                    margin: 8vh 0 0;
                    border-radius: 22px 22px 0 0;
                }
                #floraFlowProductionProgressOverlay {
                    padding: 0 !important;
                    align-items: flex-end;
                }
            }
        `;
        document.head.appendChild(style);
    }

    launcher = document.createElement("div");
    launcher.id = "floraFlowProductionProgressLauncher";
    launcher.innerHTML = `
        <button id="floraFlowProductionProgressButton" type="button" title="Production Progress">
            <span class="progress-icon">📋</span>
            <span>Production Progress</span>
            <span id="floraFlowProductionProgressBadge" style="display:none;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#dc2626;color:white;font-size:11px;align-items:center;justify-content:center;"></span>
        </button>
    `;
    document.body.appendChild(launcher);

    const overlay = document.createElement("div");
    overlay.id = "floraFlowProductionProgressOverlay";
    overlay.style.cssText = "display:none;position:fixed;inset:0;z-index:100010;background:rgba(15,23,42,.5);padding:18px;box-sizing:border-box;";
    overlay.innerHTML = `
        <section id="floraFlowProductionProgressPanel">
            <header style="position:sticky;top:0;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:17px 18px;background:white;border-bottom:1px solid #e2e8f0;">
                <div>
                    <div style="font-size:21px;font-weight:850;color:#0f172a;">Production Progress</div>
                    <div style="font-size:13px;color:#64748b;margin-top:2px;">Follow every Pick List from creation to confirmation.</div>
                </div>
                <div style="display:flex;gap:8px;align-items:center;">
                    <button type="button" id="floraFlowProductionProgressRefreshBtn">Refresh</button>
                    <button type="button" id="floraFlowProductionProgressCloseBtn" style="width:42px;height:42px;border:0;border-radius:11px;background:#e2e8f0;font-size:25px;cursor:pointer;">×</button>
                </div>
            </header>
            <div style="padding:14px;">
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
                    <button type="button" class="progress-filter-btn" data-filter="ACTIVE">Active</button>
                    <button type="button" class="progress-filter-btn" data-filter="COMPLETED">Completed</button>
                    <button type="button" class="progress-filter-btn" data-filter="ALL">All</button>
                </div>
                <div id="floraFlowProductionProgressStatus" style="min-height:20px;font-size:13px;color:#475569;margin-bottom:10px;"></div>
                <div id="floraFlowProductionProgressList"></div>
            </div>
        </section>
    `;
    document.body.appendChild(overlay);

    overlay.dataset.filter = "ACTIVE";

    let lockedScrollY = 0;

    const lockProgressBackground = function () {
        lockedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
        document.body.dataset.progressScrollY = String(lockedScrollY);
        document.body.style.top = "-" + lockedScrollY + "px";
        document.body.classList.add("flora-progress-open");
    };

    const unlockProgressBackground = function () {
        const savedScrollY = Number(document.body.dataset.progressScrollY || lockedScrollY || 0);
        document.body.classList.remove("flora-progress-open");
        document.body.style.top = "";
        delete document.body.dataset.progressScrollY;
        window.scrollTo(0, savedScrollY);
    };

    const close = function () {
        overlay.style.display = "none";
        unlockProgressBackground();
    };

    launcher.querySelector("#floraFlowProductionProgressButton").addEventListener("click", async function () {
        lockProgressBackground();
        overlay.style.display = "flex";
        const panel = overlay.querySelector("#floraFlowProductionProgressPanel");
        if (panel) panel.scrollTop = 0;
        await loadProductionProgressLists();
    });
    overlay.querySelector("#floraFlowProductionProgressCloseBtn").addEventListener("click", close);
    overlay.querySelector("#floraFlowProductionProgressRefreshBtn").addEventListener("click", loadProductionProgressLists);
    installSafeBackdropClose(overlay, close);
    overlay.querySelectorAll(".progress-filter-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            overlay.dataset.filter = button.dataset.filter || "ACTIVE";
            renderProductionProgressLists();
        });
    });

    return launcher;
}

async function loadProductionProgressLists() {
    ensureProductionProgressCenter();
    const statusElement = document.getElementById("floraFlowProductionProgressStatus");
    if (statusElement) statusElement.textContent = "Loading production progress...";

    const { data: lists, error: listError } = await supabaseClient
        .from(PRODUCTION_PICK_LIST_TABLE)
        .select("id, token, production_order, status, created_by, created_at, completed_by, completed_at")
        .order("created_at", { ascending: false })
        .limit(100);

    if (listError) {
        console.error("Could not load production progress:", listError);
        if (statusElement) statusElement.textContent = "Production progress could not be loaded.";
        return [];
    }

    const listIds = (lists || []).map(function (item) { return item.id; });
    let items = [];
    let assignments = [];

    if (listIds.length > 0) {
        const itemResult = await supabaseClient
            .from(PRODUCTION_PICK_ITEM_TABLE)
            .select("id, pick_list_id, inventory_id, product, color, case_number, reserved_quantity, quantity_taken, destination, status, confirmed_by, confirmed_at")
            .in("pick_list_id", listIds)
            .order("id", { ascending: true });
        if (!itemResult.error) items = itemResult.data || [];

        const assignmentResult = await supabaseClient
            .from(PRODUCTION_PICK_ASSIGNMENT_TABLE)
            .select("pick_list_id, assigned_to, assigned_by, status, started_at, completed_at")
            .in("pick_list_id", listIds);
        if (!assignmentResult.error) assignments = assignmentResult.data || [];
    }

    const userMap = new Map((appUsers || []).map(function (user) {
        return [String(user.id), user.full_name || user.email || "User"];
    }));

    productionProgressLists = (lists || []).map(function (list) {
        const listItems = items.filter(function (item) {
            return String(item.pick_list_id) === String(list.id);
        });
        const listAssignments = assignments.filter(function (assignment) {
            return String(assignment.pick_list_id) === String(list.id);
        }).map(function (assignment) {
            return {
                ...assignment,
                assignedName: userMap.get(String(assignment.assigned_to)) || "Assigned user"
            };
        });
        return { ...list, items: listItems, assignments: listAssignments };
    });

    if (statusElement) statusElement.textContent = "Updated " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    renderProductionProgressLists();
    updateProductionProgressBadge();
    return productionProgressLists;
}

function updateProductionProgressBadge() {
    const badge = document.getElementById("floraFlowProductionProgressBadge");
    if (!badge) return;
    const activeCount = productionProgressLists.filter(function (list) {
        return !["COMPLETED", "CANCELLED"].includes(String(list.status || "").toUpperCase());
    }).length;
    badge.textContent = activeCount > 99 ? "99+" : String(activeCount);
    badge.style.display = activeCount > 0 ? "flex" : "none";
}

function renderProductionProgressLists() {
    const container = document.getElementById("floraFlowProductionProgressList");
    const overlay = document.getElementById("floraFlowProductionProgressOverlay");
    if (!container || !overlay) return;

    const filter = overlay.dataset.filter || "ACTIVE";
    const visible = productionProgressLists.filter(function (list) {
        const status = String(list.status || "PENDING").toUpperCase();
        if (filter === "ACTIVE") return !["COMPLETED", "CANCELLED"].includes(status);
        if (filter === "COMPLETED") return status === "COMPLETED";
        return true;
    });

    if (visible.length === 0) {
        container.innerHTML = `<div style="padding:34px 18px;text-align:center;color:#64748b;background:white;border-radius:14px;">No Pick Lists in this section.</div>`;
        return;
    }

    container.innerHTML = "";
    visible.forEach(function (list) {
        const progress = calculateProductionPickProgress(list.items);
        const colors = getProductionProgressColors(list.status);
        const assignedNames = list.assignments.map(function (assignment) { return assignment.assignedName; });
        const lastConfirmed = list.items
            .filter(function (item) { return item.confirmed_at; })
            .sort(function (a, b) { return new Date(b.confirmed_at) - new Date(a.confirmed_at); })[0];

        const card = document.createElement("article");
        card.style.cssText = "background:white;border:1px solid #e2e8f0;border-radius:16px;padding:16px;margin-bottom:12px;box-shadow:0 2px 8px rgba(15,23,42,.06);";
        card.innerHTML = `
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;">
                <div>
                    <div style="font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.08em;">Production Order</div>
                    <div style="font-size:23px;font-weight:900;color:#0f172a;margin-top:2px;">#${escapeProductionPickHtml(list.production_order || "")}</div>
                </div>
                <span style="padding:7px 10px;border-radius:999px;background:${colors.background};color:${colors.text};border:1px solid ${colors.border};font-size:12px;font-weight:800;">${escapeProductionPickHtml(getProductionProgressLabel(list.status))}</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:14px;font-size:13px;color:#475569;">
                <div><strong style="color:#0f172a;">Created by</strong><br>${escapeProductionPickHtml(list.created_by || "Unknown")}</div>
                <div><strong style="color:#0f172a;">Assigned to</strong><br>${escapeProductionPickHtml(assignedNames.join(", ") || "Not assigned")}</div>
                <div><strong style="color:#0f172a;">Created</strong><br>${escapeProductionPickHtml(formatProgressCenterTime(list.created_at))}</div>
                <div><strong style="color:#0f172a;">Boxes resolved</strong><br>${progress.resolved} of ${progress.total}</div>
            </div>
            <div style="margin-top:14px;">
                <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#475569;margin-bottom:6px;"><span>Progress</span><span>${progress.percentage}%</span></div>
                <div style="height:10px;border-radius:999px;background:#e2e8f0;overflow:hidden;"><div style="width:${progress.percentage}%;height:100%;background:#166534;border-radius:999px;transition:width .25s ease;"></div></div>
            </div>
            ${lastConfirmed ? `<div style="margin-top:12px;padding:10px;border-radius:10px;background:#f8fafc;font-size:12px;color:#475569;">Last update: ${escapeProductionPickHtml(lastConfirmed.product || "Product")} · Case ${escapeProductionPickHtml(lastConfirmed.case_number || "")} · ${escapeProductionPickHtml(formatProgressCenterTime(lastConfirmed.confirmed_at))}</div>` : ""}
            <details style="margin-top:12px;">
                <summary style="cursor:pointer;font-weight:800;color:#334155;">View box details</summary>
                <div style="margin-top:10px;display:grid;gap:8px;">
                    ${(list.items || []).map(function (item) {
                        return `<div style="padding:10px;border:1px solid #e2e8f0;border-radius:10px;font-size:13px;display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap;"><div><strong>${escapeProductionPickHtml(item.product || "Product")}</strong><br><span style="color:#64748b;">${escapeProductionPickHtml(item.color || "")} · Case ${escapeProductionPickHtml(item.case_number || "")}</span></div><div style="text-align:right;"><strong>${escapeProductionPickHtml(getProductionProgressLabel(item.status))}</strong><br><span style="color:#64748b;">${Number(item.quantity_taken || 0)} / ${Number(item.reserved_quantity || 0)} stems</span></div></div>`;
                    }).join("") || `<div style="color:#64748b;">No box details available.</div>`}
                </div>
            </details>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;">
                <button type="button" class="open-progress-pick" style="background:#166534;color:white;border:0;border-radius:9px;padding:10px 13px;font-weight:800;">Open Pick List</button>
                <button type="button" class="copy-progress-link">Copy Link</button>
            </div>
        `;

        card.querySelector(".open-progress-pick").addEventListener("click", function () {
            window.location.href = getProductionPickLink(list.token);
        });
        card.querySelector(".copy-progress-link").addEventListener("click", async function () {
            try {
                await navigator.clipboard.writeText(getProductionPickLink(list.token));
                this.textContent = "Copied";
                setTimeout(() => { this.textContent = "Copy Link"; }, 1200);
            } catch (error) {
                alert("The Pick List link could not be copied.");
            }
        });
        container.appendChild(card);
    });
}

function startProductionProgressRefresh() {
    ensureProductionProgressCenter();
    if (productionProgressRefreshTimer) clearInterval(productionProgressRefreshTimer);
    loadProductionProgressLists();
    productionProgressRefreshTimer = setInterval(loadProductionProgressLists, 60000);
}

async function markProductionPickListInProgress(list) {
    if (!list || String(list.status || "").toUpperCase() !== "PENDING") return;
    const { error } = await supabaseClient
        .from(PRODUCTION_PICK_LIST_TABLE)
        .update({ status: "IN_PROGRESS" })
        .eq("id", list.id)
        .eq("status", "PENDING");
    if (!error) {
        list.status = "IN_PROGRESS";
        await supabaseClient
            .from(PRODUCTION_PICK_ASSIGNMENT_TABLE)
            .update({ status: "IN_PROGRESS", started_at: new Date().toISOString() })
            .eq("pick_list_id", list.id)
            .eq("status", "PENDING");
    }
}

/* =============================================================
   FloraFlow Production Assistant - PDF Pick List Import
   PDF is the recommended input; screenshot remains available.
   ============================================================= */

let floraFlowPdfJsPromise = null;
let floraFlowLastPdfAnalysis = null;

function configureFloraFlowPdfWorker(pdfjs) {
    if (!pdfjs || !pdfjs.GlobalWorkerOptions) {
        return pdfjs;
    }

    pdfjs.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    return pdfjs;
}

function loadFloraFlowPdfJs() {
    if (window.pdfjsLib) {
        return Promise.resolve(
            configureFloraFlowPdfWorker(window.pdfjsLib)
        );
    }

    if (floraFlowPdfJsPromise) {
        return floraFlowPdfJsPromise;
    }

    floraFlowPdfJsPromise = new Promise(function (resolve, reject) {
        const script = document.createElement("script");
        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";

        script.onload = function () {
            if (!window.pdfjsLib) {
                reject(new Error("PDF reader did not initialize."));
                return;
            }

            resolve(
                configureFloraFlowPdfWorker(window.pdfjsLib)
            );
        };

        script.onerror = function () {
            reject(new Error("PDF reader could not be loaded."));
        };

        document.head.appendChild(script);
    });

    return floraFlowPdfJsPromise;
}

function ensureProductionAssistantStyles() {
    if (document.getElementById("floraFlowProductionAssistantStyles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "floraFlowProductionAssistantStyles";
    style.textContent = `
        #productionInputChoice {
            margin-top: 12px;
            padding: 18px;
            border: 1px solid #dbe4ea;
            border-radius: 18px;
            background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        }
        .ff-input-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
        }
        .ff-input-card {
            position: relative;
            min-height: 180px;
            padding: 18px;
            border: 1px solid #cbd5e1;
            border-radius: 16px;
            background: white;
            box-shadow: 0 5px 18px rgba(15, 23, 42, .07);
            box-sizing: border-box;
        }
        .ff-input-card.recommended {
            border: 2px solid #166534;
            background: #f0fdf4;
        }
        .ff-recommended-badge {
            display: inline-flex;
            align-items: center;
            padding: 5px 9px;
            border-radius: 999px;
            background: #166534;
            color: white;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: .05em;
            text-transform: uppercase;
        }
        .ff-input-action {
            width: 100%;
            min-height: 46px;
            margin-top: 14px;
            border: 0;
            border-radius: 11px;
            background: #166534;
            color: white;
            font-size: 14px;
            font-weight: 800;
            cursor: pointer;
        }
        .ff-input-action.secondary {
            background: #334155;
        }
        #productionPdfDropZone.dragging {
            outline: 3px solid #22c55e;
            outline-offset: 3px;
        }
        .ff-analysis-progress {
            margin-top: 14px;
            padding: 14px;
            border-radius: 13px;
            border: 1px solid #bfdbfe;
            background: #eff6ff;
        }
        .ff-progress-track {
            height: 8px;
            overflow: hidden;
            margin-top: 9px;
            border-radius: 999px;
            background: #dbeafe;
        }
        .ff-progress-bar {
            width: 0%;
            height: 100%;
            border-radius: inherit;
            background: #166534;
            transition: width .25s ease;
        }
        .ff-pdf-summary {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 10px;
            margin-bottom: 15px;
        }
        .ff-summary-stat {
            padding: 13px;
            border: 1px solid #dbe4ea;
            border-radius: 12px;
            background: white;
        }
        .ff-summary-value {
            font-size: 23px;
            font-weight: 850;
            color: #14532d;
        }
        @media (max-width: 720px) {
            .ff-input-grid { grid-template-columns: 1fr; }
            .ff-pdf-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            #productionInputChoice { padding: 12px; }
            .ff-input-card { min-height: 0; padding: 15px; }
        }
    `;
    document.head.appendChild(style);
}

function setProductionPdfProgress(percent, message, type) {
    const wrapper = document.getElementById("productionPdfProgress");
    const bar = document.getElementById("productionPdfProgressBar");
    const text = document.getElementById("productionPdfProgressText");

    if (!wrapper || !bar || !text) return;

    wrapper.style.display = "block";
    bar.style.width = Math.max(0, Math.min(100, Number(percent || 0))) + "%";
    text.textContent = message || "";
    text.style.color = type === "error" ? "#b91c1c" : "#1e3a8a";
}

function ensureProductionPdfImportUI() {
    ensureProductionSelectionUI();
    ensureProductionAssistantStyles();

    let choice = document.getElementById("productionInputChoice");
    if (choice) return choice;

    choice = document.createElement("section");
    choice.id = "productionInputChoice";
    choice.innerHTML = `
        <div style="margin-bottom:14px;">
            <div style="font-size:22px;font-weight:850;color:#0f172a;">Production Assistant</div>
            <div style="font-size:14px;color:#64748b;margin-top:4px;line-height:1.5;">
                Choose the official PDF for the clearest results, or use a screenshot when the PDF is unavailable.
            </div>
        </div>

        <div class="ff-input-grid">
            <div class="ff-input-card recommended" id="productionPdfDropZone">
                <span class="ff-recommended-badge">Recommended · Highest accuracy</span>
                <div style="font-size:20px;font-weight:850;color:#14532d;margin-top:13px;">Import Pick List PDF</div>
                <div style="font-size:13px;color:#475569;line-height:1.55;margin-top:6px;">
                    Reads the official Axerrio document, detects the order number and extracts flower articles automatically.
                </div>
                <input id="productionPdfInput" type="file" accept="application/pdf,.pdf" hidden>
                <button type="button" class="ff-input-action" id="productionPdfChooseBtn">Select PDF</button>
                <div style="font-size:12px;color:#64748b;text-align:center;margin-top:8px;">You can also drag the PDF onto this card.</div>
            </div>

            <div class="ff-input-card">
                <div style="font-size:20px;font-weight:850;color:#0f172a;">Analyze Screenshot</div>
                <div style="font-size:13px;color:#475569;line-height:1.55;margin-top:8px;">
                    Keeps the current OCR workflow as a backup. Paste a screenshot and select the area to read.
                </div>
                <button type="button" class="ff-input-action secondary" id="productionUseScreenshotBtn">Use Screenshot</button>
                <div style="font-size:12px;color:#64748b;text-align:center;margin-top:8px;">Best when the PDF is not available.</div>
            </div>
        </div>

        <div id="productionPdfProgress" class="ff-analysis-progress" style="display:none;">
            <div id="productionPdfProgressText" style="font-size:13px;font-weight:750;color:#1e3a8a;">Preparing PDF reader...</div>
            <div class="ff-progress-track"><div id="productionPdfProgressBar" class="ff-progress-bar"></div></div>
        </div>
    `;

    const screenshotTool = document.getElementById("productionSelectionTool");
    if (screenshotTool?.parentNode) {
        screenshotTool.parentNode.insertBefore(choice, screenshotTool);
        if (!productionSelectionImage) screenshotTool.style.display = "none";
    }

    const input = choice.querySelector("#productionPdfInput");
    const chooseButton = choice.querySelector("#productionPdfChooseBtn");
    const screenshotButton = choice.querySelector("#productionUseScreenshotBtn");
    const dropZone = choice.querySelector("#productionPdfDropZone");

    chooseButton.addEventListener("click", function () {
        input.click();
    });

    input.addEventListener("change", async function () {
        const file = input.files?.[0];
        if (file) await processProductionPickListPdf(file);
        input.value = "";
    });

    screenshotButton.addEventListener("click", function () {
        screenshotTool.style.display = "block";
        screenshotTool.scrollIntoView({ behavior: "smooth", block: "start" });
        setProductionSelectionStatus("Paste a screenshot, then select the area containing the order and products.", "info");
    });

    ["dragenter", "dragover"].forEach(function (eventName) {
        dropZone.addEventListener(eventName, function (event) {
            event.preventDefault();
            dropZone.classList.add("dragging");
        });
    });

    ["dragleave", "drop"].forEach(function (eventName) {
        dropZone.addEventListener(eventName, function (event) {
            event.preventDefault();
            dropZone.classList.remove("dragging");
        });
    });

    dropZone.addEventListener("drop", async function (event) {
        const file = Array.from(event.dataTransfer?.files || [])
            .find(function (candidate) {
                return candidate.type === "application/pdf" || /\.pdf$/i.test(candidate.name || "");
            });
        if (!file) {
            alert("Please drop a PDF file.");
            return;
        }
        await processProductionPickListPdf(file);
    });

    return choice;
}

function groupPdfTextItemsIntoLines(items) {
    const groups = [];

    (items || []).forEach(function (item) {
        const text = String(item.str || "").trim();
        if (!text) return;

        const x = Number(item.transform?.[4] || 0);
        const y = Number(item.transform?.[5] || 0);
        let group = groups.find(function (candidate) {
            return Math.abs(candidate.y - y) <= 2.5;
        });

        if (!group) {
            group = { y: y, pieces: [] };
            groups.push(group);
        }

        group.pieces.push({ x: x, text: text });
    });

    return groups
        .sort(function (a, b) { return b.y - a.y; })
        .map(function (group) {
            return group.pieces
                .sort(function (a, b) { return a.x - b.x; })
                .map(function (piece) { return piece.text; })
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();
        })
        .filter(Boolean);
}

async function extractTextLinesFromProductionPdf(file) {
    const pdfjs = await loadFloraFlowPdfJs();
    const bytes = new Uint8Array(await file.arrayBuffer());
    const loadingTask = pdfjs.getDocument({ data: bytes });
    const pdf = await loadingTask.promise;
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        setProductionPdfProgress(
            15 + Math.round((pageNumber / pdf.numPages) * 40),
            "Reading PDF page " + pageNumber + " of " + pdf.numPages + "..."
        );
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        pages.push(groupPdfTextItemsIntoLines(content.items));
    }

    return {
        pageCount: pdf.numPages,
        pages: pages,
        lines: pages.flat(),
        fullText: pages.map(function (lines) { return lines.join("\n"); }).join("\n")
    };
}

function extractProductionOrderFromPdfLines(lines) {
    const cleanLines = (lines || []).map(function (line) {
        return String(line || "").replace(/\s+/g, " ").trim();
    });

    const titleIndex = cleanLines.findIndex(function (line) {
        return /PRODUCTION\s+ORDER\s+PICKLIST/i.test(line);
    });

    if (titleIndex >= 0) {
        for (let index = Math.max(0, titleIndex - 6); index < titleIndex; index++) {
            const match = cleanLines[index].match(/^\s*(\d{4,8})\s*$/);
            if (match) return match[1];
        }
    }

    for (const line of cleanLines) {
        const direct = line.match(/PRODUCTION\s*(?:ORDER|0RDER)\D{0,12}(\d{4,8})/i);
        if (direct) return direct[1];
    }

    const firstStandalone = cleanLines
        .map(function (line) { return line.match(/^\s*(\d{4,8})\s*$/); })
        .find(Boolean);

    return firstStandalone ? firstStandalone[1] : "";
}

function isPdfPackingOrAdministrativeLine(line) {
    const text = normalizeMatchText(line);
    if (!text) return true;

    if (isProductionMaterialLine(text)) return true;

    return [
        "PRODUCTION ORDER PICKLIST", "INTERNAL NUMBER", "SUPPLIER",
        "AVAILABLE FOR", "PRINTED", "UNITS ORDERED", "DELIVERED NAME",
        "AMOUNT PROD ORDER LOT", "PARTLIST", "OPERATIONS", "ALLOCATIONS",
        "CUSTOMER ORDER", "PACKING REMARK", "PAGE", "ALL STEMS MUST",
        "TODOS LOS TALLOS", "CLEAR SLEEVE", "NONWOVEN KRAFT", "FOOD"
    ].some(function (phrase) {
        return text.includes(phrase);
    });
}

function extractFlowerArticlesFromPdfLines(lines) {
    const cleanLines = (lines || []).map(function (line) {
        return String(line || "").replace(/\s+/g, " ").trim();
    }).filter(Boolean);

    const articleCandidates = [];

    cleanLines.forEach(function (line) {
        if (isPdfPackingOrAdministrativeLine(line)) return;

        // Axerrio summary rows normally contain a description followed by " - " and a delivered ratio.
        if (!/\s-\s/.test(line) || !/\b\d+\s*\/\s*\d+\b/.test(line)) return;

        let article = line
            .replace(/\s+\d{2,3}\s*CM\b.*$/i, "")
            .replace(/\s+-\s+.*$/, "")
            .replace(/\s+/g, " ")
            .trim();

        if (!article || isPdfPackingOrAdministrativeLine(article)) return;
        articleCandidates.push(article);
    });

    // Fallback for a future layout that does not preserve the summary row ratio.
    if (articleCandidates.length === 0) {
        cleanLines.forEach(function (line) {
            if (isPdfPackingOrAdministrativeLine(line)) return;
            if (/\sX\s[\d,]+/i.test(line)) return;
            if (/\+\s*\d+\s*STEMS?/i.test(line)) return;

            const family = detectOperationalFamilyFromLine(line);
            if (!family?.family) return;

            const article = line
                .replace(/\s+\d{2,3}\s*CM\b.*$/i, "")
                .replace(/\s+-\s+.*$/, "")
                .trim();
            if (article) articleCandidates.push(article);
        });
    }

    const seen = new Set();
    return articleCandidates.filter(function (article) {
        const key = normalizeMatchText(article);
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function prependPdfAnalysisSummary(resultsContainer, analysis, matches) {
    if (!resultsContainer || !analysis) return;

    const existing = resultsContainer.querySelector(".ff-pdf-analysis-summary");
    if (existing) existing.remove();

    const foundProducts = new Set();
    let estimatedStems = 0;

    (matches || []).forEach(function (match) {
        if (!match?.inventoryFound) return;
        foundProducts.add(normalizeMatchText(match.requestedProduct || match.product));
        estimatedStems += Number(match.quantity || 0);
    });

    const articleCount = analysis.articles.length;
    const coverage = articleCount > 0
        ? Math.round((foundProducts.size / articleCount) * 100)
        : 0;

    const summary = document.createElement("section");
    summary.className = "ff-pdf-analysis-summary";
    summary.innerHTML = `
        <div style="padding:15px;border:1px solid #86efac;border-radius:14px;background:#f0fdf4;margin-bottom:14px;">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;">
                <div>
                    <div style="font-size:12px;font-weight:850;letter-spacing:.08em;text-transform:uppercase;color:#166534;">PDF analysis complete</div>
                    <div style="font-size:21px;font-weight:850;color:#14532d;margin-top:3px;">Production Order #${escapeProductionPickHtml(analysis.orderNumber || "Not detected")}</div>
                    <div style="font-size:13px;color:#475569;margin-top:4px;">${escapeProductionPickHtml(analysis.fileName || "Pick List PDF")} · ${analysis.pageCount} page(s) · Text read directly</div>
                </div>
                <span class="ff-recommended-badge">Detection quality: 100%</span>
            </div>
        </div>
        <div class="ff-pdf-summary">
            <div class="ff-summary-stat"><div class="ff-summary-value">${articleCount}</div><div style="font-size:12px;color:#64748b;">Articles detected</div></div>
            <div class="ff-summary-stat"><div class="ff-summary-value">${foundProducts.size}</div><div style="font-size:12px;color:#64748b;">Products with leftovers</div></div>
            <div class="ff-summary-stat"><div class="ff-summary-value">${coverage}%</div><div style="font-size:12px;color:#64748b;">Coverage</div></div>
            <div class="ff-summary-stat"><div class="ff-summary-value">${estimatedStems}</div><div style="font-size:12px;color:#64748b;">Available stems found</div></div>
        </div>
    `;

    resultsContainer.insertBefore(summary, resultsContainer.firstChild);
}

async function processProductionPickListPdf(file) {
    ensureProductionPdfImportUI();

    if (!file || !(file.type === "application/pdf" || /\.pdf$/i.test(file.name || ""))) {
        alert("Please select a Production Pick List PDF.");
        return;
    }

    try {
        setProductionPdfProgress(5, "Preparing the official Pick List PDF...");
        const extracted = await extractTextLinesFromProductionPdf(file);

        setProductionPdfProgress(62, "Detecting the production order and flower articles...");
        const orderNumber = extractProductionOrderFromPdfLines(extracted.lines);
        const articles = extractFlowerArticlesFromPdfLines(extracted.lines);

        if (!orderNumber) {
            throw new Error("The Production Order number was not found in this PDF.");
        }

        if (articles.length === 0) {
            throw new Error("No flower articles were detected in the Partlist section.");
        }

        ensureProductionSelectionUI();
        productionOrderInput.value = orderNumber;
        productionDetectedText.value = articles.join("\n");
        productionFindLeftoversBtn.disabled = false;
        window.lastProductionFullOcrText = extracted.fullText;

        setProductionPdfProgress(76, "Comparing exact PDF article names with FloraFlow inventory...");

        if (!Array.isArray(lexiflorSearchCatalog) || lexiflorSearchCatalog.length === 0) {
            await loadLexiflorCatalog();
        }

        const products = normalizeProductionText(articles.join("\n"));
        const matches = findInventoryMatches(products);

        floraFlowLastPdfAnalysis = {
            fileName: file.name,
            pageCount: extracted.pageCount,
            orderNumber: orderNumber,
            articles: articles,
            products: products,
            fullText: extracted.fullText
        };

        showProductionRecommendations(matches, orderNumber);
        const resultsContainer = document.getElementById("productionRecommendations");
        prependPdfAnalysisSummary(resultsContainer, floraFlowLastPdfAnalysis, matches);

        setProductionPdfProgress(
            100,
            "Ready: Production Order #" + orderNumber + " · " + articles.length + " article(s) detected.",
            "success"
        );

        setProductionSelectionStatus(
            "PDF processed automatically. Review the leftover cards and create the Pick List when ready.",
            "success"
        );

        if (resultsContainer) {
            setTimeout(function () {
                resultsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 120);
        }
    } catch (error) {
        console.error("Production PDF analysis error:", error);
        setProductionPdfProgress(100, error?.message || String(error), "error");
        alert("The PDF could not be analyzed. " + (error?.message || String(error)));
    }
}

// Add the new input chooser whenever Today's Production opens.
if (todayProductionBtn) {
    todayProductionBtn.addEventListener("click", function () {
        setTimeout(ensureProductionPdfImportUI, 0);
    });
}

window.addEventListener("floraflow-auth-ready", function () {
    if (todayProductionModal?.style.display === "block") {
        ensureProductionPdfImportUI();
    }
});


/* ===== FloraFlow Design + Optional Send Pickup ===== */
(function initializeFloraFlowExperienceUpgrade() {
    function createIconSvg(type) {
        const icons = {
            copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path></svg>',
            send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2 11 13"></path><path d="m22 2-7 20-4-9-9-4Z"></path></svg>',
            rotate: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"></path><path d="M20 4v7h-7"></path></svg>',
            edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"></path></svg>'
        };
        return icons[type] || '';
    }

    function decoratePrimaryLayout() {
        document.body.classList.add('ff-app');
        const container = document.querySelector('.container');
        if (container) container.classList.add('ff-shell');
        document.querySelectorAll('.dashboard .card').forEach(function (card, index) {
            card.classList.add('ff-metric-card', 'ff-metric-' + (index + 1));
        });
        const form = document.querySelector('.form-grid');
        if (form) {
            form.classList.add('ff-add-panel');
            if (!form.querySelector('.ff-panel-heading')) {
                const heading = document.createElement('div');
                heading.className = 'ff-panel-heading';
                heading.innerHTML = '<div><span>Inventory intake</span><strong>Add leftover product</strong></div><small>Fast entry for Production and QC</small>';
                form.insertBefore(heading, form.firstChild);
            }
        }
        const topBar = document.querySelector('.top-bar');
        if (topBar) topBar.classList.add('ff-command-bar');
        ensureMobileNavigation();
    }

    function ensureMobileNavigation() {
        if (document.getElementById('ffMobileNav')) return;
        const nav = document.createElement('nav');
        nav.id = 'ffMobileNav';
        nav.className = 'ff-mobile-nav';
        nav.innerHTML = `
            <button type="button" data-action="inventory"><span>⌂</span><small>Inventory</small></button>
            <button type="button" data-action="production"><span>▤</span><small>Production</small></button>
            <button type="button" data-action="progress"><span>◔</span><small>Progress</small></button>
            <button type="button" data-action="notifications"><span>◉</span><small>Alerts</small></button>
            <button type="button" data-action="settings"><span>⚙</span><small>Settings</small></button>`;
        document.body.appendChild(nav);
        nav.addEventListener('click', function (event) {
            const button = event.target.closest('button');
            if (!button) return;
            const action = button.dataset.action;
            if (action === 'inventory') window.scrollTo({ top: 0, behavior: 'smooth' });
            if (action === 'production') document.getElementById('todayProductionBtn')?.click();
            if (action === 'progress') document.getElementById('floraFlowProductionProgressButton')?.click();
            if (action === 'notifications') document.getElementById('floraFlowNotificationBell')?.click();
            if (action === 'settings') document.getElementById('settingsBtn')?.click();
        });
    }

    function buildManualPickupReference() {
        return '99' + String(Date.now()).slice(-6);
    }

    function ensureSendPickupModal() {
        let overlay = document.getElementById('ffSendPickupOverlay');
        if (overlay) return overlay;
        overlay = document.createElement('div');
        overlay.id = 'ffSendPickupOverlay';
        overlay.className = 'ff-sheet-overlay';
        overlay.innerHTML = `
            <section class="ff-sheet ff-pickup-sheet">
                <header class="ff-sheet-header">
                    <div><span>Pickup request</span><h2>Send leftover to a teammate</h2></div>
                    <button type="button" id="ffClosePickupModal" class="ff-icon-close">×</button>
                </header>
                <div id="ffPickupSummary" class="ff-pickup-summary"></div>
                <label class="ff-field-label">Stems requested
                    <input id="ffPickupQuantity" type="number" min="1">
                </label>
                <div class="ff-field-label">Destination</div>
                <div class="ff-segmented" id="ffPickupDestination">
                    <button type="button" data-value="Production" class="active">Production</button>
                    <button type="button" data-value="Samples">Samples</button>
                    <button type="button" data-value="OLD">OLD</button>
                </div>
                <div class="ff-field-label">Send internally to</div>
                <div id="ffPickupRecipients" class="ff-recipient-grid"></div>
                <div class="ff-privacy-note"><strong>Case number stays hidden</strong><span>Product, color, quantity and date remain visible. The case appears only after the teammate accepts the task.</span></div>
                <div class="ff-pickup-actions">
                    <button type="button" id="ffCreatePickupRequest" class="ff-primary-action">Send internally</button>
                    <button type="button" id="ffSharePickupWhatsApp" class="ff-secondary-action">Share by WhatsApp</button>
                </div>
                <div id="ffPickupStatus" class="ff-inline-status"></div>
            </section>`;
        document.body.appendChild(overlay);
        overlay.querySelector('#ffClosePickupModal').addEventListener('click', function () { overlay.style.display = 'none'; });
        installSafeBackdropClose(overlay, function () {
            overlay.style.display = 'none';
        });
        overlay.querySelector('#ffPickupDestination').addEventListener('click', function (event) {
            const button = event.target.closest('button');
            if (!button) return;
            overlay.querySelectorAll('#ffPickupDestination button').forEach(function (item) { item.classList.remove('active'); });
            button.classList.add('active');
        });
        overlay.querySelector('#ffCreatePickupRequest').addEventListener('click', createManualPickupRequest);
        overlay.querySelector('#ffSharePickupWhatsApp').addEventListener('click', shareManualPickupByWhatsApp);
        return overlay;
    }

    let manualPickupItem = null;

    function getManualPickupFormData(overlay) {
        if (!manualPickupItem) {
            throw new Error('No leftover product is selected.');
        }

        const quantity = Number(overlay.querySelector('#ffPickupQuantity').value || 0);
        const destination = overlay.querySelector('#ffPickupDestination .active')?.dataset.value || 'Production';
        const recipients = Array.from(
            overlay.querySelectorAll('#ffPickupRecipients input:checked')
        ).map(function (input) {
            return input.value;
        });

        if (!quantity || quantity < 1 || quantity > Number(manualPickupItem.quantity || 0)) {
            throw new Error('Enter a valid quantity.');
        }

        return {
            quantity: quantity,
            destination: destination,
            recipients: recipients,
            requestItem: Object.assign({}, manualPickupItem, {
                quantity: quantity,
                articleName: 'Manual pickup · ' + destination
            })
        };
    }

    function buildManualPickupWhatsAppText(pickList, formData) {
        const item = manualPickupItem || {};
        return [
            'FloraFlow pickup request',
            '',
            'Product: ' + (item.product || ''),
            'Color / Variety: ' + (item.color || 'Not specified'),
            'Stems requested: ' + formData.quantity,
            'Date received: ' + formatProductionShareDate(item.date),
            'Destination: ' + formData.destination,
            '',
            'Case number: Hidden until the request is accepted',
            '',
            'Open and accept the request:',
            pickList.link
        ].join('\n');
    }

    async function shareManualPickupByWhatsApp() {
        const overlay = ensureSendPickupModal();
        const button = overlay.querySelector('#ffSharePickupWhatsApp');
        const status = overlay.querySelector('#ffPickupStatus');

        button.disabled = true;
        button.textContent = 'Preparing link...';
        status.textContent = 'Creating the protected pickup link...';

        try {
            const formData = getManualPickupFormData(overlay);
            const pickList = await createProductionPickList(
                buildManualPickupReference(),
                [formData.requestItem]
            );
            pickList.link += '&mode=pickup';

            if (formData.recipients.length > 0) {
                await assignProductionPickListInternally(pickList, formData.recipients);
            }

            const shareText = buildManualPickupWhatsAppText(pickList, formData);
            const whatsappUrl = 'https://wa.me/?text=' + encodeURIComponent(shareText);

            status.innerHTML = '<strong>Pickup link ready.</strong><br>WhatsApp will open without showing the case number.';
            window.open(whatsappUrl, '_blank', 'noopener');

            await loadActiveProductionReservations();
            await loadInventoryFromSupabase();
        } catch (error) {
            console.error('WhatsApp pickup share error:', error);
            status.textContent = error?.message || String(error);
        } finally {
            button.disabled = false;
            button.textContent = 'Share by WhatsApp';
        }
    }

    function openSendPickupModal(item) {
        manualPickupItem = item;
        const overlay = ensureSendPickupModal();
        overlay.querySelector('#ffPickupSummary').innerHTML = `
            <strong>${escapeProductionPickHtml(item.product || '')}</strong>
            <span>${escapeProductionPickHtml(item.color || '')} · ${Number(item.quantity || 0)} stems available · ${escapeProductionPickHtml(formatProductionShareDate(item.date))}</span>`;
        const qty = overlay.querySelector('#ffPickupQuantity');
        qty.max = Number(item.quantity || 0);
        qty.value = Math.min(30, Number(item.quantity || 0));
        const recipients = overlay.querySelector('#ffPickupRecipients');
        recipients.innerHTML = getAssignableAppUsers().map(function (user) {
            return `<label><input type="checkbox" value="${escapeProductionPickHtml(user.id)}"><span>${escapeProductionPickHtml(user.full_name || user.email || 'User')}</span></label>`;
        }).join('') || '<div class="ff-empty-state">No other active users are available.</div>';
        overlay.querySelector('#ffPickupStatus').textContent = '';
        overlay.style.display = 'flex';
    }

    async function createManualPickupRequest() {
        const overlay = ensureSendPickupModal();
        const button = overlay.querySelector('#ffCreatePickupRequest');
        const status = overlay.querySelector('#ffPickupStatus');
        if (!manualPickupItem) return;
        let formData;
        try {
            formData = getManualPickupFormData(overlay);
        } catch (error) {
            alert(error.message);
            return;
        }
        if (formData.recipients.length === 0) {
            alert('Select at least one teammate.');
            return;
        }
        button.disabled = true;
        button.textContent = 'Creating request...';
        status.textContent = 'Reserving the requested quantity and sending the internal alert...';
        try {
            const pickList = await createProductionPickList(buildManualPickupReference(), [formData.requestItem]);
            pickList.link += '&mode=pickup';
            await assignProductionPickListInternally(pickList, formData.recipients);
            status.innerHTML = '<strong>Pickup request sent.</strong><br>The case number will appear only after the teammate accepts the task.';
            await loadActiveProductionReservations();
            await loadInventoryFromSupabase();
            setTimeout(function () { overlay.style.display = 'none'; }, 1300);
        } catch (error) {
            console.error('Manual pickup request error:', error);
            status.textContent = 'The request could not be created. ' + (error?.message || String(error));
        } finally {
            button.disabled = false;
            button.textContent = 'Send internally';
        }
    }

    function attachSendPickupButtons() {
        document.querySelectorAll('.mobile-inventory-card').forEach(function (card, cardIndex) {
            if (card.querySelector('.ff-send-pickup-btn')) return;
            const visibleCards = Array.from(document.querySelectorAll('.mobile-inventory-card'));
            const item = inventory.filter(function (entry) {
                const search = (searchInput?.value || '').toLowerCase().trim();
                const matchesRemoved = showRemoved || entry.status !== 'Removed from Inventory';
                const matchesSearch = !search || [entry.product, entry.color, entry.caseNumber, entry.notes, entry.status].some(function (value) { return String(value || '').toLowerCase().includes(search); });
                return matchesRemoved && matchesSearch;
            })[cardIndex];
            if (!item || item.status === 'Removed from Inventory') return;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'ff-send-pickup-btn';
            button.title = 'Send pickup request';
            button.setAttribute('aria-label', 'Send pickup request');
            button.innerHTML = createIconSvg('send');
            button.addEventListener('click', function () { openSendPickupModal(item); });
            card.appendChild(button);
        });

        document.querySelectorAll('#inventoryTable tr').forEach(function (row) {
            if (row.querySelector('.ff-table-send-btn')) return;
            const productButton = row.querySelector('.product-history-link');
            if (!productButton) return;
            const item = inventory.find(function (entry) { return entry.product === productButton.textContent.trim() && entry.status !== 'Removed from Inventory'; });
            const actions = row.cells?.[7];
            if (!item || !actions) return;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'ff-table-send-btn';
            button.title = 'Send pickup request';
            button.innerHTML = createIconSvg('send') + '<span>Send</span>';
            button.addEventListener('click', function () { openSendPickupModal(item); });
            actions.appendChild(button);
        });
    }

    const originalRenderInventory = window.renderInventory;
    if (typeof originalRenderInventory === 'function') {
        window.renderInventory = function () {
            originalRenderInventory.apply(this, arguments);
            requestAnimationFrame(attachSendPickupButtons);
        };
    }

    document.addEventListener('DOMContentLoaded', function () {
        decoratePrimaryLayout();
        setTimeout(attachSendPickupButtons, 300);
    });
    if (document.readyState !== 'loading') {
        decoratePrimaryLayout();
        setTimeout(attachSendPickupButtons, 300);
    }
})();


/* ===== FloraFlow mobile scroll stability ===== */
(function initializeMobileScrollStability() {
    const MOBILE_QUERY = window.matchMedia("(max-width: 720px)");
    const overlaySelectors = [
        ".modal",
        ".ff-sheet-overlay",
        "#floraFlowNotificationOverlay",
        "#floraFlowProductionProgressOverlay",
        "#productionPickPage",
        "#teachFloraFlowOverlay",
        "#usersManagementOverlay",
        "#productsManagementOverlay"
    ];

    let savedScrollY = 0;
    let locked = false;
    let syncQueued = false;

    function isVisibleOverlay(element) {
        if (!element || !element.isConnected) return false;
        const style = window.getComputedStyle(element);
        return style.display !== "none" &&
            style.visibility !== "hidden" &&
            Number(style.opacity || 1) !== 0;
    }

    function getOpenOverlays() {
        return overlaySelectors.flatMap(function (selector) {
            return Array.from(document.querySelectorAll(selector));
        }).filter(isVisibleOverlay);
    }

    function lockPageScroll() {
        if (locked || !MOBILE_QUERY.matches) return;
        savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
        document.documentElement.classList.add("ff-mobile-overlay-open");
        document.body.classList.add("ff-mobile-overlay-open");
        document.body.dataset.ffScrollY = String(savedScrollY);
        document.body.style.position = "fixed";
        document.body.style.top = "-" + savedScrollY + "px";
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";
        locked = true;
    }

    function unlockPageScroll() {
        if (!locked) return;
        const restoreY = Number(document.body.dataset.ffScrollY || savedScrollY || 0);
        document.documentElement.classList.remove("ff-mobile-overlay-open");
        document.body.classList.remove("ff-mobile-overlay-open");
        delete document.body.dataset.ffScrollY;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        locked = false;
        window.scrollTo(0, restoreY);
    }

    function syncScrollLock() {
        syncQueued = false;

        const openOverlays = getOpenOverlays();

        // The header notification bell belongs only to the main screen.
        // Hide it whenever Progress, Production confirmation, Settings,
        // or another full-screen workspace is open.
        document.body.classList.toggle(
            "ff-secondary-view-open",
            openOverlays.length > 0
        );

        if (!MOBILE_QUERY.matches) {
            unlockPageScroll();
            return;
        }

        if (openOverlays.length > 0) lockPageScroll();
        else unlockPageScroll();
    }

    function queueSync() {
        if (syncQueued) return;
        syncQueued = true;
        requestAnimationFrame(syncScrollLock);
    }

    const observer = new MutationObserver(queueSync);
    observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["style", "class", "hidden"]
    });

    MOBILE_QUERY.addEventListener?.("change", queueSync);
    window.addEventListener("pageshow", queueSync);
    window.addEventListener("resize", queueSync, { passive: true });

    document.addEventListener("touchmove", function (event) {
        if (!locked) return;
        const scrollRegion = event.target.closest(
            ".modal-content, .ff-sheet, #floraFlowNotificationPanel, #floraFlowProductionProgressPanel, #productionPickPage"
        );
        if (!scrollRegion) event.preventDefault();
    }, { passive: false, capture: true });

    queueSync();
})();
