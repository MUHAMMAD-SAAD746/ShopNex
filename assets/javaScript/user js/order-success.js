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
var cartObj;
var cartCount = document.getElementById("cart-count")
var userLoggedIn;


function clearPageStorage() {
    userLoggedIn = localStorage.getItem("userLoggedIn");
}
clearPageStorage();



var orderElement = document.getElementById("order-element")
var orderObj = JSON.parse(localStorage.getItem("order"))

orderElement.innerText = orderObj.orderKey
