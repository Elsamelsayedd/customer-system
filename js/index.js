
const customerName = document.getElementById('customerName');
const amount = document.getElementById('amount');
const number = document.getElementById('number');
const search = document.getElementById('search');
const btnAdd = document.getElementById('btnAdd');
const tableBody = document.getElementById('tableBody');
const myChartCanvas = document.getElementById('myChart');

if (!localStorage.getItem('customersTransaction')) {
    localStorage.setItem('customersTransaction', JSON.stringify({
        "customers": [
        {
        "id": 1,
        "name": "Ahmed Ali"
        },
        {
        "id": 2,
        "name": "Aya Elsayed"
        },
        {
        "id": 3,
        "name": "Mina Adel"
        },
        {
        "id": 4,
        "name": "Sarah Reda"
        },
        {
        "id": 5,
        "name": "Mohamed Sayed"
        }
        ],
        "transactions": [
        {
        "id": 1,
        "customer_id": 1,
        "date": "2022-01-01",
        "amount": 1000
        },
        {
        "id": 2,
        "customer_id": 1,
        "date": "2022-01-02",
        "amount": 2000
        },
        {
        "id": 3,
        "customer_id": 2,
        "date": "2022-01-01",
        "amount": 550
        },
        {
        "id": 4,
        "customer_id": 3,
        "date": "2022-01-01",
        "amount": 500
        },
        {
        "id": 5,
        "customer_id": 2,
        "date": "2022-01-02",
        "amount": 1300
        },
        {
        "id": 6,
        "customer_id": 4,
        "date": "2022-01-01",
        "amount": 750
        },
        {
        "id": 7,
        "customer_id": 3,
        "date": "2022-01-02",
        "amount": 1250
        },
        {
        "id": 8,
        "customer_id": 5,
        "date": "2022-01-01",
        "amount": 2500
        },
        {
        "id": 9,
        "customer_id": 5,
        "date": "2022-01-02",
        "amount": 875
        }
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
            id: parseInt(number.value, 10),  
            name: customerName.value
        };
    }

    if (!arrayCustomer.find(customer => customer.id === newCustomer.id)) {
        arrayCustomer.push(newCustomer);
    }

    const newTransaction = {
        id: nextTransactionId,
        customer_id: newCustomer.id,
        date: new Date().toISOString().split('T')[0],  
        amount: parseFloat(amount.value)  
    };

    arrayTransaction.push(newTransaction);

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

    arrayCustomer.forEach(customer => {
        const transactions = arrayTransaction.filter(transaction => {
            return transaction.customer_id === customer.id
                && (searchQuery === '' || customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || transaction.amount.toString().includes(searchQuery));
        });

        transactions.forEach(transaction => {
            container += `
                <tr>
                    <td class="text-white">${customer.id}</td>
                    <td class="text-white">${customer.name}</td>
                    <td class="text-white">${transaction.date}</td>
                    <td class="text-white">${transaction.amount}</td>
                    <td class="text-white"><button onclick="showGraph(${customer.id})">Show Graph</button></td>
                </tr>
            `;
        });
    });

    tableBody.innerHTML = container;
}

function showGraph(customerId) {
    const transactions = arrayTransaction.filter(transaction => transaction.customer_id === customerId);

    const dates = [...new Set(transactions.map(transaction => transaction.date))];
    const data = dates.map(date => {
        return transactions
            .filter(transaction => transaction.date === date)
            .reduce((sum, transaction) => sum + transaction.amount, 0);
    });

    const ctx = myChartCanvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Transaction Amount',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amount'
                    }
                }
            }
        }
    });
}

displayData();

btnAdd.addEventListener('click', function () {
    addData();
});

search.addEventListener('input', () => {
    const searchQuery = search.value;
    if(searchQuery!=''){
        displayData(searchQuery);
    }
    
});

function clearData() {
    customerName.value = '';
    amount.value = '';
    number.value = '';  
    search.value = '';  
}
