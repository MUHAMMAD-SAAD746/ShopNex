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

var logOutBtn = document.getElementById("logout-btn")
var logInBtn = document.getElementById("login-btn")
var selectCategory = document.getElementById("categorySelect")
var categoryContainer = document.getElementById("category-container")

function redirect() {
    const userLoggedIn = localStorage.getItem("userLoggedIn");
    if (userLoggedIn === "true") {
        logOutBtn.style.display = "inline"
        logInBtn.style.display = "none"
    }
    else {
        logOutBtn.style.display = "none"
        logInBtn.style.display = "inline"
    }
}
redirect(); // protect dashboard

function logOut(event) {
    event.preventDefault();
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userID");
    redirect();
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
                                class="card-img-top rounded-circle mx-auto w-75 p-3" alt="Electronics">
                            <div class="card-body">
                                <h5 class="card-title">Electronics</h5>
                            </div>
                        </div>
                    </a>
                </div>`
            return
        }

        categoryContainer.innerHTML = ""

        for (var i = 0; i < categoryObj.length; i++) {
            selectCategory.innerHTML +=
                `<option value="${categoryObj[i].categoryName}">${categoryObj[i].categoryName}</option>`

            categoryContainer.innerHTML +=
                `<div class="col-6 col-md-3">
                    <a href="user/products.html" class="text-decoration-none text-dark">
                        <div class="card border-0 h-100 text-center">
                            <img src="${categoryObj[i].categoryImageURL}" id="userProduct-img"
                                class="card-img-top rounded-circle mx-auto d-block p-3" alt="${categoryObj[i].categoryName}">
                            <div class="card-body">
                                <h5 class="card-title">${categoryObj[i].categoryName}</h5>
                            </div>
                        </div>
                    </a>
                </div>`
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
                var discountedPrice = originalPrice * ( 1 - (discountPercent/100));
                discountedPrice = Number(discountedPrice.toFixed(2));


                featuredProducts.innerHTML += `
                    <div class="col-md-3 col-sm-6">
                        <div class="card h-100 product-card">
                            <span class="badge bg-danger position-absolute top-0 start-0 m-3 discount-tag">-${featuredObj[i].discount}%</span>
                            <img src="${featuredObj[i].imageURL}" class="card-img-top" alt="Product">
                            <div class="card-body">
                                <h5 class="card-title fs-6">${featuredObj[i]["Product Title"]}</h5>
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="fw-bold text-primary">$${discountedPrice}</span>
                                    <small class="text-decoration-line-through text-muted line-through-price">$${originalPrice}</small>
                                </div>
                                <div class="d-grid">
                                    <a href="user/cart.html" class="btn btn-outline-primary btn-sm rounded-pill">Add to
                                        Cart</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `

                if (featuredObj[i].discount === "0") {
                    var discountTag = document.getElementsByClassName("discount-tag")
                    var lineThrough = document.getElementsByClassName("line-through-price")

                    discountTag[i].classList.add("d-none")
                    lineThrough[i].classList.add("d-none")
                }
            }
            else {
                return
            }
        }
    })
}
getFeaturedProducts()