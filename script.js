document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const downloadBtn = document.getElementById('download-btn');
    const userPhoto = document.getElementById('user-photo');
    const photoZone = document.getElementById('photo-zone');
    const badgeTemplate = document.getElementById('badge-template');

    // Configuration précise
    const PHOTO_ZONE = {
        x: 72,    // Position X en px
        y: 210,   // Position Y en px
        width: 320, // Largeur en px
        height: 240 // Hauteur en px
    };

    // Upload photo
    uploadBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            userPhoto.src = event.target.result;
            userPhoto.style.display = 'block';
            photoZone.querySelector('.placeholder').style.display = 'none';
            downloadBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    });

    // Téléchargement
    downloadBtn.addEventListener('click', function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Dimensions canvas = dimensions affiche
        canvas.width = 800;
        canvas.height = 1200;
        
        // Dessin de l'affiche
        const bgImg = new Image();
        bgImg.src = 'assets/1000489890.jpg';
        bgImg.onload = function() {
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
            
            // Dessin de la photo utilisateur
            if (userPhoto.src) {
                ctx.save();
                
                // Créer un masque pour la zone exacte
                ctx.beginPath();
                ctx.rect(
                    PHOTO_ZONE.x,
                    PHOTO_ZONE.y,
                    PHOTO_ZONE.width,
                    PHOTO_ZONE.height
                );
                ctx.clip();
                
                ctx.drawImage(
                    userPhoto,
                    PHOTO_ZONE.x,
                    PHOTO_ZONE.y,
                    PHOTO_ZONE.width,
                    PHOTO_ZONE.height
                );
                
                ctx.restore();
            }
            
            // Téléchargement
            const link = document.createElement('a');
            link.download = 'badge-technofoire.png';
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        };
    });
});
