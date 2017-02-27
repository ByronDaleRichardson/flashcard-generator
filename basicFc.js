// The constructor for the basic flashcard.
var basicFC = function(front, back) {
    this.front = front;
    this.back = back;
}
basicFC.prototype.printCard = function() {
    console.log('Front: ' + this.front + ', ' + 'Back: ' + this.back);
};
basicFC.prototype.printFront = function() {
    console.log(this.front);
}
basicFC.prototype.printAnswer = function() {
    console.log('Wrong! The correct answer is ' + this.back + '.');
}
module.exports = basicFC;