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


privacyBtn.addEventListener("click", async () => {
    const privacyPolicyField = privacyQuill.root.innerHTML.trim();

    if (!privacyPolicyField || privacyPolicyField === "<p><br></p>") {
        toast("Please enter the Privacy Policy before saving.");
        return;
    }

    try {
        await firebase.database().ref("Privacy Policy").set({
            content: privacyPolicyField,
            updatedAt: Date.now()
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

    if (snapShot.exists()) {
        privacyQuill.root.innerHTML = snapShot.val().content
    }
    else {
        privacyQuill.root.innerHTML = ""
    }
}
fetchPrivacyPolicy()





// JS below is for Help & Feedback tab
// ===================================

// help and feedback variables
const addFaq = document.querySelector("#add-faq")
const faqAnswer = document.querySelector("#faq-answer")
const faqQuestion = document.querySelector("#faq-question")
const faqContainer = document.querySelector("#faq-container")
const faqForm = document.querySelector("#faq-form")

let faqObj;
let editingFaqId = null;


// Function to add FAQ
// ===================

faqForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    
    if (editingFaqId) {
        updateFaq()
        return;
    }

    let faqKey = firebase.database().ref("FAQ").push().key
    console.log(faqKey);

    let Obj = {
        question: faqQuestion.value.trim(),
        answer: faqAnswer.value.trim(),
        Id: faqKey
    }

    try {
        await firebase.database().ref("FAQ").child(faqKey).set(Obj)

        faqAnswer.value = "";
        faqQuestion.value = "";
        toast("FAQ added successfully", "success")
        fetchFaq()
    }
    catch (error) {
        toast("error adding FAQ" + error)
    }
})



// fetch FAQ from DB and display in existing FAQ portion
// =====================================================

const fetchFaq = async () => {
    try {
        let Obj = await firebase.database().ref("FAQ").get()
        faqObj = Object.values(Obj.val() || {})

        console.log(Obj);
        console.log(faqObj);
        faqContainer.innerHTML = ""


        for (let faq of faqObj) {
            faqContainer.innerHTML += `
            <div
                class="list-group-item d-flex justify-content-between align-items-center px-0">
                <div>
                    <small class="fw-bold d-block">${faq.question}</small>
                    <small class="text-muted text-truncate d-block"
                        style="max-width: 300px;">${faq.answer}</small>
                </div>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editFaq('${faq.Id}')"><i
                            class="bi bi-pencil"></i></button>
                    <button class="btn btn-outline-danger" onclick="deleteFaq('${faq.Id}')"><i
                            class="bi bi-trash"></i></button>
                </div>
            </div>
        `
        }
    } 
    catch (error) {
        toast("can't fetch FAQ. Please retry.")
        console.log(error);
    }
}
fetchFaq()


// Function To Delete FAQ
// ======================

const deleteFaq = async (id) => {
    firebase.database().ref("FAQ").child(id).remove()
        .then(() => {
            toast("FAQ deleted successfully.", "success")
            fetchFaq()
        })
        .catch((err) => {
            console.log(err);
            toast("Error deleting FAQ")
        })
}



// Functions below are to update Faq
// ================================

const editFaq = (id) => {
    firebase.database().ref("FAQ").child(id).get()
        .then((snap) => {
            let snapShot = snap.val()
            console.log(snapShot);

            faqQuestion.value = snapShot.question
            faqAnswer.value = snapShot.answer
            addFaq.innerHTML = `<i class="bi bi-pencil"></i> Update`

            editingFaqId = snapShot.Id
        })
        .catch((err) => {
            console.log(err);
        })
}


const updateFaq = async () => {
    let Obj = {
        question: faqQuestion.value.trim(),
        answer: faqAnswer.value.trim(),
    }

    try {
        await firebase.database().ref("FAQ").child(editingFaqId).update(Obj)
        toast("FAQ updated Successfully.", "success")

        faqAnswer.value = "";
        faqQuestion.value = "";
        editingFaqId = null;
        addFaq.innerHTML = `<i class="bi bi-plus"></i> Add FAQ`
        fetchFaq()
    }
    catch (error) {
        console.log(error);
        toast("Error updating FAQ")
    }
}
// ======================================




// Below is the code for user feedback Inbox
// =========================================

const adminReply = document.querySelector("#admin-reply")


const initializaEmailJs = () => {
    
}


const feedbackReply = () => {
    console.log(emailjs);
    
}
feedbackReply()


