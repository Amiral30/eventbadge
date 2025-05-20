document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const photoUpload = document.getElementById('photoUpload');
    const userPhoto = document.getElementById('userPhoto');
    const uploadPrompt = document.querySelector('.upload-prompt');
    const downloadBtn = document.getElementById('downloadBtn');
    const photoContainer = document.querySelector('.photo-container');
    
    // Variables
    let isDragging = false;
    let startX, startY, offsetX, offsetY;
    let scale = 1;

    // Upload Photo
    photoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                userPhoto.src = event.target.result;
                userPhoto.style.display = 'block';
                uploadPrompt.style.display = 'none';
                
                // Reset position
                userPhoto.style.transform = 'translate(0, 0) scale(1)';
                scale = 1;
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Drag to Move
    photoContainer.addEventListener('mousedown', startDrag);
    photoContainer.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
        if (userPhoto.style.display !== 'block') return;
        
        isDragging = true;
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const rect = photoContainer.getBoundingClientRect();
        offsetX = clientX - rect.left - (userPhoto.offsetLeft || 0);
        offsetY = clientY - rect.top - (userPhoto.offsetTop || 0);
        
        e.preventDefault();
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });

    function drag(e) {
        if (!isDragging) return;
        
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const rect = photoContainer.getBoundingClientRect();
        let newX = clientX - rect.left - offsetX;
        let newY = clientY - rect.top - offsetY;
        
        userPhoto.style.left = `${newX}px`;
        userPhoto.style.top = `${newY}px`;
        
        e.preventDefault();
    }

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    function endDrag() {
        isDragging = false;
    }

    // Zoom with Wheel
    photoContainer.addEventListener('wheel', (e) => {
        if (userPhoto.style.display !== 'block') return;
        
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        scale = Math.max(0.5, Math.min(3, scale + delta));
        
        userPhoto.style.transform = `scale(${scale})`;
    }, { passive: false });

    // Download HD
    downloadBtn.addEventListener('click', async () => {
        if (userPhoto.style.display !== 'block') {
            alert('Veuillez ajouter une photo d\'abord !');
            return;
        }
        
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Export en cours...';
        downloadBtn.disabled = true;
        
        try {
            const canvas = await html2canvas(document.querySelector('.badge-preview'), {
                useCORS: true,
                scale: 2,
                logging: false,
                backgroundColor: null
            });
            
            const link = document.createElement('a');
            link.download = `unh-badge-${new Date().getTime()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'export : ' + error.message);
        } finally {
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Exporter en HD';
            downloadBtn.disabled = false;
        }
    });
});
