// Constants
import ASSET_SOURCES from './AssetSources';
import KEY_MAP from './KeyMap';

import Key from './Key';
import TextManager from './TextManager';

let assets = {};
let canvas, ctx, width, height;
let mouseX = 0;
let mouseY = 0;
let mouseHeldKey, mouseDown, mouseIsHolding;
let prevTime, currentTime, dt;
let mouseDist = 0.06;
prevTime = Date.now();

const keyOffsetX = 0.03;
const keyOffsetY = 0.09;

let textMan = new TextManager();
// Init keys
let keys;

function loadAssets(loadFunc) {
  let assetsLeft = ASSET_SOURCES.length;

  ASSET_SOURCES.forEach((a) => {
    assets[a.name] = new Image();
    assets[a.name].src = a.src;

    // When all assets have loaded move on
    assets[a.name].onload = () => {
      assetsLeft -= 1;
      if (assetsLeft <= 0) loadFunc();
    }
  });
}

const SPRITE_SIZE = 64;
function drawKeySlot(k, isOver, isPressed, isFalsePress) {
  if (k.isSpace) return; // space bar can never be free hahahaha

  ctx.save();

  const size = width / 20;
  let w = size;
  let h = size;

  ctx.translate(width * (k.startX + keyOffsetX), width * (k.startY + keyOffsetY + 0.001));
  if (isPressed || isFalsePress) ctx.translate(0, size * 0.12);

  const spriteSlot = 25; // isOver || isFalsePress ? 26 : 25;
  ctx.drawImage(
    assets.keySprites,
    SPRITE_SIZE * spriteSlot, SPRITE_SIZE * 5,
    SPRITE_SIZE, SPRITE_SIZE,
    -w / 2, -h / 2,
    w, h
  );

  ctx.restore();
}

function drawKeyboard() {
  keys.forEach(k => {
    drawKeySlot(k.info, k.isOverHome, k.isPressed, k.isFailedPress);
    if (!k.isFree && !k.isHeld) k.draw(ctx, width);
  });

  // free keys
  freeKeys.forEach(k => k.draw(ctx, width));
  textMan.draw(ctx, width);

  if (mouseIsHolding) mouseHeldKey.draw(ctx, width);
}

function keySort(k1, k2) {
  // Move a held key to the top
  if (k1.isHeld) return -1;
  if (k2.isHeld) return 1;
  return k1.y - k2.y;
}

function drawTable() {
  ctx.save();

  ctx.translate(width / 2, height * 4 / 10);
  // ctx.rotate(0);

  const w = width * 4 / 5;
  const h = width * 3 / 5;
  ctx.drawImage(
    assets.table,
    0, 0,
    2477, 1731,
    -w / 2, -h / 2,
    w, h
  );
  ctx.restore();
  // debug lines
  // ctx.strokeStyle = '#ffffff';
  // ctx.lineWidth = 3;
  // ctx.beginPath();
  // ctx.moveTo(width * 3 / 20, 0);
  // ctx.lineTo(width * 3 / 20, height);
  // ctx.stroke();

  // ctx.beginPath();
  // ctx.moveTo(width * 16.7 / 20, 0);
  // ctx.lineTo(width * 16.7 / 20, height);
  // ctx.stroke();

  // ctx.beginPath();
  // ctx.moveTo(0, height * 2.2 / 20);
  // ctx.lineTo(width, height * 2.2 / 20);
  // ctx.stroke();

  // ctx.beginPath();
  // ctx.moveTo(0, height * 13 / 20);
  // ctx.lineTo(width, height * 13 / 20);
  // ctx.stroke();
}

let freeKeys = [];
function update() {
  currentTime = Date.now();
  dt = currentTime - prevTime;
  prevTime = currentTime;

  textMan.update(dt);
  freeKeys = keys.filter(k => k.isFree);
  keys.forEach(k => {
    k.update(dt);
    let keyThisFrame = false;
    if (k.isFree && !mouseIsHolding && k.circleCheck(mouseX, mouseY, mouseDist)) {
      k.currentFrame = 'PRESSED';
    } else {
      k.currentFrame = 'IDLE';
    }
  });

  freeKeys.sort(keySort);

  // the held key
  if (mouseIsHolding) {
    if (mouseHeldKey.isOverHome) {
      mouseHeldKey.dropKey();
      mouseIsHolding = false;
      mouseDown = false;
    } else {
      mouseHeldKey.x = mouseX;
      mouseHeldKey.y = mouseY;
    }
  }

  ctx.fillStyle = '#5F5557';
  ctx.fillRect(-1,-1, canvas.width + 10, canvas.height + 10);
  ctx.save();
  // ctx.translate(0.5, 0.5);
  // ctx.strokeStyle = '#503a23';
  drawTable();
  drawKeyboard();
  // drawKeys
  ctx.restore();

  requestAnimationFrame(update);
}

function pressKey(code) {
  const key = keys.find(k => (k.code === code));
  if (key && !key.isFree && !key.isFlying && !key.isHeld) {
    key.press();
  }
  else if (key) key.falsePress();
}

function liftKey(e) {
  const code = e.keyCode;
  const key = keys.find(k => (k.code === code));

  if (key && !key.isFree && !key.isFlying && !key.isHeld) {
    key.lift();
  }
  else if (key) key.falseLift();
}

document.addEventListener('keydown', (e) => {
  // console.log(e);
  pressKey(e.keyCode);
});

document.addEventListener('keypress', (e) => {
  var keynum = e.which;
  var c = String.fromCharCode(keynum).toLowerCase();
  if (c === ':') c = ';';
  const key = keys.find(k => (k.char === c && !k.isFree && !k.isHeld));
  if (key) textMan.sendKey(e);
});

document.addEventListener('keyup', (e) => {
  // console.log(e);
  liftKey(e);
});

window.onload = () => {
  canvas = document.getElementById('game');
  ctx = canvas.getContext('2d');

  canvas.width = window.innerHeight * 0.8;
  canvas.height = window.innerHeight * 0.8;
  width = canvas.width;
  height = canvas.height;

  canvas.addEventListener('mousemove', (e) => {
    const x = e.offsetX / width;
    const y = e.offsetY / height;
    mouseX = x;
    mouseY = y;
  });
  
  canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
    keys.forEach(k => {
      k.update(dt);
      let keyThisClick = false;
      if (!keyThisClick && k.isFree && !mouseIsHolding && k.circleCheck(mouseX, mouseY, mouseDist)) {
        // k.currentFrame = 'PRESSED';
        // mouseOverKey = k;
        k.holdKey();
        mouseIsHolding = true;
        mouseHeldKey = k;
      } else {
        // k.currentFrame = 'IDLE';
      }
    });
  });

  canvas.addEventListener('mouseup', (e) => {
    // if (mouseIsHolding) mouseHeldKey.dropKey();
    mouseIsHolding = false;
    mouseDown = false;
  });

  canvas.addEventListener('mouseleave', (e) => {
    if (mouseIsHolding) mouseHeldKey.dropKey();
    mouseIsHolding = false;
    mouseDown = false;
  });


  loadAssets(() => {
    // init keys
    // console.log(KEY_MAP);
    // So I don't have to manually tweak position values
    keys = KEY_MAP.map((k) => new Key(k, assets.keySprites, keyOffsetX, keyOffsetY));
    requestAnimationFrame(update);
  });
}

window.onresize = () => {
  canvas.width = window.innerHeight * 0.8;
  canvas.height = window.innerHeight * 0.8;
  width = canvas.width;
  height = canvas.height;
}