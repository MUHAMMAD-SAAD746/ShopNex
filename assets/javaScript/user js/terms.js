const termsCondition = document.querySelector("#terms-condition")
const termContainer = document.querySelector("#term-container")
// const termsIcon = document.querySelector(".bi-file-text.display-4")
let content;
const TCLoader = document.querySelector("#TC-loader")

const fetchTerms = async () => {
    try {
        let snap = await firebase
            .database()
            .ref("Terms And Condition")
            .get()

        content = snap.val()

        if (!content) {
            TCLoader.classList.add("d-none")
            return;
        }
        termContainer.classList.remove("text-center")

        termsCondition.innerHTML = content.content;
    }
    catch {
        console.log("error")
    }
}
fetchTerms()