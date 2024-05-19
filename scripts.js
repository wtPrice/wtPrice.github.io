if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
// Add event listener to the form
document.getElementById('myForm').addEventListener('submit', (event) => {
  event.preventDefault();
  // Get the form data
  const formData = new FormData(document.getElementById('myForm'));
  // Send the form data to the server
  fetch('/submit', {
    method: 'POST',
    body: formData
  })
  .then((response) => response.json())
  .then((data) => {
    // Handle the response data
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
});
}
