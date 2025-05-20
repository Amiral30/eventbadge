document.addEventListener('DOMContentLoaded', () => {
    // Éléments
    const fileInput = document.getElementById('fileInput');
    const userPhoto = document.getElementById('userPhoto');
    const uploadLabel = document.querySelector('.upload-label');
    const downloadBtn = document.getElementById('downloadBtn');
    const cropBtn = document.getElementById('cropBtn');
    const cropControls = document.querySelector('.crop-controls');
    
    let cropper;
    let currentImageSrc;

    // Upload photo
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                currentImageSrc = event.target.result;
                userPhoto.src = currentImageSrc;
                userPhoto.style.display = 'block';
                uploadLabel.style.display = 'none';
                
                // Initialise CropperJS
                initCropper();
                cropControls.style.display = 'block';
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Initialisation du recadrage
    function initCropper() {
        if (cropper) {
            cropper.destroy();
        }
        
        cropper = new Cropper(userPhoto, {
            aspectRatio: 1,
            viewMode: 1,
            autoCropArea: 1,
            responsive: true,
            guides: false,
            background: false,
            modal: false,
            cropBoxMovable: false,
            cropBoxResizable: false,
            toggleDragModeOnDblclick: false
        });
    }

    // Recadrage
    cropBtn.addEventListener('click', () => {
        if (cropper) {
            // Récupère la photo recadrée
            const croppedCanvas = cropper.getCroppedCanvas({
                width: 120,
                height: 120,
                fillColor: '#fff'
            });
            
            userPhoto.src = croppedCanvas.toDataURL('image/png');
            cropper.destroy();
            cropControls.style.display = 'none';
        }
    });

    // Téléchargement
    downloadBtn.addEventListener('click', async () => {
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération...';
        
        try {
            const canvas = await html2canvas(document.querySelector('.badge-container'), {
                useCORS: true,
                scale: 2,
                logging: false,
                backgroundColor: null
            });
            
            const link = document.createElement('a');
            link.download = `badge-unh-${new Date().getTime()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            alert('Erreur lors du téléchargement : ' + error.message);
        } finally {
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Télécharger';
        }
    });
});
