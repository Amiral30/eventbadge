document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const userPhoto = document.getElementById('userPhoto');
    const uploadLabel = document.querySelector('.upload-label');
    const downloadBtn = document.getElementById('downloadBtn');

    // Upload photo
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                userPhoto.src = event.target.result;
                userPhoto.style.display = 'block';
                uploadLabel.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Téléchargement
    downloadBtn.addEventListener('click', async () => {
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Création...';
        
        try {
            const canvas = await html2canvas(document.querySelector('.badge-container'), {
                useCORS: true,
                scale: 2,
                logging: false,
                backgroundColor: null
            });
            
            const link = document.createElement('a');
            link.download = `technofoire-badge-${new Date().getTime()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            alert("Erreur lors de la création : " + error.message);
        } finally {
            setTimeout(() => {
                downloadBtn.innerHTML = '<i class="fas fa-download"></i> Télécharger ton badge';
            }, 1000);
        }
    });
});
