<?php
// Start the session to access session variables
session_start();

// Check if the user is logged in, using the 'userData' session variable
if (!isset($_SESSION['userData'])) {
    // Return a JSON response indicating failure if the user is not logged in
    echo json_encode(['success' => false, 'error' => 'User not logged in']);
    exit;
}

// Database connection parameters
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'kidsgames';

// Create a new connection to the MySQL database
$conn = new mysqli($host, $user, $pass, $db);
// Check for a connection error and return a JSON error message if there is one
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection error']);
    exit;
}

// Retrieve the new password from the POST request
$newPassword = $_POST['newPassword'] ?? '';
// Validate the length of the new password
if (strlen($newPassword) < 8) {
    // Return a JSON response if the password is too short
    echo json_encode(['success' => false, 'error' => 'Password must contain at least 8 characters']);
    exit;
}

// Retrieve the user ID from the session variable
$userId = $_SESSION['userData']['id'];
// Hash the new password for secure storage
$hashed_password = password_hash($newPassword, PASSWORD_DEFAULT);

// Simplified SQL query to update the password in the database
$query = "UPDATE authenticator, player 
          SET authenticator.passCode = ? 
          WHERE authenticator.registrationOrder = player.registrationOrder 
          AND player.id = ?";

// Prepare the SQL query
$stmt = $conn->prepare($query);
// Check if the statement preparation was successful
if (!$stmt) {
    // Return a JSON response if the statement preparation failed
    echo json_encode(['success' => false, 'error' => 'Failed to prepare statement']);
    exit;
}

// Bind the parameters (hashed password and user ID) to the prepared statement
$stmt->bind_param("si", $hashed_password, $userId);
// Execute the statement and check for errors
if (!$stmt->execute()) {
    // Return a JSON response if the password update failed
    echo json_encode(['success' => false, 'error' => 'Failed to update password']);
    exit;
}

// Close the statement and the database connection
$stmt->close();
$conn->close();

// Return a successful JSON response
echo json_encode(['success' => true]);
?>