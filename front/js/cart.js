import {getBasket, saveBasket, saveForm, basketEmpty, productWithdrawn, deleteProductInBasket} from './basket.js'; 

let productApi = []
let totalProductsQuantity = 0;
let totalProductsPrice = 0;
//Recovery of products saved in the local storage and call to the API to recover the missing information
function displayProduct(){

let basket = getBasket();

if(basket.length === 0){
    basketEmpty();
}else{
    for(let product of basket){
        fetch(`http://localhost:3000/api/products/${product.id}`)
            .then(res => res.json())
                .then(data => {
                    let modelCard =
                        `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
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

                    productApi.push(data);
                    deleteProduct();
                    changeTotal(productApi);
                      
                    function changeTotal(productApi){
                        let basket = getBasket();
                        let allInputQuantity = document.querySelectorAll('.itemQuantity');
                        allInputQuantity.forEach(input => {
                            input.addEventListener('change', e => {
                                let targetProduct = e.target.closest("article");
                                let foundTargetProduct = basket.find(product => product.id == targetProduct.getAttribute('data-id') && product.color == targetProduct.getAttribute('data-color'));
                                foundTargetProduct.quantity = Number(input.value); 
                                saveBasket(basket); 
                                
                                if (input.value <= 0) {
                                    input.value = 1;
                                    saveBasket(basket);
                                }; 

                                basket = getBasket();
                                let newQuantite = [];
                                let newPrice = [];

                                for(let j = 0; j < basket.length; j++){
                                    if(basket[j].quantity <= 0){
                                        basket[j].quantity = 1;
                                        saveBasket(basket);
                                    };
                                    newQuantite.push(basket[j].quantity);
                                };
                                for(let i = 0; i < productApi.length; i++){                                
                                    newPrice.push(productApi[i].price);
                                };
                                
                                //Sum of all quantities
                                const newTotalProduct = newQuantite.reduce((acc, x) => {
                                    return acc + x;
                                });

                                //Quantity times price
                                let totalProductsPrice = 0;
                                for(let i = 0; i < newQuantite.length; i++){
                                    totalProductsPrice += newQuantite[i] * newPrice[i];
                                };
                                
                                //Total new quantity
                                totalProductsQuantity = newTotalProduct;
                                document.getElementById("totalQuantity").innerHTML = totalProductsQuantity;
                                //Total new price
                                document.getElementById("totalPrice").innerHTML = totalProductsPrice;
                            })
                        });
                    }                   
            }
    )}
}};

displayProduct();

function deleteProduct(){
    const deleteItem = document.querySelectorAll('.deleteItem');
          
    deleteItem.forEach(item => {
        item.addEventListener('click', () => {
            let target = item.closest('article');
            deleteProductInBasket(target)
            target.style.display = "none";
            productWithdrawn();   
        }); 
    });
};

//Message sent if the input is empty when the form is sent
function inputEmpty(errorMsg, input){
    errorMsg.innerHTML = 'Veuillez renseigner ce champ.';
    input.classList.add('showInputError')
    setTimeout(() => {
        errorMsg.innerHTML = '';
        input.classList.remove('showInputError')
    }, 3000);
};

//Message sent if the input value is not correct
let errorMessage = [];
let message = {
    name : 'Minimum 3 caractères, maximum 15 caractères. Les chiffres et caractères spéciaux différents de - ne sont pas autorisés',
    address : 'Minimum 3 caractères, maximum 15 caractères. Les caractères spéciaux ne sont pas autorisés.',
    city : 'Minimum 3 caractères, maximum 15 caractères. Les chiffres et caractères spéciaux ne sont pas autorisés',
    email : 'Veuillez renseigner une adresse mail valide.'
};
errorMessage.push(message);
function inputNotValid(input, errorMsg, msg){
    errorMsg.innerHTML = msg;
    input.classList.add('showInputError');
    setTimeout(() => {
        errorMsg.innerHTML = '';
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

//Send information of cart and form products to server to retrieve order id
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