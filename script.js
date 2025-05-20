document.addEventListener('DOMContentLoaded', () => {
    // Éléments
    const fileInput = document.getElementById('fileInput');
    const photoZone = document.getElementById('photoZone');
    const downloadBtn = document.getElementById('downloadBtn');
    const baseAffiche = document.getElementById('baseAffiche');

    // Variables
    let userPhoto = null;

    // Gestion de l'upload
    photoZone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                // Création de l'image utilisateur
                if (userPhoto) userPhoto.remove();
                
                userPhoto = document.createElement('img');
                userPhoto.src = event.target.result;
                userPhoto.style.objectFit = 'cover';
                userPhoto.style.width = '100%';
                userPhoto.style.height = '100%';
                
                photoZone.appendChild(userPhoto);
                photoZone.classList.add('has-photo');
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Téléchargement
    downloadBtn.addEventListener('click', async () => {
        if (!userPhoto) {
            alert("Ajoute d'abord une photo !");
            return;
        }

        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération...';
        
        try {
            const canvas = await html2canvas(document.querySelector('.affiche-container'), {
                useCORS: true,
                scale: 2,
                logging: false,
                backgroundColor: null,
                allowTaint: true
            });
            
            const link = document.createElement('a');
            link.download = `mon-badge-technofoire-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error("Erreur :", error);
            alert("Erreur lors de la génération");
        } finally {
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Télécharger';
        }
    });
});
