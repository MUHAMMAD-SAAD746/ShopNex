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


async function getDbData(){
    await firebase.database().ref("orders").get().then((snapOrder) => {
        orderObj = Object.values(snapOrder.val() || {});
        console.log(orderObj)
        showOrders()
    })
    .catch((error) => {
        console.log(error + "error")
    })
}
getDbData()

function showOrders() {
    for(var i = 0; i < orderObj.length; i++){
        console.log(orderObj[i])
        tableBody.innerHTML += `
            <tr>
                <td>${orderObj[i].orderKey}</td>
                <td>${orderObj[i].firstName} ${orderObj[i].lastName}</td>
                <td>${orderObj[i].totalBill}</td>
                <td>${orderObj[i].paymentMethod}</td>
                <td><span class="badge bg-warning text-dark order-status">${orderObj[i].orderStatus}</span></td>
                <td>${orderObj[i].date}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary"><i
                            class="bi bi-eye"></i></button>
                </td>
            </tr>
        `

        var orderStatusObj = document.getElementsByClassName("order-status")
        var orderStatus = orderStatusObj[i].textContent;

        if(orderStatus == "Shipped"){
            orderStatusObj[i].classList.remove("bg-warning")
            orderStatusObj[i].classList.add("bg-success")
            orderStatusObj[i].classList.add("text-white")
        }
        else if(orderStatus == "Dilivered"){
            orderStatusObj[i].classList.remove("bg-warning")
            orderStatusObj[i].classList.add("bg-primary")
            orderStatusObj[i].classList.add("text-white")
        }
        
    }
}