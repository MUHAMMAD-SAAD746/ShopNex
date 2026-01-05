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
var productID = null
var imageURL = "";

async function getCategories() {
    await firebase.database().ref("categories").get().then((snapshot) => {

        // console.log(snapshot.val())

        if (!snapshot.exists()) {
            console.log("no category found")
        }

        var categoryObj = Object.values(snapshot.val() || {})
        console.log(categoryObj)

        for (var i = 0; i < categoryObj.length; i++) {
            selectCategory.innerHTML += `
                <option value="${categoryObj[i].categoryName} :${categoryObj[i].ID}">${categoryObj[i].categoryName}</option>
            `
        }
    })
}
getCategories()



async function saveProduct() {
    event.preventDefault();

    var productName = document.getElementById("productTitle").value;
    var productDescription = document.getElementById("productDescription").value;
    var productPrice = document.getElementById("productPrice").value;
    var productCategory = document.getElementById("select-category").value;
    var productStock = document.getElementById("productStock").value;
    var productImgURL = await uploadImage();
    var status = document.querySelector(".form-check-input:checked").value;
    var category = document.getElementById("select-category").value;

    productID = await firebase.database().ref("products").push().key;
    console.log("Generated Product ID:", productID);

    var productData = {
        ID: productID,
        "Product Name": productName,
        description: productDescription,
        price: parseFloat(productPrice),
        category: productCategory,
        stock: parseInt(productStock),
        status: status,
        category: category,
        imageURL: productImgURL
    };

    try {
        await firebase.database().ref("products").child(productID).set(productData);
        toast("Product added successfully!", "success", 3000, "products.html");

        // Reset form fields
        document.getElementById("productForm").reset();
        return;
    }
    catch {
        alert("Error saving product data. Please try again.");
        return;
    }
}




async function uploadImage() {
    var imageInput = document.getElementById("productImages");
    console.log(imageInput.files[0])

    if (imageInput.files.length === 0) {
        toast("Please select an image to upload", "error", 2000);
        return;
    }
    else if (imageInput.files[0].size > 2 * 1024 * 1024) {
        toast("Image size should be less than 2MB", "error", 2000);
        return;
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
