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

var cartObj;
var userObj;

var firstName = document.getElementById("first-name")
var lastName = document.getElementById("last-name")
var email = document.getElementById("email")
var address = document.getElementById("address")
var contactNumber = document.getElementById("contactNumber")
var city = document.getElementById("city")
var zip = document.getElementById("zip")
var checkoutForm = document.getElementById("checkout-form")
var spinner = document.getElementById("spinner")
var spinnerBtn = document.getElementById("spinnerBtn")
var placeOrderBtn = document.getElementById("place-order-btn")
var logOutBtn = document.getElementById("logout-btn")
var logInBtn = document.getElementById("login-btn")
var cartCount = document.getElementById("cart-count")

function redirect() {
    userLoggedIn = localStorage.getItem("userLoggedIn");

    if (userLoggedIn === "true") {
        logOutBtn.style.display = "inline"
        logInBtn.style.display = "none"

        cartObj = JSON.parse(localStorage.getItem("cart")) || [];
        console.log(cartObj);
        
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

async function getDbData() {
    checkoutForm.style.display = "none"
    await firebase.database().ref("users").get().then((snap) => {
        userObj = Object.values(snap.val())
        console.log(userObj);
        checkoutForm.style.display = "block"
        spinner.style.display = "none"
        getFormData()
        getCartData()

    })
}
getDbData()


var details = document.getElementById("details")
var total = 0


function getCartData() {
    // cartObj = JSON.parse(localStorage.getItem("cart"));
    console.log(cartObj);
    details.innerHTML = "";


    for (var i = 0; i < cartObj.length; i++) {
        details.innerHTML += `
            <li class="list-group-item d-flex justify-content-between lh-sm">
                <div>
                    <h6 class="my-0">${cartObj[i].productTitle}</h6>
                    <small class="text-muted">Quantity: ${cartObj[i].qty}</small>
                </div>
                <span class="text-muted product-amount">$${cartObj[i].totalAmount}</span>
            </li>
        `

        var productAmount = document.getElementsByClassName("product-amount")
        total += parseFloat((productAmount[i].textContent).replace("$", ""));
        console.log(total.toFixed(2));
        // if(total.toFixed(2) === NaN){
        //     window.location.href = "./cart.html"
        // }
    }

    details.innerHTML += `
        <li class="list-group-item d-flex justify-content-between bg-light">
            <div class="text-success">
                <h6 class="my-0">Promo code</h6>
                <small>EXAMPLECODE</small>
            </div>
            <span class="text-success">-$5.00</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
            <span>Total (USD)</span>
            <strong class="text-primary" id="total-bill">$${total.toFixed(2)}</strong>
        </li>
    `

}




function getFormData() {
    var localID = localStorage.getItem("userID")
    var userName;
    for (var i = 0; i < userObj.length; i++) {
        if (userObj[i].userID === localID) {
            userName = userObj[i].fullName.split(" ")
            email.value = userObj[i].email
            console.log(userName)
        }
    }

    for (var i = 0; i < userName.length; i++) {
        firstName.value = userName[0]
        lastName.value = userName[1]
    }
}


async function placeOrder(event) {
    event.preventDefault();
    var paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    var formInput = document.getElementsByClassName("form-control")
    var totalBill = document.getElementById("total-bill")
    var isValid = true;

    for (var i = 0; i < formInput.length; i++) {
        formInput[i].style.borderColor = "#ced4da"
    }

    if (firstName.value == "") {
        isValid = false;
        toast("First Name is required");
        firstName.style.borderColor = "red"
    }
    else if (lastName.value == "") {
        isValid = false;
        toast("Last Name is required");
        lastName.style.borderColor = "red"
    }
    else if (email.value == "") {
        isValid = false;
        toast("Email is required");
        email.style.borderColor = "red"
    }
    else if (address.value == "") {
        isValid = false;
        toast("Address is required");
        address.style.borderColor = "red"
    }
    else if (address.value.length < 10) {
        isValid = false;
        toast("Address should contain at least 10 characters");
        address.style.borderColor = "red"
    }
    else if (contactNumber.value == "") {
        isValid = false;
        toast("Contact Number is required");
        contactNumber.style.borderColor = "red"
    }
    else if (contactNumber.value.length < 10) {
        isValid = false;
        toast("Contact Number should contain at least 10 numbers");
        contactNumber.style.borderColor = "red"
    }
    else if (city.value == "") {
        isValid = false;
        toast("City is required")
        city.style.borderColor = "red"
    }
    else if (zip.value == "") {
        isValid = false;
        toast("Zip code is required");
        zip.style.borderColor = "red"
    }
    else if (zip.value.length < 5) {
        isValid = false;
        toast("Zip code should contain atleast 5 numbers");
        zip.style.borderColor = "red"
    }

    if (!isValid) {
        return
    }


    spinnerBtn.style.display = "inline"
    placeOrderBtn.style.display = "none"
    var date = new Date().getDate();
    var month = (new Date().getMonth())+1;
    var year = new Date().getFullYear();
    console.log(date)
    console.log(month)
    console.log(year)

    if(month == 1){
        month = "Jan"
    }
    else if(month == 2){
        month = "Feb"
    }
    else if(month == 3){
        month = "Mar"
    }
    else if(month == 4){
        month = "Apr"
    }
    else if(month == 5){
        month = "May"
    }
    else if(month == 6){
        month = "Jun"
    }
    else if(month == 7){
        month = "Jul"
    }
    else if(month == 8){
        month = "Aug"
    }
    else if(month == 9){
        month = "Sep"
    }
    else if(month == 10){
        month = "Oct"
    }
    else if(month == 11){
        month = "Nov"
    }
    else if(month == 12){
        month = "Dec"
    }
    


    var orderKey = await firebase.database().ref("orders").push().getKey();
    console.log(totalBill);

    var orderObj = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        address: address.value,
        contactNumber: contactNumber.value,
        city: city.value,
        zip: zip.value,
        paymentMethod: paymentMethod.value,
        orderKey: orderKey,
        orderStatus: "Pending",
        totalBill: totalBill.textContent,
        date: `${month} ${date}, ${year}`
    }

    await firebase.database().ref("orders").child(orderKey).set(orderObj)
    localStorage.setItem("order", JSON.stringify(orderObj))
    localStorage.removeItem("cart")
    toast("Order placed successfully","success", 1000)

    setTimeout(() => {
        window.location.href = "../user/order-success.html"
    })


}
