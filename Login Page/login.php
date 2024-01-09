<?php
// Start a new session or resume the existing session
session_start();

// Database connection parameters
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

// Retrieve username and password from POST request
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// Redirect back if username or password is missing
if (empty($username) || empty($password)) {
    header("Location: index.php?loginError=Please enter username and password");
    exit;
}

// Prepare a SQL statement to fetch user data
$stmt = $conn->prepare("SELECT player.id, player.fName, player.lName, player.userName, player.registrationOrder, authenticator.passCode FROM player JOIN authenticator ON player.registrationOrder = authenticator.registrationOrder WHERE player.userName = ?");
if (!$stmt) {
    // Handle error for failed statement preparation
    die("Error preparing statement: " . $conn->error);
}

// Bind parameters and execute the SQL query
$stmt->bind_param("s", $username);
if (!$stmt->execute()) {
    // Handle error for failed execution
    die("Error executing statement: " . $stmt->error);
}

$result = $stmt->get_result();

// Check if the query returned any rows
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    // Verify the password
    if (password_verify($password, $row['passCode'])) {
        // Store user data in session variable
        $_SESSION['userData'] = [
            'id' => $row['id'],
            'firstName' => $row['fName'],
            'lastName' => $row['lName'],
            'username' => $row['userName'],
            'registrationOrder' => $row['registrationOrder']
        ];
        // Redirect to game page
        header("Location: ../Game Page/game.php");
        exit;
    } else {
        // Redirect back with error for invalid credentials
        header("Location: index.php?loginError=Invalid username or password");
        exit;
    }
} else {
    // Redirect back with error for invalid credentials
    header("Location: index.php?loginError=Invalid username or password");
    exit;
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>