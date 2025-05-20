document.addEventListener('DOMContentLoaded', () => {
    // Éléments DOM
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const downloadBtn = document.getElementById('downloadBtn');
    const rotateBtn = document.getElementById('rotateBtn');
    const filterBtn = document.getElementById('filterBtn');
    const overlay = document.querySelector('.overlay');

    // Variables d'état
    let isDragging = false;
    let startX, startY, offsetX, offsetY;
    let currentRotation = 0;
    let currentFilter = 'none';
    const filters = [
        'none',
        'grayscale(100%)',
        'sepia(100%)',
        'brightness(120%) contrast(120%)',
        'hue-rotate(90deg)',
        'saturate(200%)'
    ];

    // Gestion de l'upload
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('upload-hint')) {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                preview.src = event.target.result;
                preview.style.display = 'block';
                overlay.querySelector('.upload-hint').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Drag & Drop
    preview.addEventListener('mousedown', startDrag);
    preview.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
        isDragging = true;
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const rect = preview.getBoundingClientRect();
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
        
        e.preventDefault();
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });

    function drag(e) {
        if (!isDragging) return;
        
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const containerRect = document.querySelector('.badge-container').getBoundingClientRect();
        let newLeft = clientX - containerRect.left - offsetX;
        let newTop = clientY - containerRect.top - offsetY;
        
        // Contraintes de position
        newLeft = Math.max(0, Math.min(newLeft, containerRect.width - preview.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, containerRect.height - preview.offsetHeight));
        
        preview.style.left = `${newLeft}px`;
        preview.style.top = `${newTop}px`;
        
        e.preventDefault();
    }

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    function endDrag() {
        isDragging = false;
    }

    // Zoom avec molette
    preview.addEventListener('wheel', (e) => {
        e.preventDefault();
        const currentSize = parseInt(preview.style.width) || 120;
        const newSize = Math.max(60, Math.min(200, currentSize + (e.deltaY > 0 ? -10 : 10)));
        
        preview.style.width = `${newSize}px`;
        preview.style.height = `${newSize}px`;
    }, { passive: false });

    // Rotation
    rotateBtn.addEventListener('click', () => {
        currentRotation = (currentRotation + 90) % 360;
        preview.style.transform = `rotate(${currentRotation}deg)`;
    });

    // Filtres
    filterBtn.addEventListener('click', () => {
        const currentIndex = filters.indexOf(currentFilter);
        const nextIndex = (currentIndex + 1) % filters.length;
        currentFilter = filters[nextIndex];
        preview.style.filter = currentFilter;
    });

    // Téléchargement
    downloadBtn.addEventListener('click', async () => {
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération...';
        
        try {
            const canvas = await html2canvas(document.querySelector('.badge-container'), {
                useCORS: true,
                scale: 2, // Qualité HD
                logging: false,
                backgroundColor: null
            });
            
            const link = document.createElement('a');
            link.download = `badge-unh-${new Date().getTime()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            alert('Une erreur est survenue lors du téléchargement.');
        } finally {
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Télécharger le Badge';
        }
    });
});
