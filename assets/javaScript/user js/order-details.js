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


var userLoggedIn;
var cartObj;
var logOutBtn = document.getElementById("logout-btn")
var logInBtn = document.getElementById("login-btn")
var cartCount = document.getElementById("cart-count")
var tableBody = document.getElementById("tableBody")

function redirect() {
    userLoggedIn = localStorage.getItem("userLoggedIn") || "";

    if (userLoggedIn === "true") {
        logOutBtn.style.display = "inline"
        logInBtn.style.display = "none"

        cartObj = JSON.parse(localStorage.getItem("cart")) || [];

        if (cartObj.length > 0) {
            cartCount.classList.remove("d-none")
            cartCount.textContent = cartObj.length;
        }

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


async function getProductFromDb(productID) {
    const productObj = await firebase.database().ref("products").child(productID).get()

    return productObj.val();
}







var orderStatus = document.getElementById("status")
var date = document.getElementById("date")
var fullName = document.getElementById("full-name")
var address = document.getElementById("address")
var city = document.getElementById("city")
var zip = document.getElementById("zip")
var contactNumber = document.getElementById("contact-number")
var paymentMethod = document.getElementById("payment-method")
var orderid = document.getElementById("order-id")
var SubTotal = document.getElementById("Subtotal")
var billCalc = 0;
var taxEl = document.getElementById("tax")
var shipping = document.getElementById("shipping")
var total = document.getElementById("total")


async function showOrders() {
    var localOrder = localStorage.getItem("orderID") || ""

    if (!localOrder) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4">Error getting Orders</td>
            </tr>
        `
        return;
    }

    var orderSnap = await firebase.database().ref("orders").child(localOrder).get()
    var orderObj = orderSnap.val() || {}
    var orderedProducts = Object.values(orderObj.products);



    tableBody.innerHTML = ""



    for (var i = 0; i < orderedProducts.length; i++) {

        var productObj = await getProductFromDb(orderedProducts[i].productID)


        var discountPercent = productObj.discount
        var originalPrice = productObj.price
        var discountedPrice = originalPrice * (1 - (discountPercent / 100));
        discountedPrice = Number(discountedPrice.toFixed(2));


        tableBody.innerHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${productObj.imageURL}" class="img-fluid rounded me-3"
                            alt="Product Image" heigth="60" width="60">
                        <div>
                            <h6 class="mb-0">${orderedProducts[i].productTitle}</h6>
                            <small class="text-muted">${productObj.categoryName}</small>
                        </div>
                    </div>
                </td>
                <td>$${discountedPrice}</td>
                <td>${orderedProducts[i].qty}</td>
                <td class="text-end fw-bold">$${orderedProducts[i].totalAmount}</td>
            </tr>
        `

        billCalc += orderedProducts[i].totalAmount
    }

    orderid.textContent = `${orderObj.orderKey}`
    date.textContent = `${orderObj.date}`
    SubTotal.textContent = `$${billCalc}`
    taxEl.textContent = `28.40`
    shipping.textContent = `Free`
    total.textContent = `${(parseFloat(orderObj.totalBill.replace("$","")) + 28.40).toFixed(2)}`
    fullName.textContent = `${orderObj.firstName} ${orderObj.lastName}`
    address.textContent = `${orderObj.address}`
    city.textContent = `${orderObj.city}`
    zip.textContent = `${orderObj.zip}`
    contactNumber.textContent = `${orderObj.contactNumber}`
    paymentMethod.textContent = `${orderObj.paymentMethod == "COD" ? "Cash On Delivery" : ""}`

    orderStatus.textContent = `${orderObj.orderStatus}`
    if (orderObj.orderStatus == "Shipped") {
        orderStatus.classList.remove("bg-success")
        orderStatus.classList.add("bg-primary")
    }
    else if (orderObj.orderStatus == "Pending") {
        orderStatus.classList.remove("bg-success")
        orderStatus.classList.add("bg-warning")
        orderStatus.classList.add("text-dark")
    }


    if(shipping.textContent == "Free"){
        shipping.classList.add("text-success")
    }

}
showOrders()