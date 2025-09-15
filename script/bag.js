const CONVENIENCE_FEES = 99;
let bagItemObjects;
onLoad();

function onLoad() {
  loadBagItemObjects();
  displayBagItems();
  displayBagSummary();
}

function displayBagSummary() {
  let bagSummaryElement = document.querySelector('.bag-summary');
  if (!bagSummaryElement) return;

  let totalItem = bagItemObjects.length;
  let totalMRP = 0;
  let totalDiscount = 0;

  bagItemObjects.forEach(bagItem => {
    totalMRP += bagItem.original_price;
    totalDiscount += bagItem.original_price - bagItem.current_price;
  });

  let subTotal = totalMRP - totalDiscount;

  // ✅ Apply fee only if subtotal < 500 and cart not empty
  let convenienceFee = totalItem > 0 && subTotal < 2000 ? CONVENIENCE_FEES : 0;
  let finalPayment = subTotal + convenienceFee;

  bagSummaryElement.innerHTML =
    totalItem > 0
      ? `
      <div class="bag-details-container">
        <div class="price-header">PRICE DETAILS (${totalItem} Item${totalItem > 1 ? 's' : ''})</div>
        <div class="price-item">
          <span class="price-item-tag">Total MRP</span>
          <span class="price-item-value">₹${totalMRP}</span>
        </div>
        <div class="price-item">
          <span class="price-item-tag">Discount on MRP</span>
          <span class="price-item-value priceDetail-base-discount">-₹${totalDiscount}</span>
        </div>
        <div class="price-item">
          <span class="price-item-tag">Convenience Fee</span>
          <span class="price-item-value">${
            convenienceFee > 0 ? `₹${convenienceFee}` : "<span style='color:green'>FREE</span>"
          }</span>
        </div>
        <hr>
        <div class="price-footer">
          <span class="price-item-tag">Total Amount</span>
          <span class="price-item-value">₹${finalPayment}</span>
        </div>
      </div>
      <button class="btn-place-order">
        <div class="css-xjhrni">PLACE ORDER</div>
      </button>
    `
      : `<p class="empty-cart-message">Your bag is empty. Add items to see price details.</p>`;
}

function loadBagItemObjects() {
  bagItemObjects = bagItems.map(itemId => items.find(product => product.id == itemId));
}

function displayBagItems() {
  let containerElement = document.querySelector('.bag-items-container');
  if (!containerElement) return;

  if (bagItemObjects.length === 0) {
    containerElement.innerHTML = `<p class="empty-cart-message">Your bag is empty.</p>`;
    return;
  }

  let innerHTML = '';
  bagItemObjects.forEach(bagItem => {
    innerHTML += generateItemHTML(bagItem);
  });
  containerElement.innerHTML = innerHTML;
}

function removeFromBag(itemId) {
  bagItems = bagItems.filter(bagItemId => bagItemId != itemId);
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  loadBagItemObjects();
  displayBagIcon();
  displayBagItems();
  displayBagSummary();
}

function generateItemHTML(item) {
  return `<div class="bag-item-container">
    <div class="item-left-part">
      <img class="bag-item-img" src="../${item.image}">
    </div>
    <div class="item-right-part">
      <div class="company">${item.company}</div>
      <div class="item-name">${item.item_name}</div>
      <div class="price-container">
        <span class="current-price">Rs ${item.current_price}</span>
        <span class="original-price">Rs ${item.original_price}</span>
        <span class="discount-percentage">(${item.discount_percentage}% OFF)</span>
      </div>
      <div class="return-period">
        <span class="return-period-days">${item.return_period} days</span> return available
      </div>
      <div class="delivery-details">
        Delivery by
        <span class="delivery-details-days">${item.delivery_date}</span>
      </div>
    </div>
    <div class="remove-from-cart" onclick="removeFromBag(${item.id})">X</div>
  </div>`;
}
