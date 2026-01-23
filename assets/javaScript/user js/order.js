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



var orderObj;
var cartObj;
var userLoggedIn;
var localID = localStorage.getItem("userID")
var tableBody = document.getElementById("tableBody")
var logOutBtn = document.getElementById("logout-btn")
var logInBtn = document.getElementById("login-btn")
var cartCount = document.getElementById("cart-count")
var loading = document.getElementById("loader-loading")


function redirect() {
    userLoggedIn = localStorage.getItem("userLoggedIn") || "";

    if (userLoggedIn === "true") {
        logOutBtn.style.display = "inline"
        logInBtn.style.display = "none"

        cartObj = JSON.parse(localStorage.getItem("cart")) || [];
        console.log(cartObj);

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

async function getOrdersFromDb() {
    await firebase.database().ref(`orders`).get().then((orderSnap) => {
        orderObj = Object.values(orderSnap.val() || {})
        console.log(orderObj)
        loading.classList.add("d-none")
        showOrders()
    })
}
getOrdersFromDb()



function showOrders() {
    for (var i = 0; i < orderObj.length; i++) {
        if (orderObj[i].userID == localID) {
            tableBody.innerHTML += `
                <tr>
                    <td class="fw-bold">${orderObj[i].orderKey}</td>
                    <td>${orderObj[i].date}</td>
                    <td>$${orderObj[i].totalBill}</td>
                    <td><span class="badge bg-success orderStatus status-badge">${orderObj[i].orderStatus}</span></td>
                    <td>
                        <a href="#" class="btn btn-sm btn-outline-primary" onclick="orderDetailsRedirect('${orderObj[i].orderKey}')">View Details</a>
                    </td>
                </tr>
            `

            var orderStatusObj = document.getElementsByClassName("orderStatus")
            var orderStatus = orderObj[i].orderStatus;

            if (orderStatus == "Pending") {
                orderStatusObj[i].classList.remove("bg-success")
                orderStatusObj[i].classList.add("bg-warning")
                orderStatusObj[i].classList.add("text-dark")
                orderStatusObj[i].innerText = "Processing"
            }
            else if (orderStatus == "Shipped") {
                orderStatusObj[i].classList.remove("bg-success")
                orderStatusObj[i].classList.add("bg-primary")
            }
        }
    }
}



function orderDetailsRedirect(id){
    var orderID = id

    if(orderID){
        localStorage.setItem("orderID", orderID)
        window.location.href = "../user/order-details.html"
    }

}