import MANIFESTO from './Mainifesto';

class TextManager {
  constructor() {
    this.text = MANIFESTO;

    this.currentLine = 0;
    this.currentLetter = 0;
    this.txtY = 330 / 780;
    this.currentLetter = 0;
    this.LEFT_END = 150 / 780;
    this.TEXT_SIZE = 20 / 780;
    this.FADE_WINDOW = 300 / 780;
    this.LINE_INCREMENT = 30 / 780;
    this.TEXT_WIDTH = 12 / 780;
    this.CUT_OFF = 340 / 780;
    this.blinkTime = 0.7;
    this.blinkOn = true;
    
    this.lineTime = 0;
    this.lineTimeMax = 70; // 40, how many lines total are there?
    this.MIN_LINE_TIME_MAX = 15;
    this.lineBlinkTime = 0.7;
    this.lineBlinkOn = true;

    this.leftX = this.LEFT_END;
    this.highlightX = this.LEFT_END;
    this.highlightY = -this.TEXT_SIZE;
  }

  isEnd() {
    return this.lineTime > this.lineTimeMax || (this.currentLine >= this.text.length - 1);
  }

  update(deltaTime) {
    const dt = deltaTime / 1000;

    this.blinkTime -= dt;
    if (this.blinkTime < 0) {
      this.blinkOn = !this.blinkOn;
      this.blinkTime = this.blinkOn ? 0.8 : 0.2; 
    }

    this.lineTime += dt;
    this.lineBlinkTime -= dt;
    if (this.lineBlinkTime < 0) {
      this.lineBlinkOn = !this.lineBlinkOn;
      this.lineBlinkTime = this.lineBlinkOn ? 0.4 + (0.8 * (1 - this.lineTime / this.lineTimeMax)) : 0.1 + (0.3 * (1 - this.lineTime / this.lineTimeMax)); 
    }
  }

  draw(ctx, canvasSize) {
    ctx.save();
    const left = this.leftX - 0.5;
    ctx.translate(0.5 * canvasSize, (this.CUT_OFF + 0.01) * canvasSize);
    ctx.fillStyle = this.lineBlinkOn ? '#000000' : '#aaaaaa';
    // console.log(left);
    const lw = 0.6 * canvasSize * ((0.8 * (1 - this.lineTime / this.lineTimeMax)));
    ctx.fillRect(left * canvasSize, 0, lw, 0.002 * canvasSize);
    ctx.restore();

    ctx.fillStyle = 'rgba(255, 157, 66, 0.5)';
    if (this.blinkOn) ctx.fillRect(this.highlightX * canvasSize, (this.txtY + this.highlightY) * canvasSize, this.TEXT_WIDTH * canvasSize, this.TEXT_SIZE * canvasSize);
    ctx.font = `${this.TEXT_SIZE * canvasSize}px IBM Plex Mono`;
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

    ctx.fillStyle = 'rgba(238, 236, 218, .7)';
    ctx.fillRect(this.highlightX*canvasSize+this.TEXT_SIZE, (this.txtY + this.highlightY) * canvasSize, 650 / 780 * canvasSize - this.highlightX*canvasSize, this.TEXT_SIZE * canvasSize+6.5 / 780 * canvasSize);
    ctx.restore();
    // ctx.restore();

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
    // if (keynum === 189) key = '-';

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

      this.lineTimeMax -= 0.5;
      if (this.lineTimeMax < this.MIN_LINE_TIME_MAX) this.lineTimeMax = this.MIN_LINE_TIME_MAX;
      this.lineTime = 0;
    }
  }
}

export default TextManager;   
