document.addEventListener('DOMContentLoaded', function() {
    let submissionCount = 0;
    const modal = document.getElementById("paymentModal");
    const closeButton = document.getElementsByClassName("close")[0];

    // Close the modal when the close button is clicked
    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    document.getElementById('submit-form').addEventListener('submit', function(event) {
        event.preventDefault();
        submissionCount++;

        if (submissionCount > 3) {
            // Show the payment modal
            modal.style.display = "block";
        } else {
            // Process the normal submission
            // Here you would typically handle the form submission
            console.log("Processing normal submission");
        }
    });

    // Initialize Stripe Elements here as previously described
    var stripe = Stripe('pk_live_rClVmfpMwlr4dwuDOp1q3Sny');
    var elements = stripe.elements();
    var card = elements.create('card');
    card.mount('#card-element');

    document.getElementById('payment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        stripe.createToken(card).then(function(result) {
            if (result.error) {
                document.getElementById('payment-message').textContent = result.error.message;
            } else {
                // Handle the Stripe token as needed for payment
                console.log("Stripe token created:", result.token);
            }
        });
    });
});
// Function to move to the next step in the form
function nextStep(currentStep) {
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    document.getElementById(`step-${currentStep + 1}`).style.display = 'block';
    document.querySelector(`#step-${currentStep + 1} input, #step-${currentStep + 1} select`).focus();
}

// Function to move to the previous step in the form
function prevStep(currentStep) {
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    document.getElementById(`step-${currentStep - 1}`).style.display = 'block';
    document.querySelector(`#step-${currentStep - 1} input, #step-${currentStep - 1} select`).focus();
}

// Function to calculate the estimate based on the inputs
function calculateEstimate() {
    const height = document.getElementById('height').value;
    const radius1 = document.getElementById('radius1').value;
    const radius2 = document.getElementById('radius2').value;
    const canopyHeight = document.getElementById('canopyHeight').value;
    const density = document.getElementById('density').value;
    const trimLevel = document.getElementById('trimLevel').value;

    fetch(`https://script.google.com/macros/s/AKfycbxfmZ66NuFnHGf7VI5ZTaGlPlgnpJPBVb9IHk07Ag-A2XC4kmG6IcEmqJbZ7SDFXXrC/exec?height=${height}&radius1=${radius1}&radius2=${radius2}&canopyHeight=${canopyHeight}&density=${density}&trimLevel=${trimLevel}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerText = `Estimated Price: $${data.estimate.toFixed(2)}`;
            document.getElementById('downloadButton').style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
}

// Function to generate and download a PDF invoice
function downloadPDF() {
    console.log("PDF generation started");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add the logo
    const img = new Image();
    img.src = 'https://i.imgur.com/diHtzPG.png'; // Ensure this URL points to your logo image
    img.onload = function() {
        console.log("Image loaded");
        doc.addImage(img, 'PNG', 10, 10, 50, 50);

        // Set font and add title
        doc.setFontSize(20);
        doc.text('Tree Estimate Invoice', 105, 80, null, null, 'center');

        // Add estimate details
        let yPos = 110;
        const estimateDetails = [
            { label: 'Height (ft):', value: document.getElementById('height').value },
            { label: 'Canopy Radius 1 (ft):', value: document.getElementById('radius1').value },
            { label: 'Canopy Radius 2 (ft):', value: document.getElementById('radius2').value },
            { label: 'Canopy Height (ft):', value: document.getElementById('canopyHeight').value },
            { label: 'Density Level:', value: document.getElementById('density').options[document.getElementById('density').selectedIndex].text },
            { label: 'Trim Level:', value: document.getElementById('trimLevel').options[document.getElementById('trimLevel').selectedIndex].text }
        ];

        estimateDetails.forEach(detail => {
            console.log(`Adding detail: ${detail.label} ${detail.value}`);
            doc.text(`${detail.label} ${detail.value}`, 10, yPos);
            yPos += 10;
        });

        // Add total price
        const totalPrice = document.getElementById('result').innerText.replace('Estimated Price: $', '');
        doc.setFontSize(16);
        doc.text(`Total Price: $${totalPrice}`, 10, yPos + 20);

        // Save the PDF
        console.log("Saving PDF");
        doc.save('tree_estimate_invoice.pdf');
    };

    img.onerror = function() {
        console.error("Image failed to load");
    };
}

// Prevent the form from submitting traditionally
document.getElementById('treeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    calculateEstimate();
});
