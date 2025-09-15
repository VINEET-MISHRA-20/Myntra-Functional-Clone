let bagItems;
onLoad();

function onLoad() {
  let bagItemsStr = localStorage.getItem('bagItems');
  bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];
  displayItemsOnHomePage();
  displayBagIcon();
}

function addToBag(itemId) {
  if (!bagItems.includes(itemId)) {
    bagItems.push(itemId);
    localStorage.setItem('bagItems', JSON.stringify(bagItems));
    displayBagIcon();
    displayItemsOnHomePage();
  }
}

function removeFromBag(itemId) {
  bagItems = bagItems.filter(id => id !== itemId);
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  displayBagIcon();
  displayItemsOnHomePage();
}

function displayBagIcon() {
  const bagItemCountElement = document.querySelector('.bag-item-count');
  if (!bagItemCountElement) return;

  if (bagItems.length > 0) {
    bagItemCountElement.style.visibility = 'visible';
    bagItemCountElement.innerText = bagItems.length;
  } else {
    bagItemCountElement.style.visibility = 'hidden';
  }
}

function displayItemsOnHomePage() {
  const itemsContainerElement = document.querySelector('.items-container');
  if (!itemsContainerElement) return;

  let innerHtml = '';
  items.forEach(item => {
    const isAdded = bagItems.includes(item.id);
    innerHtml += `
      <div class="item-container">
        <img class="item-image" src="${item.image}" alt="item image">
        <div class="rating">
            ${item.rating.stars} ⭐ | ${item.rating.count}
        </div>
        <div class="company-name">${item.company}</div>
        <div class="item-name">${item.item_name}</div>
        <div class="price">
            <span class="current-price">Rs ${item.current_price}</span>
            <span class="original-price">Rs ${item.original_price}</span>
            <span class="discount">(${item.discount_percentage}% OFF)</span>
        </div>
        <button class="btn-add-bag" onclick="${
          isAdded ? `removeFromBag('${item.id}')` : `addToBag('${item.id}')`
        }">
          ${isAdded ? 'Remove from Bag' : 'Add to Bag'}
        </button>
      </div>`;
  });

  itemsContainerElement.innerHTML = innerHtml;
}
