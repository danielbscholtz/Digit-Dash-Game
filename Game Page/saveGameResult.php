<?php
// Start a new or resume the existing session
session_start();

// Set the default timezone for all date/time functions
date_default_timezone_set('America/Montreal');

// Database connection parameters
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'kidsgames';

// Create a new MySQLi connection
$conn = new mysqli($host, $user, $pass, $db);

// Check if connection was successful, otherwise terminate the script
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if 'result' is set in POST request and user is logged in
if (isset($_POST['result']) && isset($_SESSION['userData']) && isset($_SESSION['userData']['registrationOrder'])) {
    // Retrieve the required data
    $result = $_POST['result'];
    $registrationOrder = $_SESSION['userData']['registrationOrder'];
    $livesUsed = isset($_POST['livesUsed']) ? (int)$_POST['livesUsed'] : 0;
    $currentTimestamp = date('Y-m-d H:i:s');

    // SQL to insert the data
    $stmt = $conn->prepare("INSERT INTO score (result, registrationOrder, scoreTime, livesUsed) VALUES (?, ?, ?, ?)");
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("sisi", $result, $registrationOrder, $currentTimestamp, $livesUsed);

    if ($stmt->execute()) {
        echo "Game result recorded successfully.";
    } else {
        echo "Error recording game result: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Invalid request or user not logged in.";
}

$conn->close();
?>