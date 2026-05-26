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

const faqContainer = document.querySelector("#faqAccordion")


const fetchFaq = () => {
    firebase.database().ref("FAQ").get().then((snap) => {
        let faqObj = Object.values(snap.val() || {})

        if (faqObj.length == 0) {
            faqContainer.innerHTML = `
                <div class="card border-0 shadow-sm p-4 text-center bg-light h-100">
                    <div class="d-flex flex-column justify-content-center h-100 align-items-center">
                        <div class="text-muted fst-italic">
                            <i class="bi bi-info-circle display-4 d-block mb-3"></i>
                            <h5 class="fw-normal">Help & FAQs</h5>
                            <p class="small">Predefined help content managed by Admin will appear here.</p>
                        </div>
                    </div>
                </div>
            `

            return;
        }

        
        faqContainer.innerHTML = ""

        faqObj.forEach((faq, index) => {
            faqContainer.innerHTML += `
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button ${index===0 ? '' : 'collapsed'}"" type="button" data-bs-toggle="collapse"
                            data-bs-target="#faq${index}">
                            ${faq.question}
                        </button>
                    </h2>
                    <div id="faq${index}" class="accordion-collapse collapse ${index===0 ? 'show' : ''}"
                        data-bs-parent="#faqAccordion">
                        <div class="accordion-body">
                            ${faq.answer}
                        </div>
                    </div>
                </div>
            `
        })
    })
        .catch((err) => {
            console.log(err);
        })
}
fetchFaq()







// Below is the code for user Feed Back...
// =======================================

const userName = document.querySelector("#user-name")
const userEmail = document.querySelector("#user-email")
const feedback = document.querySelector("#feedback")
const submitFeedback = document.querySelector("#submit-feedback")
const feedbackForm = document.querySelector("#feedback-form")



feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    
    if(!userName.value){
        toast("Please enter User Name")
        return;
    }
    else if(!userEmail.value.includes("@") || !userEmail.value.includes(".") || !userEmail.value){
        toast("Please enter a valid Email.")
        return;
    }
    else if(!feedback.value){
        toast("Please enter Feedback")
        return;
    }

    let key = firebase.database().ref("feedback").push().key

    let obj = {
        userName: userName.value.trim(),
        email: userEmail.value.trim(),
        feedback: feedback.value,
        id: key
    }

    try {
        await firebase.database().ref("feedback").child(key).set(obj)
        toast("Feedback submitted Successfully.","success")
        userEmail.value = ""
        userName.value = ""
        feedback.value = ""
    }
    catch (error) {
        toast("Failed to submit feedback: " + error.message, "error")
    }
})