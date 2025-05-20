document.addEventListener('DOMContentLoaded', () => {
    // Éléments
    const fileInput = document.getElementById('fileInput');
    const userPhoto = document.getElementById('userPhoto');
    const uploadLabel = document.querySelector('.upload-label');
    const downloadBtn = document.getElementById('downloadBtn');
    const photoFrame = document.querySelector('.photo-frame');

    // Optimisation du redimensionnement
    function fitImageToFrame() {
        const imgRatio = userPhoto.naturalWidth / userPhoto.naturalHeight;
        const frameRatio = photoFrame.offsetWidth / photoFrame.offsetHeight;

        if (imgRatio > frameRatio) {
            userPhoto.style.width = '100%';
            userPhoto.style.height = 'auto';
        } else {
            userPhoto.style.width = 'auto';
            userPhoto.style.height = '100%';
        }

        // Centrage absolu
        userPhoto.style.position = 'absolute';
        userPhoto.style.top = '50%';
        userPhoto.style.left = '50%';
        userPhoto.style.transform = 'translate(-50%, -50%)';
    }

    // Gestion de l'upload
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                userPhoto.src = event.target.result;
                userPhoto.onload = () => {
                    fitImageToFrame();
                    userPhoto.style.display = 'block';
                    uploadLabel.style.display = 'none';
                };
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Téléchargement HD
    downloadBtn.addEventListener('click', async () => {
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Création en cours...';
        
        try {
            const canvas = await html2canvas(document.querySelector('.badge-container'), {
                useCORS: true,
                scale: 2,
                logging: false,
                backgroundColor: null,
                allowTaint: true
            });
            
            const link = document.createElement('a');
            link.download = `badge-technofoire-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        } catch (error) {
            console.error("Erreur de génération :", error);
            alert("Une erreur est survenue lors de la génération du badge");
        } finally {
            setTimeout(() => {
                downloadBtn.innerHTML = '<i class="fas fa-file-download"></i> Télécharger à nouveau';
                downloadBtn.disabled = false;
            }, 2000);
        }
    });

    // Clic sur le cadre pour upload
    photoFrame.addEventListener('click', () => {
        fileInput.click();
    });
});
