
let productStorage = JSON.parse(localStorage.getItem('productSelected'));

productStorage.forEach(element => {
    showProductCart(element)
});

function showProductCart(element){

    console.log(element);

}