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

var profileImage = document.getElementById('profile-image-input');
var profilePreview = document.getElementById('preview-img');
var fullName = document.getElementById('signup-fullname');
var contactNumber = document.getElementById('signup-contact');
var email = document.getElementById('signup-email');
var password = document.getElementById('signup-password');
var confirmPassword = document.getElementById('signup-confirm-password');
var createAccountBtn = document.getElementById('create-account-btn');




async function createAccount(event) {
    event.preventDefault();
    var isValid = true;

    // Reset border style
    fullName.style.border = "1px solid #ced4da";
    contactNumber.style.border = "1px solid #ced4da";
    email.style.border = "1px solid #ced4da"
    password.style.border = "1px solid #ced4da"
    confirmPassword.style.border = "1px solid #ced4da"

    if (fullName.value === "") {
        toast("Full name is required", "error");
        fullName.style.border = "1px solid red";
        isValid = false;
        return;
    }
    if (fullName.value.trim().length < 5) {
        toast("Full name must contain at least 5 characters", "error");
        fullName.style.border = "1px solid red";
        isValid = false;
        return;
    }
    if (contactNumber.value === "") {
        toast("Contact number is required", "error");
        contactNumber.style.border = "1px solid red";
        isValid = false;
        return;
    }
    if (contactNumber.value.trim().length < 11) {
        toast("Contact number must contain at least 11 digits", "error");
        contactNumber.style.border = "1px solid red";
        isValid = false;
        return;
    }
    if (email.value === "") {
        toast("Email address is required", "error");
        email.style.border = "1px solid red";
        isValid = false;
        return;
    }
    if (!email.value.includes("@") || !email.value.includes(".")) {
        toast("please enter a valid email address", "error");
        email.style.border = "1px solid red";
        isValid = false;
        return;
    }
    if (password.value.trim().length === 0) {
        toast("Password is required", "error");
        email.style.border = "1px solid red";
        isValid = false;
        return;
    }
    if (password.value.trim().length < 8) {
        toast("Password must contain at least 8 characters", "error");
        password.style.border = "1px solid red";
        isValid = false;
        return;
    }
    if (confirmPassword.value.trim().length === 0) {
        toast("Please confirm your password", "error");
        confirmPassword.style.border = "1px solid red";
        isValid = false;
        return;
    }
    if (password.value !== confirmPassword.value) {
        toast("Password did not match", "error");
        confirmPassword.style.border = "1px solid red";
        isValid = false;
        return;
    }
    if (isValid) {
        await firebase.auth().createUserWithEmailAndPassword(email.value, password.value.trim())
            .then(async (userCredential) => {
                // Signed in 
                var user = userCredential.user;
                var imageURL = await uploadProfilePic();
                console.log(user);


                userObj = {
                    fullName: fullName.value,
                    contactNumber: contactNumber.value,
                    email: email.value,
                    password: password.value,
                    userID: user.uid,
                    profilePic: imageURL ? imageURL : "https://res.cloudinary.com/dn7oklgm7/image/upload/v1768411995/ShopNex%20Default/pxwdjlfp4alwmgxybka2.png"
                }


                await firebase.database().ref('users/' + user.uid).set(userObj)
                toast("Account created successfully", "success", 1000, "../user/login.html");

                setTimeout(() => {
                    window.location.href = "../user/login.html";
                }, 1100);


            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                toast(errorMessage, "error", 2000);
                toast(errorCode, "error", 2000);
            });
    }
}






async function uploadProfilePic() {
    event.preventDefault();
    var image = profileImage.files[0];

    if (image == null) {
        console.log("No image selected");
        return null;
    }

    if (image.size > 2 * 1024 * 1024) {
        toast("Image size should be less than 2MB", "error", 3500);
        return null;
    }

    const formdata = new FormData();
    formdata.append("file", profilePic.files[0]);
    formdata.append("upload_preset", "ShopNex-Category");
    formdata.append("folder", "ShopNex profile pics");

    const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
    };


    await fetch("https://api.cloudinary.com/v1_1/dn7oklgm7/image/upload", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            imageURl = result.secure_url;
            return imageURl;
        })
        .catch((error) => {
            console.error(error)
            return null;
        });

    return imageURl;
}






// ........... below is the js for login page ................

var loginEmail = document.getElementById('login-email');
var loginPassword = document.getElementById('login-password');
var loginBtn = document.getElementById('login-btn');
var loginTxt = document.getElementById("login-txt")
var loginSpinner = document.getElementById("spinnerLogin")


async function loginUser(event) {
    event.preventDefault();
    var isValid = true;

    loginSpinner.classList.remove("d-none")
    loginTxt.classList.add("d-none")

    // Reset border style
    loginEmail.style.border = "1px solid #ced4da"
    loginPassword.style.border = "1px solid #ced4da"

    if (loginEmail.value.trim().length === 0) {
        toast("Email is required", "error");
        loginEmail.style.border = "1px solid red"
        isValid = false;
        return;
    }
    if (!loginEmail.value.includes("@") || !loginEmail.value.includes(".")) {
        toast("please enter a valid email address")
        loginEmail.style.border = "1px solid red"
        isValid = false;
        return;
    }
    if (loginPassword.value.trim().length === 0) {
        toast("Password is required")
        loginPassword.style.border = "1px solid red"
        isValid = false;
        return;
    }
    if (loginPassword.value.trim().length < 8) {
        toast("Password must contain at least 8 characters")
        loginPassword.style.border = "1px solid red"
        isValid = false;
        return;
    }
    if (isValid) {
        firebase.auth().signInWithEmailAndPassword(loginEmail.value, loginPassword.value)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                toast("Login successful", "success", 1000, "../user/home.html");

                localStorage.setItem("userLoggedIn", true);
                localStorage.setItem("userID", user.uid);

                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 1050)
                // ...
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                toast("Error: " + errorMessage + errorCode, "error", 4000)
            });
    }
}