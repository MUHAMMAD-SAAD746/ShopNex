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


async function adminData(){
    var profileImg = document.getElementById("profileImg");
    var userId = localStorage.getItem("userId");
    var adminName = document.getElementById("adminName");
    
    await firebase.database().ref("Users").child(userId).get().then((snapshot)=>{
        var userObj = snapshot.val();
        console.log(userObj.profilePicUrl);
        adminName.textContent = userObj.userName;

        if(userObj.profilePicUrl=="" || userObj.profilePicUrl==null || userObj.profilePicUrl==undefined){
            profileImg.src = "https://placehold.co/40x40";
            return;
        }
        profileImg.src = userObj.profilePicUrl;
        
    })
}
adminData()


var productCount = document.getElementById("totalProduct");
async function totalProduct(){
    await firebase.database().ref("products").get().then((snapshot)=>{
        var productObj = Object.values(snapshot.val());
        productCount.textContent = productObj.length;
    })
}
totalProduct();



var categoriesCount = document.getElementById("totalCategories");
async function totalCategories(){
    await firebase.database().ref("categories").get().then((snapshot)=>{
        var categoriesObj = Object.values(snapshot.val());
        categoriesCount.textContent = categoriesObj.length;
    })
}
totalCategories();