var sideBar= `
    <nav class="admin-sidebar    d-flex flex-column" id="sidebar">
        <div class="text-center mb-4 d-flex align-items-center justify-content-center">
            <!-- <h4 class="fw-bold">Admin Panel</h4> -->
            <a href="./dashboard.html"><img src="../assets/images/logo.png" alt="logo" width="200" id="logo" class="ms-1"></a>
            <i class="bi bi-chevron-left mt-2" id="toggleSidebar"></i>
        </div>
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link" href="dashboard.html" title="Dashboard"><i class="bi bi-columns-gap"></i> <span>Dashboard</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="categories.html" title="Categories"><i class="bi bi-tags me-2"></i> <span>Categories</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="products.html" title="Products"><i class="bi bi-box-seam me-2"></i> <span>Products</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="orders.html" title="Orders"><i class="bi bi-cart-check me-2"></i> <span>Orders</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="users.html" title="Users"><i class="bi bi-people me-2"></i> <span>Users</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="chat.html" title="Chat"><i class="bi bi-chat-dots me-2"></i> <span>Chat</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="settings.html" title="Settings"><i class="bi bi-gear me-2"></i> <span>Settings</span></a>
            </li>
        </ul>
        <div class="mt-auto p-3">
            <a href="" class="btn btn-danger w-100" onclick="logOut()" title="Logout"><i class="bi bi-box-arrow-right me-2"></i>
                <span>Logout</span></a>
        </div>
    </nav>
`


var navigationBar = document.getElementById("navigationBar");
navigationBar.innerHTML = sideBar;




var sidebar = document.getElementById('sidebar');
var toggleSidebar = document.getElementById('toggleSidebar');
var logo = document.getElementById('logo');
var collapsed = false;

// retrieve the state from localStorage on page load
var sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
if(sidebarCollapsed === "true"){
    collapsed = true;
    sidebar.classList.add('collapsed');
    logo.src = "../assets/images/favicon.png";
    toggleSidebar.classList.replace('bi-chevron-left', 'bi-chevron-right');
    logo.width = 30;
}

toggleSidebar.addEventListener('click', function () {
    collapsed = !collapsed;
    sidebar.classList.toggle('collapsed', collapsed);

    localStorage.setItem("sidebarCollapsed", collapsed);

    if (collapsed) {
        logo.src = "../assets/images/favicon.png";
        toggleSidebar.classList.replace('bi-chevron-left', 'bi-chevron-right');
        logo.width = 30;
    }
    else{
        logo.src = "../assets/images/logo.png";
        toggleSidebar.classList.replace('bi-chevron-right', 'bi-chevron-left');
        logo.width = 200;
    }
});


var currentPath = window.location.pathname.split("/").pop();
var navLinks = sidebar.getElementsByClassName('nav-link');

for (var i = 0; i < navLinks.length; i++) {
    var linkPage = navLinks[i].getAttribute('href');
    if (linkPage === currentPath) {
        navLinks[i].className += ' active';
    } else {
        navLinks[i].className = navLinks[i].className.replace(' active', '');
    }
}