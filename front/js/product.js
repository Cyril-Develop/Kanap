const itemImg = document.querySelector('.item__img');
const itemTitle = document.querySelector('#title');
const itemPrice = document.querySelector('#price');
const itemDescription = document.querySelector('#description');
let itemcolors = document.querySelector('#colors');
const btnAddToCart = document.getElementById('addToCart');

const blocItemContent = document.querySelector('.item__content__settings');
let infoError = document.createElement('p');

function showErrorInfos(infoError){
    infoError.style.color = 'black'
    infoError.style.fontSize = '20px'
    infoError.style.fontWeight = '600'
    blocItemContent.append(infoError)
    setTimeout(() => {
        infoError.remove()
    }, 1500);
}

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

            const itemQuantity = document.getElementById('quantity').value;

            const productChooses = []

            if(itemcolors.value === '' || itemQuantity == 0) {
                console.log('Remplir toutes les infos');
                infoError.innerHTML = '<p>Veuillez remplir toutes les informations et recommencer</p>'
                showErrorInfos(infoError)
            } else {
                productChooses.push({id :data._id, quantity : itemQuantity, color : itemcolors.value})         
                console.log(productChooses);
            }
    });

};
