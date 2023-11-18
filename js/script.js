let shuffledWords = [];

function checkAnswer(index, userTranslation) {
    const correctTranslations = shuffledWords[index].translation;

    if (Array.isArray(correctTranslations)) {
        return correctTranslations.map(t => t.toLowerCase()).includes(userTranslation.toLowerCase());
    } else {
        return userTranslation.toLowerCase() === correctTranslations.toLowerCase();
    }
}

$(document).ready(function () {
    let currentStep = 1;
    let correctCount = 0;
    let incorrectCount = 0;
    let userResponses = [];
    let selectedDifficulty = "beginner";

    $("#difficulty").change(function () {
        selectedDifficulty = $(this).val();
        resetGame();
    });

    $(".container").on("submit", ".card-form", function (event) {
        event.preventDefault();

        const index = $(this).data("index");
        const userTranslation = $(this).find(".user-translation").val();

        const isCorrect = checkAnswer(index, userTranslation);

        if (isCorrect) {
            correctCount++;
        } else {
            incorrectCount++;
        }

        userResponses.push({ word: shuffledWords[index].word, userAnswer: userTranslation, isCorrect });

        updateFeedback();
        displayCard();
    });

    function resetGame() {
        currentStep = 1;
        correctCount = 0;
        incorrectCount = 0;
        userResponses = [];
        shuffledWords = getShuffledWords(selectedDifficulty);
        updateFeedback();
        displayCard();
    }

    function getShuffledWords(difficulty) {
        const wordsByDifficulty = {
            beginner: [
                { word: 'Hello', translation: 'Привіт' },
                { word: 'Goodbye', translation: ["До побачення", "Бувай"] },
                { word: 'Thank you', translation: 'Дякую' },
                { word: 'Please', translation: 'Будь ласка' },
                { word: 'Sorry', translation: ["Вибачте", "Вибач"] },
                { word: 'Yes', translation: 'Так' },
                { word: 'No', translation: 'Ні' },
                { word: 'Friend', translation: 'Друг' },
            ],
            intermediate: [
                { word: 'Sun', translation: 'Сонце' },
                { word: 'Moon', translation: 'Місяць' },
                { word: 'Water', translation: 'Вода' },
                { word: 'Fire', translation: 'Вогонь' },
                { word: 'Earth', translation: 'Земля' },
                { word: 'Air', translation: 'Повітря' },
                { word: 'Rain', translation: 'Дощ' },
                { word: 'Snow', translation: 'Сніг' },
                { word: 'Mountain', translation: 'Гора' },
                { word: 'Tree', translation: 'Дерево' },
                { word: 'Flower', translation: 'Квітка' },
                { word: 'Book', translation: 'Книга' },
                { word: 'Pen', translation: 'Ручка' },
                { word: 'Paper', translation: 'Папір' },
                { word: 'Computer', translation: 'Комп’ютер' },
                { word: 'Music', translation: 'Музика' },
                { word: 'Movie', translation: 'Фільм' },
                { word: 'Game', translation: 'Гра' },
                { word: 'Time', translation: 'Час' },
                { word: 'Space', translation: ["Простір", "Космос"]},
                { word: 'City', translation: 'Місто' },
                { word: 'Nature', translation: 'Природа' },
                { word: 'Travel', translation: 'Подорож' },
                { word: 'Food', translation: 'Їжа' },
                { word: 'Drink', translation: 'Напій' },
                { word: 'Sleep', translation: 'Спати' },
                { word: 'Dream', translation: ["Сон", "Мрія"] },
            ],
            advanced: [
                { word: 'Hope', translation: 'Сподівання' },
                { word: 'Fear', translation: 'Страх' },
                { word: 'Joy', translation: 'Радість' },
                { word: 'Anger', translation: 'Гнів' },
                { word: 'Peace', translation: 'Мир' },
                { word: 'Health', translation: 'Здоров’я' },
                { word: 'Friendship', translation: 'Дружба' },
                { word: 'Learning', translation: ["Навчання", "Вивчення"] },
                { word: 'Success', translation: 'Успіх' },
                { word: 'Failure', translation: 'Невдача' },
            ],
        };

        const words = wordsByDifficulty[difficulty] || wordsByDifficulty.beginner;

        return words.sort(() => Math.random() - 0.5).slice(0, 10);
    }

    function updateFeedback() {
        $("#correct-count").text(correctCount);
        $("#incorrect-count").text(incorrectCount);
    }

    function displayCard() {
        if (currentStep <= shuffledWords.length) {
            const index = currentStep - 1;
            const card = `
                <div class="card" data-index="${index}">
                    <p>${shuffledWords[index].word}</p>
                    <form class="card-form" data-index="${index}">
                        <input type="text" class="user-translation" placeholder="Enter translation" required>
                        <button type="submit" class="submit-button">Submit</button>
                    </form>
                </div>`;

            $("#card-container").html(card).hide().fadeIn();
            $("#current-step").text(currentStep);
            currentStep++;
        } else {
            const proficiencyLevel = calculateProficiencyLevel();
            $("#proficiency-level").text(proficiencyLevel);
            displayUserResponses();
            $("#myModal").css("display", "block");
            resetGame();
        }
    }

    $("#card-container").on("submit", ".card-form", function (event) {
        event.preventDefault();

        const index = $(this).data("index");
        const userTranslation = $(this).find(".user-translation").val();

        const isCorrect = checkAnswer(index, userTranslation);

        if (isCorrect) {
            correctCount++;
        } else {
            incorrectCount++;
        }

        userResponses.push({ word: shuffledWords[index].word, userAnswer: userTranslation, isCorrect });

        updateFeedback();
        displayCard();
    });

    function calculateProficiencyLevel() {
        const accuracy = (correctCount / shuffledWords.length) * 100;
        if (accuracy >= 80) {
            return "Advanced";
        } else if (accuracy >= 60) {
            return "Intermediate";
        } else {
            return "Beginner";
        }
    }

    function displayUserResponses() {
        let responseList = "<h2>User Responses</h2><ul>";
        for (const response of userResponses) {
            responseList += `<li>${response.word}: ${response.userAnswer} - ${response.isCorrect ? "Correct" : "Incorrect, correct answer: " + (shuffledWords.find(w => w.word === response.word)?.translation || "N/A")}</li>`;
        }
        responseList += "</ul>";
        $("#user-responses").html(responseList);
    }

    $(".close").click(function () {
        $("#myModal").css("display", "none");
    });

    $(window).click(function (event) {
        if (event.target === $("#myModal")[0]) {
            $("#myModal").css("display", "none");
        }
    });

    shuffledWords = getShuffledWords(selectedDifficulty);
    displayCard();
});