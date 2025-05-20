document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const downloadBtn = document.getElementById('downloadBtn');
    const poster = document.getElementById('poster');
    
    let isDragging = false;
    let offsetX, offsetY;

    // Upload image
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                preview.src = event.target.result;
                // Position initiale au centre
                preview.style.top = '50%';
                preview.style.left = '50%';
            };
            reader.readAsDataURL(file);
        }
    });

    // Drag and drop pour positionner l'image
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
        
        // Limites pour pas sortir du cadre
        newLeft = Math.max(0, Math.min(newLeft, containerRect.width - preview.width));
        newTop = Math.max(0, Math.min(newTop, containerRect.height - preview.height));
        
        preview.style.left = newLeft + 'px';
        preview.style.top = newTop + 'px';
        
        e.preventDefault();
    }

    function endDrag() {
        isDragging = false;
    }

    // Téléchargement
    downloadBtn.addEventListener('click', function() {
        html2canvas(document.querySelector('.badge-container')).then(canvas => {
            const link = document.createElement('a');
            link.download = 'mon-badge.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
});
