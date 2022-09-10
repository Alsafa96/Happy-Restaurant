let orderName, orderDescription, orderPrice;
//let addDish = document.getElementById('add-dish');

fetch('http://127.0.0.1:5000/dishes').then(response => {
    //response.json();
    return response.json();
}).then(response => {
    response['arr'].forEach(res => {
        let newDishCard = document.createElement('div');
        newDishCard.classList.add('dish-card', 'xs:w-100', 'col-span-1', 'shadow-md');
        let newDishImg = document.createElement('img');
        if (res['dishImage'] !== 'empty.jpg') {
            newDishImg.src = '../src/img/dishes/' + res['dishImage'];
        }
        else {
            newDishImg.src = '../src/img/emptyCard/' + res['dishImage'];
        }
        //newDishImg.src = '../src/img/emptyCard/empty.jpg';
        newDishImg.classList.add('dish-image', 'w-100');
        let newImageSkin = document.createElement('img');
        newImageSkin.src = '../src/img/upload.png';
        newImageSkin.alt = 'upload-image-button';
        newImageSkin.classList.add('cursor-pointer', 'hidden');
        let imageInput = document.createElement('input');
        imageInput.type = 'file';
        imageInput.accept = 'images/*';
        imageInput.classList.add('hidden', 'image_input');
        let dishTitle = document.createElement('p');
        dishTitle.textContent = res['dishName'];
        dishTitle.classList.add('dish-title');
        let dishDescription = document.createElement('p');
        dishDescription.textContent = res['dishDescription'];
        dishDescription.classList.add('dish-description');
        let dishPrice = document.createElement('p');
        dishPrice.textContent = res['dishPrice'];
        dishPrice.classList.add('dish-price');
        let orderBtn = document.createElement('button');
        orderBtn.textContent = 'Order';
        orderBtn.classList.add('dish-order-btn', 'bg-purple-400', 'rounded-3xl', 'text-lg', 'p-2', 'xs:mx-auto', 'mb-5', 'mt-4', 'd-block', 'shadow-xl');

        orderBtn.addEventListener('click', () => {
            localStorage.setItem('orderName', dishTitle.textContent);
            localStorage.setItem('orderDescription', dishDescription.textContent);
            localStorage.setItem('orderPrice', dishPrice.textContent);
            location.href = './order_received.html';
        })
        newDishCard.appendChild(newDishImg);
        newDishCard.appendChild(newImageSkin);
        newDishCard.appendChild(imageInput);
        newDishCard.appendChild(dishTitle);
        newDishCard.appendChild(dishDescription);
        newDishCard.appendChild(dishPrice);
        newDishCard.appendChild(orderBtn);
        dishesMenu.appendChild(newDishCard);
    })
})
    .catch(console.error);

let dishDetails = () => {
    console.log(dishName, dishDescription, dishPrice);
}

window.onbeforeunload = 'return myFunction()';
function myFunction() {
    return 'Alsafa...';
}
