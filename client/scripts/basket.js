export function basketEmpty(){
    document.querySelector('.cart_empty').style.display = 'block';
    document.querySelector('.cart').style.display = 'none';
};

export function productRemoved(){
    const showPopup = document.createElement('p');
    const body = document.querySelector('body');
    showPopup.innerHTML = '<p>Produit retiré du panier</p>';
    body.append(showPopup);
    showPopup.classList.add('popup');
    setTimeout(() => {
        showPopup.remove('popup');
    }, 2000);
};

export function popup(message){
    const showPopup = document.createElement('p');
    const body = document.querySelector('body');
    showPopup.innerHTML = `<p>${message}</p>`;
    body.append(showPopup);
    showPopup.classList.add('popup');
    setTimeout(() => {
        showPopup.remove('popup');
    }, 2000);
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

export function modifyQuantityAndPrice(target) {
    // Quantité et prix global du panier
    const productsQuantity = document.querySelector("#totalQuantity");
    const productsPrice = document.querySelector("#totalPrice");

    let productsQuantityValue = productsQuantity.textContent;
    let productsPriceValue = productsPrice.textContent.replace("€", "");

    // Quantité et prix du produit supprimé
    const productPriceDeleted = target.querySelector(".cart__item__content__description p").textContent.replace("€", "");       
    const productQuantityDeleted = target.querySelector(".itemQuantity").value;

    // Calcul de la quantité et du prix global du panier
    let newQuantity = productsQuantityValue - productQuantityDeleted;
    let newPrice = productsPriceValue - productPriceDeleted * productQuantityDeleted;
        
    // Affichage de la quantité et du prix global du panier
    productsQuantity.textContent = newQuantity;
    productsPrice.textContent = newPrice + "€";
}

export function addBasket(product) {
    let basket = getBasket();
    let foundProduct = basket.find(p => p.id == product.id && p.color == product.color);
    if(foundProduct != undefined){
        let newQuantity = foundProduct.quantity + product.quantity;
        foundProduct.quantity = newQuantity;
    }else{
        basket.push(product);
    }
    basket.sort(function (a, b) {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        if (a.id = b.id){
          if (a.color < b.color) return -1;
          if (a.color > b.color) return 1;
        }
        return 0;
      });
    saveBasket(basket);
};

export function saveForm(formValue){
    localStorage.setItem('form', JSON.stringify(formValue));
};

export function getForm(){
    let form = localStorage.getItem('form');
    return JSON.parse(form);
};