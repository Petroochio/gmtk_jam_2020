const SPRITE_SIZE = 64;
const FRAMES = {
  'IDLE': { x: 0, y: 0 },
  'PRESSED': { x: 128, y: 0 },
  'FREE': { x: 64, y: 0 },
};
const SPACE_FRAMES = {
  'IDLE': { x: 0, y: 0 },
  'PRESSED': { x: 64 * 6, y: 0 },
}

class Key {
  constructor(keyInfo, spriteSheet, holder) {
    this.char = keyInfo.char;
    this.code = keyInfo.code;
    this.info = keyInfo;
    this.sprite = spriteSheet;
    this.holder = holder;
    this.isFree = false;
    this.isPressed = false;
    this.x = this.info.startX;
    this.y = this.info.startY;
    // console.log(this.info);
    this.currentFrame = 'IDLE'; // 'IDLE', 'PRESSED', 'FREE'
  }

  draw(ctx, canvasSize) {
    ctx.save();

    ctx.translate(canvasSize * this.x, canvasSize * this.y);
    if (this.isPressed && !this.isFree) ctx.translate(0, canvasSize * 0.005);
    ctx.rotate(0);

    const size = canvasSize / 20;
    // space is 6 times the width of regular keys
    const spaceW = size * 6;
    if (!this.info.isSpace) {
      ctx.drawImage(
        this.sprite,
        this.info.spriteX + FRAMES[this.currentFrame].x, this.info.spriteY + FRAMES[this.currentFrame].y,
        SPRITE_SIZE, SPRITE_SIZE,
        -size / 2, -size / 2,
        size, size
      );
    } else {
      ctx.drawImage(
        this.sprite,
        this.info.spriteX + SPACE_FRAMES[this.currentFrame].x, this.info.spriteY + SPACE_FRAMES[this.currentFrame].y,
        SPRITE_SIZE * 6, SPRITE_SIZE,
        -spaceW / 2, -size / 2,
        spaceW, size
      );
    }

    ctx.restore();
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
