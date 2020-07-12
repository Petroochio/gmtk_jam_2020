import MANIFESTO from './Mainifesto';

class TextManager {
  constructor() {
    this.text = MANIFESTO;

    this.currentLine = 0;
    this.currentLetter = 0;
    this.txtY = 210;
    this.currentLetter = 0;
    this.leftX = 50;
    this.highlightX = 50;
    this.highlightY = -20;
  }

  draw(ctx, canvasSize) {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.highlightX, this.txtY+this.highlightY, 11, 20);
    ctx.font = "20px monospace";
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvasSize, 250);
    ctx.clip();
    for(let i = 0; i < this.text.length; i++){
      var lineY = this.txtY+30*i;
      var col = "rgba(0,0,0,"+(lineY/300)+")";
      ctx.fillStyle = col;
      ctx.fillText(this.text[i], this.leftX, lineY);
    }
    ctx.restore();
    // ctx.fillStyle = 'white';
    // ctx.fillRect(0, 250, width, 200);
    // ctx.fillStyle = 'rgba(255,255,255,.6)';
    // ctx.fillRect(0, 220, width, 50);
    // ctx.fillRect(highlightX, txtY+highlightY, 600, 25);
  }

  sendKey(e) {
    var keynum = e.which;
    var key = String.fromCharCode(keynum).toLowerCase();

    // HERE BE EDGE CASES
    if (keynum === 189) key = '-';

    var letter = this.text[this.currentLine][this.currentLetter].toLowerCase();
    if(key == letter){
      this.currentLetter++;
      this.highlightX+=12;
    }
    
    if(this.currentLetter == this.text[this.currentLine].length){
      this.txtY -= 30;
      this.currentLine++;
      this.currentLetter = 0;
      this.highlightX = this.leftX;
      this.highlightY += 30;
    }
  }
}

export default TextManager;   
