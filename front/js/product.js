const itemImg = document.querySelector('.item__img');
const itemTitle = document.querySelector('#title');
const itemPrice = document.querySelector('#price');
const itemDescription = document.querySelector('#description');


const productId = getProductId();
function getProductId(){
    return new URL(location.href).searchParams.get('id')
};

const getProductData = async function(){
    let response = await fetch(`http://localhost:3000/api/products/${productId}`)
    let data = await response.json()
    displayProduct(data)
};
getProductData();

function displayProduct(data){

    itemImg.appendChild(document.createElement('img')).src = data.imageUrl;
    itemTitle.innerHTML = data.name;
    itemPrice.innerHTML = data.price;
    itemDescription.innerHTML = data.description;
    console.log(data);
    console.log(itemImg.src);

};