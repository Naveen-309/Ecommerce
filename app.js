const productsContainer = document.getElementById("products-container");
const cartCount = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items");
const cartPage = document.getElementById("cart-page");
const cartBtn = document.getElementById("cart-btn");

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

const addToCart = (product) => {
    if (cart[product.id]) {
        cart[product.id].quantity += 1;
    } else {
        cart[product.id] = { ...product, quantity: 1 };
    }
    updateCartUI();
};

const updateCartUI = () => {
    cartItemsContainer.innerHTML = "";
    let totalCount = 0;
    let totalPrice = 0;

    Object.values(cart).forEach((item) => {
        totalCount += item.quantity;
        totalPrice += item.price * item.quantity;

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.title}">
                <span>${item.title}</span>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-quantity">
                    <button class="decrease-btn">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-btn">+</button>
                </div>
                <p class="cart-item-total">${item.quantity} × $${item.price.toFixed(2)}</p>
            </div>
        `;

        div.querySelector(".decrease-btn").addEventListener("click", () => {
            if (cart[item.id].quantity > 1) {
                cart[item.id].quantity -= 1;
            } else {
                delete cart[item.id];
            }
            updateCartUI();
        });

        div.querySelector(".increase-btn").addEventListener("click", () => {
            cart[item.id].quantity += 1;
            updateCartUI();
        });

        cartItemsContainer.appendChild(div);
    });

    cartCount.textContent = totalCount;
    document.getElementById("summary-count").textContent = totalCount;
    document.getElementById("summary-products").textContent = totalPrice.toFixed(2);

    let shipping = totalPrice > 0 ? 30 : 0;
    document.getElementById("summary-shipping").textContent = shipping;
    document.getElementById("summary-total").textContent = (totalPrice + shipping).toFixed(2);

    const emptyMsg = document.getElementById("empty-cart-message");
    const cartLayout = document.querySelector(".cart-layout");

    if (totalCount === 0) {
        emptyMsg.style.display = "block";
        cartLayout.style.display = "none";
    } else {
        emptyMsg.style.display = "none";
        cartLayout.style.display = "flex";
    }
};

document.querySelector(".products-category-buttons").addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;

    const category = e.target.className;

    if (category.includes("category-all-btn")) {
        displayProducts(allProducts);
    } else if (category.includes("category-mens-btn")) {
        displayProducts(allProducts.filter(p => p.category === "men's clothing"));
    } else if (category.includes("category-womens-btn")) {
        displayProducts(allProducts.filter(p => p.category === "women's clothing"));
    } else if (category.includes("category-jewelery-btn")) {
        displayProducts(allProducts.filter(p => p.category === "jewelery"));
    } else if (category.includes("category-electronics-btn")) {
        displayProducts(allProducts.filter(p => p.category === "electronics"));
    }
});

if (cartBtn) {
    cartBtn.addEventListener("click", () => {
        productsContainer.style.display = "none";
        document.querySelector(".products-category-buttons").style.display = "none";
        document.querySelector(".latest-products").style.display = "none";

        const homepagePic = document.querySelector(".homepage-pic");
        if (homepagePic) homepagePic.style.display = "none";

        cartPage.style.display = "block";
        updateCartUI();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelector(".login-btn");
    const registerBtn = document.querySelector(".register-btn");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            window.location.href = "../Login Page/index.html";
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            window.location.href = "../Register Page/index.html";
        });
    }
});

function continueShopping() {
    cartPage.style.display = "none";
    productsContainer.style.display = "flex";
    document.querySelector(".products-category-buttons").style.display = "flex";
    document.querySelector(".latest-products").style.display = "block";

    const homepagePic = document.querySelector(".homepage-pic");
    if (homepagePic) homepagePic.style.display = "block";
}

fetchProducts();
