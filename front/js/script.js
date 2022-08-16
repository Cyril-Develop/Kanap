const productId = document.querySelector('#items a');
const img = document.querySelector('article img');
const productName = document.querySelector('.productName');
const productDescription = document.querySelector('.productDescription');

const getProducts = async function () {
    let response = await fetch('http://localhost:3000/api/products')
    let data = await response.json()
    showData(data)
}
getProducts();

function showData(products){
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

            newA.href = item._id;
            newImg.src = item.imageUrl;
            newImg.alt = item.altTxt;
            newTitle.textContent = item.name;
            newP.textContent = item.description;
    })
};