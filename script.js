document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const preview = document.getElementById('preview');
    const downloadBtn = document.getElementById('downloadBtn');
    const cropBtn = document.getElementById('cropBtn');
    const rotateBtn = document.getElementById('rotateBtn');
    const filterBtn = document.getElementById('filterBtn');
    
    let isDragging = false;
    let offsetX, offsetY;
    let currentRotation = 0;
    let currentFilter = 'none';

    // Upload de l'image
    uploadBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                preview.src = event.target.result;
                preview.style.transform = 'rotate(0deg)';
                preview.style.filter = 'none';
                currentRotation = 0;
                currentFilter = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Drag & Drop
    preview.addEventListener('mousedown', startDrag);
    preview.addEventListener('touchstart', startDrag);
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    function startDrag(e) {
        isDragging = true;
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const rect = preview.getBoundingClientRect();
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
        
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging) return;
        
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const containerRect = document.querySelector('.badge-container').getBoundingClientRect();
        let newLeft = clientX - containerRect.left - offsetX;
        let newTop = clientY - containerRect.top - offsetY;
        
        newLeft = Math.max(0, Math.min(newLeft, containerRect.width - preview.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, containerRect.height - preview.offsetHeight));
        
        preview.style.left = newLeft + 'px';
        preview.style.top = newTop + 'px';
        
        e.preventDefault();
    }

    function endDrag() {
        isDragging = false;
    }

    // Zoom avec molette
    preview.addEventListener('wheel', function(e) {
        e.preventDefault();
        const currentWidth = parseInt(preview.style.width) || 120;
        const newWidth = currentWidth + (e.deltaY > 0 ? -10 : 10);
        
        if (newWidth >= 60 && newWidth <= 200) {
            preview.style.width = newWidth + 'px';
            preview.style.height = newWidth + 'px';
        }
    });

    // Rotation
    rotateBtn.addEventListener('click', function() {
        currentRotation += 90;
        if (currentRotation >= 360) currentRotation = 0;
        preview.style.transform = `rotate(${currentRotation}deg)`;
    });

    // Forme (Carré ↔ Cercle)
    cropBtn.addEventListener('click', function() {
        const isCircle = preview.style.borderRadius === '50%';
        preview.style.borderRadius = isCircle ? '0' : '50%';
    });

    // Filtres
    filterBtn.addEventListener('click', function() {
        const filters = [
            'none',
            'grayscale(100%)',
            'sepia(100%)',
            'brightness(150%)',
            'contrast(200%)',
            'hue-rotate(90deg)'
        ];
        
        const currentIndex = filters.indexOf(currentFilter);
        const nextIndex = (currentIndex + 1) % filters.length;
        currentFilter = filters[nextIndex];
        preview.style.filter = currentFilter;
    });

    // Téléchargement
    downloadBtn.addEventListener('click', function() {
        html2canvas(document.querySelector('.badge-container')).then(canvas => {
            const link = document.createElement('a');
            link.download = 'badge-unh-personnalise.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
});
