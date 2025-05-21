const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const bg = new Image();
bg.src = "affiche.jpg";

bg.onload = () => drawCanvas();

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Cercle d'indication
  ctx.beginPath();
  ctx.arc(585, 215, 125, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(200,200,200,0.2)";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "white";
  ctx.stroke();
}

// Gestion image importée
document.getElementById("upload").addEventListener("change", function (e) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = document.getElementById("uploaded-photo");
    img.src = event.target.result;
    img.onload = () => {
      document.getElementById("photo-container").style.display = "block";
    };
  };
  reader.readAsDataURL(e.target.files[0]);
});

// Rendre déplaçable et redimensionnable
interact("#photo-container")
  .draggable({
    listeners: {
      move(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

        target.style.transform = translate(${x}px, ${y}px);
        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
      }
    }
  })
  .resizable({
    edges: { left: false, right: true, bottom: true, top: false },
    modifiers: [
      interact.modifiers.aspectRatio({ ratio: 1 }),
      interact.modifiers.restrictSize({ max: 300, min: 100 })
    ],
    listeners: {
      move(event) {
        let { width, height } = event.rect;
        const target = event.target;
        target.style.width = ${width}px;
        target.style.height = ${height}px;

        const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.deltaRect.left;
        const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.deltaRect.top;

        target.style.transform = translate(${x}px, ${y}px);
        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
      }
    }
  });

// Générer et télécharger badge
document.getElementById("download").addEventListener("click", () => {
  drawCanvas();

  const photoContainer = document.getElementById("photo-container");
  const img = document.getElementById("uploaded-photo");

  const containerRect = photoContainer.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const x = containerRect.left - canvasRect.left;
  const y = containerRect.top - canvasRect.top;
  const width = containerRect.width;
  const height = containerRect.height;

  ctx.save();
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, x, y, width, height);
  ctx.restore();

  const link = document.createElement("a");
  link.download = "badge.png";
  link.href = canvas.toDataURL();
  link.click();
});
