import {getBasket} from './basket.js'; 
import {saveBasket} from './basket.js'; 

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

                changeTotal(product);

                //Total quantite produit
                totalProductsQuantity += product.quantity;
                document.getElementById("totalQuantity").innerHTML = totalProductsQuantity;
                //Total quantite produit
                totalProductsPrice += product.quantity * data.price;
                document.getElementById("totalPrice").innerHTML = totalProductsPrice;
        
                deleteProduct();
            }
        )}
    }
}
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

function changeTotal(product){
    let productInStorage = getBasket();
    let allInputQuantity = document.querySelectorAll('.itemQuantity');
    allInputQuantity.forEach(input => {
        input.addEventListener('change', e => {
            if (input.value < 1) {
                input.value = 1;
            } else {
                console.log(input);
                let targetProduct = e.target.closest("article").getAttribute('data-id');
                let foundTargetProduct = productInStorage.find(product => product.id == targetProduct);
                foundTargetProduct.quantity = Number(input.value);
                console.log(product);
                saveBasket(productInStorage)
            }
        })
    });
}
                 






