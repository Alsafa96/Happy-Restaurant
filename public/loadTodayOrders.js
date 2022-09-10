//const { response } = require("express")
const todayOrdersTable = document.querySelector('.todayOrders');

let tableToSort = document.querySelector('.todayOrders');
function sortTableByColumn(table, column, asc = false) {
    const dirModifier = asc ? 1 : -1;
    const tBody = tableToSort.children[1];
    const rows = Array.from(tBody.querySelectorAll('tr'));

    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    })

    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    tBody.append(...sortedRows);
}

function loadingTodayOrders() {

    fetch('/todayOrders').then(response => {
        return response.json();
    }).then(response => {
        response['arr'].forEach(res => {
            let newOrder = document.createElement('tr');
            newOrder.classList.add('justify-between');
            let newOrderNum = document.createElement('td');
            newOrderNum.textContent = orderNum;
            newOrderNum.classList.add('inline-block', 'mx-10');
            let newOrderName = document.createElement('td');
            newOrderName.classList.add('inline-block', 'mx-20');
            newOrderName.textContent = res['orderName'];
            let newOrderPrice = document.createElement('td');
            newOrderPrice.classList.add('inline-block', '-mx-5');
            newOrderPrice.textContent = res['orderPrice'];
            let customerName = document.createElement('td');
            customerName.classList.add('inline-block', 'mx-20');
            customerName.textContent = res['customerName'];
            let customerPhoneNumber = document.createElement('td');
            customerPhoneNumber.textContent = res['phoneNumber'];
            customerPhoneNumber.classList.add('inline-block', 'mx-20');
            let customerAddress = document.createElement('td');
            customerAddress.classList.add('inline-block', 'mx-0');
            customerAddress.textContent = res['customerAddress'];
            let timeOfRequrest = document.createElement('td');
            timeOfRequrest.classList.add('inline-block', 'mx-40');
            timeOfRequrest.textContent = res['requestTime'];
            newOrder.appendChild(newOrderNum);
            newOrder.appendChild(newOrderName);
            newOrder.appendChild(newOrderPrice);
            newOrder.appendChild(customerName);
            newOrder.appendChild(customerPhoneNumber);
            newOrder.appendChild(customerAddress);
            newOrder.appendChild(timeOfRequrest);
            todayOrdersTable.appendChild(newOrder);
            orderNum++;
        })
    })
}

let oldTable = document.querySelector('table');
window.addEventListener('resize', () => {
    let table = document.querySelector('table');
    let headers = document.querySelectorAll('th');
    let tableRows = Array.from(document.querySelectorAll('tr'));
    tableRows = tableRows.splice(1, tableRows.length);
    let main = document.querySelector('main');
    let tableHeaders = headers;
    if (window.innerWidth < 1400) {
        let newTable = document.createElement('table');
        let tableBody = document.createElement('tbody');
        tableRows.forEach(tableRow => {
            let oldRowContent = Array.from(tableRow.children);
            for (let i = 0; i < tableHeaders.length; i++) {
                let newTableRow = document.createElement('tr');
                newTableRow.classList.add('mb-10');
                let newRowHeader = document.createElement('th');
                newRowHeader.classList.add('inline-block');
                newRowHeader.textContent = tableHeaders[i].textContent;
                let newRowContent = document.createElement('td');
                newRowContent.classList.add('inline-block');
                newRowContent.textContent = oldRowContent[i].textContent;
                newTableRow.appendChild(newRowHeader);
                newTableRow.appendChild(newRowContent);
                tableBody.appendChild(newTableRow);
                tableBody.appendChild(document.createElement('br'));
            }
            newTable.appendChild(tableBody);
        })
        //newTable.appendChild(tableBody);
        //console.log(newTable);
        main.replaceChild(newTable, table);
        replaced = true;
        //document.body.appendChild(newTable);
    }
    else if (window.innerWidth >= 1400) {
        main.replaceChild(oldTable, table);
    }
})

loadingTodayOrders();


