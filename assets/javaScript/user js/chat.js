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


let productId = localStorage.getItem("productID") || "";
let userId = localStorage.getItem("userID") || "";

const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const chats = document.getElementById("chat-messages");
const sidebar = document.querySelector(".chat-list");
const loader = document.querySelector(".loader-spinner")
const productContextBar = document.querySelector(".product-context-bar");

const emptyState = document.querySelector(".chat-empty-state");
const chatActive = document.querySelector(".chat-active");


let ROOMID;
let chatRef;
let chatRoomObj;
let productObj;





const fetchProductDetails = async (productId) => {
    if (!productId) return;

    await firebase.database().ref("products").child(productId).get()
        .then((snap) => {
            if (!snap.exists()) {
                toast("Product not found", "error");
                return;
            }
            const product = snap.val();
            productContextBar.innerHTML = `
                <img src="${product.imageURL || "assets/images/default-product.png"}" class="product-context-img" alt="Product">
                <div class="product-context-info">
                    <h6>${product["Product Title"] || "Unnamed Product"}</h6>
                    <p class="mb-0 text-muted small">Price :  $${product.price || "0.00"}</p>
                </div>
                <i class="bi bi-box-arrow-up-right ms-auto text-muted"></i>
            `;
        })
        .catch((error) => {
            console.error("Error fetching product details:", error);
            toast("Error fetching product details", "error");
        });
}
if (productId) fetchProductDetails(productId);




// ========== FUNCTION TO CREATE CHATROOM ============
// ===================================================
const createRoom = async (userId, productId) => {
    ROOMID = firebase.database().ref("chatRooms").push().getKey();

    let chatIds = { userId, productId, ROOMID };

    await firebase.database().ref("chatRooms").child(ROOMID).set(chatIds);

    return ROOMID;
}



// ========== FUNCTION TO SEND MESSAGE ===========
// ===============================================

sendBtn.addEventListener("click", async () => {
    var text = messageInput.value.trim();

    if (!text) return;

    if (!ROOMID) {
        ROOMID = await createRoom(userId, productId)
        showChatUI(true);
        chatRef = firebase.database().ref("chats").child(ROOMID);
        loadSidebarChats();
    }

    const messageKey = chatRef.push().key;
    await chatRef.child(messageKey).set({
        senderId: userId,
        // productId, 
        message: text,
        timestamp: Date.now()
    });

    messageInput.value = ""
    loadChat()
})






// ========= FUNCTION TO LOAD SIDE BAR ==========
// ==============================================

const loadSidebarChats = async () => {
    await firebase.database().ref("chatRooms").get().then((chatRoomSnap) => {
        chatRoomObj = Object.values(chatRoomSnap.val());
        sidebar.innerHTML = ""
    })
        .catch((err) => {
            console.log(err)
            chatRoomObj = []
            return;
        })


    for (let room of chatRoomObj) {
        if (room.userId !== userId) continue;

        // ROOMID = room.ROOMID


        await firebase.database().ref("products").child(room.productId).get()
            .then((productSnap) => {
                productObj = productSnap.val();
            })
            .catch((err) => {
                console.log(err)
                productObj = { fullName: "Unknown User", profilePic: "https://placehold.co/48x48?text=User" };
            })

        const div = document.createElement("div");
        div.className = "chat-item";
        div.innerHTML = `
            <img src="${productObj.imageURL}" class="chat-avatar" alt="User">
            <div class="chat-info">
                <div class="chat-name">${productObj["Product Title"]}</div>
            </div>
        `;

        if (ROOMID === room.ROOMID) {
            div.classList.add("active");
        }

        div.addEventListener("click", async () => {
            ROOMID = room.ROOMID;

            // Update active product ID
            setActiveProductId(room.productId);

            chatRef = firebase.database().ref("chats").child(ROOMID);
            showChatUI(true);
            loadChat();

            // Remove active class from all chat items
            sidebar.querySelectorAll(".chat-item").forEach(item => item.classList.remove("active"));

            // Add active class to the clicked chat
            div.classList.add("active");
        });

        sidebar.appendChild(div);
    }
}
loadSidebarChats();





const loadChat = async () => {
    if (!ROOMID) {
        await firebase.database().ref("chatRooms").get()
            .then((chatRoomSnap) => {
                if (!chatRoomSnap.exists()) return;

                chatRoomObj = Object.values(chatRoomSnap.val());

                for (let room of chatRoomObj) {
                    if (room.productId === productId && room.userId === userId) {
                        ROOMID = room.ROOMID;
                    }
                }
            })
            .catch((err) => console.log(err));
    }

    if (ROOMID) {
        chatRef = firebase.database().ref("chats").child(ROOMID);
        showChatUI(true);
    }
    else if (productId) {
        // Coming from product page but no room exists yet
        showChatUI(true);
        chats.innerHTML = ""; // empty chat area
        return;
    }
    else {
        showChatUI(false);
        return;
    }

    if (loader) loader.style.display = "block";

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

        if (loader) loader.style.display = "none";

        chats.scrollTop = chats.scrollHeight;
    })
}
loadChat();




messageInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendBtn.click();
});




const setActiveProductId = (id) => {
    localStorage.setItem("productID", id);
    productId = id; // update the global variable too

    fetchProductDetails(productId)
};



const showChatUI = (show) => {
    if (show) {
        emptyState.classList.add("d-none");
        chatActive.classList.remove("d-none");
    } else {
        emptyState.classList.remove("d-none");
        chatActive.classList.add("d-none");
    }
};