
let currentStep = 0;

const steps = document.querySelectorAll(".form-step");
const circles = document.querySelectorAll(".steps span");
const form = document.getElementById("registrationForm");

function showStep() {

    steps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
    });

    circles.forEach((circle, index) => {
        circle.classList.toggle("active", index <= currentStep);
    });

    document.getElementById("progressLine").style.width =
        ((currentStep + 1) / steps.length * 100) + "%";

    document.getElementById("previousBtn").style.display =
        currentStep === 0 ? "none" : "block";

    document.getElementById("nextBtn").style.display =
        currentStep === steps.length - 1 ? "none" : "block";

    document.getElementById("submitBtn").style.display =
        currentStep === steps.length - 1 ? "block" : "none";

    if (currentStep === 3) {
        showReview();
    }
}

function changeStep(direction) {

    if (direction === 1 && !validateStep()) {
        alert("Please complete all required fields correctly.");
        return;
    }

    currentStep += direction;

    showStep();
}

function validateStep() {

    const fields = steps[currentStep].querySelectorAll(
        "input:not([type=file]), select, textarea"
    );

    for (const field of fields) {
        if (!field.checkValidity()) {
            field.reportValidity();
            return false;
        }
    }

    if (currentStep === 2) {
        const passport = document.getElementById("passport").files[0];

        if (!passport) {
            alert("Please upload your passport photograph.");
            return false;
        }

        if (!passport.type.startsWith("image/")) {
            alert("Please select a valid image.");
            return false;
        }
    }

    return true;
}

function showReview() {

    const data = new FormData(form);
    const review = document.getElementById("review");

    const fields = [
        ["Full Name", "fullName"],
        ["Email", "email"],
        ["Phone", "phone"],
        ["Date of Birth", "dob"],
        ["Gender", "gender"],
        ["Address", "address"],
        ["Parent Name", "parentName"],
        ["Parent Phone", "parentPhone"],
        ["Parent Email", "parentEmail"],
        ["Relationship", "relationship"],
        ["Class", "className"],
        ["Previous School", "previousSchool"],
        ["Admission Type", "admissionType"]
    ];

    review.innerHTML = "";

    fields.forEach(([label, name]) => {

        const row = document.createElement("p");
        const strong = document.createElement("strong");

        strong.textContent = label + ": ";

        row.appendChild(strong);
        row.appendChild(document.createTextNode(data.get(name) || ""));

        review.appendChild(row);
    });

    const passport = document.getElementById("passport").files[0];

    const photo = document.createElement("p");
    photo.textContent = "Passport: " + passport.name;
    review.appendChild(photo);
}

document.getElementById("passport").addEventListener("change", function() {

    const file = this.files[0];

    if (file && file.type.startsWith("image/")) {
        const preview = document.getElementById("preview");

        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});

form.addEventListener("submit", function(event) {

    event.preventDefault();

    if (!document.getElementById("agree").checked) {
        alert("Please confirm your information.");
        return;
    }

    const applicationNumber =
        "AJIMO" + Date.now().toString().slice(-7);

    document.getElementById("applicationNumber").textContent =
        "Application Number: " + applicationNumber;

    form.style.display = "none";

    document.getElementById("success").style.display = "block";

});

showStep();
