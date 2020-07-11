// Constants
import ASSET_SOURCES from './AssetSources';
import KEY_MAP from './KeyMap';

import Key from './Key';

let assets = {};
let canvas, ctx, width, height;
let prevTime, currentTime, dt;
prevTime = Date.now();

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

function update() {
  currentTime = Date.now();
  dt = currentTime - prevTime;
  prevTime = currentTime;

  ctx.fillStyle = '#efc37d';
  ctx.fillRect(-1,-1, canvas.width, canvas.height);
  ctx.save();
  // ctx.translate(0.5, 0.5);
  ctx.strokeStyle = '#503a23';
  drawKeyboard();
  // drawKeys
  ctx.restore();

  requestAnimationFrame(update);
}

function pressKey(code) {
  const key = keys.find(k => k.code === code);
  if (key) key.press();
}

function liftKey(code) {
  const key = keys.find(k => k.code === code);
  if (key) key.lift();
}

document.addEventListener('keydown', (e) => {
  // console.log(e);
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

  console.log('ye');
  loadAssets(() => {
    // init keys
    keys = KEY_MAP.map((k) => new Key(k, assets.keySprites));
    requestAnimationFrame(update);
  });
}

window.onresize = () => {
  canvas.width = window.innerHeight * 0.8;
  canvas.height = window.innerHeight * 0.8;
  width = canvas.width;
  height = canvas.height;
}