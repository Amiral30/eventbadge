document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const fileInput = document.getElementById('file-input');
    const photoZone = document.getElementById('photo-zone');
    const userPhoto = document.getElementById('user-photo');
    const placeholder = photoZone.querySelector('.placeholder');
    const downloadBtn = document.getElementById('download-btn');
    const badgeTemplate = document.getElementById('badge-template');

    // Configuration (à ajuster selon badge.png)
    const config = {
        photoSize: 220,       // Doit correspondre au CSS
        position: {           // Position relative sur le badge (en %)
            x: 50,            // Centre horizontal
            y: 35             // 35% du haut
        }
    };

    // Gestion upload
    photoZone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            userPhoto.src = event.target.result;
            userPhoto.style.display = 'block';
            placeholder.style.display = 'none';
            photoZone.style.borderColor = 'var(--primary)';
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

    // Téléchargement
    downloadBtn.addEventListener('click', function() {
        if (!userPhoto.src) return;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Dimensions
        canvas.width = badgeTemplate.naturalWidth || badgeTemplate.width;
        canvas.height = badgeTemplate.naturalHeight || badgeTemplate.height;
        
        // Dessin du badge
        ctx.drawImage(badgeTemplate, 0, 0, canvas.width, canvas.height);
        
        // Position photo
        const posX = (canvas.width * config.position.x / 100) - (config.photoSize / 2);
        const posY = (canvas.height * config.position.y / 100) - (config.photoSize / 2);
        
        // Masque circulaire
        ctx.save();
        ctx.beginPath();
        ctx.arc(
            posX + config.photoSize / 2,
            posY + config.photoSize / 2,
            config.photoSize / 2,
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
            config.photoSize,
            config.photoSize
        );
        ctx.restore();
        
        // Téléchargement
        const link = document.createElement('a');
        link.download = `badge-technofoire-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // Ajustement dynamique si besoin
    badgeTemplate.onload = function() {
        console.log('Dimensions du badge:', badgeTemplate.naturalWidth, 'x', badgeTemplate.naturalHeight);
        // Ajuster config.position.y si nécessaire
    };
});
