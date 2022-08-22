let productInStorage = JSON.parse(localStorage.getItem('productSelected'));

console.log(productInStorage);

if(!productInStorage){
    document.querySelector('.cartAndFormContainer h1').innerHTML = 'Votre panier est vide.';
    document.querySelector('.cart').style.display = 'none';
}else{

    productInStorage.forEach(item => {
        //Article
        const cartItem = document.querySelector('#cart__items');
        const newArticle = document.createElement('article');
        newArticle.className = "cart__item";
        newArticle.setAttribute('data-id', 'product-ID');
        newArticle.setAttribute('data-color', 'product-color');
        cartItem.append(newArticle);
        //div cart__item__img
        const newDivImg = document.createElement('div');
        newDivImg.className = 'cart__item__img';
        //cart__item__img img
        const newImg = document.createElement('img');
        newImg.setAttribute('src', item.img);
        newImg.setAttribute('alt', `Photographie d'un canapé`);
        newDivImg.append(newImg)
        //cart__item__content
        const newDivContent = document.createElement('div');
        newDivContent.className = 'cart__item__content';
        newArticle.append(newDivImg, newDivContent)
        //cart__item__content__description
        const newDivContentDescription = document.createElement('div');
        newDivContentDescription.className = 'cart__item__content__description';
        newDivContent.append(newDivContentDescription);
        //content title
        const contentTitle = document.createElement('h2');
        contentTitle.innerHTML = item.name;
        //content color
        const contentColor = document.createElement('p');
        contentColor.innerHTML = item.color;
        //content price
        const contentPrice = document.createElement('p');
        contentPrice.innerHTML = `${item.price} €`;
        newDivContentDescription.append(contentTitle, contentColor, contentPrice);
        //cart__item__content__settings
        const newItemSetting = document.createElement('div');
        newItemSetting.className = 'cart__item__content__settings';
        //cart__item__content__settings__quantity
        const newItemSettingQuantity = document.createElement('div');
        newItemSettingQuantity.className = 'cart__item__content__settings__quantity';
        newItemSetting.append(newItemSettingQuantity);
        //
        const newItemSettingQuantityValue = document.createElement('p');
        newItemSettingQuantityValue.innerHTML = `Qté : `;
        //input
        const inputItemQuantity = document.createElement('input');
        inputItemQuantity.setAttribute('type', 'number');
        inputItemQuantity.setAttribute('name', 'itemQuantity');
        inputItemQuantity.setAttribute('value', item.quantity);
        inputItemQuantity.setAttribute('min', 1);
        inputItemQuantity.setAttribute('max', 100);
        //
        newItemSettingQuantity.append(newItemSettingQuantityValue, inputItemQuantity);
        //div cart__item__content__settings__delete
        const divDeleteItem = document.createElement('div')
        divDeleteItem.className = 'cart__item__content__settings__delete';
        //delete button
        const deleteBtn = document.createElement('p');
        deleteBtn.className = 'deleteItem';
        deleteBtn.innerHTML = 'Supprimer';
        divDeleteItem.append(deleteBtn);
        newDivContent.append(newItemSetting, divDeleteItem);
    });
}







