var fs = require("fs");
var inquirer = require("inquirer");
var BasicFC = require("./BasicFC");
var ClozeFC = require("./ClozeFC");
var correct = 0;
var incorrect = 0;
var cardArray = [];

// Main app interface
var flashcards = function() {
	inquirer.prompt([{
		type: 'list',
		name: 'userType',
		message: 'Choose!',
		choices: ['Basic Quiz', 'Cloze Quiz', 'Add Basic Flashcard', 'Add Cloze Flashcard', 'Quit']
	}]).then(function(choices) {

		if (choice.userType === 'Basic Quiz') {
			quiz('logBasic.txt', 0);
		} else if (choice.userType === 'Cloze Quiz') {
			quiz('logCloze.txt', 0);
		} else if (choice.userType === 'Add Basic Flashcard') {
			readCards('logBasic.txt');
			createCards(basicPrompt, 'logBasic.txt');
		} else if (choice.userType === 'Add Cloze Flashcard') {
			readCards('logCloze.txt');
			createCards('logCloze.txt');
		} else if (choice.userType === 'Quit') {
			console.log("Thank you for playing!");
		}
	});
}

// This reads 
var readCards = function(logFile) {
	cardArray = [];
	fs.readFile(logFile, 'utf8', function(err, data) {
		var jsonContent = JSON.parse(data);
		for (let i=0, i<jsonContent.length; i++) {
			cardArray.push(jsonContent[i]);
		}
	});
};

var createCards = function(promptType, logFile) {
	inquirer.prompt(promptType).then(function(answers) {
		cardArray.push(answers);
		if (answers.makeMore) {
			createCards(promtType, logFile);
		} else {
			writeToLog(logFile, JSON.stringify(cardArray));
			flashcards();
		}
	});
}

var quiz = function(logFile, x) {
	fs.readFile(logFile, 'utf8', function(err, data) {
		var jsonContent = JSON.parse(data);
		if (x < jsonContent.length) {
			if (jsonContent[x].hasOwnProperty("front")) {
				var gameCard = new BasicFC(jsonContent[x].front, jsonContent[x].back);
				var gameQuestion = gameCard.front;
				var gameAnswer = gameCard.back.toLowerCase();				
			} else {
				var gameCard = new ClozeFC(jsonContent[x].text, jsonContent[x].cloze);
				var gameQuestion = gameCard.printText();
				var gameAnswer = gameCard.cloze.toLowerCase();
			}

			inquirer.prompt([{
				name: "question",
				message: gameQuestion,
				validate: function(value) {
					if (value.length > 0) {
						return true;
					}
					return "Write something!";
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
			console.log('So, you got: ');
			console.log('correct: ' + correct);
			console.log('wrong: ' + wrong);	
			correct = 0;
			wrong = 0;
			flashcards();
		}
	});
};

var writeToLog = function(logFile, info) {
	fs.writeFile(logFile, info, function(err) {
		if (err)
			console.log(err);
	});
}

var basicPrompt = [{
	name: "front",
	message: "Enter a question."
}, {
	name: "back",
	message: "Enter the answer."
}, {
	type: 'confirm',
	name: 'makeMore',
	message: 'To create another card, Hit ENTER.'
	default: true
}]

