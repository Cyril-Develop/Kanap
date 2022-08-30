import {getBasket, saveBasket, saveForm, basketEmpty, productWithdrawn} from './basket.js'; 

let totalProductsQuantity = 0;
let totalProductsPrice = 0;
function displayProduct(){

let productInStorage = getBasket();

if(productInStorage.length === 0){
    basketEmpty();
}else{
    for(let product of productInStorage){
        fetch(`http://localhost:3000/api/products/${product.id}`)
            .then(res => res.json())
                .then(data => {
                    let modelCard =
                        `<article class="cart__item" data-id="${data._id}" data-color="${product.color}">
                            <div class="cart__item__img">
                            <img src="${data.imageUrl}" alt="Photographie d'un canapé ${data.name}">
                            </div>
                            <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${data.name}</h2>
                                <p>${product.color}</p>
                                <p class="price">${data.price} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                            </div>
                        </article>`;
                    document.querySelector('#cart__items').innerHTML += modelCard; 

                    //Total product quantity
                    totalProductsQuantity += product.quantity;
                    document.getElementById("totalQuantity").innerHTML = totalProductsQuantity;
                    //Total product price
                    totalProductsPrice += product.quantity * data.price;
                    document.getElementById("totalPrice").innerHTML = totalProductsPrice;

                    changeTotal();
                    deleteProduct();

                    function changeTotal(){
                        let allInputQuantity = document.querySelectorAll('.itemQuantity');
                        allInputQuantity.forEach(input => {
                            input.addEventListener('change', e => {
                                let productInStorage = getBasket();

                                if (input.value < 1) {
                                    input.value = 1;
                                } else {
                                    let targetProductId = e.target.closest("article").getAttribute('data-id');
                                    let foundTargetProduct = productInStorage.find(product => product.id == targetProductId);
                                    foundTargetProduct.quantity = Number(input.value);

                                    saveBasket(productInStorage);
                                };
                                
                                let newTotalProduct = 0;
                                for(let product of productInStorage){
                                    newTotalProduct += product.quantity;
                                }
                                //Total new quantity
                                totalProductsQuantity = newTotalProduct;
                                document.getElementById("totalQuantity").innerHTML = totalProductsQuantity;
                                //Total new price
                                totalProductsPrice = newTotalProduct * data.price;
                                document.getElementById("totalPrice").innerHTML = totalProductsPrice;
                            })
                        });
                    }                   
            }
    )}
}};
displayProduct();

function deleteProduct(){
    let productInStorage = getBasket();

    const deleteItem = document.querySelectorAll('.deleteItem');
          
    deleteItem.forEach(item => {
        item.addEventListener('click', () => {
            let produtSelectedForDeletion = item.closest('article');
            const foundProductToDelete = productInStorage.find(el => el.id === produtSelectedForDeletion.getAttribute('data-id'));
            const indexProduct = productInStorage.indexOf(foundProductToDelete);
            productInStorage.splice(indexProduct, 1);
            saveBasket(productInStorage);
            produtSelectedForDeletion.style.display = "none";
            productWithdrawn();
            setTimeout(() => {
                window.location.reload();
            }, 200);
            if(productInStorage.length === 0){
                localStorage.clear();
                basketEmpty();
            }    
            //Total product quantity
            //totalProductsQuantity -= foundProductToDelete.quantity;
            //document.getElementById("totalQuantity").innerHTML = totalProductsQuantity;   
        }); 
    });
};

/*FORMULAIRE*/

function inputEmpty(inputMessage, input){
    inputMessage.innerHTML = 'Veuillez renseigner ce champ.';
    input.classList.add('showInputError')
    setTimeout(() => {
        inputMessage.innerHTML = '';
        input.classList.remove('showInputError')
    }, 3000);
};

let errorMessage = [];
let message = {
    name : 'Minimum 3 caractères, maximum 15 caractères. Les chiffres et caractères spéciaux différents de - ne sont pas autorisés',
    address : 'Minimum 3 caractères, maximum 15 caractères. Les caractères spéciaux ne sont pas autorisés.',
    city : 'Minimum 3 caractères, maximum 15 caractères. Les chiffres et caractères spéciaux ne sont pas autorisés',
    email : 'Veuillez renseigner une adresse mail valide.'
}
errorMessage.push(message);
function inputNotValid(input, inputText, text){
    inputText.innerHTML = text;
    input.classList.add('showInputError')
    setTimeout(() => {
        inputText.innerHTML = '';
        input.classList.remove('showInputError')
    }, 5000);
};

document.querySelector('.cart__order__form').addEventListener('submit', (e) => {
    
    e.preventDefault();

    let formValue = {
        firstName : document.querySelector('#firstName').value,
        lastName : document.querySelector('#lastName').value,
        address : document.querySelector('#address').value,
        city : document.querySelector('#city').value,
        email : document.querySelector('#email').value
    };

    let inputValidation = {
        firstName : false,
        lastName : false,
        address : false,
        city : false,
        email : false
    };

    if(formValue.firstName == ''){
        inputEmpty(document.querySelector('#firstNameErrorMsg'), document.querySelector('#firstName'));
    } else if(!/^([A-Aa-z]{3,15})?([-]{0,1})?([A-Aa-z]{3,15})$/.test(formValue.firstName)){
        inputNotValid(document.querySelector('#firstName'), document.querySelector('#firstNameErrorMsg'), errorMessage[0].name);
    } else {
        inputValidation.firstName = true;
    };

    if(formValue.lastName == ''){
        inputEmpty(document.querySelector('#lastNameErrorMsg'), document.querySelector('#lastName'));
    } else if(!/^([A-Aa-z|\s]{3,15})?([-]{0,1})?([A-Aa-z|\s]{3,15})$/.test(formValue.lastName)){
        inputNotValid(document.querySelector('#lastName'), document.querySelector('#lastNameErrorMsg'), errorMessage[0].name);   
    } else {
        inputValidation.lastName = true;
    };

    if(formValue.address == ''){
        inputEmpty(document.querySelector('#addressErrorMsg'), document.querySelector('#address'));
    } else if(!/^[A-Za-z0-9\s]{3,50}$/.test(formValue.address)){
        inputNotValid(document.querySelector('#address'), document.querySelector('#addressErrorMsg'), errorMessage[0].address);   
    } else {
        inputValidation.address = true;
    };

    if(formValue.city == ''){
        inputEmpty(document.querySelector('#cityErrorMsg'), document.querySelector('#city'));
    } else if(!/^([a-zA-Z|\s]{3,15})?([-]{0,1})$/.test(formValue.city)){
        inputNotValid(document.querySelector('#city'), document.querySelector('#cityErrorMsg'), errorMessage[0].city);  
    } else {
        inputValidation.city = true;
    };

    if(formValue.email == ''){
        inputEmpty(document.querySelector('#emailErrorMsg'), document.querySelector('#email'));
    } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formValue.email)){
        inputNotValid(document.querySelector('#email'), document.querySelector('#emailErrorMsg'), errorMessage[0].email);  
    } else {
        inputValidation.email = true;
    };

    if(inputValidation.firstName && inputValidation.lastName &&  inputValidation.address && inputValidation.city && inputValidation.email){
        saveForm(formValue);
        sendForm(formValue);
    }
}); 

function sendForm(formValue){

    let productInStorage = getBasket();
    let products = [];
    for(let product of productInStorage){
        products.push(product.id)
    }

    let contact = formValue;

    const sendFormData = {
        contact,
        products,
      }

      const options = {
        method: 'POST',
        body: JSON.stringify(sendFormData),
        headers: { 
          'Content-Type': 'application/json',
        }
      };

    fetch("http://localhost:3000/api/products/order", options)
        .then(response => response.json())
            .then(data => {
                localStorage.setItem('orderId', data.orderId);
                document.location.href =`confirmation.html?id=${data.orderId}`;
                localStorage.clear();
    });

};      
    



                 






