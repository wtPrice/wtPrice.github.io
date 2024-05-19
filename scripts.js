const form = document.getElementById('myForm');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const intro = document.getElementById('intro').value;
  const body = document.getElementById('body').value;
  const conclusion = document.getElementById('conclusion').value;
  // Send the form data to the server
  fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, intro, body, conclusion })
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
});
