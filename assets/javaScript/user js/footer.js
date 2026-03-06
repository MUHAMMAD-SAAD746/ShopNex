const footerContainer = document.querySelector("#footer-container")
const path = window.location.pathname.split("/").pop();


const footerContent = `
    <div class="container">
            <div class="row g-4">
            <div class="col-md-4">
                <h5 class="fw-bold mb-3">ShopNex</h5>
                <p class="small text-white-50">Your one-stop shop for everything you need. Quality products at the
                    best prices.</p>
            </div>
            <div class="col-md-2">
                <h6 class="fw-bold mb-3">Quick Links</h6>
                <ul class="list-unstyled small text-white-50">
                    <li class="mb-2">
                        <a href="${path=="index.html"?path:"../index.html"}" 
                            class="text-white-50 text-decoration-none">Home
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="${path=="index.html"?"user/products.html":"products.html"}" 
                        <a href="user/products.html" 
                            class="text-white-50 text-decoration-none">Shop
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="${path=="index.html"?"user/privacy.html":"privacy.html"}" 
                            class="text-white-50 text-decoration-none">Privacy Policy
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="${path=="index.html"?"user/terms.html":"terms.html"}" 
                            class="text-white-50 text-decoration-none">Terms & Conditions
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="${path=="index.html"?"admin/login.html":"../admin/login.html"}" 
                            class="text-white-50 text-decoration-none">Admin Login
                        </a>
                    </li>
                </ul>
            </div>
            <div class="col-md-3">
                <h6 class="fw-bold mb-3">Contact Us</h6>
                <ul class="list-unstyled small text-white-50">
                    <li class="mb-2">
                        <i class="bi bi-geo-alt me-2"></i> 
                        <a href="${path=="index.html"?"user/help.html":"help.html"}"
                            class="text-white-50 text-decoration-none">Help & Support
                        </a>
                    </li>
                    <li class="mb-2"><i class="bi bi-envelope me-2"></i> support@eshop.com</li>
                    <li class="mb-2"><i class="bi bi-telephone me-2"></i> +1 234 567 8900</li>
                </ul>
            </div>
            <div class="col-md-3">
                <h6 class="fw-bold mb-3">Newsletter</h6>
                <div class="input-group mb-3">
                    <input type="text" class="form-control form-control-sm" placeholder="Your Email">
                    <button class="btn btn-primary btn-sm" type="button">Subscribe</button>
                </div>
            </div>
        </div>
        <hr class="border-secondary my-4">
        <div class="text-center small text-white-50">
            &copy; 2026 ShopNex. All rights reserved.
        </div>
    </div>
`

footerContainer.innerHTML = footerContent
