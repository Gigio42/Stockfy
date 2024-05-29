const QRCode = require('qrcode');

const generateQR = async text => {
  try {
    await QRCode.toFile('./stockQR.png', text);
  } catch (err) {
    console.error(err);
  }
}

generateQR('https://stockfysite.onrender.com/PCP/pcp.html');