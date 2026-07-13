
const productsCatalog = [
    "ACHILLEA",
    "AGAPANTHUS",
    "ALLIUM",
    "ALSTROEMERIA",
    "AMARANTHUS",
    "AMMI",
    "ANEMONE",
    "ARALIA",
    "ASTER",
    "CALLA",
    "CARNATION STANDARD",
    "CHRYSANTHEMUM",
    "CUSHION POM",
    "DELPHINIUM",
    "DISBUD",
    "DUSTY MILLER",
    "EUCALYPTUS",
    "FREESIA",
    "GERBERA",
    "GYPSOPHILA",
    "HYPERICUM",
    "HYDRANGEA",
    "MINI GREEN",
    "IRIS",
    "LEPIDIUM",
    "LEUCADENDRON",
    "LISIANTHUS",
    "LIMONIUM",
    "MOLUCELLA",
    "PEONY",
    "PINCUSHION",
    "PITTOSPORUM",
    "PROTEA",
    "RANUNCULUS",
    "ROSE",
    "RUSCUS",
    "SCABIOSA",
    "SNAPDRAGON",
    "SOLIDAGO",
    "SPRAY CARNATION",
    "SPRAY ROSE",
    "STOCK",
    "TULIP",
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
const activityModal = document.getElementById("activityModal");
const closeModal = document.getElementById("closeModal");

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

const productionPreview = document.getElementById("productionPreview");
const productionPlaceholder = document.getElementById("productionPlaceholder");
const productionDropZone = document.getElementById("productionDropZone");
const clearProductionImageBtn = document.getElementById("clearProductionImageBtn");
const productionLoaded = document.getElementById("productionLoaded");
const viewProductionImageBtn = document.getElementById("viewProductionImageBtn");
const productionPreviewViewport = document.getElementById("productionPreviewViewport");
const analyzeProductionBtn = document.getElementById("analyzeProductionBtn");
let productionImageScale = 1;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let nextId = Number(localStorage.getItem("nextId")) || 1;
let editingIndex = null;
let showRemoved = false;
let learnedProductAliases =
    JSON.parse(localStorage.getItem("learnedProductAliases")) || {};

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

loadInventoryFromSupabase();
loadHistoryFromSupabase();

activityBtn.addEventListener("click", function () {
    activityModal.style.display = "block";
});
todayProductionBtn.addEventListener("click", function () {
    todayProductionModal.style.display = "block";
});

closeTodayProductionModal.addEventListener("click", function () {
    todayProductionModal.style.display = "none";
});
clearProductionImageBtn.addEventListener("click", function () {

    productionPreview.src = "";

    productionPlaceholder.style.display = "block";
    productionLoaded.style.display = "none";

    productionPreview.style.display = "none";
    productionPreviewViewport.style.display = "none";

    productionImageScale = 1;
    productionPreview.style.transform = "scale(1)";

    viewProductionImageBtn.textContent = "👁 View Screenshot";
});
document.addEventListener("paste", function (event) {
    if (todayProductionModal.style.display !== "block") {
        return;
    }

    const items = event.clipboardData?.items;

    if (!items) {
        return;
    }

    for (const item of items) {
        if (item.type.startsWith("image/")) {
            const imageFile = item.getAsFile();

            if (!imageFile) {
                return;
            }

            const imageUrl = URL.createObjectURL(imageFile);

            productionPreview.src = imageUrl;
            productionPlaceholder.style.display = "none";
            productionLoaded.style.display = "block";

            productionPreview.style.display = "none";
            productionPreviewViewport.style.display = "none";
            return;
        }
    }

    alert("No image was found in the clipboard. Press Prt Sc first.");
});
viewProductionImageBtn.addEventListener("click", function () {

    if (productionPreviewViewport.style.display === "none") {

        productionPreviewViewport.style.display = "block";
        productionPreview.style.display = "block";

        viewProductionImageBtn.textContent = "🙈 Hide Screenshot";

    } else {

        productionPreviewViewport.style.display = "none";
        productionPreview.style.display = "none";

        viewProductionImageBtn.textContent = "👁 View Screenshot";

    }

});
analyzeProductionBtn.addEventListener("click", async function () {

    await analyzeProduction();

});
productionPreview.addEventListener("wheel", function (event) {

    event.preventDefault();

    if (event.deltaY < 0) {
        productionImageScale += 0.1;
    } else {
        productionImageScale -= 0.1;
    }

    productionImageScale = Math.max(0.5, Math.min(5, productionImageScale));

    productionPreview.style.transform = `scale(${productionImageScale})`;
    productionPreview.style.transformOrigin = "top left";

});
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
    const currentQty = Number(item.quantity);
    const rotatedQty = Number(prompt("How many stems are you rotating to production?"));

    if (!rotatedQty || rotatedQty <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    if (rotatedQty > currentQty) {
        alert("You cannot rotate more stems than available.");
        return;
    }

    const newQty = currentQty - rotatedQty;
    const newStatus = (newQty === 0)
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

await addHistory(
    item.id,
    "ROTATE",
    item.product,
    item.color,
    item.caseNumber,
    currentQty,
    rotatedQty,
    newQty
);

await loadHistoryFromSupabase();
    renderInventory();
    renderHistory();
    updateDashboard();
}
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
exportInventoryBtn.addEventListener("click", function () {
    exportToCSV(inventory, "FloraFlow_Inventory.csv");
});

exportHistoryBtn.addEventListener("click", function () {
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
    console.log("Touch started");

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

    if (!productionPreview.src) {
        alert("Please paste a production screenshot first.");
        return;
    }

    await startProductionAnalysis();
}
async function startProductionAnalysis() {

    const rawText = await readProductionScreenshot();

    const lotNumber = extractProductionLot(rawText);

    console.log("Production Lot:", lotNumber);

    alert(rawText);
    
    const products = normalizeProductionText(rawText);

    const matches = findInventoryMatches(products);

    showProductionRecommendations(matches);

}
function extractProductionLot(text) {

    const match = text.match(/\b\d{5,6}\b/);

    if (match) {
        return match[0];
    }

    return null;

}
async function readProductionScreenshot() {

    console.log("Reading production screenshot...");

    if (!productionPreview.src) {
        return "";
    }

    // Crear imagen
    const img = new Image();
    img.src = productionPreview.src;

    await new Promise(resolve => {
        img.onload = resolve;
    });

    // Canvas temporal
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // ===== RECORTE =====
    // Ajustaremos estos valores con tu captura
    const cropX = img.width * 0.03;
    const cropY = img.height * 0.15;
    const cropWidth = img.width * 0.55;
    const cropHeight = img.height * 0.50;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
    );

    // OCR
    const result = await Tesseract.recognize(
        canvas,
        "eng",
        {
            logger: m => console.log(m)
        }
    );

    return result.data.text;

}
function normalizeProductionText(text) {

    console.log("Normalizing production text...");

    const lines = text
        .split("\n")
        .map(cleanProductionLine)
        .filter(line => line !== "");

    return lines.map(normalizeProductionLine);
}
function normalizeProductionLine(line) {

    const words = line.split(" ");

    let product = "";
    let color = "";

    for (let i = 0; i < words.length; i++) {

        const word = words[i];

        if (!product && window.flowerBrain.productAliases[word]) {
            product = window.flowerBrain.productAliases[word];
            continue;
        }

        if (!color && window.flowerBrain.colorAliases[word]) {
            color = window.flowerBrain.colorAliases[word];
        }
    }

    return {
        original: line,
        product: product,
        color: color
    };
}
function findInventoryMatches(products) {

    console.log("Searching inventory matches...");

    return [];

}
function showProductionRecommendations(matches) {

    console.log("Displaying recommendations...");
    console.table(matches);

    const summary = matches
        .map(function (item) {
            return `${item.product || "UNKNOWN"} | ${item.color || "UNKNOWN"}`;
        })
        .join("\n");

    alert(
        "Normalized production products:\n\n" +
        summary
    );
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

    return line
        .toUpperCase()
        .replace(/\b\d+(?:-\d+)?\s*CM\b/g, "")
        .replace(/\b\d+\s*GR(?:AM|AMS)?\b/g, "")
        .replace(/[.,;:()[\]{}]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}

