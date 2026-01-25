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

var productObj = [];
var cartObj;
var summary = document.getElementById("summary")
var tableBody = document.getElementById("table-body")
var subTotal = document.getElementById("sub-total")
var totalBill = document.getElementById("total-bill")
var logOutBtn = document.getElementById("logout-btn")
var logInBtn = document.getElementById("login-btn")
var cartCount = document.getElementById("cart-count")
var tax = document.getElementById("tax")

function redirect() {
    userLoggedIn = localStorage.getItem("userLoggedIn");

    if (userLoggedIn === "true") {
        logOutBtn.style.display = "inline"
        logInBtn.style.display = "none"

        cartObj = JSON.parse(localStorage.getItem("cart")) || [];

        if (cartObj.length > 0) {
            // cartCount.classList.remove("d-none")
            cartCount.textContent = cartObj.length;
        }
        else{
            cartCount.classList.add("d-none")
        }

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




async function getProducts() {
    await firebase.database().ref("products").get().then((snapProduct) => {
        productObj = Object.values(snapProduct.val());

        summary.classList.remove("d-none")
        getSelectedProducts()
    })
}
getProducts()


function getSelectedProducts() {
    let cartObj = JSON.parse(localStorage.getItem("cart")) || [];
    console.log(cartObj);
    tableBody.innerHTML = ""

    if (cartObj.length == 0) {
        tableBody.innerHTML = `
            <tr id="loader-loading">
                <td colspan="5" class="text-center">Cart is empty.</td>
            </tr>
        `
    }

    for (var i = 0; i < cartObj.length; i++) {
        for (let j = 0; j < productObj.length; j++) {

            let discountPercent = productObj[j].discount
            let originalPrice = productObj[j].price
            let discountedPrice = originalPrice * (1 - (discountPercent / 100));
            discountedPrice = Number(discountedPrice.toFixed(2));
            let totalPrice = discountedPrice;

            if (cartObj[i].productId === productObj[j].ID) {
                tableBody.innerHTML += `
                    <tr>
                        <td>
                            <div class="d-flex align-items-center">
                                <img src="${productObj[j].imageURL}" class="rounded me-3"
                                    height="60" width="60" alt="Product">
                                <div>
                                    <a href="product-detail.html"
                                        class="text-decoration-none text-dark fw-bold product-title">${productObj[j]["Product Title"]}</a>
                                    <small class="d-block text-muted">Color: Black</small>
                                </div>
                            </div>
                        </td>
                        <td>$${discountedPrice}</td>
                        <td>
                            <div class="d-flex align-items-center">
                                <button class="btn btn-outline-secondary btn-sm" onclick="increaseQty('${productObj[j].ID}')">+</button>
                                <input type="number" class="form-control form-control-sm mx-2" value="${cartObj[i].qty}" min="1"
                                    style="width: 50px;" id="qty-${productObj[j].ID}" disabled>
                                <button class="btn btn-outline-secondary btn-sm" onclick="decreaseQty('${productObj[j].ID}')">-</button>
                            </div>
                        </td>
                        <td class="fw-bold product-total" id="total-${productObj[j].ID}">$${(totalPrice * cartObj[i].qty).toFixed(2)}</td>
                        <td><button class="btn btn-sm text-danger" onclick="deleteFromCart('${productObj[j].ID}')"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>
                `

                var productTotal = document.getElementsByClassName("product-total")
                var price = parseFloat(productTotal[i].innerText.replace("$", ""));
                cartObj[i].totalAmount = price;
                var productTitle = document.getElementsByClassName("product-title")
                cartObj[i].productTitle = productTitle[i].innerText;
                cartObj[i].imageURL = productObj[j].imageURL;
            }
        }
    }
    localStorage.setItem("cart", JSON.stringify(cartObj));
    orderSummary()
}


function increaseQty(productId) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Find the item in the cart
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId === productId) {
            cart[i].qty++; // increase quantity by 1
            break;
        }
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));


    getSelectedProducts()
}



function decreaseQty(productId) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Find the item in the cart
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId === productId) {
            cart[i].qty--; // increase quantity by 1
            break;
        }
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));


    getSelectedProducts()
}


function deleteFromCart(productId) {
    var cartObj = JSON.parse(localStorage.getItem("cart")) || [];

    for (var i = 0; i < cartObj.length; i++) {
        if (cartObj[i].productId === productId) {
            cartObj.splice(i, 1); // remove item
            break;
        }
    }

    localStorage.setItem("cart", JSON.stringify(cartObj));
    toast("Item removed from cart", "success");

    tableBody.innerHTML = "";
    redirect()
    getSelectedProducts();
}


function orderSummary() {

    var productTotal = document.getElementsByClassName("product-total")
    var total = 0;
    var taxAmount = 0

    if(cartObj.length > 0){
        taxAmount = 28.40;
    }

    for (var i = 0; i < productTotal.length; i++) {
        var price = parseFloat(productTotal[i].innerText.replace("$", ""));
        total += price;
    }
    subTotal.textContent = `$${total.toFixed(2)}`
    tax.textContent = `${taxAmount}`
    totalBill.textContent = (total + taxAmount).toFixed(2)

    
}



async function checkoutRedirect() {
    if (!totalBill) {
        toast("Total bill not found");
        return;
    }

    var orderObj = {
        totalBill: totalBill.innerText
    }


    localStorage.setItem("billingInfo", JSON.stringify(orderObj))
    window.location.href = "../user/checkout.html"
}