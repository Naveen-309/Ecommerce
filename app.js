const productsContainer = document.getElementById("products-container");
const cartCount = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items");

let allProducts = [];
let cart = {};

const fetchProducts = async () => {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        allProducts = data;
        displayProducts(allProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

const displayProducts = (products) => {
    productsContainer.innerHTML = "";
    products.forEach((product) => {
        const div = document.createElement("div");
        div.classList.add("product-card");
        div.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title.slice(0, 15)}...</h3>
            <p>${product.description.slice(0, 150)}...</p>
            <p class="price">$ ${product.price}</p>
            <div class="buttons">
            <button class="details-btn">Details</button>
            <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        `;

        div.querySelector(".add-to-cart-btn").addEventListener("click", () => addToCart(product));
        productsContainer.appendChild(div);
    });
};

fetchProducts();