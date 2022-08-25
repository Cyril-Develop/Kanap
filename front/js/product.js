const itemImg = document.querySelector('.item__img');
const itemTitle = document.querySelector('#title');
const itemPrice = document.querySelector('#price');
const itemDescription = document.querySelector('#description');
const itemcolors = document.querySelector('#colors');
const btnAddToCart = document.getElementById('addToCart');
const blocItemContent = document.querySelector('.item__content__settings');
const blocItem = document.querySelector('.item__img');

const getProductData = async function(){
    const productId = new URL(location.href).searchParams.get('id');
    const response = await fetch(`http://localhost:3000/api/products/${productId}`);
    const data = await response.json();
    displayProduct(data);
};
getProductData();

function displayProduct(data){
    itemImg.appendChild(document.createElement('img')).src = data.imageUrl;
    itemTitle.innerHTML = data.name;
    itemPrice.innerHTML = data.price;
    itemDescription.innerHTML = data.description;
    for(let color of data.colors){
        let newOption = document.createElement('option');
        newOption.innerHTML = `<option value="${color}">${color}</option>`;
        itemcolors.append(newOption);
    };
    getchosenProducts(data);
};

class optionsProductSelected {
    constructor(id, quantity, color){
        this.id = id, 
        this.quantity = Number(quantity),
        this.color = color
    }
};
function getchosenProducts(data){

        btnAddToCart.addEventListener('click', () => {

            const itemQuantity = document.getElementById('quantity').value;

            if(itemQuantity <= 0 ){
                infoError.innerHTML = '<p>Veuillez choisir une quantité</p>';
                showError(infoError);
            } else {
                const choiceOptionsProduct = new optionsProductSelected(data._id, itemQuantity, itemcolors.value);
                pushToLocalStorage(choiceOptionsProduct);   
            };    
    });
};

function pushToLocalStorage(choiceOptionsProduct){

    let registeredProducts = JSON.parse(localStorage.getItem('productSelected'))

    if(!registeredProducts){

        registeredProducts = [];
        registeredProducts.push(choiceOptionsProduct);
        localStorage.setItem('productSelected', JSON.stringify(registeredProducts));
        console.log(registeredProducts);
        popupAddToCart()

    } else {
        const compareProducts = registeredProducts.find(el => el.id === choiceOptionsProduct.id && el.color === choiceOptionsProduct.color);

        if(compareProducts) {
            let newQuantity = choiceOptionsProduct.quantity + compareProducts.quantity;
            compareProducts.quantity = newQuantity;
            localStorage.setItem("productSelected", JSON.stringify(registeredProducts));
            console.log(registeredProducts);   
            popupAddToCart()     
        } else {
            registeredProducts.push(choiceOptionsProduct);
            localStorage.setItem("productSelected", JSON.stringify(registeredProducts));
            console.log(registeredProducts);
            popupAddToCart()
        }
    };

    function popupAddToCart(){
        const showPopup = document.createElement('p');
        showPopup.innerHTML = '<p>Produit ajouté au panier</p>'
        blocItem.append(showPopup);
        showPopup.classList.add('popupAddToCart');
        setTimeout(() => {
            showPopup.remove('popupAddToCart')
        }, 2000);
    }
};    

const infoError = document.createElement('p');
function showError(infoError){
    blocItemContent.append(infoError);
    infoError.classList.add('showError');
    setTimeout(() => {
        infoError.remove('showError')
    }, 4000);
};
