const itemImg = document.querySelector('.item__img');
const itemTitle = document.querySelector('#title');
const itemPrice = document.querySelector('#price');
const itemDescription = document.querySelector('#description');
let itemcolors = document.querySelector('#colors');
const btnAddToCart = document.getElementById('addToCart');

const productId = getProductId();
function getProductId(){
    return new URL(location.href).searchParams.get('id')
};

const getProductData = async function(){
    let response = await fetch(`http://localhost:3000/api/products/${productId}`)
    let data = await response.json();
    displayProduct(data);
};
getProductData();

function displayProduct(data){
    console.log(data);
    itemImg.appendChild(document.createElement('img')).src = data.imageUrl;
    itemTitle.innerHTML = data.name;
    itemPrice.innerHTML = data.price;
    itemDescription.innerHTML = data.description;
    for(let i = 0; i < data.colors.length; i++){
        let newOption = document.createElement('option')
        newOption.innerHTML = `<option value="${data.colors[i]}">${data.colors[i]}</option>`
        itemcolors.append(newOption);
    };

    getProductChooses(data);
};

function getProductChooses(data){

        btnAddToCart.addEventListener('click', () => {

            let productChooses = [];

            const itemQuantity = document.getElementById('quantity').value;

            const productChoosesId = data._id;
            const productChoosesQuantity = itemQuantity;
            const productChoosesColor = itemcolors.value;

            productChooses.push(productChoosesId, productChoosesQuantity, productChoosesColor);
            console.log(productChooses);
    });

};
