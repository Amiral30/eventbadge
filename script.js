const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const download = document.getElementById("download");

const bg = new Image();
bg.src = "affiche.jpg";

// Position et taille de la zone circulaire
const circle = {
  x: 800, // position X du centre
  y: 190, // position Y du centre
  r: 120  // rayon du cercle
};

let uploadedImg = null;
let imgX = circle.x - circle.r;
let imgY = circle.y - circle.r;
let imgW = circle.r * 2;
let imgH = circle.r * 2;
let dragging = false;
let resizing = false;
let offsetX, offsetY;

// Dessiner la scène complète
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Cercle rouge transparent
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "red";
  ctx.stroke();
  ctx.closePath();

  if (uploadedImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(uploadedImg, imgX, imgY, imgW, imgH);
    ctx.restore();

    // Cadre de redimensionnement
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.strokeRect(imgX, imgY, imgW, imgH);
  }
}

// Image de fond chargée
bg.onload = () => drawCanvas();

// Upload de l'image utilisateur
upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    uploadedImg = new Image();
    uploadedImg.onload = () => drawCanvas();
    uploadedImg.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Mouvements souris/tactile
canvas.addEventListener("mousedown", startDrag);
canvas.addEventListener("touchstart", startDrag, { passive: false });

canvas.addEventListener("mousemove", onDrag);
canvas.addEventListener("touchmove", onDrag, { passive: false });

canvas.addEventListener("mouseup", endDrag);
canvas.addEventListener("touchend", endDrag);

function getPos(e) {
  if (e.touches) {
    return { x: e.touches[0].clientX - canvas.getBoundingClientRect().left, y: e.touches[0].clientY - canvas.getBoundingClientRect().top };
  } else {
    return { x: e.offsetX, y: e.offsetY };
  }
}

function startDrag(e) {
  e.preventDefault();
  const pos = getPos(e);
  if (pos.x > imgX + imgW - 20 && pos.y > imgY + imgH - 20) {
    resizing = true;
  } else if (pos.x > imgX && pos.x < imgX + imgW && pos.y > imgY && pos.y < imgY + imgH) {
    dragging = true;
    offsetX = pos.x - imgX;
    offsetY = pos.y - imgY;
  }
}

function onDrag(e) {
  if (!dragging && !resizing || !uploadedImg) return;

  e.preventDefault();
  const pos = getPos(e);
  if (dragging) {
    imgX = pos.x - offsetX;
    imgY = pos.y - offsetY;
  } else if (resizing) {
    imgW = pos.x - imgX;
    imgH = pos.y - imgY;
  }
  drawCanvas();
}

function endDrag() {
  dragging = false;
  resizing = false;
}

// Télécharger le résultat
download.addEventListener("click", () => {
  const a = document.createElement("a");
  a.download = "badge.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
});
