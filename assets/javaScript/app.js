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

var selectCategory = document.getElementById("categorySelect")
var categoryContainer = document.getElementById("category-container")
var viewAllBtn = document.getElementById("view-all-btn")
var logOutBtn = document.getElementById("logout-btn")
var logInBtn = document.getElementById("login-btn")
var cartObj;
var cartCount = document.getElementById("cart-count")
var cartBtn = document.getElementById("cart-btn")
var userLoggedIn;
var spinnerLogout = document.getElementById("spinnerLogout")
var logoutText = document.getElementById("logout-text")

function redirect() {
    userLoggedIn = localStorage.getItem("userLoggedIn");

    localStorage.removeItem("ProductId")
    localStorage.removeItem("productID")
    localStorage.removeItem("categoryID")
    localStorage.removeItem("categoryName")


    if (userLoggedIn === "true") {
        logOutBtn.style.display = "inline"
        logInBtn.style.display = "none"

        cartObj = JSON.parse(localStorage.getItem("cart")) || []

        if (cartObj.length > 0) {
            cartCount.classList.remove("d-none")
            cartCount.textContent = cartObj.length;
        }
    }
    else {
        console.log("else block")
        logOutBtn.style.display = "none"
        logInBtn.style.display = "inline"
        cartCount.classList.add("d-none")
    }
}
redirect(); // protect dashboard


function logOut(event) {
    event.preventDefault();
    spinnerLogout.classList.remove("d-none")
    logoutText.classList.add("d-none")

    firebase.auth().signOut()
        .then(() => {
            localStorage.removeItem("userLoggedIn");
            localStorage.removeItem("userID");
            redirect();
        })
        .catch((error) => {
            console.error("Logout error:", error);
        })
}



async function getcategories() {
    await firebase.database().ref("categories").get().then((snap) => {
        categoryObj = Object.values(snap.val() || {})
        console.log(categoryObj);

        if (!categoryObj || categoryObj.length === 0) {
            selectCategory.innerHTML =
                '<option value="" disabled selected>No category found</option>'

            categoryContainer.innerHTML =
                `<div class="col-6 col-md-3">
                    <a href="user/products.html" class="text-decoration-none text-dark">
                        <div class="card border-0 h-100 text-center">
                            <img src="https://placehold.co/200x200?text=No Category Found"
                                class="card-img-top rounded-circle mx-auto w-75 p-3" alt="category">
                            <div class="card-body">
                                <h5 class="card-title">Not Found</h5>
                            </div>
                        </div>
                    </a>
                </div>`
            return
        }

        categoryContainer.innerHTML = ""

        for (var i = 0; i < categoryObj.length; i++) {
            selectCategory.innerHTML +=
                `<option value="${categoryObj[i].ID}">
                    ${categoryObj[i].categoryName}
                </option>`

            categoryContainer.innerHTML +=
                `<div class="col-6 col-md-3">
                    <a href="#" class="text-decoration-none text-dark" onclick="sortByCategory(event, '${categoryObj[i].categoryName}', '${categoryObj[i].ID}')">
                        <div class="card border-0 h-100 text-center">
                            <img src="${categoryObj[i].categoryImageURL}" id="userProduct-img"
                                class="card-img-top rounded-circle mx-auto d-block p-3" alt="${categoryObj[i].categoryName}">
                            <div class="card-body">
                                <h5 class="card-title">${categoryObj[i].categoryName}</h5>
                            </div>
                        </div>
                    </a>
                </div>`

            selectCategory.addEventListener("change", function (event) {
                var selectedIndex = event.target.selectedIndex;
                var selectedOption = event.target.options[selectedIndex];

                var categoryName = selectedOption.text;
                var categoryID = selectedOption.value;

                sortByCategory(event, categoryName, categoryID);
            });
        }

    })
}
getcategories()


var featuredProducts = document.getElementById("featured-products")

async function getFeaturedProducts() {
    await firebase.database().ref("products").get().then((snap) => {
        var featuredObj = Object.values(snap.val())
        featuredProducts.innerHTML = ""

        for (var i = 0; i < featuredObj.length; i++) {
            if (featuredObj[i]["Feature Product"]) {
                var discountPercent = featuredObj[i].discount
                var originalPrice = featuredObj[i].price
                var discountedPrice = originalPrice * (1 - (discountPercent / 100));
                discountedPrice = Number(discountedPrice.toFixed(2));
                var hideDiscount = featuredObj[i].discount == "0" ? "d-none" : ""


                featuredProducts.innerHTML += `
                    <div class="col-md-3 col-sm-6">
                        <div class="card h-100 product-card">
                            <span class="badge bg-danger position-absolute top-0 start-0 m-3 ${hideDiscount}">-${featuredObj[i].discount}%</span>
                            <img src="${featuredObj[i].imageURL}" class="card-img-top" alt="Product">
                            <div class="card-body">
                                <h5 class="card-title fs-6">${featuredObj[i]["Product Title"]}</h5>
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="fw-bold text-primary">$${discountedPrice}</span>
                                    <small class="text-decoration-line-through text-muted ${hideDiscount}">$${originalPrice}</small>
                                </div>
                                <div class="d-grid">
                                    <a href="" class="btn btn-outline-primary btn-sm rounded-pill" onclick="productDetailRedirect(event, '${featuredObj[i].ID}')">See Details</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `

            }
        }
    })
}
getFeaturedProducts()





async function productDetailRedirect(event, id) {
    event.preventDefault();

    if (userLoggedIn == "true") {
        localStorage.setItem("productID", id)
        window.location.href = "./user/product-detail.html"
    }
    else {
        toast("Please login to view details")
    }
}




function sortByCategory(event, categoryName, ID) {
    event.preventDefault();

    if (userLoggedIn == "true") {
        localStorage.setItem("categoryName", categoryName)
        localStorage.setItem("categoryID", ID)

        window.location.href = "./user/products.html"
    }
    else {
        toast("Pease login to view Products")
    }

}


function productsPageRedirect() {
    event.preventDefault();

    if (userLoggedIn == "true") {
        var categoryID = localStorage.getItem("categoryID")

        if (categoryID) {
            localStorage.removeItem("categoryID")
            localStorage.removeItem("categoryName")
        }

        window.location.href = "./user/products.html"
    }
    else {
        toast("Please login to view Products")
    }
}
viewAllBtn.addEventListener("click", () => {
    productsPageRedirect()
})


function cartRedirect() {
    if (userLoggedIn == "true") {
        window.location.href = "./user/cart.html"
    }
    else {
        toast("Please login to view cart")
    }
}
cartBtn.addEventListener("click", (event) => {
    event.preventDefault()
    cartRedirect()
})