const canvas = document.getElementById("badgeCanvas");
const ctx = canvas.getContext("2d");

const bg = new Image();
bg.src = "affiche.jpg";

const photo = {
  img: null,
  x: 815, // Position du centre du cercle
  y: 275,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  dragging: false,
  lastX: 0,
  lastY: 0,
};

const radius = 140;

bg.onload = () => draw();

document.getElementById("upload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const img = new Image();
    img.onload = () => {
      photo.img = img;
      photo.scale = 1;
      photo.offsetX = 0;
      photo.offsetY = 0;
      draw();
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  if (photo.img) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(photo.x, photo.y, radius, 0, Math.PI * 2);
    ctx.clip();

    const size = radius * 2 * photo.scale;
    ctx.drawImage(
      photo.img,
      photo.x - radius + photo.offsetX,
      photo.y - radius + photo.offsetY,
      size,
      size
    );
    ctx.restore();

    // Contour
    ctx.beginPath();
    ctx.arc(photo.x, photo.y, radius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.stroke();
  }
}

canvas.addEventListener("mousedown", (e) => {
  photo.dragging = true;
  photo.lastX = e.offsetX;
  photo.lastY = e.offsetY;
});

canvas.addEventListener("mouseup", () => {
  photo.dragging = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (photo.dragging && photo.img) {
    const dx = e.offsetX - photo.lastX;
    const dy = e.offsetY - photo.lastY;
    photo.offsetX += dx;
    photo.offsetY += dy;
    photo.lastX = e.offsetX;
    photo.lastY = e.offsetY;
    draw();
  }
});

canvas.addEventListener("wheel", (e) => {
  if (photo.img) {
    e.preventDefault();
    photo.scale += e.deltaY * -0.001;
    photo.scale = Math.min(Math.max(0.5, photo.scale), 3); // Limites du zoom
    draw();
  }
});

document.getElementById("download").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "badge.png";
  link.href = canvas.toDataURL();
  link.click();
});
