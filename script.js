document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const fileInput = document.getElementById('file-input');
    const photoZone = document.getElementById('photo-zone');
    const userPhoto = document.getElementById('user-photo');
    const placeholder = photoZone.querySelector('.placeholder');
    const downloadBtn = document.getElementById('download-btn');
    const badgeTemplate = document.getElementById('badge-template');

    // Configuration
    const config = {
        photoSize: 200, // Taille en px
        photoPosition: { x: 50, y: 30 } // Position en %
    };

    // Gestion de l'upload
    photoZone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            userPhoto.src = event.target.result;
            userPhoto.style.display = 'block';
            placeholder.style.display = 'none';
            photoZone.style.border = '3px solid var(--primary)';
            photoZone.style.backgroundColor = 'transparent';
            downloadBtn.disabled = false;
            
            // Ajustement automatique de la photo
            userPhoto.onload = function() {
                const imgRatio = userPhoto.naturalWidth / userPhoto.naturalHeight;
                const zoneRatio = 1; // Carré
                
                if (imgRatio > zoneRatio) {
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

    // Téléchargement
    downloadBtn.addEventListener('click', function() {
        if (!userPhoto.src) return;
        
        // Création du canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Dimensions
        canvas.width = badgeTemplate.naturalWidth || badgeTemplate.width;
        canvas.height = badgeTemplate.naturalHeight || badgeTemplate.height;
        
        // Dessin du badge
        ctx.drawImage(badgeTemplate, 0, 0, canvas.width, canvas.height);
        
        // Position de la photo
        const photoX = (canvas.width * config.photoPosition.x / 100) - (config.photoSize / 2);
        const photoY = (canvas.height * config.photoPosition.y / 100) - (config.photoSize / 2);
        
        // Masque circulaire
        ctx.save();
        ctx.beginPath();
        ctx.arc(
            photoX + config.photoSize / 2,
            photoY + config.photoSize / 2,
            config.photoSize / 2,
            0,
            Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();
        
        // Dessin de la photo
        ctx.drawImage(
            userPhoto,
            photoX,
            photoY,
            config.photoSize,
            config.photoSize
        );
        ctx.restore();
        
        // Téléchargement
        const link = document.createElement('a');
        link.download = 'badge-technofoire-' + new Date().getTime() + '.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    });

    // Initialisation
    badgeTemplate.onload = function() {
        // Ajustement dynamique si besoin
        const badgeWidth = badgeTemplate.width;
        const badgeHeight = badgeTemplate.height;
        
        // Mise à jour de la position si nécessaire
        config.photoPosition = { 
            x: 50, 
            y: Math.round((200 / badgeHeight) * 100) // Position verticale basée sur 200px du haut
        };
    };
});
