let cropper;
const upload = document.getElementById("upload");
const cropperImage = document.getElementById("cropper-image");
const userPhoto = document.getElementById("user-photo");
const canvas = document.getElementById("final-canvas");
const confirmCrop = document.getElementById("confirm-crop");
const downloadBtn = document.getElementById("download");

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    cropperImage.src = reader.result;

    if (cropper) cropper.destroy();
    cropper = new Cropper(cropperImage, {
      aspectRatio: 1,
      viewMode: 1,
      dragMode: "move",
      zoomable: true,
    });
  };
  reader.readAsDataURL(file);
});

confirmCrop.addEventListener("click", () => {
  const croppedCanvas = cropper.getCroppedCanvas({
    width: 220,
    height: 220,
  });
  userPhoto.src = croppedCanvas.toDataURL();
});

downloadBtn.addEventListener("click", () => {
  const affiche = document.querySelector(".affiche");

  canvas.width = 500;
  canvas.height = 500;
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.src = affiche.src;
  img.onload = () => {
    ctx.drawImage(img, 0, 0, 500, 500);

    const photo = new Image();
    photo.src = userPhoto.src;
    photo.onload = () => {
      ctx.drawImage(photo, 240, 125, 220, 220);
      const link = document.createElement("a");
      link.download = "mon_badge.png";
      link.href = canvas.toDataURL();
      link.click();
    };
  };
});
