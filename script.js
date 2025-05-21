document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const downloadBtn = document.getElementById('download-btn');
    const photoZone = document.getElementById('photo-zone');
    const userPhoto = document.getElementById('user-photo');
    const badgeTemplate = document.getElementById('badge-template');

    // CONFIGURATION (à ajuster selon ton image)
    const config = {
        // Position relative sur l'affiche (%)
        position: { x: 50, y: 60 },
        
        // Taille relative (% de la largeur/hauteur du badge)
        size: { width: 35, height: 25 },
        
        // Forme : 'circle', 'ellipse', 'rectangle', 'polygon'
        shape: 'ellipse',
        
        // Paramètres spécifiques à la forme
        shapeParams: {
            ellipse: { rx: 40, ry: 50 } // % pour clip-path
        }
    };

    // Gestion upload
    uploadBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            userPhoto.src = event.target.result;
            photoZone.style.border = 'none';
            downloadBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    });

    // Téléchargement
    downloadBtn.addEventListener('click', function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Dimensions
        canvas.width = badgeTemplate.naturalWidth;
        canvas.height = badgeTemplate.naturalHeight;
        
        // Dessin du badge
        ctx.drawImage(badgeTemplate, 0, 0, canvas.width, canvas.height);
        
        // Calcul position photo
        const photoWidth = canvas.width * config.size.width / 100;
        const photoHeight = canvas.height * config.size.height / 100;
        const posX = canvas.width * config.position.x / 100 - photoWidth / 2;
        const posY = canvas.height * config.position.y / 100 - photoHeight / 2;
        
        // Masque selon la forme
        ctx.save();
        ctx.beginPath();
        
        if (config.shape === 'ellipse') {
            ctx.ellipse(
                posX + photoWidth / 2,
                posY + photoHeight / 2,
                photoWidth * config.shapeParams.ellipse.rx / 100,
                photoHeight * config.shapeParams.ellipse.ry / 100,
                0, 0, Math.PI * 2
            );
        }
        // (autres formes peuvent être ajoutées ici)
        
        ctx.closePath();
        ctx.clip();
        
        // Dessin de la photo
        if (userPhoto.src) {
            ctx.drawImage(userPhoto, posX, posY, photoWidth, photoHeight);
        }
        
        ctx.restore();
        
        // Téléchargement
        const link = document.createElement('a');
        link.download = 'badge-technofoire.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});
