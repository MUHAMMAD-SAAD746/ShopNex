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



const termsConditionField = document.querySelector("#terms-condition-field")
const conditionBtn = document.querySelector("#TC-btn")
let termsAndCondition;


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
