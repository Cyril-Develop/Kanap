const mainTitle = document.querySelector('.titles h1');
const mainSubtitle = document.querySelector('.titles h2');
const productId = document.querySelector('#items a');
const img = document.querySelector('article img');
const productName = document.querySelector('.productName');
const productDescription = document.querySelector('.productDescription');

function showInfos(){
    mainTitle.innerHTML = 'Vérifiez que le serveur soit allumé'
    mainSubtitle.innerHTML = ''
};
showInfos();

const getProducts = async function () {
    let response = await fetch('http://localhost:3000/api/products')
    if (response.ok) {
        let data = await response.json()
        showInfos()
        mainTitle.innerHTML = ''
        mainSubtitle.innerHTML = ''
        showData(data)
    } else {
        console.log('Retour du serveur : ', response.status);
        showInfos()
        mainTitle.innerHTML = 'Le serveur ne répond pas...'
        mainSubtitle.innerHTML = ''
    }
};
getProducts();

function showData(products) {
    products.forEach(item => {
        let newA = document.createElement('a')
        document.querySelector('#items').append(newA);

        let newArticle = document.createElement('article')
        newA.append(newArticle);

        let newImg = document.createElement('img')
        newArticle.append(newImg);

        let newTitle = document.createElement('h3')
        newTitle.className = 'productName'
        newArticle.append(newTitle);

        let newP = document.createElement('p')
        newP.className = 'productDescription'
        newArticle.append(newP);

        newA.href += `./product.html?id=${item._id}`;
        newImg.src = item.imageUrl;
        newImg.alt = item.altTxt;
        newTitle.textContent = item.name;
        newP.textContent = item.description;
    })
};