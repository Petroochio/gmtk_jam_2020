import MANIFESTO from './Mainifesto';

class TextManager {
  constructor() {
    this.text = MANIFESTO;

    this.currentLine = 0;
    this.currentLetter = 0;
    this.txtY = 300 / 780;
    this.currentLetter = 0;
    this.LEFT_END = 150 / 780;
    this.TEXT_SIZE = 20 / 780;
    this.FADE_WINDOW = 300 / 780;
    this.LINE_INCREMENT = 30 / 780;
    this.TEXT_WIDTH = 12 / 780;
    this.CUT_OFF = 340 / 780;
    
    
    this.leftX = this.LEFT_END;
    this.highlightX = this.LEFT_END;
    this.highlightY = -this.TEXT_SIZE;
  }

  draw(ctx, canvasSize) {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.highlightX * canvasSize, (this.txtY + this.highlightY) * canvasSize, this.TEXT_WIDTH * canvasSize, this.TEXT_SIZE * canvasSize);
    ctx.font = `${this.TEXT_SIZE * canvasSize}px monospace`;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvasSize, this.CUT_OFF * canvasSize);
    ctx.clip();
    for(let i = 0; i < this.text.length; i++){
      var lineY = this.txtY + this.LINE_INCREMENT * i;
      var col = "rgba(0,0,0,"+ ( lineY / this.FADE_WINDOW)+")";
      ctx.fillStyle = col;
      ctx.fillText(this.text[i], this.leftX * canvasSize, lineY * canvasSize);
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
      this.highlightX += this.TEXT_WIDTH;
    }
    
    if(this.currentLetter == this.text[this.currentLine].length){
      this.txtY -= this.LINE_INCREMENT;
      this.currentLine++;
      this.currentLetter = 0;
      this.highlightX = this.leftX;
      this.highlightY += this.LINE_INCREMENT;
    }
  }
}

export default TextManager;   