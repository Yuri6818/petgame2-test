const sharp = require('sharp');

// Generate favicon from shop icon
sharp('img/assets/shopicon.png')
  .resize(32, 32)
  .toFile('public/favicon.ico')
  .then(info => console.log('Favicon created successfully:', info))
  .catch(err => console.error('Error creating favicon:', err));