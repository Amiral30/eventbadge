document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const userPhoto = document.getElementById('userPhoto');
    const photoSpot = document.querySelector('.photo-spot');
    const downloadBtn = document.getElementById('downloadBtn');

    // Upload photo
    photoSpot.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                userPhoto.src = event.target.result;
                userPhoto.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Download
    downloadBtn.addEventListener('click', async () => {
        const canvas = await html2canvas(document.querySelector('.badge-container'));
        const link = document.createElement('a');
        link.download = 'badge-technofoire.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});
