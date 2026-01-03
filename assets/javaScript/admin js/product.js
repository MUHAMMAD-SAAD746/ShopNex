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

async function getCategories() {
    await firebase.database().ref("categories").get().then((snapshot) => {

        console.log(snapshot.val())

        if(!snapshot.exists()){
            console.log("no category found")
        }
        
        var categoryObj = Object.values(snapshot.val() || {})

        for(var i = 0 ; i < categoryObj.length ; i++){
            selectCategory.innerHTML += `
                <option value="${categoryObj[i].categoryName}">${categoryObj[i].categoryName}</option>
            `
        }
    })
}
getCategories()