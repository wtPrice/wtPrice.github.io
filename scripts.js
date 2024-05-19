const form = document.getElementById('form');
const generateButton = document.getElementById('generate-button');
const imageContainer = document.getElementById('image-container');

generateButton.addEventListener('click', async () => {
  const title = document.getElementById('title').value;
  const intro = document.getElementById('intro').value;
  const body = document.getElementById('body').value;
  const conclusion = document.getElementById('conclusion').value;

  // Make an API call to the Pixels API to generate the images
  const response = await fetch(`https://api.zPhMQms3thyBjnQnph7jxMBUSau1KlrRKjHOpeOfwkKtT0NXzADh0L8D/pixels?title=${title}&intro=${intro}&body=${body}&conclusion=${conclusion}`);
  const imageData = await response.json();

  // Use the Ideogram wrapper to generate the visual representation of the pixel count
  const ideogram = new Ideogram(imageData.pixel_count);
  const visualRepresentation = ideogram.generateVisualRepresentation();

  // Update the HTML element with the visual representation
  imageContainer.innerHTML = visualRepresentation;
});
