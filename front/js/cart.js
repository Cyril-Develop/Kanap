const productInStorage = JSON.parse(localStorage.getItem('productSelected'));

console.log(productInStorage);

if(!productInStorage){
    document.querySelector('.cartAndFormContainer h1').innerHTML = 'Votre panier est vide.';
    document.querySelector('.cart').style.display = 'none';
}else{
    for(let product of productInStorage){
        let modelCard = ` <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                            <div class="cart__item__img">
                            <img src="${product.img}" alt="Photographie d'un canapé ${product.name}">
                            </div>
                            <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${product.name}</h2>
                                <p>${product.color}</p>
                                <p>${product.price} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                <p class="deleteItem" id="[item_Id]">Supprimer</p>
                                </div>
                            </div>
                            </div>
                        </article>`;
        document.querySelector('#cart__items').innerHTML += modelCard;  
            
    }

};

function displayTotal(){
    
}





