const BasicCard = require("./basicFC");
const Cloze = require("./clozeFC");
const inquirer = require("inquirer");
const fs = require("fs");
var correct = 0;
var wrong = 0;
var cardArray = [];
// ********************************* Main Process *************************************

const flashcards = () => {

        inquirer.prompt([{

                type: 'list',
                name: 'userType',
                message: 'What would you like to do?',
                choices: ['Basic Quiz', 'Cloze Quiz', 'Add Basic Flashcard', 'Add Cloze Flashcard', 'Quit']
            }

        ]).then(function(choice) {

            if (choice.userType === 'Add Basic Flashcard') {
                readCards('logBasic.txt');
                createCards(basicPrompt, 'logBasic.txt');
            } else if (choice.userType === 'Add Cloze Flashcard') {
                readCards('logCloze.txt');
                createCards(clozePrompt, 'logCloze.txt');
            } else if (choice.userType === 'Basic Quiz') {
                quiz('logBasic.txt', 0);
            } else if (choice.userType === 'Cloze Quiz') {
                quiz('logCloze.txt', 0);
            } else if (choice.userType === 'Quit') {
                console.log('Thanks for playing!');
            }
        });
    }
// This is for reading the cards.
const readCards = (logFile) => {
    cardArray = [];
    fs.readFile(logFile, "utf8", function(error, data) {

        var jsonContent = JSON.parse(data);

        for (let i = 0; i < jsonContent.length; i++) {
            cardArray.push(jsonContent[i]);
        }
    });
};

// This is for creating more cards. 
const createCards = (promptType, logFile) => {
    inquirer.prompt(promptType).then(function(answers) {
        cardArray.push(answers);
        if (answers.makeMore) {
            createCards(promptType, logFile);
        } else {
            writeToLog(logFile, JSON.stringify(cardArray));
            flashcards();
        }
    });
};

const quiz = (logFile, x) => {
    fs.readFile(logFile, "utf8", function(error, data) {
        var jsonContent = JSON.parse(data);
        if (x < jsonContent.length) {
            if (jsonContent[x].hasOwnProperty("front")) {
                var gameCard = new BasicCard(jsonContent[x].front, jsonContent[x].back);
                var gameQuestion = gameCard.front;
                var gameAnswer = gameCard.back.toLowerCase();
            } else {
                var gameCard = new Cloze(jsonContent[x].text, jsonContent[x].cloze);
                var gameQuestion = gameCard.message;
                var gameAnswer = gameCard.cloze.toLowerCase();
            }

            inquirer.prompt([{
                name: "question",
                message: gameQuestion,
                validate: function(value) {
                    if (value.length > 0) {
                        return true;
                    }
                    return 'At least make a guess.';
                }
            }]).then(function(answers) {
                if (answers.question.toLowerCase().indexOf(gameAnswer) > -1) {
                    console.log('Correct!');
                    correct++;
                    x++;
                    quiz(logFile, x);
                } else {
                    gameCard.printAnswer();
                    wrong++;
                    x++;
                    quiz(logFile, x);
                }
            })
        } else {
            console.log('Here is your score: ');
            console.log('correct: ' + correct);
            console.log('wrong: ' + wrong);
            correct = 0;
            wrong = 0;
            flashcards();
        }
    });
};

const writeToLog = (logFile, info) => {
    fs.writeFile(logFile, info, function(err) {
        if (err)
            console.error(err);
    });
}

const basicPrompt = [{
    name: "front",
    message: "Please type the front of the Card: "
}, {
    name: "back",
    message: "Please type the back of the Card: "
}, {
    type: 'confirm',
    name: 'makeMore',
    message: 'You want to create another card? (hit enter for YES)?',
    default: true
}]

const clozePrompt = [{
    name: "text",
    message: "Enter a sentence, with the word you want to hide in parentheses, like this: 'When (pigs) fly.'",
    validate: function(value) {
        var parentheses = /\(\w.+\)/;
        if (value.search(parentheses) > -1) {
            return true;
        }
        return 'A word in your sentence must be in parentheses'
    }
}, {
    type: 'confirm',
    name: 'makeMore',
    message: 'You want to create another card? (hit enter for YES)?',
    default: true
}]

const makeMore = {
    //Prompt to find out if user wants to make more cards (default is yes)
    type: 'confirm',
    name: 'makeMore',
    message: 'You want to create another card? (hit enter for YES)?',
    default: true
}

flashcards();
