document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');
    const downloadBtn = document.getElementById('download-btn');
    const photoContainer = document.getElementById('photo-container');
    const userPhoto = document.getElementById('user-photo');

    // Configuration du badge
    const badgeConfig = {
        photoPosition: {
            x: 50, // % par rapport au badge
            y: 30  // % par rapport au badge
        },
        photoSize: {
            width: 200, // px
            height: 200 // px
        }
    };

    // Gestion de l'upload
    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            userPhoto.src = e.target.result;
            userPhoto.style.display = 'block';
            photoContainer.classList.add('has-image');
            downloadBtn.disabled = false;
            
            // Redimensionnement automatique
            userPhoto.onload = function() {
                const containerRatio = badgeConfig.photoSize.width / badgeConfig.photoSize.height;
                const imageRatio = userPhoto.naturalWidth / userPhoto.naturalHeight;
                
                if (imageRatio > containerRatio) {
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

    // Téléchargement du badge
    downloadBtn.addEventListener('click', async () => {
        const badgeTemplate = document.getElementById('badge-template');
        
        // Création du canvas
        const canvas = document.createElement('canvas');
        canvas.width = badgeTemplate.naturalWidth || badgeTemplate.width;
        canvas.height = badgeTemplate.naturalHeight || badgeTemplate.height;
        const ctx = canvas.getContext('2d');

        // Dessiner le badge
        ctx.drawImage(badgeTemplate, 0, 0, canvas.width, canvas.height);

        // Dessiner la photo utilisateur
        if (userPhoto.src) {
            // Calculer la position
            const posX = (canvas.width * badgeConfig.photoPosition.x / 100) - (badgeConfig.photoSize.width / 2);
            const posY = (canvas.height * badgeConfig.photoPosition.y / 100) - (badgeConfig.photoSize.height / 2);
            
            // Créer un masque circulaire si besoin
            ctx.save();
            ctx.beginPath();
            ctx.arc(
                posX + badgeConfig.photoSize.width / 2,
                posY + badgeConfig.photoSize.height / 2,
                badgeConfig.photoSize.width / 2,
                0,
                Math.PI * 2
            );
            ctx.closePath();
            ctx.clip();
            
            // Dessiner l'image
            ctx.drawImage(
                userPhoto,
                posX,
                posY,
                badgeConfig.photoSize.width,
                badgeConfig.photoSize.height
            );
            ctx.restore();
        }

        // Téléchargement
        const link = document.createElement('a');
        link.download = 'badge_technofoire.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // Initialisation
    const badgeTemplate = document.getElementById('badge-template');
    badgeTemplate.onload = function() {
        // Ajuster dynamiquement la zone photo si besoin
        const container = document.querySelector('.badge-container');
        container.style.width = badgeTemplate.width + 'px';
        container.style.height = badgeTemplate.height + 'px';
    };
});
