# Debugger Steps

## Breakpoint 1 – Fetching trivia questions
Breakpoint 1 – Getting Trivia Questions

Where I paused:
Inside fetchQuestions(), on the line that calls the API using fetch().

Why this point matters:
The game cannot work without questions. If this step fails, nothing else loads.

Before stepping:
The loading skeleton is showing and response hasn’t been created yet.
The program is waiting for the API.

After stepping:
response becomes a real object (status 200, ok: true). This confirms the API is working and sending data.
The game can now turn that data into JSON for displayQuestions().

## Breakpoint 2 – Displaying trivia questions

Where I paused:
Inside displayQuestions(), on the line where the code creates each question container (document.createElement("div")).

Why this point matters:
This is where questions and their answer choices actually appear on the page.

Before stepping:
questions.results holds all 10 questions.

After stepping:

The question <div> is created and filled with text + answer options. The element gets added to the page, and I can see it appear live.

This confirms the DOM is updating correctly.

## Breakpoint 3 – Calculating score
Where I paused:
In the form submit handler, right at const score = calculateScore();.

Why this point matters:
This is where all selected answers are turned into a final score.

Before stepping:
The user has chosen answers and clicked “Finish Game.”


After stepping:

score now contains the total correct answers.
saveScore(score) then stores it in localStorage.
displayScores() immediately updates the table on the page.

## Critical State – Score Ready to Be Saved

State chosen:
Right after const score = calculateScore();.

What I saw:

score shows exactly how many questions the user got right. I can confirm whether this number matches the answers I picked.