
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


async function loadProductionAliases() {

    const { data, error } = await supabaseClient
        .from("production_aliases")
        .select("alias, family, confirmed_by, active")
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
                alias: normalizeMatchText(item.alias),
                family: normalizeMatchText(item.family),
                confirmedBy: item.confirmed_by || ""
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

async function loadFlowerFamilies() {

    const { data, error } = await supabaseClient
        .from("flower_families")
        .select("family, aliases")
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
            family: String(item.family || "")
                .trim()
                .toUpperCase(),

            aliases: aliases
        };
    });

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

const users = [
    "Harsson",
    "Ender",
    "Henry",
    "Maidelyn",
    "Mark",
    "Paulina",
    "Sandra",
    "Dayan",
    "Sarymed",
    "Thalia",
    "Laura",
    "Liudmila",
    "Orlando"
];

let currentUser = localStorage.getItem("currentUser") || "Harsson";
const userSelect = document.getElementById("userSelect");

users.forEach(user => {
    const option = document.createElement("option");
    option.value = user;
    option.textContent = user;
    userSelect.appendChild(option);
});

userSelect.value = currentUser;

userSelect.addEventListener("change", function () {
    currentUser = this.value;
    localStorage.setItem("currentUser", currentUser);
});

async function initializeFloraFlow() {

    await loadInventoryFromSupabase();
    await loadHistoryFromSupabase();
    await loadFlowerFamilies();
    await loadProductionAliases();
    await loadLexiflorCatalog();

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
                created_by: document.getElementById("userSelect").value || "Harsson"            }
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
                user_name: document.getElementById("userSelect").value || "Harsson",
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
    if (window.scrollY === 0) {
        pullStartY = event.touches[0].clientY;
        isPulling = true;
    }
});

document.addEventListener("touchmove", function (event) {
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

        productionDetectedText.value = detectedText;
        productionFindLeftoversBtn.disabled = detectedText === "";

        saveRememberedProductionSelection();

        if (!detectedText) {
            setProductionSelectionStatus(
                "No readable text was found. Select the product area again or make the rectangle tighter.",
                "error"
            );
            return;
        }

        const lineCount = detectedText
            .split(/\r?\n/)
            .filter(Boolean)
            .length;

        setProductionSelectionStatus(
            "Text detected in " + lineCount +
            " line(s). Review it below, correct any letter if necessary, then press Find Leftovers.",
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
        const productionOrderNumber = extractProductionLot(editedText);

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
    brainCard.style.padding = "13px";
    brainCard.style.border = "1px solid #7c3aed";
    brainCard.style.borderRadius = "10px";
    brainCard.style.background = "#f5f3ff";

    const canTeach =
        normalizeMatchText(currentUser) === "HARSSON";

    brainCard.innerHTML = `
        <div style="font-weight:800;color:#5b21b6;margin-bottom:8px;">
            🧠 FloraFlow Brain
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
                    Only Harsson can confirm new learning rules.
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
        resultsContainer.style.maxHeight = "450px";
        resultsContainer.style.overflowY = "auto";
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
            background:#e8f5e9;
            border:1px solid #2e7d32;
            border-radius:10px;
            padding:14px;
            margin-bottom:15px;
            font-size:18px;
            font-weight:bold;
        ">
            📋 Production Order:
            ${productionOrderNumber || "Not detected"}
        </div>
    `;

    resultsContainer.appendChild(orderHeader);

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

    matches.forEach(function (match) {

        const card = document.createElement("div");

        card.style.background = "white";
        card.style.borderRadius = "10px";
        card.style.padding = "15px";
        card.style.marginBottom = "12px";
        card.style.boxShadow = "0 2px 6px rgba(0,0,0,.08)";

        if (match.inventoryFound) {

            card.innerHTML = `
                <div style="
                    font-size:18px;
                    font-weight:bold;
                    margin-bottom:10px;
                    color:#166534;
                ">
                    ✅ ${match.product || ""}
                </div>

                <div style="
                    line-height:1.8;
                    font-size:14px;
                ">
                    🎨 Color: ${match.color || match.requestedColor || "Not specified"}<br>
                    📦 Case: ${match.caseNumber || "Not specified"}<br>
                    🌿 Available: ${match.quantity ?? 0} stems<br>
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
        resultsContainer.appendChild(card);
    });

    requestAnimationFrame(function () {
        resultsContainer.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    });
}
function extractProductionLot(text) {

    const source = String(text || "").toUpperCase();

    if (!source) {
        return null;
    }

    const normalizeDigits = function (value) {
        return String(value || "")
            .replace(/O/g, "0")
            .replace(/[IL]/g, "1")
            .replace(/[^0-9]/g, "");
    };

    const nearOrder = source.match(
        /([0-9OIL]{4,7})\s*[-:]?\s*PRODUCTION\s*ORDER/
    );

    if (nearOrder) {
        const orderNumber = normalizeDigits(nearOrder[1]);

        if (orderNumber.length >= 4) {
            return orderNumber;
        }
    }

    const possibleNumbers = source.match(/[0-9OIL]{4,7}/g) || [];

    for (const possibleNumber of possibleNumbers) {
        const orderNumber = normalizeDigits(possibleNumber);

        if (orderNumber.length >= 4 && orderNumber.length <= 7) {
            return orderNumber;
        }
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

function normalizeProductionText(text) {

    const normalizedProducts = String(text || "")
        .split("\n")
        .map(function (rawLine) {

            const raw = normalizeMatchText(rawLine);

            if (!raw || isProductionMaterialLine(raw)) {
                return null;
            }

            const cleaned = cleanProductionLine(rawLine);

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

            return Boolean(catalogFamily);
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
        "AS50RTED": "ASSORTED"
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
        console.log("OCR corrected:", correctedLine);
        



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

    const detectedColor =
        explicitColor ||
        codedColor ||
        "";

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
            names: ["TULIP"]
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

            return (
                Number(item.quantity || 0) > 0 &&
                status !== "REMOVED FROM INVENTORY" &&
                status !== "REMOVED"
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
