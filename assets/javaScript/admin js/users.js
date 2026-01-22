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

function redirect() {
    const adminLogin = localStorage.getItem("adminLogin");
    if (adminLogin !== "true") {
        window.location.href = "./login.html";
    }
}
redirect(); // protect dashboard

function logOut() {
    localStorage.removeItem("adminLogin");
    localStorage.removeItem("userId");
    redirect();
}


var localAdmin = localStorage.getItem("userId");
var adminName = document.getElementById("adminName")
var profileImg = document.getElementById("profileImg")
var tableBody = document.getElementById("tableBody")

async function getAdminDb(){
    await firebase.database().ref("Admins").child(localAdmin).get().then((adminSnap) => {
        var adminObj = adminSnap.val();
        adminName.innerText = adminObj.userName;

        if (!adminObj.profilePicUrl) {
            profileImg.src = "https://placehold.co/50x50?text=profile";
            return;
        }
        profileImg.src = adminObj.profilePicUrl;
    })
}
getAdminDb()


async function getUsersInfo(){
    await firebase.database().ref("users").get().then((userSnap) => {
        var userObj = Object.values(userSnap.val() || {})
        tableBody.innerHTML = ""

        for (var i = 0; i < userObj.length; i++) {
            tableBody.innerHTML += `
                <tr>
                    <td>${userObj[i].userID}</td>
                    <td>
                        <div class="d-flex align-items-center"><img src="${userObj[i].profilePic}"
                                width="30" height="30" class="rounded-circle me-2" alt=""> ${userObj[i].fullName}</div>
                    </td>
                    <td>${userObj[i].email}</td>
                    <td>${userObj[i].contactNumber}</td>
                    <td>15</td>
                    <td><span class="badge bg-success">Active</span></td>
                    <td class="text-end">
                        <a href="user-detail.html" class="btn btn-sm btn-outline-primary me-1"
                            title="View Details"><i class="bi bi-eye"></i></a>
                        <button class="btn btn-sm btn-outline-danger" title="Block User"><i
                                class="bi bi-slash-circle"></i></button>
                    </td>
                </tr>
            `
        }
    })
}
getUsersInfo()