// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAY3-XOr0WIIO0qUL52nRpv31VC_1MCVPM",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "reflect-and-inspire-journal",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "1:527702878859:web:15bab9caeff092fabec28e"
};
firebase.initializeApp(firebaseConfig);

// Google Sign-In
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    document.getElementById('signInButton').style.display = 'none';
    document.getElementById('signOutButton').style.display = 'block';
    document.getElementById('treeForm').style.display = 'block';
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        document.getElementById('signInButton').style.display = 'block';
        document.getElementById('signOutButton').style.display = 'none';
        document.getElementById('treeForm').style.display = 'none';
    });
}

let totalPrice = 0;

function calculateEstimate() {
    const height = parseFloat(document.getElementById('height').value);
    const radius1 = parseFloat(document.getElementById('radius1').value);
    const radius2 = parseFloat(document.getElementById('radius2').value);
    const canopyHeight = parseFloat(document.getElementById('canopyHeight').value);
    const density = parseInt(document.getElementById('density').value);
    const trimLevel = parseInt(document.getElementById('trimLevel').value);

    // BasicTrim Calculation
    const basicTrim = (height * 3) + (radius1 * 1.5) + (radius2 * 1.5) + (canopyHeight * 2);

    // Trim Level and Density Multipliers
    const multipliers = {
        1: { 1: 1.1, 2: 1.2, 3: 1.7, 4: 4.3 },
        2: { 1: 1.4, 2: 1.6, 3: 2.2, 4: 5.1 },
        3: { 1: 1.7, 2: 2.0, 3: 2.8, 4: 6.2 },
        4: { 1: 2.0, 2: 2.4, 3: 3.4, 4: 7.2 }
    };

    const multiplier = multipliers[density][trimLevel];
    const cost = basicTrim * multiplier;

    totalPrice = cost;

    document.getElementById('result').innerText = `Estimated Price: $${totalPrice.toFixed(2)}`;
    document.getElementById('downloadButton').style.display = 'block';
}

function downloadPDF() {
    console.log("PDF generation started");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add the logo
    const img = new Image();
    img.src = 'https://i.imgur.com/diHtzPG.png';
    img.onload = function() {
        console.log("Image loaded");
        doc.addImage(img, 'PNG', 10, 10, 50, 50);

        // Set font and add title
        doc.setFontSize(20);
        doc.text('Tree Estimate Invoice', 105, 20, null, null, 'center');

        // Add some spacing
        doc.setFontSize(12);
        doc.text(' ', 10, 40);

        // Add estimate details
        let yPos = 60;
        const estimateDetails = [
            { label: 'Height (ft):', value: document.getElementById('height').value },
            { label: 'Canopy Radius 1 (ft):', value: document.getElementById('radius1').value },
            { label: 'Canopy Radius 2 (ft):', value: document.getElementById('radius2').value },
            { label: 'Canopy Height (ft):', value: document.getElementById('canopyHeight').value },
            { label: 'Density Level:', value: document.getElementById('density').value },
            { label: 'Trim Level:', value: document.getElementById('trimLevel').value }
        ];

        estimateDetails.forEach(detail => {
            console.log(`Adding detail: ${detail.label} ${detail.value}`);
            doc.text(`${detail.label} ${detail.value}`, 10, yPos);
            yPos += 10;
        });

        // Add total price
        doc.setFontSize(16);
        doc.text(`Total Price: $${totalPrice.toFixed(2)}`, 10, yPos + 20);

        // Save the PDF
        console.log("Saving PDF");
        doc.save('tree_estimate_invoice.pdf');
        console.log("PDF saved");
    };
    img.onerror = function() {
        console.error("Image failed to load");
    };
}

function nextStep(currentStep) {
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    document.getElementById(`step-${currentStep + 1}`).style.display = 'block';
    document.querySelector(`#step-${currentStep + 1} input, #step-${currentStep + 1} select`).focus();
}

function prevStep(currentStep) {
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    document.getElementById(`step-${currentStep - 1}`).style.display = 'block';
    document.querySelector(`#step-${currentStep - 1} input, #step-${currentStep - 1} select`).focus();
}

document.getElementById('treeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    calculateEstimate();
});

document.getElementById('downloadButton').addEventListener('click', downloadPDF);