const customerName = document.getElementById('customerName');
const amount = document.getElementById('amount');
const number = document.getElementById('number');
const search = document.getElementById('search');
const btnAdd = document.getElementById('btnAdd');
const tableBody = document.getElementById('tableBody');

if (!localStorage.getItem('customersTransaction')) {
    localStorage.setItem('customersTransaction', JSON.stringify({
        "customers": [
            { "id": 1, "name": "Ahmed Ali" },
            { "id": 2, "name": "Aya Elsayed" },
            { "id": 3, "name": "Mina Adel" },
            { "id": 4, "name": "Sarah Reda" },
            { "id": 5, "name": "Mohamed Sayed" }
        ],
        "transactions": [
            { "id": 1, "customer_id": 1, "date": "2022-01-01", "amount": 1000 },
            { "id": 2, "customer_id": 1, "date": "2022-01-02", "amount": 2000 },
            { "id": 3, "customer_id": 2, "date": "2022-01-01", "amount": 550 },
            { "id": 4, "customer_id": 3, "date": "2022-01-01", "amount": 500 },
            { "id": 5, "customer_id": 2, "date": "2022-01-02", "amount": 1300 },
            { "id": 6, "customer_id": 4, "date": "2022-01-01", "amount": 750 },
            { "id": 7, "customer_id": 3, "date": "2022-01-02", "amount": 1250 },
            { "id": 8, "customer_id": 5, "date": "2022-01-01", "amount": 2500 },
            { "id": 9, "customer_id": 5, "date": "2022-01-02", "amount": 875 }
        ]
    }));
}

let customersData = localStorage.getItem('customersTransaction');
if (customersData) {
    customersData = JSON.parse(customersData);
} else {
    customersData = { customers: [], transactions: [] };
}

let arrayCustomer = customersData.customers;
let arrayTransaction = customersData.transactions;

let nextCustomerId, nextTransactionId;

if (arrayCustomer.length > 0) {
    const ids = arrayCustomer.map(customer => customer.id);
    nextCustomerId = Math.max(...ids) + 1;
} else {
    nextCustomerId = 1;
}

if (arrayTransaction.length > 0) {
    const ids = arrayTransaction.map(transaction => transaction.id);
    nextTransactionId = Math.max(...ids) + 1;
} else {
    nextTransactionId = 1;
}

function addData() {
    let newCustomer;
    if (number.value === '') {
        newCustomer = {
            id: nextCustomerId,
            name: customerName.value
        };
    } else {
        newCustomer = {
            id: parseInt(number.value, 10),  // Convert to integer
            name: customerName.value
        };
    }

    // Add new customer only if the ID is unique
    if (!arrayCustomer.find(customer => customer.id === newCustomer.id)) {
        arrayCustomer.push(newCustomer);
    }

    const newTransaction = {
        id: nextTransactionId,
        customer_id: newCustomer.id,
        date: new Date().toISOString().split('T')[0],  // Current date in YYYY-MM-DD format
        amount: parseFloat(amount.value)  // Convert to float
    };

    arrayTransaction.push(newTransaction);

    // Sort transactions by date from oldest to newest
    arrayTransaction.sort((a, b) => new Date(a.date) - new Date(b.date));

    const updatedCustomersData = JSON.stringify({ customers: arrayCustomer, transactions: arrayTransaction });
    localStorage.setItem('customersTransaction', updatedCustomersData);

    nextCustomerId = Math.max(nextCustomerId, ...arrayCustomer.map(customer => customer.id) + 1);
    nextTransactionId++;

    displayData();
    clearData();
}

function displayData(searchQuery = '') {
    let container = '';

    // Filter transactions and customers by search query (name or amount)
    arrayCustomer.forEach(customer => {
        const transactions = arrayTransaction.filter(transaction => {
            return transaction.customer_id === customer.id
                && (searchQuery === '' || customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || transaction.amount.toString().includes(searchQuery));
        });

        transactions.forEach(transaction => {
            container += `
                <tr>
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${transaction.date}</td>
                    <td>${transaction.amount}</td>
                    <td>graph</td>
                </tr>
            `;
        });
    });

    tableBody.innerHTML = container;
}

// Initial display
displayData();

btnAdd.addEventListener('click', function () {
    addData();
});

search.addEventListener('input', () => {
    const searchQuery = search.value;
    displayData(searchQuery);
});

function clearData() {
    customerName.value = '';
    amount.value = '';
    number.value = '';  // Clear the number input field
    search.value = '';  // Clear the search input field
}
