const form = document.getElementById("entryForm");
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const categorySelect = document.getElementById("category");
const typeSelect = document.getElementById("type");
const entryList = document.getElementById("entryList");
const balanceDisplay = document.getElementById("balance");
const totalIncomeDisplay = document.getElementById("totalIncome");
const totalExpenseDisplay = document.getElementById("totalExpense");

let entries = JSON.parse(localStorage.getItem("entries"))  || [];
let editIndex = null;

function updateUI() {
    entryList.innerHTML = "";
    let totalIncome = 0;
    let totalExpense =0;

    entries.forEach((entry, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="top">
                <span>${entry.desc} - Rs${entry.amount}</span>
                <span class="${entry.type}"> ${entry.type}</span>
            </div>
            <div class="bottom">
                <span>${entry.date}</span>
                <span class=${entry.category}</span>
            </div>
            <div class="actions">
                <button onclick="editEntry(${index})"> Edit</button>
                <button onclick="deleteEntry(${index})"> Delete</button>
            </div>
        `;

        entryList.appendChild(li);

        if (entry.type === "income") totalIncome += entry.amount;
        else totalExpense += entry.amount;
    });

    const balance = totalIncome - totalExpense;
    balanceDisplay.textContent = `Rs${balance}`;
    totalIncomeDisplay.textContent = totalIncome;
    totalExpenseDisplay.textContent = totalExpense;

    localStorage.setItem("entries", JSON.stringify(entries));
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const desc = descInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;
    const category = categorySelect.value;
    const type = typeSelect.value;

    if (desc && amount && date) {
        const newEntry = { desc, amount, date, category, type };

        if (editIndex !== null) {
            entries[editIndex] = newEntry;
            editIndex = null;
            form.querySelector("button").textContent = "+ Add Entry";
        } else {
            entries.push(newEntry);
        }

        updateUI();
        form.reset();
    }
});


function editEntry(index) {
    const entry = entries[index];
    descInput.value = entry.desc;
    amountInput.value = entry.amount;
    dateInput.value = entry.date;
    categorySelect.value = entry.category;
    typeSelect.value = entry.type;
    editIndex = index;
    form.querySelector("button").textContent = "Update Entry";
}

function deleteEntry(index) {
    entries.splice(index, 1);
    updateUI();
}

updateUI();