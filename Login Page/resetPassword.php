<?php
// Database connection
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'kidsgames';

// Create a new MySQLi connection
$conn = new mysqli($host, $user, $pass, $db);

// Check if connection was successful, otherwise end the script
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve user input
$username = $_POST['username'] ?? '';
$newPassword = $_POST['newPassword'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';

// Check if the new passwords match
if ($newPassword !== $confirmPassword) {
    die("Passwords do not match.");
}

// Check if the user exists and get their registrationOrder
$stmt = $conn->prepare("SELECT registrationOrder FROM player WHERE userName = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Username not found.");
}

$row = $result->fetch_assoc();
$registrationOrder = $row['registrationOrder'];

// Hash the new password
$hashed_password = password_hash($newPassword, PASSWORD_DEFAULT);

// Update the password in the database
$updateStmt = $conn->prepare("UPDATE authenticator SET passCode = ? WHERE registrationOrder = ?");
$updateStmt->bind_param("si", $hashed_password, $registrationOrder);
$updateStmt->execute();

// Redirect to login page or show a success message
header("Location: index.php?loginError=Password updated successfully. Please login.");

// Close the statements and connection
$stmt->close();
$updateStmt->close();
$conn->close();
?>
