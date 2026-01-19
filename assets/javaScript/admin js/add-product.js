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

var selectCategory = document.getElementById("select-category")
// var productID = null
var imageURL = "";
var imageInput = document.getElementById("productImages");
var previewPic = document.getElementById("previewPic");
var productName = document.getElementById("productTitle");
var productDescription = document.getElementById("productDescription");
var productPrice = document.getElementById("productPrice");
var productStock = document.getElementById("productStock");
var featureProduct = document.getElementById("featureProduct")
var discount = document.getElementById("discount")


async function getCategories() {
    await firebase.database().ref("categories").get().then((snapshot) => {

        // console.log(snapshot.val())

        if (!snapshot.exists()) {
            console.log("no category found")
        }

        var categoryObj = Object.values(snapshot.val() || {})

        for (var i = 0; i < categoryObj.length; i++) {
            selectCategory.innerHTML += `
                <option value="${categoryObj[i].categoryName}:${categoryObj[i].ID}">${categoryObj[i].categoryName}</option>
            `
            console.log(`${categoryObj[i].categoryName}:${categoryObj[i].ID}`)
        }
    })
}
// getCategories()


imageInput.addEventListener("change", () => {
    console.log(imageInput.files[0])

    if (imageInput.files.length > 0){
        previewPic.src = URL.createObjectURL(imageInput.files[0])
    }
    else{
        previewPic.src = "https://placehold.co/80x80?text=profile"
    }
})



async function saveProduct() {
    event.preventDefault();

    if (imageInput.files.length === 0) {
        toast("Please select an image to upload", "error", 2000);
        return;
    }


    var productImgURL = await uploadImage();
    console.log("Uploaded Image URL:", productImgURL);


    var status = document.querySelector(".form-check-input:checked").value;
    var categoryID = selectCategory.value.split(":")[1]; // Extract category ID
    var productID = await firebase.database().ref("products").push().key;
    console.log("Generated Product ID:", productID);

    var productData = {
        "ID": productID,
        "Product Title": productName.value,
        "description": productDescription.value,
        "price": parseFloat(productPrice.value),
        "categoryName": selectCategory.value.split(":")[0].trim(),
        "stock": parseInt(productStock.value),
        "status": status,
        "categoryID": categoryID,
        "imageURL": productImgURL,
        "Feature Product": featureProduct.checked,
        "discount": discount.value?discount.value:0
    };

    try {
        await firebase.database().ref("products").child(productID).set(productData);
        toast("Product added successfully!", "success", 1500, "products.html");

        setTimeout(() => {
            localStorage.removeItem("ProductId");
            window.location.href = "products.html";
        }, 1500);


        // Clear form fields if dont want to redirect to product page after adding product
        // productName.value = "";
        // productDescription.value = "";
        // productPrice.value = "";
        // selectCategory.value = "";
        // productStock.value = "";
        // imageInput.value = "";
        return;
    }
    catch (error) {
        console.error("Error saving product data:", error);
        alert("Error saving product data. Please try again.");
        return;
    }
}




async function uploadImage() {

    console.log(imageInput.files[0])

    var file = imageInput.files[0];

    if (!file) {
        return null;
    }

    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            toast("Image size should be less than 2MB", "error", 2000);
            return;
        }
    }



    const formdata = new FormData();
    formdata.append("file", imageInput.files[0]);
    formdata.append("upload_preset", "ShopNex-Category");
    formdata.append("folder", "ShopNex products");

    const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
    };

    await fetch("https://api.cloudinary.com/v1_1/dn7oklgm7/image/upload", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            // console.log(result.secure_url);

            imageURL = result.secure_url;
            console.log("this is url" + imageURL);
            return imageURL;
        })
        .catch((error) => {
            console.error(error);
            return null;
        });

    return imageURL;
}





var pageTitle = document.getElementById("pageTitle");
var saveBtn = document.getElementById("saveBtn");

async function addProductRedirect() {
    // event.preventDefault();

    var productID = localStorage.getItem("ProductId");
    await getCategories();




    if (productID === null) {
        pageTitle.innerText = "Add Product";
        saveBtn.innerText = " Save Product";
        saveBtn.setAttribute("onclick", "saveProduct()");

        productName.value = "";
        productDescription.value = "";
        productPrice.value = "";
        selectCategory.value = "";
        productStock.value = "";
        imageURL = "";

        document.getElementById("available").checked = true;

    } else {
        await firebase
            .database()
            .ref("products")
            .child(productID)
            .get()
            .then((snapProduct) => {
                var productObj = (snapProduct.val())
                console.log(productObj)
                console.log(productObj.categoryID)
                console.log(productObj.categoryName)
                console.log(`${productObj.categoryName}:${productObj.categoryID}`)

                pageTitle.innerText = "Update Product";
                saveBtn.innerText = " Update Product";
                saveBtn.setAttribute("onclick", "updateProduct()");

                productName.value = snapProduct.val()["Product Title"];
                productDescription.value = snapProduct.val().description;
                productPrice.value = snapProduct.val().price;
                productStock.value = snapProduct.val().stock;
                discount.value = snapProduct.val().discount;    
                previewPic.src = snapProduct.val().imageURL            
                imageURL = snapProduct.val().imageURL;

                selectCategory.value =
                    `${productObj.categoryName}:${productObj.categoryID}`;



                var status = snapProduct.val().status;


                if (status === "Available") {
                    document.getElementById("available").checked = true;
                }
                else if (status === "Out of Stock") {
                    document.getElementById("outOfStock").checked = true;
                }
            })
    }
}
addProductRedirect();


async function updateProduct() {
    event.preventDefault();

    var productImgURL = await uploadImage();
    // if (productImgURL == null) {
    //     toast("Image upload failed. Please try again.", "error", 3500);
    //     return;
    // }

    var checkedStatus = document.querySelector(".checkedStatus:checked").value;
    var productID = localStorage.getItem("ProductId");

    if (productImgURL === null || productImgURL === "" || productImgURL === undefined) {
        productImgURL = imageURL;
    }

    var productObj = {
        "ID": productID,
        "Product Title": productName.value,
        "description": productDescription.value,
        "price": productPrice.value,
        "categoryName": selectCategory.value.split(":")[0],
        "categoryID": selectCategory.value.split(":")[1],
        "stock": productStock.value,
        // "imageURL": productImgURL,
        "status": checkedStatus,
        "Feature Product": featureProduct.checked,
        "discount": discount.value?discount.value:0
    };

    console.log(productImgURL);

    if (productImgURL) {
        productObj.imageURL = productImgURL;
    }

    firebase.database().ref("products").child(productID).update(productObj);
    toast("Product updated successfully", "success", 1500);
    localStorage.removeItem("ProductId");
    setTimeout(() => {
        window.location.href = "products.html";
    }, 1500);
}


