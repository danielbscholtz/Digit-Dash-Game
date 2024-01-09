// Function to switch between the 'Login' and 'Register' tabs
function showTab(tabName) {
    // Get all elements with class "tabcontent" and hide them
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class "tab" and remove the class "active"
    var tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    for (i = 0; i < tablinks.length; i++) {
        if (tablinks[i].textContent.toLowerCase() === tabName) {
            tablinks[i].className += " active";
        }
    }
}

// Function to set up field validation
function setupValidation() {
    // Fields that need validation
    const fieldsToValidate = ['firstName', 'lastName', 'username'];
    fieldsToValidate.forEach(fieldName => {
        validateField(fieldName, 'Must start with a letter a-z or A-Z');
    });
}

// Function to validate a specific field
function validateField(fieldName, errorMessage) {
    // Find the input field by its name
    const field = document.querySelector(`input[name="${fieldName}"]`);
    if (!field) {
        return;
    }

    // Create a span element to display error message
    const errorDisplay = document.createElement('span');
    errorDisplay.style.color = 'red';
    errorDisplay.style.fontSize = '0.8em';
    field.parentNode.insertBefore(errorDisplay, field.nextSibling);

    // Add keyup event listener to validate field in real-time
    field.addEventListener('keyup', function() {
        // Create an XMLHttpRequest to send data to 'validateField.php'
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'validateField.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            // Parse and display validation result
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                const response = JSON.parse(this.responseText);
                errorDisplay.textContent = response.valid ? '' : errorMessage;
            }
        };
        xhr.send(`field=${fieldName}&value=${encodeURIComponent(field.value)}`);
    });
}

// Event listener for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function() {
    // Initially display the login tab
    showTab('login');

    // Setup field validation
    setupValidation();

    // Add event listener for form submission
    document.getElementById("registerForm").addEventListener("submit", function(e) {
        e.preventDefault();

        // Create FormData object from form
        var formData = new FormData(this);

        // Send the form data to 'register.php'
        fetch('register.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response
            if (data.success) {
                // Redirect to login page on successful registration
                window.location.href = "index.php?registerSuccess=Account created successfully, please log in.";
            } else {
                // Display error messages
                document.getElementById('registerError').innerText = data.errors.join("\n");
                showTab('register');
            }
        });
    });
});