document.addEventListener('DOMContentLoaded', () => {
    // Éléments
    const fileInput = document.getElementById('fileInput');
    const userPhoto = document.getElementById('userPhoto');
    const uploadHint = document.querySelector('.upload-hint');
    const downloadBtn = document.getElementById('downloadBtn');
    const photoSpot = document.querySelector('.photo-spot');
    const cropContainer = document.getElementById('cropContainer');
    const validateCropBtn = document.getElementById('validateCrop');
    
    let cropper;

    // Upload photo
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                // Préparation du recadrage
                cropContainer.innerHTML = `<img id="cropImage" src="${event.target.result}">`;
                cropContainer.classList.remove('hidden');
                validateCropBtn.classList.remove('hidden');
                downloadBtn.disabled = true;
                
                // Initialisation de CropperJS
                const image = document.getElementById('cropImage');
                image.onload = () => {
                    cropper = new Cropper(image, {
                        aspectRatio: 1,
                        viewMode: 1,
                        autoCropArea: 0.8,
                        responsive: true,
                        guides: false
                    });
                };
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Validation du recadrage
    validateCropBtn.addEventListener('click', () => {
        if (cropper) {
            // Récupération de la photo recadrée
            const canvas = cropper.getCroppedCanvas({
                width: 300,
                height: 300,
                minWidth: 150,
                minHeight: 150
            });
            
            userPhoto.src = canvas.toDataURL('image/jpeg', 0.9);
            userPhoto.style.display = 'block';
            uploadHint.style.display = 'none';
            
            // Reset UI
            cropContainer.classList.add('hidden');
            validateCropBtn.classList.add('hidden');
            downloadBtn.disabled = false;
            
            // Destruction de Cropper
            cropper.destroy();
        }
    });

    // Téléchargement
    downloadBtn.addEventListener('click', async () => {
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération...';
        
        try {
            const canvas = await html2canvas(document.querySelector('.badge-preview'), {
                useCORS: true,
                scale: 2,
                logging: false,
                backgroundColor: null,
                allowTaint: true
            });
            
            const link = document.createElement('a');
            link.download = `badge-technofoire-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error("Erreur :", error);
            alert("Erreur lors de la génération");
        } finally {
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Télécharger';
        }
    });

    // Clic sur la zone photo
    photoSpot.addEventListener('click', () => {
        fileInput.click();
    });
});
