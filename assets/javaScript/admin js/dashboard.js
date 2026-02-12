function redirect() {
    const adminLogin = localStorage.getItem("adminLogin");

    if (adminLogin !== "true") {
        window.location.href = "./login.html";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    redirect();
});
// protect dashboard

function logOut() {
    localStorage.removeItem("adminLogin");
    localStorage.removeItem("userId");
    redirect();
}



var productObj;
var categoriesObj;
var userObj;
var orderObj;

async function adminData() {
    var profileImg = document.getElementById("profileImg");
    var userId = localStorage.getItem("userId");
    var adminName = document.getElementById("adminName");

    await firebase.database().ref("Admins").child(userId).get().then((snapshot) => {
        var userObj = snapshot.val();
        console.log(userObj.profilePicUrl);
        adminName.textContent = userObj.userName;

        if (userObj.profilePicUrl == "" || userObj.profilePicUrl == null || userObj.profilePicUrl == undefined) {
            profileImg.src = "https://placehold.co/40x40";
            return;
        }
        profileImg.src = userObj.profilePicUrl;

    })
}
adminData()


var productCount = document.getElementById("totalProduct");
async function totalProduct() {
    await firebase.database().ref("products").get().then((snapshot) => {
        productObj = Object.values(snapshot.val());
        productCount.textContent = productObj.length;
    })
}
totalProduct();



var categoriesCount = document.getElementById("totalCategories");
async function totalCategories() {
    await firebase.database().ref("categories").get().then((snapshot) => {
        categoriesObj = Object.values(snapshot.val());
        categoriesCount.textContent = categoriesObj.length;
    })
}
totalCategories();



var totalUser = document.getElementById("totalUsers")
async function totalUsers() {
    await firebase.database().ref("users").get().then((userSnap) => {
        userObj = Object.values(userSnap.val())
        console.log(userObj);

        totalUser.textContent = userObj.length;
    })
}
totalUsers()



var totalOrder = document.getElementById("totalOrders")
async function totalOrders() {
    await firebase.database().ref("orders").get().then((orderSnap) => {
        orderObj = Object.values(orderSnap.val())
        totalOrder.textContent = orderObj.length;
    })
}
totalOrders()