var userName = document.getElementById("name");
var email = document.getElementById("email")
var password = document.getElementById("password")
var confirmPassword = document.getElementById("confirm-password")
var profilePic = document.getElementById("profile-pic");
var imageURl = "";

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

function signUp() {
    event.preventDefault();
    var isValid = true;

    const auth = firebase.auth();

    // user name validation
    if (userName.value.trim() == "") {
        toast("User name is required!")
        isValid = false;
        return
    }
    else if (userName.value.trim().length < 5) {
        toast("User name must contain at least 5 letters")
        isValid = false;
        return
    }

    // email validation 
    if (email.value.trim() == "") {
        toast("Email address is required")
        isValid = false;
        return
    }
    else if (!email.value.includes("@") || !email.value.includes(".")) {
        toast("Please enter a valid email address")
        isValid = false;
        return

    }
    // password and confirm password validation 
    if (password.value == "" || confirmPassword.value == "") {
        toast("Password is required")
        isValid = false;
        return
    }
    else if (password.value.length < 8 || password.value.length < 8) {
        toast("Password must be at least 8 characters")
        isValid = false;
        return
    }
    else if (password.value !== confirmPassword.value) {
        toast("Password do not match!")
        isValid = false;
        return
    }


    if (isValid) {
        toast("SignUp successful", "success")
        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then(async (userCredential) => {
                var user = userCredential.user;
                console.log(user);
                var profilePicUrl = await uploadProfilePic();



                var userData = {
                    userName: userName.value,
                    email: email.value,
                    password: password.value,
                    userId: user.uid,
                    profilePicUrl
                }

                await firebase.database().ref("Users").child(user.uid).set(userData);
                window.location.href = "../admin/login.html"
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert("Error code : " + errorCode + errorMessage)
                // ..
            });
    }
}

async function uploadProfilePic() {
    event.preventDefault();
    var image = profilePic.files[0];

    if (image == null) {
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


