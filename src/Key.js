const SPRITE_SIZE = 64;
const FRAMES = {
  'IDLE': { x: 0, y: 0 },
  'PRESSED': { x: 128, y: 0 },
  'FREE': { x: 64, y: 0 },
};

class Key {
  constructor(keyInfo, spriteSheet, holder) {
    this.char = keyInfo.char;
    this.code = keyInfo.code;
    this.info = keyInfo;
    this.sprite = spriteSheet;
    this.holder = holder;
    this.isFree = false;
    this.isPressed = false;
    this.x = 0.5;
    this.y = 0.5;
    this.currentFrame = 'IDLE'; // 'IDLE', 'PRESSED', 'FREE'
  }

  draw(ctx, canvasSize) {
    ctx.translate(canvasSize * this.x, canvasSize * this.y);
    if (this.isPressed && !this.isFree) ctx.translate(0, canvasSize * 0.02); 
    ctx.rotate(0);

    const size = canvasSize / 20;
    ctx.drawImage(
      this.sprite,
      this.info.spriteX + FRAMES[this.currentFrame].x, this.info.spriteY + FRAMES[this.currentFrame].y,
      SPRITE_SIZE, SPRITE_SIZE,
      -size / 2, -size / 2,
      size, size
    );
  }

  press() {
    this.isPressed = true;
    this.currentFrame = 'PRESSED';
  }

  lift() {
    this.isPressed = false;
    this.currentFrame = 'IDLE';
  }
}

export default Key;
