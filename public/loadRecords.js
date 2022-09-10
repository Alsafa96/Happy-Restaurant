//const { MongoNetworkError } = require("mongodb");

//const { ConnectionClosedEvent } = require("mongodb");


const recordsTable = document.querySelector('.recordsTable');
const recordsTableBody = document.querySelector('tbody');

let headersNames = ['No.', 'Order', 'Price', 'Customer name', 'Phone Number', 'Address', 'Time of request', 'Date of request'];


let tableToSort = document.getElementById('recordsTable');
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
    let orderNum = 1;
    fetch('/allRecords').then(response => {
        return response.json();
    }).then(response => {
        response['arr'].forEach(res => {
            let newOrder = document.createElement('tr');
            newOrder.classList.add('justify-between');
            let newOrderNum = document.createElement('td');
            newOrderNum.textContent = orderNum;
            newOrderNum.id = 'orderNum';
            newOrderNum.classList.add('inline-block', 'sm:mx-1');
            let newOrderName = document.createElement('td');
            newOrderName.classList.add('inline-block', 'sm:mx-5');
            newOrderName.textContent = res['orderName'];
            newOrderName.id = 'orderName';
            let newOrderPrice = document.createElement('td');
            newOrderPrice.classList.add('inline-block', 'sm:mx-4');
            newOrderPrice.textContent = res['orderPrice'];
            newOrderPrice.id = 'orderPrice';
            let customerName = document.createElement('td');
            customerName.classList.add('inline-block', 'sm:mx-20');
            customerName.textContent = res['customerName'];
            customerName.id = 'customerName';
            let customerAddress = document.createElement('td');
            customerAddress.classList.add('inline-block', 'sm:ml-10');
            customerAddress.textContent = res['customerAddress'];
            customerAddress.id = 'customerAddress';
            let customerPhoneNumber = document.createElement('td');
            customerPhoneNumber.textContent = res['phoneNumber'];
            customerPhoneNumber.classList.add('inline-block');
            customerPhoneNumber.id = 'customerPhoneNumber';
            let timeOfRequest = document.createElement('td');
            timeOfRequest.classList.add('inline-block', 'sm:ml-20');
            timeOfRequest.textContent = res['requestTime'];
            timeOfRequest.id = 'timeOfRequest';
            let dateOfRequest = document.createElement('td');
            dateOfRequest.classList.add('inline-block', 'sm:ml-14');
            dateOfRequest.textContent = res['requestDate'];
            dateOfRequest.id = 'dateOfRequest'
            newOrder.appendChild(newOrderNum);
            newOrder.appendChild(newOrderName);
            newOrder.appendChild(newOrderPrice);
            newOrder.appendChild(customerName);
            newOrder.appendChild(customerAddress);
            newOrder.appendChild(customerPhoneNumber);
            newOrder.appendChild(timeOfRequest);
            newOrder.appendChild(dateOfRequest);
            recordsTableBody.appendChild(newOrder);
            orderNum++;

        })
        window.dispatchEvent(new Event('resize'));
    })

}

let replaced = false;
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
                newRowContent.classList.add('inline-block', 'xs:ml-5');
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
let sortBy = document.getElementById('records-filter');

sortBy.addEventListener('change', () => {
    let main = document.querySelector('main');
    if (sortBy.value === 'Order-Name') {
        if (window.innerWidth >= 1400) {
            sortTableByColumn(tableToSort, 1, true);
        }
        else if (window.innerWidth < 1400) {
            sortTableByColumn(tableToSort, 1, true);
            main.replaceChild(tableToSort, document.querySelector('table'));
            window.dispatchEvent(new Event('resize'));
        }
    }
    else if (sortBy.value === 'Customer-Name') {
        if (window.innerWidth >= 1400) {
            sortTableByColumn(tableToSort, 3, true);
        }
        else if (window.innerWidth < 1400) {
            sortTableByColumn(tableToSort, 3, true);
            main.replaceChild(tableToSort, document.querySelector('table'));
            window.dispatchEvent(new Event('resize'));
        }

    }
    else if (sortBy.value === 'Phone-Number') {
        if (window.innerWidth >= 1400) {
            sortTableByColumn(tableToSort, 5, true);
        }
        else if (window.innerWidth < 1400) {
            sortTableByColumn(tableToSort, 5, true);
            main.replaceChild(tableToSort, document.querySelector('table'));
            window.dispatchEvent(new Event('resize'));
        }
    }
    else if (sortBy.value === 'Time-of-Request') {
        if (window.innerWidth >= 1400) {
            sortTableByColumn(tableToSort, 6, true);
        }
        else if (window.innerWidth < 1400) {
            sortTableByColumn(tableToSort, 6, true);
            main.replaceChild(tableToSort, document.querySelector('table'));
            window.dispatchEvent(new Event('resize'));
        }
    }
    else if (sortBy.value === 'Date-of-Request') {
        if (window.innerWidth >= 1400) {
            sortTableByColumn(tableToSort, 7, true);
        }
        else if (window.innerWidth < 1400) {
            sortTableByColumn(tableToSort, 7, true);
            main.replaceChild(tableToSort, document.querySelector('table'));
            window.dispatchEvent(new Event('resize'));
        }
    }
})

