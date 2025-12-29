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