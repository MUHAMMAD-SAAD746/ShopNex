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


var productCount = document.getElementById("totalProduct");


async function totalProduct(){
    await firebase.database().ref("products").get().then((snapshot)=>{
        var productObj = Object.values(snapshot.val());
        console.log(productObj.length);
        productCount.textContent = productObj.length;
    })
}
totalProduct();



var categoriesCount = document.getElementById("totalCategories");
async function totalCategories(){
    await firebase.database().ref("categories").get().then((snapshot)=>{
        var categoriesObj = Object.values(snapshot.val());
        console.log(categoriesObj.length);
        categoriesCount.textContent = categoriesObj.length;
    })
}
totalCategories();