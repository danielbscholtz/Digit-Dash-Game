<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link rel="stylesheet" href="styles.css">
    <!-- Tilte Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Pridi:wght@200&display=swap" rel="stylesheet">
    <!-- Other Text Font -->
    <link href="https://fonts.googleapis.com/css2?family=Piazzolla:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="wrapper">
        <!-- Title of the Game -->
        <h1 class="game-title">Alphabet and Digit Dash</h1>

        <!-- Main Container -->
        <div class="main-container">
            <!-- Image Section -->
            <div class="image-container">
                <img src="Image.jpg" alt="Image"/>
            </div>

            <!-- Login & Registration Section -->
            <div class="login-container">
                <!-- Tabs for switching between Login and Register -->
                <div class="tabs">
                    <button class="tab" onclick="showTab('login')">Login</button>
                    <button class="tab" onclick="showTab('register')">Register</button>
                </div>

                <!-- Login Form -->
                <div id="login" class="tabcontent">
                    <h1>Login to Account</h1>
                    <!-- Display Login Error if Any -->
                    <?php if(isset($_GET['loginError'])): ?>
                        <p style='color:red'><?php echo htmlspecialchars($_GET['loginError']); ?></p>
                    <?php endif; ?>
                    <!-- Login Form Elements -->
                    <form id="loginForm" method="post" action="login.php">
                        <input type="text" name="username" placeholder="Username">
                        <div class="password-section">
                            <input type="password" name="password" placeholder="Password">
                            <a href="forgotPassword.php" class="forgot-password-link">Forgot Password?</a>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>

                <!-- Registration Form -->
                <div id="register" class="tabcontent" style="display:none;">
                    <h1>Register Account</h1>
                    <!-- Display Registration Errors Here -->
                    <p id='registerError' style='color:red'></p>
                    <!-- Registration Form Elements -->
                    <form id="registerForm">
                        <input type="text" name="firstName" placeholder="First Name">
                        <input type="text" name="lastName" placeholder="Last Name">
                        <input type="text" name="username" placeholder="Username">
                        <input type="password" name="password" placeholder="Password">
                        <input type="password" name="confirmPassword" placeholder="Confirm Password">
                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
