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

function redirect() {
    const adminLogin = localStorage.getItem("adminLogin");
    if (adminLogin !== "true") {
        window.location.href = "./login.html";
    }
}
redirect(); // protect dashboard

function logOut() {
    localStorage.removeItem("adminLogin");
    localStorage.removeItem("userId");
    redirect();
}


var orderObj;
var tableBody = document.getElementById("tableBody")
var localAdmin = localStorage.getItem("userId")
var adminName = document.getElementById("adminName")
var profileImg = document.getElementById("profileImg")


async function getAdminDb() {
    await firebase.database().ref("Admins").child(localAdmin).get().then((adminSnap) => {
        var adminObj = adminSnap.val() || {}
        console.log(adminObj);
        adminName.textContent = adminObj.userName;

        if (!adminObj.profilePicUrl) {
            profileImg.src = "https://placehold.co/40x40";
            return;
        }
        profileImg.src = adminObj.profilePicUrl;
    })
}
getAdminDb()


async function getDbOrders() {
    await firebase.database().ref("orders").get().then((snapOrder) => {
        orderObj = Object.values(snapOrder.val() || {});
        console.log(orderObj)
        showOrders()
    })
        .catch((error) => {
            console.log(error + "error")
        })
}
getDbOrders()

function showOrders() {
    tableBody.innerHTML = ""
    for (var i = 0; i < orderObj.length; i++) {
        console.log(orderObj[i])
        tableBody.innerHTML += `
            <tr>
                <td>${orderObj[i].orderKey}</td>
                <td>${orderObj[i].firstName} ${orderObj[i].lastName}</td>
                <td>${orderObj[i].totalBill}</td>
                <td>${orderObj[i].paymentMethod}</td>
                <td><span class="badge bg-warning text-dark order-status status-badge">${orderObj[i].orderStatus}</span></td>
                <td>${orderObj[i].date}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary"
                        onclick="goToOrderDetails('${orderObj[i].orderKey}')">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>
        `

        var orderStatusObj = document.getElementsByClassName("order-status")
        var orderStatus = orderStatusObj[i].textContent;

        if (orderStatus == "Shipped") {
            orderStatusObj[i].classList.remove("bg-warning")
            orderStatusObj[i].classList.add("bg-success")
            orderStatusObj[i].classList.add("text-white")
        }
        else if (orderStatus == "Delivered") {
            orderStatusObj[i].classList.remove("bg-warning")
            orderStatusObj[i].classList.add("bg-primary")
            orderStatusObj[i].classList.add("text-white")
        }
    }
}




function goToOrderDetails(orderId) {
    localStorage.setItem("selectedOrderId", orderId);
    window.location.href = "../admin/order-details.html";
}