export function basketEmpty(){
    document.querySelector('.cartAndFormContainer h1').innerHTML = 'Votre panier est vide.';
    document.querySelector('.cart').style.display = 'none';
};

export function productWithdrawn(){
    const showPopup = document.createElement('p');
    const body = document.querySelector('body');
    showPopup.innerHTML = '<p>Produit retiré du panier</p>'
    body.append(showPopup);
    showPopup.classList.add('popupAddToCart');
    setTimeout(() => {
        showPopup.remove('popupAddToCart')
    }, 1000);
};

export function saveBasket(basket){
    localStorage.setItem('basket', JSON.stringify(basket));
};

export function getBasket(){
    let basket = localStorage.getItem('basket');
    if(basket == null){
        return [];
    } else {
        return JSON.parse(basket);
    }
};

export function deleteProductInBasket(target){
    let basket = getBasket();
    productWithdrawn();
    basket = basket.filter(p => p.id !== target.getAttribute('data-id') || p.color !== target.getAttribute('data-color'))
    console.log(basket);
     saveBasket(basket);
     setTimeout(() => {
        window.location.reload();
    }, 200);
    if(basket.length === 0){
        localStorage.clear();
        basketEmpty();
    }     
};

export function addBasket(product) {
    let basket = getBasket();
    let foundProduct = basket.find(p => p.id == product.id && p.color == product.color)
    if(foundProduct != undefined){
        let newQuantity = foundProduct.quantity + product.quantity;
        foundProduct.quantity = newQuantity
    }else{
        basket.push(product);
    }
    saveBasket(basket)
};

//Formulaire

export function saveForm(formValue){
    localStorage.setItem('form', JSON.stringify(formValue));
};

export function getForm(){
    let form = localStorage.getItem('form');
    return JSON.parse(form);
};


