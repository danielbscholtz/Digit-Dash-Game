// Function to start a timeout for user inactivity
function startTimeout() {
    const timeoutDuration = 15 * 60 * 1000; // Set timeout for 15 minutes
    let timeout = setTimeout(() => window.location.href = '../Game Page/game.php?logout=1', timeoutDuration);

    // Reset the timeout on mouse movement or keypress
    document.onmousemove = resetTimeout;
    document.onkeypress = resetTimeout;

    function resetTimeout() {
        clearTimeout(timeout); // Clear the current timeout
        timeout = setTimeout(() => window.location.href = '../Game Page/game.php?logout=1', timeoutDuration); // Restart the timeout
    }
}

// Function to open the user profile popup
function openPopup() {
    document.getElementById("profilePopup").style.display = "block";
}

// Function to close the user profile popup
function closePopup() {
    document.getElementById("profilePopup").style.display = "none";
}

// Function to display an error message in the user profile form
function displayProfileError(message) {
    const profileForm = document.getElementById('profileForm');
    let errorContainer = profileForm.querySelector('.error-message');
    if (!errorContainer) {
        errorContainer = document.createElement('p');
        errorContainer.className = 'error-message';
        errorContainer.style.color = 'red';
        profileForm.insertBefore(errorContainer, profileForm.firstChild); // Insert the error message at the top of the form
    }
    errorContainer.innerText = message; // Set the error message text
}

// Function to handle password update
function updatePassword() {
    const newPassword = document.querySelector('#profileForm [name="newPassword"]').value;
    const confirmPassword = document.querySelector('#profileForm [name="confirmPassword"]').value;

    // Validate password and display error if necessary
    if (newPassword !== confirmPassword) {
        displayProfileError('Passwords do not match.');
        return;
    } else if (newPassword.length < 8) {
        displayProfileError('Password must contain at least 8 characters.');
        return;
    }

    // Prepare form data for POST request
    const formData = new FormData();
    formData.append('newPassword', newPassword);

    // Send POST request to change password
    fetch('changePassword.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Handle response from server
        if (data.success) {
            alert('Password changed successfully');
            closePopup();
        } else {
            displayProfileError(data.error || 'An error occurred');
        }
    })
    .catch(error => {
        displayProfileError('An error occurred while updating the password.');
    });
}

// Initialize the timeout function when the window loads
window.onload = startTimeout;