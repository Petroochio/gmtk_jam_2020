// Constants
import ASSET_SOURCES from './AssetSources';
import KEY_MAP from './KeyMap';

import Key from './Key';
import TextManager from './TextManager';

let assets = {};
let canvas, ctx, width, height;
let prevTime, currentTime, dt;
prevTime = Date.now();

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

function drawKeyboard() {
  keys.forEach(k => k.draw(ctx, width));
}

function keySort(k1, k2) {
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

function update() {
  currentTime = Date.now();
  dt = currentTime - prevTime;
  prevTime = currentTime;

  keys.forEach(k => k.update(dt));
  keys.sort(keySort);

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
  const key = keys.find(k => (k.code === code && !k.isFree));
  if (key) key.press();
}

function liftKey(code) {
  const key = keys.find(k => (k.code === code && !k.isFree));
  if (key) {
    key.lift();
    textMan.sendKey(key);
  }
}

document.addEventListener('keydown', (e) => {
  console.log(e);
  pressKey(e.keyCode);
});

document.addEventListener('keyup', (e) => {
  // console.log(e);
  liftKey(e.keyCode);
});


window.onload = () => {
  canvas = document.getElementById('game');
  ctx = canvas.getContext('2d');

  canvas.width = window.innerHeight * 0.8;
  canvas.height = window.innerHeight * 0.8;
  width = canvas.width;
  height = canvas.height;

  loadAssets(() => {
    // init keys
    console.log(KEY_MAP);
    // So I don't have to manually tweak values
    const offsetX = 0.03;
    const offsetY = 0.09;
    keys = KEY_MAP.map((k) => new Key(k, assets.keySprites, offsetX, offsetY));
    requestAnimationFrame(update);
  });
}

window.onresize = () => {
  canvas.width = window.innerHeight * 0.8;
  canvas.height = window.innerHeight * 0.8;
  width = canvas.width;
  height = canvas.height;
}