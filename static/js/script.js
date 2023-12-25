// script.js
function updateTotalPrice() {
    let totalPrice = 0;
    document.querySelectorAll('.quantity-input').forEach(input => {
        const price = parseFloat(input.getAttribute('data-price'));
        totalPrice += input.value * price;
    });
    document.getElementById('total-price').innerText = totalPrice.toFixed(2);
}

function createBasketItem(product) {
    const isVbucks = product.product_name.toLowerCase().includes('v-bucks');

    let quantityControl;
    if (isVbucks) {
        quantityControl = `
            <button type="button" onclick="updateQuantity(${product.product_id}, -1)">-</button>
            <input type="number" class="quantity-input" id="quantity-${product.product_id}"
                   data-price="${product.product_price_uah}" value="0" min="0" oninput="updateTotalPrice()">
            <button type="button" onclick="updateQuantity(${product.product_id}, 1)">+</button>
        `;
    } else {
        quantityControl = `
            <input type="checkbox" class="quantity-input" id="quantity-${product.product_id}"
                   data-price="${product.product_price_uah}" value="0" onchange="updateCheckboxPrice(this, ${product.product_id})">
        `;
    }

    const itemDiv = document.createElement('div');
    itemDiv.className = 'product-item';
    itemDiv.innerHTML = `
        <span class="product-name">${product.product_name}</span>
        <div class="product-controls">
            ${quantityControl}
            <span class="product-price">Price: ${product.product_price_uah} UAH</span>
        </div>
    `;
    return itemDiv;
}

function updateCheckboxPrice(checkbox, productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    quantityInput.value = checkbox.checked ? '1' : '0';
    updateTotalPrice();
}

function updateQuantity(productId, change) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    let quantity = parseInt(quantityInput.value, 10);
    quantity = Math.max(quantity + change, 0);
    quantityInput.value = quantity;
    updateTotalPrice();
}

function fetchProductsAndUpdateBasket() {
    fetch('/products')  // Adjust the endpoint if necessary
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            console.log('Products received:', products);  // Debugging line
            const basketItemsDiv = document.getElementById('basket-items');
            basketItemsDiv.innerHTML = ''; // Clear existing items
            products.forEach(product => {
                basketItemsDiv.appendChild(createBasketItem(product));
            });
            updateTotalPrice();
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

function validateCheckout() {
    const email = document.getElementById('fortnite-email').value;
    const password = document.getElementById('fortnite-password').value;
    const discordUsername = document.getElementById('discord-username').value;
    let atLeastOneProductSelected = false;

    document.querySelectorAll('.quantity-input').forEach(input => {
        if (input.type === 'checkbox' && input.checked) atLeastOneProductSelected = true;
        if (input.type === 'number' && parseInt(input.value) > 0) atLeastOneProductSelected = true;
    });

    const isFormValid = email && password && discordUsername && atLeastOneProductSelected;
    document.getElementById('checkout-button').disabled = !isFormValid;
}

// Call this function on input/checkbox change and after fetching the products
document.querySelectorAll('.user-info input').forEach(input => {
    input.addEventListener('input', validateCheckout);
});

document.addEventListener('DOMContentLoaded', fetchProductsAndUpdateBasket);
