import {getBasket} from './basket.js'; 
import {saveBasket} from './basket.js'; 
import {saveForm} from './basket.js'; 
import {getForm} from './basket.js'; 

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

/************/
/*FORMULAIRE*/
/************/
let form = getForm();

document.querySelector('#firstName').value = form.firstName;
document.querySelector('#lastName').value = form.lastName;
document.querySelector('#address').value = form.address;
document.querySelector('#city').value = form.city;
document.querySelector('#email').value = form.email;

document.querySelector('.cart__order__form').addEventListener('submit', (e) => {
    
    e.preventDefault();
    
    const formValue = {
        firstName : document.querySelector('#firstName').value,
        lastName : document.querySelector('#lastName').value,
        address : document.querySelector('#address').value,
        city : document.querySelector('#city').value,
        email : document.querySelector('#email').value
    }

    saveForm(formValue);

});

                 






