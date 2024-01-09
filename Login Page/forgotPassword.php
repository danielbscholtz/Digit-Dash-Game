<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <link rel="stylesheet" href="fPassword.css">
</head>
<body>
    <div class="wrapper">
        <div class="main-container">
            <div class="password-reset-container">
                <h1>Reset Password</h1>
                <form method="post" action="resetPassword.php">
                    <input type="text" name="username" placeholder="Username" required>
                    <input type="password" name="newPassword" placeholder="New Password" required>
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" required>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
        <a href="index.php" class="back-button">Back</a>
    </div>
</body>
</html>
