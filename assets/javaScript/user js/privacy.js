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


const PRIVACY_REF = "Privacy Policy"
const loader = document.querySelector("#privacy-loader")
const privacyContent = document.querySelector("#privacy-content")
const privacyContainer = document.querySelector("#privacy-container")
const privacyPlaceholder = document.querySelector("#privacy-placeholder")
const placeholderText = document.querySelector("#placeholder-text")



const fetchPrivacyPolicy = async () => {
    try {
        privacyPlaceholder.classList.remove("d-none")
        placeholderText.textContent = "Loading Privacy Policy"
        let snapShot = await firebase
            .database()
            .ref(PRIVACY_REF)
            .get()

        let privacyPolicy = snapShot.val()

        if (!privacyPolicy) {
            toast("Error fetching Privacy Policy")
            placeholderText.textContent = "Privacy Policy not found."
            return;
        }

        privacyContent.innerHTML = privacyPolicy.content
        privacyContainer.classList.remove("text-center")
        privacyPlaceholder.classList.add("d-none")

    }
    catch (error) {
        console.log(error);
        placeholderText.textContent = "Privacy Policy not found."
        toast("Error fetching Privacy Policy")
    }
    finally{
        loader.classList.add("d-none")
    }
}
fetchPrivacyPolicy()