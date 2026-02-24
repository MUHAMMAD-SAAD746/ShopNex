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


// JS below is for Terms & Condition Tab
// ======================================

const termsConditionField = document.querySelector("#TC-editor")
const conditionBtn = document.querySelector("#TC-btn")
const TCLoader = document.querySelector("#TC-loader")


conditionBtn.addEventListener("click", async () => {
    const termsAndCondition = quill.root.innerHTML.trim(); // get HTML

    if (!termsAndCondition || termsAndCondition === "<p><br></p>") {
        toast("Please enter the Terms & Conditions before saving.");
        return;
    }

    await firebase.database()
        .ref("Terms And Condition")
        .set({
            content: termsAndCondition,
            updatedAt: Date.now()
        })
        .then(() => {
            toast("Terms & Conditions updated successfully", "success");
        })
        .catch(error => console.log(error));
});



const fetchTermsAndCondition = async () => {
    let snapShot = await firebase.database().ref("Terms And Condition").get()
    TCLoader.classList.add("d-none")
    termsConditionField.classList.remove("d-none")

    if (snapShot.exists()) {
        const data = snapShot.val().content
        quill.root.innerHTML = data
    }
    else {
        quill.root.innerHTML = ""
    }
}
fetchTermsAndCondition()





// JS below is for Privacy Policy tab
// ==================================

const privacyField = document.querySelector("#privacy-quill")
const privacyBtn = document.querySelector("#privacy-btn")
const privacyLoader = document.querySelector("#privacy-loader")


privacyBtn.addEventListener("click",async () => {
    const privacyPolicyField = privacyQuill.root.innerHTML.trim();

    if (!privacyPolicyField || privacyPolicyField === "<p><br></p>") {
        toast("Please enter the Privacy Policy before saving.");
        return;
    }

    try{
        await firebase.database().ref("Privacy Policy").set({
        content : privacyPolicyField,
        updatedAt : Date.now()
        })
        toast("Privacy Policy Updated Sucessfullly.", "success")
    }
    catch (err) {
        console.log(err)
    }
})


const fetchPrivacyPolicy = async () => {
    let snapShot = await firebase.database().ref("Privacy Policy").get()
    privacyLoader.classList.add("d-none")
    privacyField.classList.remove("d-none")

    if(snapShot.exists()){
        privacyQuill.root.innerHTML = snapShot.val().content
    }
    else {
        privacyQuill.root.innerHTML = ""
    }
}
fetchPrivacyPolicy()





// JS below is for Help & Feedback tab
// ===================================


