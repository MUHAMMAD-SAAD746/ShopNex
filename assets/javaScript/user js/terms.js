const termsContainer = document.querySelector("#terms-container")
let termsAndCondition;

const fetchTerms = async () => {
    await firebase
        .database()
        .ref("Terms And Condition")
        .get()
        .then((snap) => {
            if (!snap) return;

            termsAndCondition = snap.val()

            termsContainer.innerHTML = termsAndCondition.content;
        })
        .catch((err) => {
            console.log(err)
        })
}
fetchTerms()