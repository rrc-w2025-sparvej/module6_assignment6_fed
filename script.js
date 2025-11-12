/**
 * Initializes the Trivia Game when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");

    // Initialize the game
    // checkUsername(); Uncomment once completed
    displayQuestions();
    // displayScores();

    /**
     * Fetches trivia questions from the API and displays them.
     */
    async function fetchQuestions() {
        showLoading(true); // Show loading state
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

    // Event listeners for form submission and new player button
    form.addEventListener("submit", (event) => {

    })

    newPlayerButton.addEventListener("click", (event) => {

    })


});