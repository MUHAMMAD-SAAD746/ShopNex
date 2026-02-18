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


var productId = localStorage.getItem("productID") || ""
var userId = localStorage.getItem("userID") || ""

var sendBtn = document.getElementById("sendBtn")
var messageInput = document.getElementById("messageInput")
var chats = document.getElementById("chat-messages")

var ROOMID = ""
var chatRef = null // for run time chat show

var chatRoomObj;
var rooms;








const productContextBar = document.querySelector(".product-context-bar");
const productImg = productContextBar.querySelector(".product-context-img");
const productInfo = productContextBar.querySelector(".product-context-info");

async function fetchProductDetails(productId) {
    if(!productId) return;

    await firebase.database().ref("products").child(productId).get()
        .then((snap) => {
            if(!snap.exists()) {
                toast("Product not found", "error");
                return;
            }

            const product = snap.val();

            // productImg.src = product.imageURL || "assets/images/default-product.png";
            productContextBar.innerHTML = `
                <img src="${product.imageURL || "assets/images/default-product.png"}" class="product-context-img" alt="Product">
                <div class="product-context-info">
                    <h6>${product["Product Title"] || "Unnamed Product"}</h6>
                    <p class="mb-0 text-muted small">Price :  $${product.price || "0.00"}</p>
                </div>
                <i class="bi bi-box-arrow-up-right ms-auto text-muted"></i> 
            `

        }) .catch((error) => {
            console.error("Error fetching product details:", error);
            toast("Error fetching product details", "error");
        });
}

fetchProductDetails(productId);








async function createRoom(userId, productId) {
    var roomid = await firebase.database().ref("chatRooms").push().getKey()
    var chatIds = {
        userId,
        productId,
        roomid
    }
    await firebase.database().ref("chatRooms").child(roomid).set(chatIds)
    return roomid
}



async function checkRoom(userId, productId) {
    chatRoomObj = await firebase.database().ref("chatRooms").get();

    if (!chatRoomObj.exists()) {
        return await createRoom(userId, productId)
    }

    rooms = Object.values(chatRoomObj.val())


    for (let room of rooms) {
        if (room.userId == userId && room.productId == productId) {
            return room.roomid
        }
    }

    return await createRoom(userId, productId)
}




async function loadChat() {
    if (!productId || !userId) {
        toast("Error loading chat.", "error")
        return
    }

    ROOMID = await checkRoom(userId, productId)


    loadSidebarChats();

    chatRef = firebase.database().ref("chats").child(ROOMID);

    chatRef.on("value", (snap) => {
        chats.innerHTML = ""

        if (!snap.exists()) return;


        const messages = Object.values(snap.val())

        for (var i = 0; i < messages.length; i++) {
            console.log(messages);
            const msg = messages[i];

            var div = document.createElement("div")

            if (msg.senderId === userId) {
                div.className = "message sent";
            } else {
                div.className = "message received";
            }

            // Just show message text
            div.textContent = msg.message;

            chats.appendChild(div);

        }

        chats.scrollTop = chats.scrollHeight;
    })
}
loadChat();



sendBtn.addEventListener("click", async function () {
    var text = messageInput.value.trim();
    if (!text) return;

    var messageKey = chatRef.push().key;

    await chatRef.child(messageKey).set({
        senderId: userId,
        productId: productId,
        message: text
    });

    messageInput.value = "";
});




// Enter key support
messageInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendBtn.click();
});

// Load chat on page load
// window.addEventListener("load", loadChat);





async function loadSidebarChats(){
    const sidebar = document.querySelector(".chat-list");
    sidebar.innerHTML = ""

    if(!chatRoomObj || !chatRoomObj.exists()) {
        sidebar.innerHTML = "<p class='text-muted text-center mt-3'>No active chats</p>"
        return;
    }

    for (let room of rooms){
        if(room.userId !== userId) continue;

        const roomId = room.roomid;

        const userSnap = await firebase.database()
            .ref("users")
            .child(room.userId)
            .get();

            console.log(room.userId);
            

        if(!userSnap.exists()) continue;

        const user = userSnap.val();


        const div = document.createElement("div");
        div.className = "chat-item";
        div.innerHTML = `
            <img src="${user.profilePic || "https://placehold.co/48x48?text=User"}" class="chat-avatar" alt="User">
            <div class="chat-info">
                <div class="chat-name">
                    ${user.fullName || "Unknown User"}
                </div>
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

loadSidebarChats()