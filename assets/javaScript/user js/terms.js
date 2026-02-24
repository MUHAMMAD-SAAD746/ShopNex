const termsCondition = document.querySelector("#terms-condition")
const termContainer = document.querySelector("#term-container")
const termsIcon = document.querySelector(".bi-file-text.display-4")
let content;
const TCLoader = document.querySelector("#TC-loader")

const fetchTerms = async () => {
    await firebase
        .database()
        .ref("Terms And Condition")
        .get()
        .then((snap) => {
            TCLoader.classList.add("d-none")
            termContainer.classList.remove("text-center")
            termsIcon.classList.add("d-none")
            if (!snap) return;

            content = snap.val()

            termsCondition.innerHTML = content.content;
        })
        .catch((err) => {
            console.log(err)
        })
}
fetchTerms()