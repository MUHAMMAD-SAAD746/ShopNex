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


async function adminData(){
    var profileImg = document.getElementById("profileImg");
    var userId = localStorage.getItem("userId");
    var adminName = document.getElementById("adminName");
    
    await firebase.database().ref("Users").child(userId).get().then((snapshot)=>{
        var userObj = snapshot.val();
        adminName.textContent = userObj.userName;

        if(userObj.profilePicUrl=="" || userObj.profilePicUrl==null || userObj.profilePicUrl==undefined){
            profileImg.src = "https://placehold.co/40x40";
            return;
        }
        profileImg.src = userObj.profilePicUrl;
        
    })
}
adminData()

var selectCategory = document.getElementById("select-category")
var productBody = document.getElementById("productBody")

async function getCategories() {
    await firebase.database().ref("categories").get().then((snapshot) => {


        if (!snapshot.exists()) {
            console.log("no category found")
        }

        var categoryObj = Object.values(snapshot.val() || {})

        for (var i = 0; i < categoryObj.length; i++) {
            selectCategory.innerHTML += `
                <option value="${categoryObj[i].categoryName}">${categoryObj[i].categoryName}</option>
            `
        }
    })
}
getCategories()



async function getProducts() {
    await firebase.database().ref("products").get().then((snapshot) => {
        var productObj = Object.values(snapshot.val() || {})

        productBody.innerHTML = ""

        if (productObj.length === 0) {
            toast("No products found. Please add a new product.", "info", 2500);
            productBody.innerHTML = `
                <tr>
                    <td colspan='7' class='text-center'>No products found</td>
                </tr>`
            return;
        }

        for (var i = 0; i < productObj.length; i++) {
            var status = productObj[i].status;            

            var availableBtn = "btn checkedStatus"
            var outOfStockBtn = "btn checkedStatus"

            if(status === "Available"){
                availableBtn += " btn-success border fw-bold"
                outOfStockBtn += " btn text-muted btn-light border"
            }
            else if (status === "Out of Stock"){
                availableBtn += " btn text-muted btn-light border"
                outOfStockBtn += " btn-danger fw-bold"
            }


            productBody.innerHTML += `
                <tr>
                    <td><img src="${productObj[i].imageURL}" id="category-img" class="rounded" alt="Product"></td>
                    <td>${productObj[i]["Product Title"]}</td>
                    <td>${productObj[i].categoryName}</td>
                    <td>$${productObj[i].price}</td>
                    <td>${productObj[i].stock}</td>
                    <td class="text-center">
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="${availableBtn}" onclick="updateStatus('${productObj[i].ID}', 'Available')">Available</button>
                            <button type="button" class="${outOfStockBtn}" onclick="updateStatus('${productObj[i].ID}', 'Out of Stock')">Out of Stock</button>
                        </div>
                    </td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary me-2" onclick="addProductRedirect('${productObj[i].ID}')"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${productObj[i].ID}')"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `
        }
    })
}
getProducts()




function updateStatus(productId, status) {
    firebase.database().ref("products").child(productId).update({status: status});
    getProducts();
}



function deleteProduct(productId) {
    var confirmDelete = confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
        firebase
            .database()
            .ref("products")
            .child(productId)
            .remove();
        toast("Product deleted successfully", "success", 2000);
        getProducts();
    }
}




async function addProductRedirect(productId) {
    event.preventDefault();

    var productId = productId;

    if (productId) {
        localStorage.setItem("ProductId", productId);
        window.location.href = "add-product.html";
    }
    else {
        window.location.href = "add-product.html";
    }
}