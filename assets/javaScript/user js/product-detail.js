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



var productTitle = document.getElementById("product-title")
var shortDescription = document.getElementById("short-description")
var productImg = document.getElementById("product-img")
var price = document.getElementById("price")
var previousPrice = document.getElementById("previous-price")
var productInfo = document.getElementById("product-info")
var loaderSpinner = document.getElementById("loader-spinner")
var stockStatus = document.getElementById("status")
var addToCart = document.getElementById("add-to-cart")
var qty = document.getElementById("qty")
var logOutBtn = document.getElementById("logout-btn")
var logInBtn = document.getElementById("login-btn")
var cartObj;
var cartCount = document.getElementById("cart-count")
var userLoggedIn;


function redirect() {
    userLoggedIn = localStorage.getItem("userLoggedIn");

    if (userLoggedIn === "true") {
        logOutBtn.style.display = "inline"
        logInBtn.style.display = "none"

        cartObj = JSON.parse(localStorage.getItem("cart")) || [];
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


async function getProduct() {
    var productID = localStorage.getItem("productID")
    console.log(productID)

    await firebase.database().ref("products").child(productID).get().then((snapProduct) => {

        productInfo.style.display = "block"
        loaderSpinner.style.display = "none"
        var discountPercent = snapProduct.val().discount;
        var originalPrice = snapProduct.val().price
        var discountedPrice = originalPrice * (1 - (discountPercent / 100));
        discountedPrice = Number(discountedPrice.toFixed(2));

        if (snapProduct.val().discount <= "0") {
            previousPrice.style.display = "none"
        }
        else {
            previousPrice.textContent = originalPrice;
        }

        const status = snapProduct.val().status === "Available" ? "In Stock" : "Out of Stock";
        if (status === "In Stock") {
            stockStatus.classList.add("bg-success")
            stockStatus.classList.remove("bg-danger")
        }
        else {
            stockStatus.classList.add("bg-danger")
            stockStatus.classList.remove("bg-success")
        }

        stockStatus.textContent = status;
        productTitle.textContent = snapProduct.val()["Product Title"];
        shortDescription.textContent = snapProduct.val().description;
        price.textContent = discountedPrice;
        productImg.src = snapProduct.val().imageURL;


        addToCart.addEventListener("click", () => {
            addToCartFunction(productID)
        })




    })
}
getProduct()


function addToCartFunction(productId) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    var exist = false 
    var productQuantity = Number(qty.value)

    cartObj = {
        productId,
        qty: productQuantity
    }

    for (var i = 0; i < cart.length; i++) {
        // Check if product is already in cart
        if (cart[i].productId === productId) {
            exist = true;

            if(Number(cart[i].qty) !== productQuantity){
                cart[i].qty = productQuantity;
                localStorage.setItem("cart", JSON.stringify(cart));
                toast("Quantity updated in cart", "success");
            }
            else{
                toast("Product already in cart with same quantity", "info");
            }
            break;
        }
    }

    if(!exist){
        cart.push(cartObj);
        localStorage.setItem("cart", JSON.stringify(cart));
        toast("Product added to cart", "success");
    }
    redirect()
    console.log("Current cart:", cart); // for debugging
}


