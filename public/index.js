function initMap() {

    var mapProp = {
        center: new google.maps.LatLng(33.318390, 44.338180),
        zoom: 20,
    }
    let map = new google.maps.Map(
        document.getElementById('map'), mapProp
    )
}

let humburger = document.getElementById('humburger');
let menu = document.getElementById('menu');
let menu_items = document.querySelectorAll('li');

humburger.addEventListener('click', () => {
    if (menu.classList.contains('menu_closed')) {
        menu.classList.remove('menu_closed');
        menu.classList.add('menu_open');
        for (let i = 0; i < menu_items.length; i++) {
            menu_items[i].classList.remove('xs:hidden');
        }

    }
    else {
        menu.classList.add('menu_closed');
        menu.classList.remove('menu_open');
        for (let i = 0; i < menu_items.length; i++) {
            menu_items[i].classList.add('xs:hidden');
        }
    }

})

window.addEventListener('resize', () => {
    if (!menu.classList.contains('menu_closed')) {
        menu.classList.add('menu_closed');
    }
})


//Adding new dishes:-
let dishesMenu = document.querySelector('.dishes-menu');
let addDish = document.getElementById('add-dish');


if (addDish) {
    addDish.addEventListener('click', () => {
        let newDishCard = document.createElement('div');
        newDishCard.classList.add('dish-card', 'xs:w-100', 'col-span-1', 'shadow-md');
        let newDishImg = document.createElement('img');
        newDishImg.src = '../src/img/emptyCard/empty.jpg';
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
        dishTitle.textContent = 'Enter Dish Name';
        dishTitle.classList.add('dish-title');
        let dishDescription = document.createElement('p');
        dishDescription.textContent = 'Enter dish description';
        dishDescription.classList.add('dish-description');
        let dishPrice = document.createElement('p');
        dishPrice.textContent = 'Enter dish price';
        dishPrice.classList.add('dish-price');
        let editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        editBtn.classList.add('dish-order-btn', 'bg-purple-400', 'rounded-3xl', 'text-lg', 'p-2', 'ml-5', 'mt-4', 'w-2/6', 'shadow-xl', 'edit-dish-btn');
        deleteBtn.classList.add('dish-order-btn', 'bg-purple-400', 'rounded-3xl', 'text-lg', 'p-2', 'ml-10', 'mb-5', 'w-2/6', 'shadow-xl', 'delete-dish-btn');
        let saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Dish';
        saveBtn.classList.add('dish-order-btn', 'bg-purple-400', 'rounded-3xl', 'text-lg', 'mx-auto', 'p-2', 'mb-5', 'w-full', 'shadow-xl', 'save-dish-btn');
        newDishCard.appendChild(newDishImg);
        newDishCard.appendChild(newImageSkin);
        newDishCard.appendChild(imageInput);
        newDishCard.appendChild(dishTitle);
        newDishCard.appendChild(dishDescription);
        newDishCard.appendChild(dishPrice);
        newDishCard.appendChild(editBtn);
        newDishCard.appendChild(deleteBtn);
        newDishCard.appendChild(saveBtn);
        dishesMenu.appendChild(newDishCard);

        //Adding Event listeners to both the edit and delete buttons:
        editBtnsOrder(editBtn);
        deleteBtnsOrder(deleteBtn);
    })
}
