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
    const itemDiv = document.createElement('div');
    itemDiv.className = 'product-item';
    itemDiv.innerHTML = `
        <span>${product.product_name}</span>
        <div>
            <button type="button" onclick="updateQuantity(${product.product_id}, -1)">-</button>
            <input type="number" class="quantity-input" id="quantity-${product.product_id}"
                   data-price="${product.product_price_uah}" value="0" min="0" oninput="updateTotalPrice()">
            <button type="button" onclick="updateQuantity(${product.product_id}, 1)">+</button>
            Price: ${product.product_price_uah} UAH
        </div>
    `;
    return itemDiv;
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

document.addEventListener('DOMContentLoaded', fetchProductsAndUpdateBasket);
