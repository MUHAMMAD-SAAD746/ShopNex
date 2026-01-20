function toast(msg, className = "error", duration = 2000, destination = null) {
    Toastify({
        text: msg,
        className: className,
        duration: duration,
        destination: destination,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        onClick: function () { } // Callback after click
    }).showToast();
}


var categorySelect = document.getElementById("categorySelect")
var categoryCount = document.getElementById("categoryCount");
var productContainer = document.getElementById("product-container");
var logOutBtn = document.getElementById("logout-btn")
var logInBtn = document.getElementById("login-btn")
var cartObj;
var cartCount = document.getElementById("cart-count")
var userLoggedIn;


function redirect() {
    userLoggedIn = localStorage.getItem("userLoggedIn");
    localStorage.removeItem("productID")
    localStorage.removeItem("categoryID")
    localStorage.removeItem("categoryName")


    if (userLoggedIn === "true") {
        logOutBtn.style.display = "inline"
        logInBtn.style.display = "none"

        cartObj = JSON.parse(localStorage.getItem("cart"))
        cartCount.classList.remove("d-none")
        cartCount.textContent = cartObj.length;
        console.log(cartObj.length);
    }
    else {
        logOutBtn.style.display = "none"
        logInBtn.style.display = "inline"
        window.location.href = "../index.html"
    }
}
redirect(); // protect dashboard

function logOut(event) {
    event.preventDefault();
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userID");
    redirect();
}

async function getCategory() {
    const name = localStorage.getItem("categoryName")
    const ID = localStorage.getItem("categoryID");

    console.log(name);
    console.log(ID);



    await firebase.database().ref("categories").get().then((categorySnap) => {
        var categoryObj = Object.values(categorySnap.val());

        for (var i = 0; i < categoryObj.length; i++) {
            categorySelect.innerHTML += `
                <option value="${categoryObj[i].categoryName}:${categoryObj[i].ID}">${categoryObj[i].categoryName}</option>
            `

            categoryCount.innerHTML += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${categoryObj[i].ID}">
                    <label class="form-check-label" for="cat1">${categoryObj[i].categoryName} (120)</label>
                </div>
            `
        }

        if (name !== null && ID !== null) {
            categorySelect.value = `${name}:${ID}`

            const checkbox = document.querySelector(`input[type="checkbox"][value="${ID}"]`);
            if (checkbox) checkbox.checked = true
        }
    })
}
getCategory()




async function getProducts() {
    localStorage.removeItem("productID")
    await firebase.database().ref("products").get().then((snapProduct) => {
        var productObj = Object.values(snapProduct.val());


        var ID = localStorage.getItem("categoryID")
        productContainer.innerHTML = ""

        for (var i = 0; i < productObj.length; i++) {

            var discountPercent = productObj[i].discount
            var originalPrice = productObj[i].price
            var discountedPrice = originalPrice * (1 - (discountPercent / 100));
            discountedPrice = Number(discountedPrice.toFixed(2));

            var hideDiscount = productObj[i].discount == "0"?"d-none":""

            if (ID === null) {
                productContainer.innerHTML += `
                    <div class="col-md-4 col-sm-6">
                        <div class="card h-100 product-card">
                            <a href="#" class="text-decoration-none text-dark">
                                <span class="badge bg-danger position-absolute top-0 start-0 m-3 discount-tag  ${hideDiscount}">-${productObj[i].discount}%</span>
                                <img src="${productObj[i].imageURL}" class="card-img-top" alt="Product">
                                <div class="card-body">
                                    <h5 class="card-title fs-6">${productObj[i]["Product Title"]}</h5>
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="fw-bold text-primary">$${discountedPrice}</span>
                                        <small class="text-decoration-line-through text-muted ${hideDiscount}">$${originalPrice}</small>
                                    </div>
                                    <div class="d-grid">
                                        <button class="btn btn-outline-primary btn-sm rounded-pill" onclick="productDetailRedirect(event, '${productObj[i].ID}')">View Details</button>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                `
            }


            if(productObj[i].categoryID === ID){
                productContainer.innerHTML += `
                    <div class="col-md-4 col-sm-6">
                        <div class="card h-100 product-card">
                            <a href="product-detail.html" class="text-decoration-none text-dark">
                                <span class="badge bg-danger position-absolute top-0 start-0 m-3 discount-tag ${hideDiscount}">-${productObj[i].discount}%</span>
                                <img src="${productObj[i].imageURL}" class="card-img-top" alt="Product">
                                <div class="card-body">
                                    <h5 class="card-title fs-6">${productObj[i]["Product Title"]}</h5>
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="fw-bold text-primary">$${discountedPrice}</span>
                                        <small class="text-decoration-line-through text-muted ${hideDiscount}">$${originalPrice}</small>
                                    </div>
                                    <div class="d-grid">
                                        <button class="btn btn-outline-primary btn-sm rounded-pill" onclick="productDetailRedirect(event, '${productObj[i].ID}')">View Details</button>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                `
            }
        }


    })
}
getProducts()



async function productDetailRedirect(event, id) {
    event.preventDefault();
    localStorage.removeItem("ProductId")
    localStorage.removeItem("productID")
    localStorage.setItem("productID", id)
    window.location.href = "../user/product-detail.html"

    // await firebase.database().ref("products").child(id).get().then((snapProduct) => {
    //     localStorage.setItem("productID", id)
        
    // })
}
