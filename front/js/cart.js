import {getBasket} from './basket.js'; 
import {saveBasket} from './basket.js'; 
import {getForm} from './basket.js'; 
import {saveForm} from './basket.js'; 

let totalProductsQuantity = 0;
let totalProductsPrice = 0;
function displayProduct(){

    let productInStorage = getBasket();

    if(productInStorage.length === 0){
        document.querySelector('.cartAndFormContainer h1').innerHTML = 'Votre panier est vide.';
        document.querySelector('.cart').style.display = 'none';
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
                            <p>${data.price} €</p>
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

                changeTotal();
                deleteProduct();
                //Total product quantity
                totalProductsQuantity += product.quantity;
                document.getElementById("totalQuantity").innerHTML = totalProductsQuantity;
                //Total product price
                totalProductsPrice += product.quantity * data.price;
                document.getElementById("totalPrice").innerHTML = totalProductsPrice;

                function changeTotal(){
                    let productInStorage = getBasket();
                    let allInputQuantity = document.querySelectorAll('.itemQuantity');
                    allInputQuantity.forEach(input => {
                        input.addEventListener('change', e => {

                            if (input.value < 1) {
                                input.value = 1;
                            } else {
                                let targetProduct = e.target.closest("article").getAttribute('data-id');
                                let foundTargetProduct = productInStorage.find(product => product.id == targetProduct);
                                foundTargetProduct.quantity = Number(input.value);

                                saveBasket(productInStorage)
                            }
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
    }
};
displayProduct();

function deleteProduct(){
    let productInStorage = getBasket();

    const deleteItem = document.querySelectorAll('.deleteItem');

    deleteItem.forEach(item => {

        item.addEventListener('click', () => {
            let produtSelectedForDeletion = item.closest('article');
            let idProductToDelete = produtSelectedForDeletion.getAttribute('data-id');
            const foundProductInStorage = productInStorage.find(el => el.id === idProductToDelete);
            const indexProduct = productInStorage.indexOf(foundProductInStorage);
            productInStorage.splice(indexProduct, 1);
            saveBasket(productInStorage)
            if(productInStorage.length === 0){
                localStorage.clear()
            }
            alert('Produit retiré du panier')
            location.reload();    
        }); 
    });
};

/*FORMULAIRE*/

let form = getForm();

if(form !== null){
    document.querySelector('#firstName').value = form.firstName;
    document.querySelector('#lastName').value = form.lastName;
    document.querySelector('#address').value = form.address;
    document.querySelector('#city').value = form.city;
    document.querySelector('#email').value = form.email;
};

function showErrorInput(inputMessage, input){
    inputMessage.innerHTML = 'Veuillez renseigner ce champ.';
    input.classList.add('showInputError')
    setTimeout(() => {
        inputMessage.innerHTML = '';
        input.classList.remove('showInputError')
    }, 3000);
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

    document.querySelector('#firstNameErrorMsg').innerHTML = '';
    document.querySelector('#firstName').style.border = 'none';
    document.querySelector('#lastNameErrorMsg').innerHTML = '';
    document.querySelector('#lastName').style.border = 'none';
    document.querySelector('#addressErrorMsg').innerHTML = '';
    document.querySelector('#address').style.border = 'none';
    document.querySelector('#cityErrorMsg').innerHTML = '';
    document.querySelector('#city').style.border = 'none';
    document.querySelector('#emailErrorMsg').innerHTML = '';
    document.querySelector('#email').style.border = 'none';

    if(formValue.firstName == ''){
        showErrorInput(document.querySelector('#firstNameErrorMsg'), document.querySelector('#firstName'))
    } else if(!/^([A-Aa-z]{3,15})?([-]{0,1})?([A-Aa-z]{3,15})$/.test(formValue.firstName)){
        document.querySelector('#firstNameErrorMsg').innerHTML = 'Minimum 3 caractères, maximum 15 caractères. Les chiffres et caractères spéciaux différents de - ne sont pas autorisés.';
        document.querySelector('#firstName').style.border = '2px solid crimson';    
    } else {
        inputValidation.firstName = true;
    };

    if(formValue.lastName == ''){
        showErrorInput(document.querySelector('#lastNameErrorMsg'), document.querySelector('#lastName'))
    } else if(!/^([A-Aa-z|\s]{3,15})?([-]{0,1})?([A-Aa-z|\s]{3,15})$/.test(formValue.lastName)){
        document.querySelector('#lastNameErrorMsg').innerHTML = 'Minimum 3 caractères, maximum 15 caractères. Les chiffres et caractères spéciaux différents de - ne sont pas autorisés.';
        document.querySelector('#lastName').style.border = '2px solid crimson';    
    } else {
        inputValidation.lastName = true;
    };

    if(formValue.address == ''){
        showErrorInput(document.querySelector('#addressErrorMsg'), document.querySelector('#address'))
    } else if(!/^[A-Za-z0-9\s]{3,50}$/.test(formValue.address)){
        document.querySelector('#addressErrorMsg').innerHTML = 'Minimum 3 caractères, maximum 15 caractères. Les caractères spéciaux ne sont pas autorisés.';
        document.querySelector('#address').style.border = '2px solid crimson';    
    } else {
        inputValidation.address = true;
    };

    if(formValue.city == ''){
        showErrorInput(document.querySelector('#cityErrorMsg'), document.querySelector('#city'))
    } else if(!/^([a-zA-Z|\s]{3,15})?([-]{0,1})$/.test(formValue.city)){
        document.querySelector('#cityErrorMsg').innerHTML = 'Minimum 3 caractères, maximum 15 caractères. Les chiffres et caractères spéciaux ne sont pas autorisés.';
        document.querySelector('#city').style.border = '2px solid crimson';    
    } else {
        inputValidation.city = true;
    };

    if(formValue.email == ''){
        showErrorInput(document.querySelector('#emailErrorMsg'), document.querySelector('#email'))
    } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formValue.email)){
        document.querySelector('#emailErrorMsg').innerHTML = 'Minimum 2 caractères, maximum 15 caractères. Les chiffres et caractères spéciaux ne sont pas autorisés.';
        document.querySelector('#email').style.border = '2px solid crimson';    
    } else {
        inputValidation.email = true;
    };

    if(inputValidation.firstName, inputValidation.lastName, inputValidation.address, inputValidation.city, inputValidation.email){
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
    



                 






