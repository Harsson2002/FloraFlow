const addBtn = document.getElementById("addBtn");
const todayBtn = document.getElementById("todayBtn");
const table = document.getElementById("inventoryTable");
const historyTable = document.getElementById("historyTable");
const historySearch = document.getElementById("historySearch");
const searchInput = document.getElementById("search");

const activityBtn = document.getElementById("activityBtn");
const activityModal = document.getElementById("activityModal");
const closeModal = document.getElementById("closeModal");

const editModal = document.getElementById("editModal");
const closeEditModal = document.getElementById("closeEditModal");
const saveEditBtn = document.getElementById("saveEditBtn");

const exportInventoryBtn = document.getElementById("exportInventoryBtn");
const exportHistoryBtn = document.getElementById("exportHistoryBtn");

let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let nextId = Number(localStorage.getItem("nextId")) || 1;
let editingIndex = null;

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

closeModal.addEventListener("click", function () {
    activityModal.style.display = "none";
});

closeEditModal.addEventListener("click", function () {
    editModal.style.display = "none";
});

todayBtn.addEventListener("click", function () {
    document.getElementById("date").value = getToday();
});

addBtn.addEventListener("click", async function () {
    const product = document.getElementById("product").value;
    const color = document.getElementById("color").value;
    const quantity = document.getElementById("quantity").value;
    const caseNumber = document.getElementById("case").value;
    const date = document.getElementById("date").value;
    const notes = document.getElementById("notes").value;

    if (product === "" || color === "" || quantity === "") {
        alert("Please enter Product, Color and Quantity.");
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

    alert("Leftover saved to Supabase!");
});

function renderInventory() {
    table.innerHTML = "";

    inventory.forEach(function (item, index) {
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

    document.getElementById("historyProductName").textContent = item.product;
    document.getElementById("historyProductColor").textContent = item.color;
    document.getElementById("historyProductCase").textContent = item.caseNumber;
    document.getElementById("historyProductQty").textContent = item.quantity;

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

    const updatedProduct = document.getElementById("editProduct").value;
    const updatedColor = document.getElementById("editColor").value;
    const updatedQuantity = Number(document.getElementById("editQuantity").value);
    const updatedCase = document.getElementById("editCase").value;
    const updatedDate = document.getElementById("editDate").value;
    const updatedNotes = document.getElementById("editNotes").value;

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
        updatedQuantity
    );
    await loadHistoryFromSupabase();

    renderInventory();
    renderHistory();
    updateDashboard();

    editModal.style.display = "none";
    editingIndex = null;

});
async function addHistory(id, action, product, color, caseNumber, beforeQty, quantity, afterQty) {
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
               details: action
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
        afterQty: item.after_qty
    }));

    renderHistory();
    updateDashboard();
}

function renderHistory() {

    historyTable.innerHTML = "";

    const search = historySearch.value.toLowerCase().trim();

    const filteredHistory = history.filter(item => {

        if (search === "") return true;

        return (
            (item.action ?? "").toLowerCase().includes(search) ||
            (item.userName ?? "").toLowerCase().includes(search) ||
            (item.product ?? "").toLowerCase().includes(search) ||
            (item.color ?? "").toLowerCase().includes(search) ||
            String(item.caseNumber ?? "").toLowerCase().includes(search)
        );

    });

    filteredHistory.forEach(function (item) {

        const row = historyTable.insertRow();

        row.insertCell(0).innerHTML = item.date + " " + item.time;
        row.insertCell(1).innerHTML = item.action;
        row.insertCell(2).innerHTML = item.userName ?? "";
        row.insertCell(3).innerHTML = item.product;
        row.insertCell(4).innerHTML = item.color;
        row.insertCell(5).innerHTML = item.caseNumber;
        row.insertCell(6).innerHTML = item.beforeQty ?? "";
        row.insertCell(7).innerHTML = item.quantity ?? "";
        row.insertCell(8).innerHTML = item.afterQty ?? "";

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
    document.getElementById("product").value = "";
    document.getElementById("color").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("case").value = "";
    document.getElementById("date").value = "";
    document.getElementById("notes").value = "";
}

function getToday() {
    return new Date().toISOString().split("T")[0];
}

function getTime() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

searchInput.addEventListener("keyup", function () {
    const searchValue = searchInput.value.toLowerCase();
    const rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const rowText = rows[i].innerText.toLowerCase();
        rows[i].style.display = rowText.includes(searchValue) ? "" : "none";
    }
});

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

