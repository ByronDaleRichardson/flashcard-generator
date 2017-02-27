// The constructor for the cloze flashcard.
var clozeFC = function(text, cloze) {
    this.text = text;
    this.cloze = this.text.match(/\(([^)]+)\)/)[1];
    this.printCloze = function() {
        console.log(this.cloze);
    }
    this.printText = function() {
        console.log(this.text);
    }
    this.message = this.text.replace('(' + this.cloze + ')', '________');
}
clozeFC.prototype.printAnswer = function() {
    console.log('Sorry, wrong. This is the correct sentence: \n' + this.text.replace(/[{()}]/g, ''));
}

module.exports = clozeFC;