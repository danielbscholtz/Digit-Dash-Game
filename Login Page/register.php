<?php
// Start a new session or resume the existing one
session_start();

// Set the default timezone to Montreal
date_default_timezone_set('America/Montreal');

// Database connection parameters
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'kidsgames';

// Create a new database connection
$conn = new mysqli($host, $user, $pass, $db);
// Check for connection error and stop execution if any
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve user input from POST request
$firstName = $_POST['firstName'] ?? '';
$lastName = $_POST['lastName'] ?? '';
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';
// Get the current time for registration
$registrationTime = date('Y-m-d H:i:s');

// Initialize an array to collect potential errors
$errors = [];

// Validate input fields
if (empty($firstName) || empty($lastName) || empty($username) || empty($password) || empty($confirmPassword)) {
    $errors[] = 'All fields are required.';
}

if (!preg_match("/^[a-zA-Z]/", $firstName) || !preg_match("/^[a-zA-Z]/", $lastName) || !preg_match("/^[a-zA-Z]/", $username)) {
    $errors[] = 'First Name, Last Name, and Username must start with a letter.';
}

if (strlen($username) < 8 || strlen($password) < 8) {
    $errors[] = 'Username and Password must contain at least 8 characters.';
}

if ($password !== $confirmPassword) {
    $errors[] = 'Passwords do not match.';
}

// Check if the username already exists in the database
$checkUser = $conn->prepare("SELECT id FROM player WHERE userName=?");
$checkUser->bind_param("s", $username);
$checkUser->execute();
$userResult = $checkUser->get_result();
if ($userResult->num_rows > 0) {
    $errors[] = 'Username already exists';
}

// If there are any errors, return them and stop execution
if (!empty($errors)) {
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Hash the user's password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Begin a transaction for inserting user data
$conn->begin_transaction();
try {
    // Insert user details into the player table
    $stmtPlayer = $conn->prepare("INSERT INTO player (fName, lName, userName, registrationTime) VALUES (?, ?, ?, ?)");
    $stmtPlayer->bind_param("ssss", $firstName, $lastName, $username, $registrationTime);
    $stmtPlayer->execute();

    // Get the auto-generated registrationOrder
    $registrationOrder = $conn->insert_id;

    // Insert authentication details into the authenticator table
    $stmtAuth = $conn->prepare("INSERT INTO authenticator (registrationOrder, passCode) VALUES (?, ?)");
    $stmtAuth->bind_param("is", $registrationOrder, $hashed_password);
    $stmtAuth->execute();

    // Commit the transaction
    $conn->commit();
    echo json_encode(['success' => true]);
} catch (mysqli_sql_exception $exception) {
    // Rollback the transaction in case of an exception
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $exception->getMessage()]);
}

// Close the statement and connection
$stmtPlayer->close();
$stmtAuth->close();
$conn->close();
?>