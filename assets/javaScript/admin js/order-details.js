// function to show toast messages
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

var orderID;
function redirect() {
    const adminLogin = localStorage.getItem("adminLogin");
    orderID = localStorage.getItem("selectedOrderId")
    if (adminLogin !== "true") {
        window.location.replace("./login.html");
    }

    else if(!orderID){
        toast("error getting order details.")
        setTimeout(() => {
            window.location.replace("./orders.html");
        }, 1000)
    }
}
redirect(); // protect dashboard

function logOut() {
    localStorage.removeItem("adminLogin");
    localStorage.removeItem("userId");
    redirect();
}

var orderObj;
var orderedProducts;
var userObj;
var adminID = localStorage.getItem("userId")
var tableBody = document.getElementById("tableBody")
var orderIDElem = document.getElementById("order-id")
var date = document.getElementById("date")
var paymentMethod = document.getElementById("payment-method")

// ========== CUSTOMER DETAILS VARIABLES ============

var userProfile = document.getElementById("user-profile")
var userName = document.getElementById("user-name")
var userEmail = document.getElementById("user-email")
var contactNumber = document.getElementById("contactNumber")
var address = document.getElementById("address")
var city = document.getElementById("city")
var zip = document.getElementById("zip")

// =========== ORDER SUMMARY VARIABLES ==============

var subTotal = document.getElementById("sub-total")
// var  = document.getElementById("")
// var  = document.getElementById("")

async function getOrderFromDb(){
    await firebase.database().ref("orders").child(orderID).get().then((orderSnap) => {
        orderObj = orderSnap.val()
        orderedProducts = Object.values(orderObj.products)
        console.log(orderObj)
        console.log(orderedProducts)
        getUserFromDb()

    })
    .catch((e) => {
        console.log("error" + e)
    })
}
getOrderFromDb()


async function getUserFromDb(){
    await firebase.database().ref("users").child(orderObj.userID).get().then((userSnap) => {
        userObj = userSnap.val();
        console.log("user Object " + userObj);
        showSelectedOrder()
    })
    .catch((e) => {
        console.log("error " + e)
    })
}



function showSelectedOrder(){
    for (let i = 0; i < orderedProducts.length; i++) {
        var productPrice = (orderedProducts[i].totalAmount)/(orderedProducts[i].qty)
        var productImg = orderedProducts[i].imageURL
        
        
        tableBody.innerHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${productImg}" class="rounded me-3"
                            alt="Product" height="50" width="50">
                        <div>
                            <p class="mb-0 fw-bold">${orderedProducts[i].productTitle}</p>
                            <small class="text-muted">Color: Black</small>
                        </div>
                    </div>
                </td>
                <td>$${productPrice}</td>
                <td>${orderedProducts[i].qty}</td>
                <td class="text-end fw-bold">$${orderedProducts[i].totalAmount}</td>
            </tr>
        `
    }



    // ============= ORDER INFO DATA =============

    orderIDElem.textContent = orderID;
    date.textContent = orderObj.date;
    paymentMethod.textContent = orderObj.paymentMethod;


    // ============= CUSTOMER DETAILS DATA ==========

    userEmail.textContent = userObj.email;
    userName.textContent = userObj.fullName;
    userProfile.src = userObj.profilePic;
    contactNumber.textContent = userObj.contactNumber;
    address.textContent = orderObj.address;
    city.textContent = orderObj.city
    zip.textContent = orderObj.zip


    // ============ ORDER SUMMARY DATA =============
    subTotal.textContent = orderObj.totalBill

}
