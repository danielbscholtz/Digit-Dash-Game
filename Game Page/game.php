<?php
// Start a new session or resume the existing session
session_start();

// Check if user data is stored in the session and assign it to a variable
if (isset($_SESSION['userData'])) {
    $userData = $_SESSION['userData'];
}

// Check if a logout request has been made
if (isset($_GET['logout']) && $_GET['logout'] == '1') {
    // Destroy the current session to log out the user
    session_destroy();
    // Redirect the user to the login page
    header('Location: ../Login Page/index.php');
    exit; // Terminate the script execution
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Game Page</title>
    <link rel="stylesheet" href="game-styles.css">
    <!-- Text Font -->
    <link href="https://fonts.googleapis.com/css2?family=Piazzolla:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
        <div class="dropdown">
            <!-- Dropdown button for menu options -->
            <button class="dropbtn">Menu</button>
            <!-- Dropdown content links -->
            <div class="dropdown-content">
                <a href="#" onclick="openPopup()">Profile</a> <!-- Link to open the profile popup -->
                <a href="../Game History/game-history.php">Game History</a> <!-- Link to the game history page -->
                <a href="../Game Page/game.php?logout=1">Logout</a> <!-- Link to log out the user -->
            </div>
        </div>
    </nav>

    <!-- User profile popup section -->
    <div id="profilePopup" class="popup">
        <div class="popup-content">
            <span class="closeBtn" onclick="closePopup()">&times;</span> <!-- Button to close the popup -->
            <h2>User Profile</h2> <!-- Popup heading -->
            <!-- Displaying user information -->
            <div class="user-info">
                <p>First Name: <span id="profileFirstName"><?php echo htmlspecialchars($userData['firstName']); ?></span></p>
                <p>Last Name: <span id="profileLastName"><?php echo htmlspecialchars($userData['lastName']); ?></span></p>
                <p>Username: <span id="profileUsername"><?php echo htmlspecialchars($userData['username']); ?></span></p>
            </div>
            <!-- Form to update user password -->
            <form id="profileForm" class="profile-form">
                <input type="password" name="newPassword" placeholder="New Password">
                <input type="password" name="confirmPassword" placeholder="Confirm New Password">
                <button type="button" class="btn" onclick="updatePassword()">Set New Password</button>
            </form>
        </div>
    </div>

    <!-- Main game container -->
    <div class="game-container">
        <div class="left-area">
            <div id="livesContainer"></div> <!-- Container to display lives -->
            <h1 class="game-title">Alphabet and Digit Dash</h1>
            <button id="startButton" onclick="startCountdown()">Start Game</button> <!-- Button to start the game -->
            <div id="countdown">5</div> <!-- Countdown display before the game starts -->
            <div id="gameArea">
                <!-- Game area where the game will be played -->
            </div>
        </div>
    </div>

    <!-- Linking JavaScript files for game logic and functionality -->
    <script src="game-script.js"></script>
    <script src="game-logic.js"></script>
    <script src="saveGameResult.js"></script>

</body>
</html>