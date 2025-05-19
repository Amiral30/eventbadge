let imageReady = false;

document.getElementById('upload-btn').addEventListener('click', () => {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    const userPhoto = document.getElementById('user-photo');
    userPhoto.src = imgURL;

    userPhoto.onload = () => {
        imageReady = true;
        document.getElementById('download-btn').disabled = false;
    };
});

document.getElementById('download-btn').addEventListener('click', async () => {
    if (!imageReady) {
        alert("Image non chargée !");
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 1800;

    const circle = {
        x: canvas.width / 2,
        y: canvas.height * 0.26,
        radius: 191
    };

    const badgeImg = new Image();
    badgeImg.src = 'assets/badge.png';

    await new Promise(resolve => badgeImg.onload = resolve);
    ctx.drawImage(badgeImg, 0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.clip();

    const userImg = document.getElementById('user-photo');
    ctx.drawImage(
        userImg,
        circle.x - circle.radius,
        circle.y - circle.radius,
        circle.radius * 2,
        circle.radius * 2
    );
    ctx.restore();

    const link = document.createElement('a');
    link.download = 'badge_technofoire.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
