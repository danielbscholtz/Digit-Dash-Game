// Function to save the game result
function saveGameResult(result, livesUsed = 0) {
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    // Open a POST request to the 'saveGameResult.php' file
    xhr.open("POST", "saveGameResult.php", true);
    // Set the request header for form data
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // Define what happens on state change of the request
    xhr.onreadystatechange = function() {
        // Check if the request is complete and successful
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                console.log("Game result saved:", this.responseText);
            } else {
                console.error("Failed to save game result:", this.status, this.responseText);
            }
        }
    };

    // Send the request with game result data
    xhr.send(`result=${encodeURIComponent(result)}&livesUsed=${encodeURIComponent(livesUsed)}`);
}

// Event listener for game over
document.addEventListener('gameOver', function() {
    // Save the game result as 'gameover' with the number of lives used
    saveGameResult("gameover", calculateLivesUsed());
});

// Event listener for game win
document.addEventListener('gameWin', function() {
    // Save the game result as 'win' with the number of lives used
    saveGameResult("win", calculateLivesUsed());
});

// Event listener for incomplete game
document.addEventListener('gameIncomplete', function() {
    // Save the game result as 'incomplete' with the number of lives used
    saveGameResult("incomplete", calculateLivesUsed());
});

// Function to calculate the number of lives used in the game
function calculateLivesUsed() {
    // Subtract the current number of lives from the total given at the start (6)
    return 6 - lives;
}