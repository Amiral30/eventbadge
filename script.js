const canvas = document.getElementById("badgeCanvas");
const ctx = canvas.getContext("2d");

const bg = new Image();
bg.src = "affiche.jpg"; // Assure-toi que le nom est EXACT

bg.onload = () => {
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
};

bg.onerror = () => {
  alert("Erreur : l'image de fond n'a pas pu être chargée.");
};

document.getElementById("upload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const userImg = new Image();
    userImg.src = evt.target.result;

    userImg.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      // Coordonnées et taille du cercle (ajuste-les selon ton design)
      const circleX = 815; // X du centre
      const circleY = 275; // Y du centre
      const radius = 140;

      ctx.save();
      ctx.beginPath();
      ctx.arc(circleX, circleY, radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(userImg, circleX - radius, circleY - radius, radius * 2, radius * 2);

      ctx.restore();

      // Contour
      ctx.beginPath();
      ctx.arc(circleX, circleY, radius + 2, 0, Math.PI * 2);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 5;
      ctx.stroke();
    };
  };
  reader.readAsDataURL(file);
});

document.getElementById("download").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "mon_badge.png";
  link.href = canvas.toDataURL();
  link.click();
});
