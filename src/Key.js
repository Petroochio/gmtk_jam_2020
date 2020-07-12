import { lerp } from './Utils';

const SPRITE_SIZE = 64;
const FRAMES = {
  IDLE: { x: 0, y: 0 },
  PRESSED: { x: 128, y: 0 },
  FREE: { x: 64, y: 0 },
};
const SPACE_FRAMES = {
  IDLE: { x: 0, y: 0 },
  PRESSED: { x: 64 * 6, y: 0 },
}
const BOUNDS = {
  LEFT: 3 / 20,
  RIGHT: 16.7 / 20,
  UP: 2.2 / 20,
  DOWN: 13 / 20,
  // For spawning
  CENTER_Y: 7.6 / 20,
  CENTER_X: 10 / 20,
  // SPAW OFFSET RADIUS
  X_R: 4 / 20,
  Y_R: 4 / 20,
}

class Key {
  constructor(keyInfo, spriteSheet, offsetX, offsetY, holder) {
    this.char = keyInfo.char;
    this.code = keyInfo.code;
    this.info = keyInfo;
    this.sprite = spriteSheet;
    this.holder = holder;
    this.isFree = false;
    this.isPressed = false;
    this.isOverHome = false;
    this.homeX = this.info.startX + offsetX;
    this.homeY = this.info.startY + offsetY;
    this.x = this.info.startX + offsetX;
    this.y = this.info.startY + offsetY;
    this.moveX = 0;
    this.moveY = 0;
    // console.log(this.info);
    this.currentFrame = 'IDLE'; // 'IDLE', 'PRESSED', 'FREE'

    this.MAX_BREAK = 9;
    this.breakCount = this.MAX_BREAK;
    this.numBreaks = 0;
    this.isHeld = false; // like by player hand
    this.isFlying = false;
    this.scaleFactor = 1;

    // Change this as time goes on
    this.speed = 0.01;
  }

  update(dt) {
    if (this.isFree) {
      // check bounds
      if (this.x < BOUNDS.LEFT && this.moveX < 0) this.moveX *= -1;
      if (this.x > BOUNDS.RIGHT && this.moveX > 0) this.moveX *= -1;
      if (this.y < BOUNDS.UP && this.moveY < 0) this.moveY *= -1;
      if (this.y > BOUNDS.DOWN && this.moveY > 0) this.moveY *= -1;

      this.x += this.moveX * this.scaleFactor * dt / 1000;
      this.y += this.moveY * this.scaleFactor * dt / 1000;
    }
    
    this.scaleFactor = 1 - lerp(BOUNDS.DOWN, BOUNDS.UP, 0, 0.25, this.y);

    // if (this.isHeld) console.log(this.startX, this.startY, this.x, this.y);
    if (this.isHeld && this.circleCheck(this.homeX, this.homeY, 0.04)) {
      this.isOverHome = true;
    }
    else this.isOverHome = false;
  }

  circleCheck(x, y, r) {
    const dx = x - this.x;
    const dy = y - this.y;
    return ((dx * dx) + (dy * dy)) < (r * r);
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
      let w = size;
      let h = size;

      // when it's free, it can scale
      if (this.isFree && this.y < BOUNDS.DOWN) {
        w *= this.scaleFactor;
        h *= this.scaleFactor;
      }

      ctx.drawImage(
        this.sprite,
        this.info.spriteX + FRAMES[this.currentFrame].x, this.info.spriteY + FRAMES[this.currentFrame].y,
        SPRITE_SIZE, SPRITE_SIZE,
        -w / 2, -h / 2,
        w, h
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

  holdKey() {
    this.isHeld = true;
    this.isPressed = false;
    this.currentFrame = 'IDLE';
  }

  dropKey() {
    // check if over slot
    if (this.isOverHome) {
      this.isFree = false;
      this.isHeld = false;
      this.isOverHome = false;
      this.x = this.homeX;
      this.y = this.homeY;
      this.breakCount = this.MAX_BREAK - this.numBreaks;
      // hard coded max speed
      if (this.speed < 0.30) this.speed += 0.01;
    } else {
      // fit in bounds
      this.isFree = true;
      this.isHeld = false;
      if (this.x < BOUNDS.LEFT) this.x = BOUNDS.LEFT;
      if (this.x > BOUNDS.RIGHT) this.x = BOUNDS.RIGHT;
      if (this.y < BOUNDS.UP) this.y = BOUNDS.UP;
      if (this.y > BOUNDS.DOWN) this.y = BOUNDS.DOWN;
    }
  }

  press() {
    this.isPressed = true;
    this.currentFrame = 'PRESSED';
  }

  lift() {
    this.isPressed = false;
    this.currentFrame = 'IDLE';

    // Again, space is special
    if (!this.info.isSpace) this.breakCount -= 1;

    if (!this.isFree && this.breakCount <= 0) {
      this.isFree = true;
      if (this.numBreaks < this.MAX_BREAK - 1) this.numBreaks += 1;
      // spawn on table for now
      this.x = BOUNDS.CENTER_X + (((Math.random() * 2) - 1) * BOUNDS.X_R);
      this.y = BOUNDS.CENTER_Y + (((Math.random() * 2) - 1) * BOUNDS.Y_R);

      const angle = Math.random() * 2 * Math.PI;
      this.moveX = Math.cos(angle) * this.speed;
      this.moveY = Math.sin(angle) * this.speed;
    }
  }
}

export default Key;
