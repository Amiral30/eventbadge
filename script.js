const canvas = document.getElementById("badgeCanvas");
const ctx = canvas.getContext("2d");

const fileInput = document.getElementById("fileInput");
const downloadBtn = document.getElementById("downloadBtn");

const background = new Image();
background.src = "affiche.jpg";

const circle = {
  x: 614,
  y: 500,
  r: 250
};

let uploadedImg = null;
let imgX = 0, imgY = 0, imgW = 0, imgH = 0;
let dragging = false, resizing = false;
let offsetX = 0, offsetY = 0;
let imgNaturalWidth = 0, imgNaturalHeight = 0;

background.onload = drawCanvas;

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
  ctx.clip();

  if (uploadedImg) {
    ctx.drawImage(uploadedImg, imgX, imgY, imgW, imgH);
  }
  ctx.restore();

  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
  ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
  ctx.fill();
}

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    uploadedImg = new Image();
    uploadedImg.onload = () => {
      imgNaturalWidth = uploadedImg.naturalWidth;
      imgNaturalHeight = uploadedImg.naturalHeight;
      const ratio = imgNaturalWidth / imgNaturalHeight;
      imgW = circle.r * 2;
      imgH = imgW / ratio;
      imgX = circle.x - imgW / 2;
      imgY = circle.y - imgH / 2;
      drawCanvas();
    };
    uploadedImg.src = reader.result;
  };
  reader.readAsDataURL(file);
});

canvas.addEventListener("mousedown", startDrag);
canvas.addEventListener("mousemove", onDrag);
canvas.addEventListener("mouseup", endDrag);
canvas.addEventListener("touchstart", startDrag, { passive: false });
canvas.addEventListener("touchmove", onDrag, { passive: false });
canvas.addEventListener("touchend", endDrag);

function getPos(e) {
  if (e.touches) {
    return {
      x: e.touches[0].clientX - canvas.getBoundingClientRect().left,
      y: e.touches[0].clientY - canvas.getBoundingClientRect().top
    };
  } else {
    return {
      x: e.offsetX,
      y: e.offsetY
    };
  }
}

function startDrag(e) {
  e.preventDefault();
  const pos = getPos(e);
  if (
    pos.x >= imgX && pos.x <= imgX + imgW &&
    pos.y >= imgY && pos.y <= imgY + imgH
  ) {
    dragging = true;
    offsetX = pos.x - imgX;
    offsetY = pos.y - imgY;
  }
}

function onDrag(e) {
  if (!dragging) return;
  e.preventDefault();
  const pos = getPos(e);
  imgX = pos.x - offsetX;
  imgY = pos.y - offsetY;
  drawCanvas();
}

function endDrag() {
  dragging = false;
}

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "badge.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
