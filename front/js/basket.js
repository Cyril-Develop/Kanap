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

export function addBasket(product) {
    let basket = getBasket();
    let foundProduct = basket.find(p => p.id == product.id)
    if(foundProduct != undefined){
        let newQuantity = foundProduct.quantity + product.quantity;
        foundProduct.quantity = newQuantity
    }else{
        basket.push(product);
    }
    saveBasket(basket)
};






