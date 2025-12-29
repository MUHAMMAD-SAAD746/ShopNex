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

async function logIn() {
    event.preventDefault();
    var isValid = true;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password");

    const auth = firebase.auth();

    if (email == "") {
        toast("Email address is required")
        isValid = false;
        return;
    }
    else if (!email.includes("@") || !email.includes(".")) {
        toast("Please enter a valid email address")
        isValid = false;
        return;
    }

    if (password.value == "") {
        toast("Password is required")
        isValid = false;
        return;
    }
    else if (password.value.length < 8) {
        toast("Password must be at least 8 characters")
        isValid = false;
        return;
    }
    console.log("sjdhfjhdjhfjsdhj")

    if (isValid) {
        await auth.signInWithEmailAndPassword(email, password.value)
            .then((userCredential) => {
                toast("Login successful!", "success", "1200")
                // Signed in
                var user = userCredential.user;

                localStorage.setItem("adminLogin", true)
                localStorage.setItem("userId", user.uid)

                setTimeout(() => {
                    window.location.href = "dashboard.html"
                }, 1200)


            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage)
            });
    }
}

function redirect(){
    var isLoggedIn = localStorage.getItem("adminLogin")
    if (isLoggedIn) {
        window.location.href = "../../../admin/dashboard.html"
    }
}
redirect()

