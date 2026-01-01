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


var categoryName = document.getElementById("categoryName");
var numProduct = document.getElementById("numProducts");
var modalToggle = document.getElementById("modal-toggle");
var categoryId = null;


// function to get categories from firebase database and display in table
function getCategories() {
    var tableBody = document.getElementById("tableBody")
    firebase.database().ref("categories").get().then((categorydb) => {
        var categoryObj = Object.values(categorydb.val() || {})

        if (categoryObj.length === 0) {
            toast("No categories found. Please add a new category.", "info", 2500);
            tableBody.innerHTML = `
                <tr>
                    <td colspan='5' class='text-center'>No categories found</td>
                </tr>`
            return;
        }

        tableBody.innerHTML = "" // clear loading text
        for (var i = 0; i < categoryObj.length; i++) {
            var status = categoryObj[i].checkedStatus;

            var activeBtnClass = "btn checkedStatus"
            var inactiveBtnClass = "btn text-muted border checkedStatus"

            if (status === "active") {
                activeBtnClass += " btn-success fw-bold"
                inactiveBtnClass += " btn-light"
            }
            else if (status === "inactive") {
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
                        <button class="btn btn-sm btn-outline-primary me-2" onclick="openModal('${categoryObj[i].ID}')"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory('${categoryObj[i].ID}')"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `
        }
    });
}
getCategories()



// function to add a new category to firebase database
async function saveCategory() {
    event.preventDefault();

    var checkedStatus = document.querySelector(".checkedStatus:checked").value;
    categoryId = await firebase.database().ref("categories").push(categoryObj).getKey();
    console.log(categoryId);
    var categoryObj = {
        categoryName: categoryName.value,
        numProduct: numProduct.value,
        checkedStatus: checkedStatus,
        ID: categoryId
    }
    console.log(categoryId);

    try {
        await firebase.database().ref("categories").child(categoryId).set(categoryObj);
        toast("Category added successfully", "success", 2000)
        modalToggle.checked = false   // closes the modal (CSS based)
    }
    catch {
        alert("error occured")
    }
    getCategories();
    console.log(categoryId);
}





var modalBtn = document.getElementById("modal-btn")

// function to open modal for adding/updating category
async function openModal(categoryId) {
    var modalTitle = document.getElementById("modal-title")
    categoryId = categoryId || null;
    modalToggle.checked = true;

    if (categoryId == null) {
        modalTitle.textContent = "Add New Category"
        modalBtn.textContent = "Save"
        modalBtn.setAttribute("onclick", "saveCategory()")
        categoryName.value = "";
        numProduct.value = "";
    }
    else {
        await firebase
            .database()
            .ref("categories")
            .child(categoryId)
            .get()
            .then((categoryObj) => {
                categoryName.value = categoryObj.val().categoryName;
                numProduct.value = categoryObj.val().numProduct;
                var status = categoryObj.val().checkedStatus;
                var radioButtons = document.getElementsByName("status");

                for (var i = 0; i < radioButtons.length; i++) {
                    if (radioButtons[i].value == status) {
                        radioButtons[i].checked = true;
                        break;
                    }
                }


                // if(status === "active"){
                //     document.getElementById("activeStatus").checked = true;
                // }
                // else if(status === "inactive"){
                //     document.getElementById("inactiveStatus").checked = true;
                // }
            });

        modalTitle.textContent = "Edit Category"
        modalBtn.textContent = "Update"
        modalBtn.setAttribute("onclick", `updateCategory('${categoryId}')`)


    }
}



// function call inside update modal update btn to update category
async function updateCategory(categoryId) {
    event.preventDefault();

    var checkedStatus = document.querySelector(".checkedStatus:checked").value;
    categoryId = categoryId || null;

    var categoryObj = {
        categoryName: categoryName.value,
        numProduct: numProduct.value,
        checkedStatus: checkedStatus,
        ID: categoryId
    }
    // console.log(categoryId);

    await firebase
        .database()
        .ref("categories")
        .child(categoryId)
        .set(categoryObj);


    categoryName.value = "";
    numProduct.value = "";

    setTimeout(() => {
        modalToggle.checked = false
        toast("Category updated successfully", "success", 2000)   // closes the modal (CSS based)
        categoryId = null;
    }, 2)
    getCategories();
}

function cancelModal() {
    categoryName.value = "";
    numProduct.value = "";
    categoryId = null;

    modalToggle.checked = false;
}





function deleteCategory(categoryId) {
    var confirmDelete = confirm("Are you sure you want to delete this category?");
    if (confirmDelete) {
        firebase
            .database()
            .ref("categories")
            .child(categoryId)
            .remove();
        toast("Category deleted successfully", "success", 2000);
        getCategories();
    }
}