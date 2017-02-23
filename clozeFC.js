// Constructor for Cloze flashcard.
var ClozeFC = function(text, cloze) {
	this.text = text;
	this.cloze = cloze;
	this.printText = function() {
		console.log(this.text + "_________.");
	};
	this.printCloze = function() {
		console.log(this.cloze);
	};
	this.correct = function() {
		console.log("Correct!");
	};
	this.incorrect = function() {
		console.log("Incorrect! Here is the answer: \n" + this.text + " " + this.cloze + ".");
	};
}

module.exports = ClozeFC;