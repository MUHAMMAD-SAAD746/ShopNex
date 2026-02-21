const currentPage = window.location.pathname.split("/").pop();
console.log(currentPage);



const navbar = `
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold fs-3 text-primary" href="index.html">ShopNex</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarContent">
                <form class="d-flex mx-auto w-50" action="user/products.html">
                    <div class="input-group">
                        <input class="form-control" type="search" placeholder="Search for products...">
                        <button class="btn btn-primary" type="submit"><i class="bi bi-search"></i></button>
                    </div>
                </form>
                <div class="d-flex align-items-center gap-3 mt-3 mt-lg-0">
                    <select id="categorySelect" class="form-select border-dark" style="width: 125px;">
                        <option value="">Category</option>
                    </select>
                    <a href="user/orders.html" class="btn btn-outline-dark me-2" id="order-btn">
                        <i class="bi bi-bag-check"></i>
                    </a>
                    <a href="" class="btn btn-outline-dark position-relative" id="cart-btn">
                        <i class="bi bi-cart"></i>
                        <span
                            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none"
                            id="cart-count">
                            3
                        </span>
                    </a>
                    <a href="user/chat.html" class="btn btn-outline-dark me-2" id="chat-btn">
                        <i class="bi bi-chat-left-dots"></i>
                    </a>
                    <a href="user/login.html" class="btn btn-primary" id="login-btn">Login</a>
                    <a href="#" class="btn btn-primary" id="logout-btn" style="display: none;" onclick="logOut(event)">
                        <div class="loader-spinner user-spinner mb-1 d-none mx-auto"
                            style="background: #2f4c77; width: 20px; padding: 3px;" id="spinnerLogout"></div>
                        <span id="logout-text"><i class="bi bi-box-arrow-right me-2"></i>Logout</span>
                    </a>
                </div>
            </div>
        </div>
    </nav>
`


const navigationBar = document.getElementById("navigation-bar");
navigationBar.innerHTML = navbar


const cartButton = document.getElementById("cart-btn");
const orderButton = document.getElementById("order-btn");
const chatBtn = document.getElementById("chat-btn");

if (currentPage === "index.html" || currentPage === "") {
    // Links when on index page
    cartButton.href = "user/cart.html";
    orderButton.href = "user/orders.html";
    chatBtn.href = "user/chat.html";

} else {
    // Links when NOT on index page
    cartButton.href = "../user/cart.html";
    orderButton.href = "../user/orders.html";
    chatBtn.href = "../user/chat.html";
}