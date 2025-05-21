const canvas = document.getElementById('badgeCanvas');
const ctx = canvas.getContext('2d');
const uploadInput = document.getElementById('upload');
const resetBtn = document.getElementById('reset');
const downloadBtn = document.getElementById('download');

const bg = new Image();
bg.src = 'techno-affiche.png'; // Mets ici le nom exact de ton image de fond

let userImg = null;
let userImgX = 700, userImgY = 200, userImgR = 160;
let scale = 1;
let dragging = false;
let offsetX = 0, offsetY = 0;

uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    userImg = new Image();
    userImg.onload = drawCanvas;
    userImg.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left);
  const y = (e.clientY - rect.top);
  if (isInsideCircle(x, y)) {
    dragging = true;
    offsetX = x - userImgX;
    offsetY = y - userImgY;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (dragging && userImg) {
    const rect = canvas.getBoundingClientRect();
    userImgX = (e.clientX - rect.left) - offsetX;
    userImgY = (e.clientY - rect.top) - offsetY;
    drawCanvas();
  }
});

canvas.addEventListener('mouseup', () => dragging = false);
canvas.addEventListener('wheel', (e) => {
  if (userImg) {
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(0.3, scale), 3);
    drawCanvas();
  }
});

resetBtn.addEventListener('click', () => {
  userImg = null;
  scale = 1;
  drawCanvas();
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'badge.png';
  link.href = canvas.toDataURL();
  link.click();
});

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Cercle de placement
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(830, 350, userImgR, 0, Math.PI * 2);
  ctx.stroke();

  if (userImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(830, 350, userImgR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(
      userImg,
      userImgX,
      userImgY,
      userImg.width * scale,
      userImg.height * scale
    );

    ctx.restore();
  }
}

function isInsideCircle(x, y) {
  const dx = x - 830;
  const dy = y - 350;
  return Math.sqrt(dx * dx + dy * dy) < userImgR;
}

bg.onload = drawCanvas;
