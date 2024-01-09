<?php
// Database connection parameters
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'kidsgames';

// Create a new MySQLi connection
$conn = new mysqli($host, $user, $pass, $db);

// Check if connection was successful, otherwise end the script with an error message
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to select game history data
$query = "SELECT player.registrationOrder as id, player.fName, player.lName, score.result as outcome, score.livesUsed, score.scoreTime FROM player JOIN score ON player.registrationOrder = score.registrationOrder";

// Execute the query and store the result
$result = $conn->query($query);

// Check for a query error
if (!$result) {
    die("Error: " . $conn->error);
}

// Initialize an array to store the history data
$history = [];

// Fetch each row from the query result and add it to the history array
while ($row = $result->fetch_assoc()) {
    $history[] = $row;
}

// Close the database connection
$conn->close();

// Output the history data as a JavaScript variable
echo "<script>window.gameHistoryData = " . json_encode($history) . ";</script>";
?>

<!DOCTYPE html>
<html>
<head>
    <title>Game History</title>
    <link rel="stylesheet" href="game-history.css">
    <!-- Text Font -->
    <link href="https://fonts.googleapis.com/css2?family=Piazzolla:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="history-container">
        <h2>Game History</h2>
        <table>
            <thead>
                <tr>
                    <th>Player ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Outcome</th>
                    <th>Lives Used</th>
                    <th>Date/Time</th>
                </tr>
            </thead>
            <tbody id="historyTableBody"></tbody>
        </table>
        <a href="../Game Page/game.php" class="btn back-btn">Back</a>
    </div>
    <script src="game-history.js"></script>
</body>
</html>