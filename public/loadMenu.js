
let delete_dialog_box;
let edit_dish_btns = Array.from(document.querySelectorAll('.edit-dish-btn'));
let delete_dish_btns = Array.from(document.querySelectorAll('.delete-dish-btn'));

//The delete Buttons function:-

function deleteBtnsOrder(deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
        if (!delete_dialog_box) {
            delete_dialog_box = document.createElement('div');
            delete_dialog_box.textContent = 'Are you sure you want to delete this dish from your menu?';
            delete_dialog_box.classList.add('bg-yellow-200', 'absolute', 'w-50', 'block', '-ml-80', 'text-center', 'pt-2', 'pb-2', 'font-extrabold', 'text-xl', 'border-4', 'rounded-md', 'border-red-400');
            delete_dialog_box.appendChild(document.createElement('br'));
            let yesBtn = document.createElement('button');
            yesBtn.classList.add('w-20', 'bg-red-200', 'border-3', 'border-red-400', 'rounded-lg', 'mt-2', 'hover:bg-red-300');
            yesBtn.textContent = 'Yes';
            let noBtn = document.createElement('button');
            noBtn.classList.add('w-20', 'bg-red-200', 'border-3', 'border-red-400', 'ml-5', 'rounded-lg', 'mt-2', 'hover:bg-red-300');
            noBtn.textContent = 'No';
            delete_dialog_box.appendChild(yesBtn);
            delete_dialog_box.appendChild(noBtn);
            e.target.parentElement.appendChild(delete_dialog_box);
            //delete_dish_btn.parentElement.appendChild(delete_dialog_box);
            delete_dialog_box.style.left = e.x + 'px';
            let delete_dialog_box_width = parseInt(window.outerWidth) / 2 + 'px';
            let delete_dialog_box_left = e.x;
            delete_dialog_box.style.top = window.pageYOffset + deleteBtn.parentElement.offsetHeight / 2 + 'px';

            //Keeping the dialog box withing the coordinates of the viewport:-
            let calculatedDeleteDialogBoxCoords = parseInt(delete_dialog_box_width) + (parseInt(delete_dialog_box_left) - 320);
            if (calculatedDeleteDialogBoxCoords > parseInt(window.outerWidth)) {
                let boxDisplacement = calculatedDeleteDialogBoxCoords - parseInt(window.outerWidth);
                delete_dialog_box.style.left = parseInt(delete_dialog_box.style.left) - boxDisplacement + 'px';
            }

            else if (calculatedDeleteDialogBoxCoords - parseInt(delete_dialog_box_width) < 0) {
                let boxDisplacement = Math.abs(calculatedDeleteDialogBoxCoords - parseInt(delete_dialog_box_width));
                delete_dialog_box.style.left = parseInt(delete_dialog_box.style.left) + boxDisplacement + 'px';
            }

            //Making the dialog box draggable:-
            let pos1 = 0; pos2 = 0; pos3 = 0; pos4 = 0;
            let isDown = false;
            //let pos1, pos2, pos3, pos4;
            delete_dialog_box.addEventListener('mousedown', (e) => {
                e = e || window.event;
                e.preventDefault();
                isDown = true;
                pos3 = e.clientX;
                pos4 = e.clientY;
            })

            delete_dialog_box.addEventListener('mousemove', (e) => {
                e = e || window.event;
                e.preventDefault();
                if (isDown) {
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    delete_dialog_box_style = window.getComputedStyle(delete_dialog_box);
                    delete_dialog_box_top = parseInt(delete_dialog_box_style.top);
                    delete_dialog_box_left = parseInt(delete_dialog_box_style.left);
                    delete_dialog_box.style.left = delete_dialog_box_left - pos1 + 'px';
                    delete_dialog_box.style.top = delete_dialog_box_top - pos2 + 'px';
                }

            })

            delete_dialog_box.addEventListener('mouseup', () => {
                isDown = false;
            })
            delete_dialog_box.addEventListener('mouseleave', () => {
                isDown = false;
            })

            //Programming the noBtn and yesBtn:-
            noBtn.addEventListener('click', () => {
                delete_dialog_box.remove();
                delete_dialog_box = null;
            })

            yesBtn.addEventListener('click', () => {
                if (!deleteBtn.parentElement.hasAttributeNS('id', 'cardID')) {
                    deleteBtn.parentElement.remove();
                    delete_dialog_box.remove();
                    delete_dialog_box = null;
                }

                else {
                    let cardToDelete = document.createElement('form');
                    cardToDelete.method = 'POST';
                    cardToDelete.action = '/deleteCard';
                    let cardIdField = document.createElement('input');
                    cardIdField.type = 'text';
                    cardIdField.name = 'cardIDName';
                    cardIdField.value = deleteBtn.parentElement.getAttributeNS('id', 'cardID');
                    cardIdSubmit = document.createElement('input');
                    cardIdSubmit.type = 'submit';
                    cardIdSubmit.value = 'submit';
                    cardToDelete.appendChild(cardIdField);
                    cardToDelete.appendChild(cardIdSubmit);
                    cardToDelete.hidden = true;
                    document.body.appendChild(cardToDelete);
                    cardIdSubmit.click();
                    loadingMenu();
                }

            })

        }
    })
}

//Adding the save button:-
let addSaveBtn = (cardId, oldImage, oldImageName, oldTitle, oldDescription, oldPrice, newImage, imageName, newTitle, newDescription, newPrice) => {
    console.log(newImage, newTitle, newDescription, newPrice);
    let saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save Dish';
    saveBtn.type = 'button';
    saveBtn.classList.add('dish-order-btn', 'bg-purple-400', 'rounded-3xl', 'text-lg', 'mx-auto', 'p-2', 'mb-5', 'w-full', 'shadow-xl', 'save-dish-btn');
    //Programming the save dish button:-
    saveBtn.addEventListener('click', () => {
        let hiddenForm = document.createElement('form');
        hiddenForm.method = 'POST';
        hiddenForm.action = '/addOrEditDish';
        hiddenForm.hidden = true;
        //Loading the card ID:-
        let cardIdText = document.createElement('input');
        cardIdText.type = 'text';
        cardIdText.name = 'cardId';
        cardIdText.value = cardId;
        cardIdText.hidden = true;
        ///Loading the old values:-
        //Loading the old Image:-
        let oldDishImg = document.createElement('input');
        oldDishImg.type = 'text';
        //oldDishImg.value = '..' + oldImage.slice(oldImage.indexOf('/src'), oldImage.length);
        oldDishImg.value = oldImage;
        oldDishImg.name = 'oldImage';
        oldDishImg.hidden = true;
        //Loading the old Image Name:-
        let oldDishImgName = document.createElement('input');
        oldDishImgName.type = 'text';
        oldDishImgName.value = oldImageName;
        oldDishImgName.name = 'oldImageName';
        //oldDishImg.value = '..' + oldImage.slice(oldImage.indexOf('/src'), oldImage.length);
        //oldDishImg.name = 'oldImage';
        oldDishImg.hidden = true;
        //Loading the old Title:-
        let oldDishTitle = document.createElement('input');
        oldDishTitle.type = 'text';
        oldDishTitle.value = oldTitle;
        oldDishTitle.name = 'oldTitle';
        oldDishTitle.hidden = true;
        //Loading the old Description:-
        let oldDishDescription = document.createElement('input');
        oldDishDescription.type = 'text';
        oldDishDescription.value = oldDescription;
        oldDishDescription.name = 'oldDescription';
        oldDishDescription.hidden = true;
        //Loading the old Price:-
        let oldDishPrice = document.createElement('input');
        oldDishPrice.type = 'text';
        oldDishPrice.value = oldPrice;
        oldDishPrice.name = 'oldPrice';
        oldDishPrice.hidden = true;
        ///Loading the current values:-
        let dishImgName = document.createElement('input');
        dishImgName.type = 'text';
        //let newDishImg = saveBtn.parentElement.firstChild;
        //dishImg.value = '..' + newDishImg.src.slice(newDishImg.src.indexOf('/src'), newDishImg.src.length);
        dishImgName.value = imageName;
        dishImgName.name = 'imageName';
        dishImgName.hidden = true;
        let dishImg = document.createElement('input');
        dishImg.type = 'text';
        //let newDishImg = saveBtn.parentElement.firstChild;
        //dishImg.value = '..' + newDishImg.src.slice(newDishImg.src.indexOf('/src'), newDishImg.src.length);
        dishImg.value = newImage;
        dishImg.name = 'image';
        dishImg.hidden = true;
        let dishName = document.createElement('input');
        dishName.type = 'text';
        dishName.name = 'name';
        //let dishTitle = saveBtn.parentElement.children[3];
        dishName.value = newTitle;
        dishName.hidden = true;
        let dishDesc = document.createElement('input');
        dishDesc.type = 'text';
        //let dishDescription = saveBtn.parentElement.children[4];
        //dishDesc.value = dishDescription.value;
        dishDesc.value = newDescription;
        dishDesc.name = 'description';
        dishDesc.hidden = true;
        let dishPr = document.createElement('input');
        dishPr.type = 'text';
        //let dishPrice = saveBtn.parentElement.children[5];
        //dishPr.value = dishPrice.value;
        dishPr.value = newPrice;
        dishPr.name = 'price';
        dishPr.hidden = true;
        let submitBtn = document.createElement('input');
        submitBtn.type = 'submit';
        submitBtn.hidden = true;
        submitBtn.value = 'Submit';
        //Adding the old values to our hidden Form:-
        hiddenForm.appendChild(cardIdText);
        hiddenForm.appendChild(oldDishImg);
        hiddenForm.appendChild(oldDishImgName);
        hiddenForm.appendChild(oldDishTitle);
        hiddenForm.appendChild(oldDishDescription);
        hiddenForm.appendChild(oldDishPrice);
        //Adding the new Values to our hidden Form:-
        hiddenForm.appendChild(dishImgName);
        hiddenForm.appendChild(dishImg);
        hiddenForm.appendChild(dishName);
        hiddenForm.appendChild(dishDesc);
        hiddenForm.appendChild(dishPr);
        hiddenForm.appendChild(submitBtn);
        document.body.appendChild(hiddenForm);
        submitBtn.click();
    })
    return saveBtn;
}


//The edit buttons function:-
async function editBtnsOrder(editBtn) {
    let card = editBtn.parentElement;
    let cardId = card.getAttributeNS('id', 'cardID');
    let editedValue = false;

    //Getting the old image name and reading it as well:-
    //let oldImage = '.' + card.firstChild.src.slice(card.firstChild.src.indexOf('public') - 1, card.firstChild.src.length);
    //card.firstChild.src = oldImage;
    //let oldImageName = oldImage.slice(oldImage.lastIndexOf('/') + 1, oldImage.length);

    /*async function readImageData(oldImage) {
        let response = await fetch(oldImage);
        let data = await response.text();
        return data;
    }*/

    oldImage = card.firstChild.src;

    //console.log(oldImage);
    //console.log(oldImageName);
    //Getting the old values:-
    let oldTitle = card.children[3].textContent;
    let oldDescription = card.children[4].textContent;
    let oldPrice = card.children[5].textContent;
    let newImage = oldImage;
    let imageName = card.firstChild.src.slice(card.firstChild.src.lastIndexOf('/') + 1, card.firstChild.length);
    let newTitle = oldTitle, newDescription = oldDescription, newPrice = oldPrice;

    //Converting static paragraphs to editable text boxes:-
    let paragraphVsInput = (paragraph, order) => {
        let saveBtn;
        let editabelParagraph = document.createElement('input');
        editabelParagraph.setAttribute('type', 'text');
        editabelParagraph.setAttribute('value', paragraph.textContent);
        editabelParagraph.classList = paragraph.classList;
        editabelParagraph.classList.add('block', 'w-full', 'bg-yellow-300', 'outline-black');

        //Save Changes on loss of focus from text input:-
        editabelParagraph.addEventListener('blur', () => {
            paragraph.textContent = editabelParagraph.value;
            card.replaceChild(paragraph, editabelParagraph);
        });

        //Save Changes on press of Enter key:-
        editabelParagraph.addEventListener('keypress', (event) => {
            if (event.keyCode === 13) {
                editabelParagraph.blur();
            }
        })

        if (order === 'Edit') {
            card.replaceChild(editabelParagraph, paragraph);
            editabelParagraph.addEventListener('input', (e) => {

                if (editabelParagraph.classList.contains('dish-title')) {
                    newTitle = editabelParagraph.value;
                    oldTitle = editabelParagraph.value;
                    /*if (!editedValue) {
                        newDescription = oldDescription;
                        newPrice = oldPrice;
                    }
                    editedValue = true;*/
                }
                else if (editabelParagraph.classList.contains('dish-description')) {
                    newDescription = editabelParagraph.value;
                    oldDescription = editabelParagraph.value;
                    /*if (!editedValue) {
                        newTitle = oldTitle;
                        newPrice = oldPrice;
                    }
                    editedValue = true;*/
                }
                else if (editabelParagraph.classList.contains('dish-price')) {
                    newPrice = editabelParagraph.value;
                    oldPrice = editabelParagraph.value;
                    /*if (!editedValue) {
                        newTitle = oldTitle;
                        newDescription = oldDescription;
                    }
                    editedValue = true;*/
                }
                //console.log(newTitle, newDescription, newPrice);
                /*if (!editedValue) {
                    saveBtn = addSaveBtn(oldImage, oldTitle, oldDescription, oldPrice);
                    card.appendChild(saveBtn);
                    editedValue = true;
                    return editedValue = true;
                }*/
                if (editBtn.parentElement.lastChild.textContent !== 'Save Dish') {
                    editBtn.parentElement.appendChild(addSaveBtn(cardId, newImage, imageName, oldTitle, oldDescription, oldPrice, newImage, imageName, newTitle, newDescription, newPrice));
                }
                else {
                    editBtn.parentElement.lastChild.remove();
                    editBtn.parentElement.appendChild(addSaveBtn(cardId, newImage, imageName, oldTitle, oldDescription, oldPrice, newImage, imageName, newTitle, newDescription, newPrice));
                }
            })
        }

        else if (order === 'Done') {
            let inputClassList = Array.from(paragraph.classList);
            for (let i = 0; i < cardParagraphs.length; i++) {
                let paragraphClassList = Array.from(cardParagraphs[i].classList);
                for (let j = 0; j < paragraphClassList.length; j++) {
                    if (inputClassList[0] === paragraphClassList[j]) {
                        card.replaceChild(cardParagraphs[i], paragraph);
                    }
                }
            }
        }
        return editedValue;
    }

    editBtn.addEventListener('click', () => {
        let editedValue = false;
        if (cardParagraphs.length > 0) {

            if (editBtn.textContent === 'Edit') {
                let cardParagraphs = Array.from(card.getElementsByTagName('p'));
                cardParagraphs.forEach(cardParagraph => {
                    editedValue = paragraphVsInput(cardParagraph, editBtn.textContent);
                })

                //card.appendChild(addSaveBtn());
                //Changing the title on the edit button to Done:-
                editBtn.textContent = 'Done';
            }

            else if (editBtn.textContent === 'Done') {
                let editableParagraphs = Array.from(editBtn.parentElement.getElementsByTagName('input'));
                editableParagraphs.forEach(editableParagraph => {
                    paragraphVsInput(editableParagraph, editBtn.textContent);
                })
                //Changing the title on the Done button to Edit:-
                editBtn.textContent = 'Edit';
                //alert(editedValue);
                //editBtn.parentElement.lastChild.remove();
            }

        }

        //Adding upload image button:-

        const image_input = editBtn.parentElement.children[2];
        const imageSkin = editBtn.parentElement.children[1];
        const image_holder = editBtn.parentElement.children[0];

        image_input.addEventListener('change', (e) => {
            if (window.FileReader) {
                var file = e.target.files[0];
                var reader = new FileReader();
                if (file && file.type.match('image.*')) {
                    reader.readAsDataURL(file);
                }

                reader.onloadend = function (e) {
                    //let fileName = URL.createObjectURL(file);
                    image_holder.setAttribute('src', reader.result);
                    imageName = file.name;
                    newImage = reader.result;
                    //newImage = fileName;
                    //newImage = card.firstChild.src;
                    //console.log(oldImage);
                    if (editBtn.parentElement.lastChild.textContent !== 'Save Dish') {
                        editBtn.parentElement.appendChild(addSaveBtn(cardId, newImage, imageName, oldTitle, oldDescription, oldPrice, newImage, imageName, newTitle, newDescription, newPrice));
                    }
                }

                //reader.readAsDataURL(this.files[0]);
            }

        })
        //alert(newImage);

        imageSkin.addEventListener('click', () => {
            image_input.click();
        })

        //image_input.classList.toggle('hidden');
        imageSkin.classList.toggle('hidden');

    })

    let cardParagraphs = Array.from(card.getElementsByTagName('p'));
    cardParagraphs.forEach(cardParagraph => {
        cardParagraph.addEventListener('dblclick', function () {
            paragraphVsInput(cardParagraph, 'Edit');
        })

    })
}
function loadingMenu() {
    fetch('http://127.0.0.1:5000/dishes').then(response => {
        //response.json();
        return response.json();
    }).then(response => {
        response['arr'].forEach(res => {
            let newDishCard = document.createElement('div');
            newDishCard.setAttributeNS('id', 'cardID', res['_id']);
            newDishCard.classList.add('dish-card', 'xs:w-100', 'col-span-1', 'shadow-md');
            let newDishImg = document.createElement('img');
            if (res['dishImage'] !== 'empty.jpg') {
                newDishImg.src = '../src/img/dishes/' + res['dishImage'];
            }
            else {
                newDishImg.src = '../src/img/emptyCard/' + res['dishImage'];
            }
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
            let editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            let deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            editBtn.classList.add('dish-order-btn', 'bg-purple-400', 'rounded-3xl', 'text-lg', 'p-2', 'ml-5', 'mt-4', 'w-2/6', 'shadow-xl', 'edit-dish-btn');
            deleteBtn.classList.add('dish-order-btn', 'bg-purple-400', 'rounded-3xl', 'text-lg', 'p-2', 'ml-10', 'mb-5', 'w-2/6', 'shadow-xl', 'delete-dish-btn');
            //let saveBtn = addSaveBtn();
            newDishCard.appendChild(newDishImg);
            newDishCard.appendChild(newImageSkin);
            newDishCard.appendChild(imageInput);
            newDishCard.appendChild(dishTitle);
            newDishCard.appendChild(dishDescription);
            newDishCard.appendChild(dishPrice);
            newDishCard.appendChild(editBtn);
            newDishCard.appendChild(deleteBtn);
            //newDishCard.appendChild(saveBtn);
            dishesMenu.appendChild(newDishCard);
            editBtnsOrder(editBtn);
            deleteBtnsOrder(deleteBtn);
            addDish.classList.remove('hidden');
        })
    })

        .catch(console.error);
}

loadingMenu();
