let canvas = document.getElementById('badgeCanvas');
let ctx = canvas.getContext('2d');
let image = new Image();
image.src = 'badge-background.jpg';

let uploadedPhoto = null;
let photoX = 500, photoY = 150;
let photoSize = 220;

image.onload = () => {
    drawCanvas();
};

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    if (uploadedPhoto) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(uploadedPhoto, photoX, photoY, photoSize, photoSize);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + 2, 0, Math.PI * 2);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.stroke();
    }
}

document.getElementById('photoUpload').addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
        uploadedPhoto = new Image();
        uploadedPhoto.onload = drawCanvas;
        uploadedPhoto.src = evt.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

document.getElementById('downloadBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'badge-technofoire.png';
    link.href = canvas.toDataURL();
    link.click();
});

document.getElementById('resetBtn').addEventListener('click', () => {
    uploadedPhoto = null;
    drawCanvas();
});
