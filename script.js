/**
 * Initializes the Trivia Game when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");

    // Cookie Management Functions
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }

    // Retrieves the value of a specified cookie
    function getCookie(name) {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${name}=`))
            ?.split("=")[1];
    }

    // Checks if a username cookie exists and updates the UI accordingly
    function checkUsername() {
        const savedName = getCookie("username");
        const usernameInput = document.getElementById("username");
        const newPlayerButton = document.getElementById("new-player");

        if (savedName) {
            // Hide the username input and show the new player button
            usernameInput.classList.add("hidden");
            newPlayerButton.classList.remove("hidden");
        }
        else {
            // Show the username field and hide the new player button
            usernameInput.classList.remove("hidden");
            newPlayerButton.classList.add("hidden");
        }
    }

    // Initialize the game
    checkUsername(); 
    displayQuestions();
    displayScores();

    /**
     * Fetches trivia questions from the API and displays them.
     */
    async function fetchQuestions() {
        showLoading(true);  
        try {
            const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            if (!response.ok) {
                throw new Error(`HTTP Error: status: ${response.status}`);
            }
            showLoading(false)
            return response.json()
        } catch (error) {
            //  Error handling: log the error message
            console.error("Failed to fetch data, error.message");
            showLoading(false)
        }
    }

    /**
     * Toggles the display of the loading state and question container.
     *
     * @param {boolean} isLoading - Indicates whether the loading state should be shown.
     */
    function showLoading(isLoading) {
        document.getElementById("loading-container").classList = isLoading
            ? ""
            : "hidden";
        document.getElementById("question-container").classList = isLoading
            ? "hidden"
            : "";
    }

    /**
     * Displays fetched trivia questions.
     * @param {Object[]} questions - Array of trivia questions.
     */
    async function displayQuestions() {

        const questions = await fetchQuestions();
        console.log(questions.results)
        questionContainer.innerHTML = ""; // Clear existing questions
        questions.results.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(
                question.correct_answer,
                question.incorrect_answers,
                index
            )}
            `;
            questionContainer.appendChild(questionDiv);
        });
    }

    /**
     * Creates HTML for answer options.
     * @param {string} correctAnswer - The correct answer for the question.
     * @param {string[]} incorrectAnswers - Array of incorrect answers.
     * @param {number} questionIndex - The index of the current question.
     * @returns {string} HTML string of answer options.
     */
    function createAnswerOptions(
        correctAnswer,
        incorrectAnswers,
        questionIndex
    ) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
            () => Math.random() - 0.5
        );
        return allAnswers
            .map(
                (answer) => `
            <label>
                <input type="radio" name="answer${questionIndex}" value="${answer}" ${answer === correctAnswer ? 'data-correct="true"' : ""
                    }>
                ${answer}
            </label>
        `
            )
            .join("");
    }

    // Calculate the user's score based on their answers
    function calculateScore() {
    let score = 0;

    for (let i = 0; i < 10; i++) {
        const selected = document.querySelector(`input[name="answer${i}"]:checked`);

        if (selected && selected.dataset.correct === "true") {
            score++;
        }
    }

    return score;
}

// Saves the user's score 
    function saveScore(score) {
        const username = getCookie("username");

        if (!username) return; // safety check

        // Get existing scores or create an empty array
        let scores = JSON.parse(localStorage.getItem("scores")) || [];

        // Add new score
        scores.push({
            name: username,
            score: score
        });

        // Save back to localStorage
        localStorage.setItem("scores", JSON.stringify(scores));
}

// Display the list of scores

    function displayScores() {
        const tableBody = document.querySelector("#score-table tbody");

        tableBody.innerHTML = "";

        let scores = JSON.parse(localStorage.getItem("scores")) || [];

        scores.forEach(entry => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${entry.name}</td>
                <td>${entry.score}</td>
            `;
            tableBody.appendChild(row);
        });
    }


    // Event listeners for form submission and new player button
    form.addEventListener("submit", function(event) {
        event.preventDefault(); 

    const usernameInput = document.getElementById("username");
    const enteredName = usernameInput.value.trim();

    // If the user typed a name and cookie doesn't exist,save cookie
    if (enteredName !== "" && !getCookie("username")) {
        setCookie("username", enteredName, 7);
    }

    // If cookie exists, hide input again
    checkUsername();

    // score calculation   
    const score = calculateScore();
    console.log("Score:", score);

    // save score
    saveScore(score);

    // display updated scores
    displayScores();

    // Refresh game with new questions
    displayQuestions();

});

    newPlayerButton.addEventListener("click", (event) => {


    // Delete username cookie by setting expiry to past
    setCookie("username", "", -1);

    // Show username input field again
    document.getElementById("username").classList.remove("hidden");

    // Hide new player button
    newPlayerButton.classList.add("hidden");

    document.getElementById("username").value = "";

    checkUsername();
    })


});