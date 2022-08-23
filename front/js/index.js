const mainTitle = document.querySelector('.titles h1');
const mainSubtitle = document.querySelector('.titles h2');
let titleHomePage = document.querySelector('.titles');

function showInfos(){
    titleHomePage.innerHTML = `<h1>Vérifiez que le serveur soit allumé</h1>`
};
showInfos();

const getProducts = async () => {
    let response = await fetch('http://localhost:3000/api/products');
    if (response.ok) {
        let data = await response.json();
        showInfos();
        titleHomePage.innerHTML = ` <h1>Nos produits</h1>
                                    <h2>Une gamme d'articles exclusifs</h2>`
        showData(data);
    } else {
        console.log('Retour du serveur : ', response.status);
        showInfos();
        titleHomePage.innerHTML = `<h1>Le serveur ne répond pas...</h1>`
    }
};
getProducts();

function showData(products) {
    for(let product of products) {
        let productList =   `<a href="./product.html?id=${product._id}">
                                <article>
                                <img src="${product.imageUrl}" alt="${product.altTxt}">
                                <h3 class="productName">${product.name}</h3>
                                <p class="productDescription">${product.description}</p>
                                </article>
                            </a>`;       
        document.querySelector('#items').innerHTML += productList; 
    }
};