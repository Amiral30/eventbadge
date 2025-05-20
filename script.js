document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const fileInput = document.getElementById('file-input');
    const photoZone = document.getElementById('photo-zone');
    const userPhoto = document.getElementById('user-photo');
    const placeholder = document.querySelector('.placeholder');
    const downloadBtn = document.getElementById('download-btn');
    const badgeTemplate = document.getElementById('badge-template');

    // ======= CONFIGURATION =======
    const config = {
        // TAILLE (doit correspondre au CSS)
        photoSizeRatio: 0.7, // ← Même valeur que --photo-size (0.3 = 30%)
        
        // POSITION (doit correspondre au CSS)
        photoPosition: {
            x: 50,  // Ne pas changer (centrage horizontal)
            y: 50   // ← Même valeur que --photo-position-y
        }
    };

    // ======= GESTION UPLOAD =======
    photoZone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            userPhoto.src = event.target.result;
            userPhoto.style.display = 'block';
            placeholder.style.display = 'none';
            downloadBtn.disabled = false;
            
            // Ajustement automatique
            userPhoto.onload = function() {
                const imgRatio = userPhoto.naturalWidth / userPhoto.naturalHeight;
                if (imgRatio > 1) {
                    userPhoto.style.width = '100%';
                    userPhoto.style.height = 'auto';
                } else {
                    userPhoto.style.width = 'auto';
                    userPhoto.style.height = '100%';
                }
            };
        };
        reader.readAsDataURL(file);
    });

    // ======= TÉLÉCHARGEMENT =======
    downloadBtn.addEventListener('click', function() {
        if (!userPhoto.src) return;
        
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Génération...';
        
        setTimeout(() => { // Petit délai pour le feedback
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Dimensions (conserve le ratio original)
            const imgRatio = badgeTemplate.naturalHeight / badgeTemplate.naturalWidth;
            canvas.width = 1200; // Haute résolution
            canvas.height = Math.round(1200 * imgRatio);
            
            // Dessin du badge
            ctx.drawImage(badgeTemplate, 0, 0, canvas.width, canvas.height);
            
            // Calcul position photo
            const photoSizePx = canvas.width * config.photoSizeRatio;
            const posX = (canvas.width * config.photoPosition.x / 100) - (photoSizePx / 2);
            const posY = (canvas.height * config.photoPosition.y / 100) - (photoSizePx / 2);
            
            // Masque circulaire
            ctx.save();
            ctx.beginPath();
            ctx.arc(
                posX + photoSizePx / 2,
                posY + photoSizePx / 2,
                photoSizePx / 2,
                0,
                Math.PI * 2
            );
            ctx.closePath();
            ctx.clip();
            
            // Dessin photo
            ctx.drawImage(
                userPhoto,
                posX,
                posY,
                photoSizePx,
                photoSizePx
            );
            ctx.restore();
            
            // Téléchargement
            const link = document.createElement('a');
            link.download = `badge-technofoire-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
            
            downloadBtn.disabled = false;
            downloadBtn.textContent = '⬇️ Télécharger';
        }, 500);
    });

    // Debug : affiche les dimensions si besoin
    badgeTemplate.onload = function() {
        console.log('Dimensions du badge:', 
            badgeTemplate.naturalWidth, 'x', 
            badgeTemplate.naturalHeight);
    };
});
