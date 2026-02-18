function toast(msg, className = "error", duration = 2000, destination = null) {
    Toastify({
        text: msg,
        className: className,
        duration: duration,
        destination: destination,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        onClick: function () { }
    }).showToast();
}



// ================== GLOBAL VARIABLES ==================
let ROOMID = null;
let chatRef = null;
let chatRoomObj = [];
let productObj = null;
let userObj = null;

const chatSidebar = document.querySelector(".chat-list");
const chats = document.querySelector(".chat-messages");
const messageInput = document.querySelector(".chat-input");
const sendBtn = document.querySelector(".btn-send");
const productContextBar = document.querySelector(".product-context-bar");
const loader = document.getElementById("sidebarLoader");

const ADMIN_ID = localStorage.getItem("userId")


const chatMain = document.querySelector(".chat-main")
const noChatView = document.getElementById("noChatView");






// ================== LOAD ALL CHAT ROOMS ==================
// =========================================================
const loadSidebarChats = async () => {
    // chatSidebar.innerHTML = "";

    const snap = await firebase.database().ref("chatRooms").get();

    if (!snap.exists()) return;

    chatRoomObj = Object.values(snap.val());
    

    for (let room of chatRoomObj) {

        // fetch product
        const productSnap = await firebase.database()
            .ref("products")
            .child(room.productId)
            .get();

        productObj = productSnap.exists() ? productSnap.val() : null;

        // fetch user
        const userSnap = await firebase.database()
            .ref("users")
            .child(room.userId)
            .get();

        userObj = userSnap.exists() ? userSnap.val() : null;

        const div = document.createElement("div");
        div.className = "chat-item";
        // All chat items loaded, hide loader
        loader.classList.add("d-none");

        div.innerHTML = `
            <img src="${userObj?.profilePic || "https://placehold.co/48x48?text=U"}" class="chat-avatar">
            <div class="chat-info d-flex justify-content-between align-items-center">
                <div>
                    <div class="chat-name">${userObj?.fullName || "User"}</div>
                    <div class="chat-preview">${productObj?.["Product Title"] || "Product"}</div>
                </div>
                <span class="badge bg-primary rounded-pill d-none">1</span>
            </div>
        `;

        div.addEventListener("click", () => {

            ROOMID = room.ROOMID;

            // highlight active
            chatSidebar.querySelectorAll(".chat-item")
                .forEach(item => item.classList.remove("active"));

            div.classList.add("active");


            // 👇 SHOW CHAT UI
            noChatView.classList.add("hide");
            chatMain.classList.remove("hide");

            loadChat();
            loadProductContext(room.productId);
        });

        chatSidebar.appendChild(div);
    }

    
};

loadSidebarChats();







// ================== LOAD PRODUCT CONTEXT ==================
const loadProductContext = async (productId) => {

    const snap = await firebase.database()
        .ref("products")
        .child(productId)
        .get();

    if (!snap.exists()) return;

    const product = snap.val();

    productContextBar.innerHTML = `
        <img src="${product.imageURL}" class="product-context-img">
        <div class="product-context-info">
            <h6>${product["Product Title"]}</h6>
            <p class="mb-0 text-muted small">Price: $${product.price}</p>
        </div>
    `;
};









// ================== LOAD CHAT MESSAGES ==================
// ========================================================

const loadChat = () => {

    if (!ROOMID) return;

    chatRef = firebase.database().ref("chats").child(ROOMID);

    chatRef.on("value", (snap) => {

        chats.innerHTML = "";

        if (!snap.exists()) return;

        const messages = Object.values(snap.val());

        for (let msg of messages) {

            const div = document.createElement("div");

            div.className =
                msg.senderId === ADMIN_ID
                    ? "message sent"
                    : "message received";

            div.textContent = msg.message;

            chats.appendChild(div);
        }

        chats.scrollTop = chats.scrollHeight;
    });
};







// ================== SEND MESSAGE ==================
// ==================================================
sendBtn.addEventListener("click", async () => {

    const text = messageInput.value.trim();

    if (!text || !ROOMID) return;

    const messageKey = chatRef.push().key;

    await chatRef.child(messageKey).set({
        senderId: ADMIN_ID,
        message: text,
        timestamp: Date.now()
    });

    messageInput.value = "";
});
