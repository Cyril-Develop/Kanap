const mainTitle = document.querySelector('.titles h1');
const titleHomePage = document.querySelector('.titles');

//Error message if the server is not on
function showInfos(){
    titleHomePage.innerHTML = `<h1>Vérifiez que le serveur soit allumé.</h1>`
};
showInfos();

//Call to the API to retrieve all products
fetch('http://localhost:3000/api/products')
    .then(res => {
        if(res.ok){
            res.json().then(data => {
                showInfos();
                titleHomePage.innerHTML = ` <h1>Nos produits</h1>
                                    <h2>Une gamme d'articles exclusifs</h2>`;
                showData(data);
            })
        } else {
            console.log('Retour du serveur : ', res.status);
            showInfos();
            titleHomePage.innerHTML = `<h1>Le serveur ne répond pas...</h1>`
        }
});

//We use the information retrieved via the API to display all the products
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