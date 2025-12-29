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


var categoryName;
var numProduct;
var checkedStatus;

// function to add a new category to firebase database
async function saveCategory() {
    event.preventDefault();

    categoryName = document.getElementById("categoryName").value;
    numProduct = document.getElementById("numProducts").value
    checkedStatus = document.querySelector(".checkedStatus:checked").value
    var modalbtn = document.getElementById("modal-toggle")
    console.log(modalbtn)

    var categoryObj = {
        categoryName,
        numProduct,
        checkedStatus
    }


    try {
        var categoryId = await firebase.database().ref("categories").push(categoryObj).getKey();
        console.log(categoryId)
        setTimeout(() => {
            modalbtn.checked = false   // closes the modal (CSS based)
        }, 2)
    }
    catch {
        alert("error occured")
    }
    toast("Category added successfully", "success", 1700)
}



function getCategories() {
    var tableBody = document.getElementById("tableBody")
    firebase.database().ref("categories").get().then((categorydb) => {
        var categoryObj = Object.values(categorydb.val() || {})


        for (var i = 0; i < categoryObj.length; i++) {
            var status = categoryObj[i].checkedStatus;

            var activeBtnClass = "btn"
            var inactiveBtnClass = "btn text-muted border"

            if(status === "active"){
                activeBtnClass += " btn-success fw-bold"
                inactiveBtnClass += " btn-light"
            }
            else if(status === "inactive"){
                activeBtnClass += " btn-light"
                inactiveBtnClass += " btn-danger fw-bold"
            }

            tableBody.innerHTML += `
                <tr>
                    <td><img src="https://placehold.co/50x50" class="rounded" alt=""></td>
                    <td>${categoryObj[i].categoryName}</td>
                    <td class="text-center">${categoryObj[i].numProduct}</td>
                    <td class="text-center">
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="${activeBtnClass}">Active</button>
                            <button type="button" class="${inactiveBtnClass}">Inactive</button>
                        </div>
                    </td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary me-2"><i
                            class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `
        }
    });
}
getCategories()