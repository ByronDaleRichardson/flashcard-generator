// Constructor for Basic flashcard.
var BasicFC = function(front, back) {
	this.front = front;
	this.back = back;
	this.printFront = function() {
		console.log(this.front);
	};
	this.printBack = function() {
		console.log(this.back);
	};
	this.printAnswer = function() {
		console.log("Sorry, the correct answer is " + this.back + ".");
	};
}

module.exports = BasicFC;