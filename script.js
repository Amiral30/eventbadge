document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');
    const photoContainer = document.getElementById('photo-container');
    const uploadBtn = document.getElementById('upload-btn');
    const downloadBtn = document.getElementById('download-btn');
    const badgeTemplate = document.getElementById('badge-template');

    if (!fileInput || !photoContainer || !uploadBtn || !downloadBtn || !badgeTemplate) {
        console.error("Erreur : Un élément HTML est manquant");
        return;
    }

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            alert("Veuillez sélectionner une image valide (JPEG, PNG)");
            return;
        }

        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.id = 'user-photo';
            img.src = e.target.result;
            
            
            photoContainer.innerHTML = '';
            photoContainer.appendChild(img);
            photoContainer.classList.add('has-image');
            downloadBtn.disabled = false;
        };
        
        reader.onerror = function() {
            console.error("Erreur lors de la lecture du fichier");
            alert("Erreur : Impossible de lire le fichier");
        };
        
        reader.readAsDataURL(file);
    }

    function downloadBadge() {
        const userPhoto = photoContainer.querySelector('img');
        if (!userPhoto) {
            alert("Veuillez d'abord ajouter une photo");
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("Erreur : Impossible d'obtenir le contexte canvas");
            return;
        }

        canvas.width = badgeTemplate.naturalWidth || 800;
        canvas.height = badgeTemplate.naturalHeight || 1200;
        
        ctx.drawImage(badgeTemplate, 0, 0, canvas.width, canvas.height);
        
        const circleConfig = {
            centerX: canvas.width / 2,
            centerY: canvas.height * 0.32,
            radius: (canvas.width * 0.35) / 2
        };

        ctx.save();
        ctx.beginPath();
        ctx.arc(
            circleConfig.centerX, 
            circleConfig.centerY, 
            circleConfig.radius, 
            0, 
            Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();
        
        const userImg = new Image();
        userImg.crossOrigin = 'Anonymous';
        
        userImg.onload = function() {
            ctx.drawImage(
                userImg, 
                circleConfig.centerX - circleConfig.radius, 
                circleConfig.centerY - circleConfig.radius, 
                circleConfig.radius * 2, 
                circleConfig.radius * 2
            );
            ctx.restore();
            
            try {
                const link = document.createElement('a');
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                link.download = Badge_Technofoire.png;
                link.href = canvas.toDataURL('image/*');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("Erreur lors du téléchargement :", error);
                alert("Erreur lors de la génération du badge");
            }
        };
        
        userImg.onerror = function() {
            console.error("Erreur de chargement de l'image utilisateur");
            alert("Erreur : Impossible de charger la photo");
        };
        
        userImg.src = userPhoto.src;
    }

    uploadBtn.addEventListener('click', function() {
        fileInput.value = ''; 
        fileInput.click();
    });

    photoContainer.addEventListener('click', function() {
        fileInput.value = '';
        fileInput.click();
    });

    fileInput.addEventListener('change', handleFileUpload);
    downloadBtn.addEventListener('click', downloadBadge);
});