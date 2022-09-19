import {getBasket, saveBasket, saveForm, basketEmpty, productWithdrawn, deleteProductInBasket} from './basket.js'; 

let productApi = [];
let productStorage = [];
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
        .then(res => {
            if(!res.ok){
                console.log('Retour du serveur : ', res.status);
                document.querySelector('.cartAndFormContainer h1').innerHTML = 'Nous ne parvenons pas à afficher cette page...';
                document.querySelector('.cart').style.display = 'none';
            } else {
                res.json().then(data => {
                    productApi.push(data);
                    productStorage.push(product);
                    //Sorts products according id
                    productApi.sort(function (a, b) {
                        if (a._id < b._id) return -1;
                        if (a._id > b._id) return 1;
                        return 0;                        
                    });
                    productStorage.sort(function (a, b) {
                        if (a.id < b.id) return -1;
                        if (a.id > b.id) return 1;
                        return 0;                        
                    });
                    
                    if(productApi.length === basket.length){
                        showDetails(productApi, productStorage)
                    }               
                })
            }}
    )}
}};

function showDetails(productApi, productStorage){
    for(let i = 0; i < productApi.length; i++){

        let productArticle = document.createElement("article");
        productArticle.className = "cart__item"
        document.querySelector("#cart__items").appendChild(productArticle);
        productArticle.setAttribute("data-id", `${productStorage[i].id}`);
        productArticle.setAttribute("data-color", `${productStorage[i].color}`);

        let productDivImg = document.createElement("div");
        productArticle.appendChild(productDivImg);
        productDivImg.className = "cart__item__img";

        let productImg = document.createElement("img");
        productDivImg.appendChild(productImg);
        productImg.src = `${productApi[i].imageUrl}`;
       
        let productItemContent = document.createElement("div");
        productArticle.appendChild(productItemContent);
        productItemContent.className = "cart__item__content";

        let productItemContentTitlePrice = document.createElement("div");
        productItemContent.appendChild(productItemContentTitlePrice);
        productItemContentTitlePrice.className = "cart__item__content__description";

        let productTitle = document.createElement("h2");
        productItemContentTitlePrice.appendChild(productTitle);
        productTitle.innerHTML = `${productApi[i].name}`;

        let productColor = document.createElement("p");
        productTitle.appendChild(productColor);
        productColor.innerHTML = `${productStorage[i].color}`;
        //productColor.style.fontSize = "20px";

        let productPrice = document.createElement("p");
        productItemContentTitlePrice.appendChild(productPrice);
        productPrice.innerHTML = `${productApi[i].price} €`;

        let productItemContentSettings = document.createElement("div");
        productItemContent.appendChild(productItemContentSettings);
        productItemContentSettings.className = "cart__item__content__settings";

        let productItemContentSettingsQuantity = document.createElement("div");
        productItemContentSettings.appendChild(productItemContentSettingsQuantity);
        productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";

        let productQty = document.createElement("p");
        productItemContentSettingsQuantity.appendChild(productQty);
        productQty.innerHTML = "Qté : ";

        let productQuantity = document.createElement("input");
        productItemContentSettingsQuantity.appendChild(productQuantity);
        productQuantity.value = `${productStorage[i].quantity}`;
        productQuantity.className = "itemQuantity";
        productQuantity.setAttribute("type", "number");
        productQuantity.setAttribute("min", "1");
        productQuantity.setAttribute("max", "100");
        productQuantity.setAttribute("name", "itemQuantity");

        let productItemContentSettingsDelete = document.createElement("div");
        productItemContentSettings.appendChild(productItemContentSettingsDelete);
        productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

        let productSupprimer = document.createElement("p");
        productItemContentSettingsDelete.appendChild(productSupprimer);
        productSupprimer.className = "deleteItem";
        productSupprimer.innerHTML = "Supprimer";
  
        //Total product quantity
        totalProductsQuantity += productStorage[i].quantity;
        document.getElementById("totalQuantity").innerHTML = totalProductsQuantity;
        //Total product price
        totalProductsPrice += productStorage[i].quantity * productApi[i].price;
        document.getElementById("totalPrice").innerHTML = totalProductsPrice;

        changeTotal(productApi);

        deleteProduct();
            
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
                    let newQuantity = [];
                    let newPrice = [];   

                    for(let j = 0; j < basket.length; j++){
                        if(basket[j].quantity <= 0){
                            basket[j].quantity = 1;
                            saveBasket(basket);
                        };
                        newQuantity.push(basket[j].quantity);
                        saveBasket(basket);
                    };
                    for(let i = 0; i < productApi.length; i++){                                
                        newPrice.push(productApi[i].price);
                    };
                    
                    //Sum of all quantities
                    const newTotalProduct = newQuantity.reduce((acc, x) => {
                        return acc + x;
                    });

                    //Quantity times price
                    let totalProductsPrice = 0;
                    for(let i = 0; i < newQuantity.length; i++){
                        totalProductsPrice += newQuantity[i] * newPrice[i];
                    };
                    
                    //Total new quantity
                    totalProductsQuantity = newTotalProduct;
                    document.getElementById("totalQuantity").innerHTML = totalProductsQuantity;
                    //Total new price
                    document.getElementById("totalPrice").innerHTML = totalProductsPrice;
                })
            })
        }
    }
};
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
    address : `Minimum 10 caractères, maximum 50 caractères. Les caractères spéciaux différents de , . ' - ne sont pas autorisés.`,
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
    }, 8000);
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
    } else if(!/^([A-Za-z|\s]{3,15})?([-]{0,1})?([A-Za-z|\s]{3,15})$/.test(formValue.firstName)){
        inputNotValid(document.querySelector('#firstName'), document.querySelector('#firstNameErrorMsg'), errorMessage[0].name);
    } else {
        inputValidation.firstName = true;
    };

    if(formValue.lastName == ''){
        inputEmpty(document.querySelector('#lastNameErrorMsg'), document.querySelector('#lastName'));
    } else if(!/^([A-Za-z|\s]{3,15})?([-]{0,1})?([A-Za-z|\s]{3,15})$/.test(formValue.lastName)){
        inputNotValid(document.querySelector('#lastName'), document.querySelector('#lastNameErrorMsg'), errorMessage[0].name);   
    } else {
        inputValidation.lastName = true;
    };

    if(formValue.address == ''){
        inputEmpty(document.querySelector('#addressErrorMsg'), document.querySelector('#address'));
    } else if(!/^[a-zA-Z0-9\s,.'-]{10,50}$/.test(formValue.address)){
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
                document.location.href =`confirmation.html?id=${data.orderId}`;
                localStorage.clear();
    });
};      