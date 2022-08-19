const itemImg = document.querySelector('.item__img');
const itemTitle = document.querySelector('#title');
const itemPrice = document.querySelector('#price');
const itemDescription = document.querySelector('#description');
const itemcolors = document.querySelector('#colors');
const btnAddToCart = document.getElementById('addToCart');
const blocItemContent = document.querySelector('.item__content__settings');
const infoError = document.createElement('p');

function showError(infoError){
    blocItemContent.append(infoError);
    infoError.classList.add('showError');
    setTimeout(() => {
        infoError.remove('showError')
    }, 4000);
};

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
        newOption.innerHTML = `<option value="${color}">${color}</option>`
        itemcolors.append(newOption);
    };
    getProductChooses(data);
};

function getProductChooses(data){

        btnAddToCart.addEventListener('click', () => {

            const itemQuantity = document.getElementById('quantity').value;

            const productChooses = [];

            if(itemQuantity <= 0 ){
                console.log('quantité mauvaise');
                infoError.innerHTML = '<p>Veuillez choisir une quantité</p>';
                showError(infoError);
            };
            if(itemcolors.value !== '' && itemQuantity >= 1) {
                productChooses.push({id :data._id, quantity : itemQuantity, color : itemcolors.value});
                console.log(productChooses);      
            }; 
    });

};
