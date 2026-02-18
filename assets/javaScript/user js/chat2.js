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

var productId = localStorage.getItem("productID") || "";
var userId = localStorage.getItem("userID") || "";

var sendBtn = document.getElementById("sendBtn");
var messageInput = document.getElementById("messageInput");
var chats = document.getElementById("chat-messages");

var ROOMID = "";
var chatRef = null;
var chatRoomObj;
var rooms;

// Product context bar
const productContextBar = document.querySelector(".product-context-bar");

async function fetchProductDetails(ROOMID) {
    if (!ROOMID) return;

    await firebase.database().ref("chatRooms").child(ROOMID).get()
        .then(async (roomSnap) => {
            if (!snap.exists()) {
                toast("Room not found", "error");
                return;
            }
            const roomSnap = roomSnap.val();

            await firabase.database().ref("products").child(roomSnap.productId).get()
                .then((productSnap) => {
                    const productSnap = productSnap;

                    productContextBar.innerHTML = `
                        <img src="${productSnap.imageURL || "assets/images/default-product.png"}" class="product-context-img" alt="Product">
                        <div class="product-context-info">
                            <h6>${productSnap["Product Title"] || "Unnamed Product"}</h6>
                            <p class="mb-0 text-muted small">Price :  $${productSnap.price || "0.00"}</p>
                        </div>
                        <i class="bi bi-box-arrow-up-right ms-auto text-muted"></i>
                    `;
                })
        })
        .catch((error) => {
            console.error("Error fetching product details:", error);
            toast("Error fetching product details", "error");
        });
}

// fetchProductDetails(productId);

// Create new chat room
async function createRoom(userId, productId) {
    var roomid = await firebase.database().ref("chatRooms").push().getKey();
    var chatIds = { userId, productId, roomid };
    await firebase.database().ref("chatRooms").child(roomid).set(chatIds);
    return roomid;
}

// Load chat messages
async function loadChat() {
    const loader = document.querySelector(".loader-spinner");
    if (loader) loader.style.display = "none";

    chats.innerHTML = "";

    if (!ROOMID) return;

    fetchProductDetails(ROOMID)
    chatRef = firebase.database().ref("chats").child(ROOMID);

    chatRef.on("value", (snap) => {
        chats.innerHTML = "";

        if (!snap.exists()) return;

        const messages = Object.values(snap.val());

        for (let msg of messages) {
            const div = document.createElement("div");
            div.className = msg.senderId === userId ? "message sent" : "message received";
            div.textContent = msg.message;
            chats.appendChild(div);
        }

        chats.scrollTop = chats.scrollHeight;
    });
}

// Sidebar chat list
async function loadSidebarChats() {
    const sidebar = document.querySelector(".chat-list");
    sidebar.innerHTML = "";

    chatRoomObj = await firebase.database().ref("chatRooms").get();
    if (!chatRoomObj.exists()) {
        sidebar.innerHTML = "<p class='text-muted text-center mt-3'>No active chats</p>";
        rooms = [];
        return;
    }

    rooms = Object.values(chatRoomObj.val());

    for (let room of rooms) {
        if (room.userId !== userId) continue;

        const roomId = room.roomid;

        const userSnap = await firebase.database().ref("users").child(room.userId).get();
        const user = userSnap.exists()
            ? userSnap.val()
            : { fullName: "Unknown User", profilePic: "https://placehold.co/48x48?text=User" };

        const div = document.createElement("div");
        div.className = "chat-item";
        div.innerHTML = `
            <img src="${user.profilePic}" class="chat-avatar" alt="User">
            <div class="chat-info">
                <div class="chat-name">${user.fullName}</div>
            </div>
        `;

        div.addEventListener("click", async () => {
            ROOMID = roomId;
            chatRef = firebase.database().ref("chats").child(ROOMID);
            loadChat();
        });

        sidebar.appendChild(div);
    }
}

// Send message
sendBtn.addEventListener("click", async function () {
    var text = messageInput.value.trim();
    if (!text) return;

    if (!ROOMID) {
        // create room lazily
        ROOMID = await createRoom(userId, productId);
        chatRef = firebase.database().ref("chats").child(ROOMID);
        loadSidebarChats();
    }

    const messageKey = chatRef.push().key;
    await chatRef.child(messageKey).set({ senderId: userId, productId, message: text });

    messageInput.value = "";
    loadChat();
});

// Enter key support
messageInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendBtn.click();
});

// Initial sidebar load
loadSidebarChats();

// Do not load chat messages until a room is selected or message sent
loadChat();
