const productInStorage = JSON.parse(localStorage.getItem('productSelected'));

if(!productInStorage){
    document.querySelector('.cartAndFormContainer h1').innerHTML = 'Votre panier est vide.';
    document.querySelector('.cart').style.display = 'none';
}else{
    for(let product of productInStorage){
        fetch(`http://localhost:3000/api/products/${product.id}`)
            .then(res => res.json())
            .then(data => {
                let modelCard = ` <article class="cart__item" data-id="${data._id}" data-color="${product.color}">
                                    <div class="cart__item__img">
                                    <img src="${data.imageUrl}" alt="Photographie d'un canapé ${data.name}">
                                    </div>
                                    <div class="cart__item__content">
                                    <div class="cart__item__content__description">
                                        <h2>${data.name}</h2>
                                        <p>${product.color}</p>
                                        <p>${data.price} €</p>
                                    </div>
                                    <div class="cart__item__content__settings">
                                        <div class="cart__item__content__settings__quantity">
                                        <p>Qté : </p>
                                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                                        </div>
                                        <div class="cart__item__content__settings__delete">
                                        <p class="deleteItem">Supprimer</p>
                                        </div>
                                    </div>
                                    </div>
                                </article>`;
                document.querySelector('#cart__items').innerHTML += modelCard; 
                    
                deleteProduct();
                getTotalQuantity()      
            }
                  
        )
    }
};              
 
                    
                    
                    
  
    



///////////////////////////////////////////////////////Delete item///////////////////////
                    
function deleteProduct(){

    const deleteItem = document.querySelectorAll('.deleteItem');

    deleteItem.forEach(item => {

        item.addEventListener('click', () => {
            // showDeletion();
            let produtSelectedForDeletion = item.closest('article');
            let idProductToDelete = produtSelectedForDeletion.getAttribute('data-id');
            const foundProduct = productInStorage.find(el => el.id === idProductToDelete);
            //productInStorage.pop(foundProduct);
            //produtSelectedForDeletion.remove();
            localStorage.setItem('productSelected', JSON.stringify(productInStorage));
            if(productInStorage.length === 0){
                localStorage.clear()
            }
            alert('Produit retiré du panier')
            location.reload(); 
     
        });
        
    });
}
/////////////////////////////////////Show total quantity/////////////////////////////////////////
function getTotalQuantity(){

    let allInput = Array.from(document.querySelectorAll('.itemQuantity'))

        console.log(allInput);
        

   
}
















// const cartAndFormContainer = document.querySelector('#cartAndFormContainer h1')
// const deletionInfo = document.createElement('p');
// function showDeletion(){
//     deletionInfo.innerHTML = 'Produit retiré du panier'
//     cartAndFormContainer.append(deletionInfo);
//     deletionInfo.classList.add('showDeletion');
//     setTimeout(() => {
//         deletionInfo.remove('showDeletion')
//     }, 4000);
// }

