const orderName = document.getElementById('order_name');
const orderPrice = document.getElementById('order_price');
orderName.value = localStorage.getItem('orderName');
orderPrice.value = localStorage.getItem('orderPrice');