const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const downloadBtn = document.getElementById('download-btn');
const userPhoto = document.getElementById('user-photo');

let imageReady = false;

// Bouton "Choisir une photo"
uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

// Quand une photo est sélectionnée
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    userPhoto.src = imgURL;

    userPhoto.onload = () => {
        imageReady = true;
        downloadBtn.disabled = false;
    };
});

// Bouton "Télécharger le badge"
downloadBtn.addEventListener('click', async () => {
    if (!imageReady) {
        alert("Veuillez d'abord choisir une photo.");
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Dimensions du badge
    canvas.width = 1200;
    canvas.height = 1800;

    // Position du cercle
    const circle = {
        x: canvas.width / 2,
        y: canvas.height * 0.26,
        radius: 191
    };

    // Charger l'image du badge
    const badgeImg = new Image();
    badgeImg.src = 'assets/badge.png';

    await new Promise(resolve => badgeImg.onload = resolve);

    // Dessiner le badge en arrière-plan
    ctx.drawImage(badgeImg, 0, 0, canvas.width, canvas.height);

    // Masquer en cercle
    ctx.save();
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.clip();

    // Dessiner la photo de l'utilisateur
    ctx.drawImage(
        userPhoto,
        circle.x - circle.radius,
        circle.y - circle.radius,
        circle.radius * 2,
        circle.radius * 2
    );

    ctx.restore();

    // Générer et déclencher le téléchargement
    const link = document.createElement('a');
    link.download = 'badge_technofoire.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
