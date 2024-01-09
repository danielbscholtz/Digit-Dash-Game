// Add an event listener to document object that calls 'openHistoryPopup' function when the DOM content is fully loaded.
document.addEventListener('DOMContentLoaded', openHistoryPopup);

// Function to open the history popup and display the game history data.
function openHistoryPopup() {
    // Retrieve game history data from a global variable, or use an empty array if it's not set.
    const data = window.gameHistoryData || [];

    // Call function to display the game history data in the table.
    displayGameHistory(data);
}

// Function to populate the game history table with data.
function displayGameHistory(data) {
    // Get the table body element where game history will be displayed.
    const tableBody = document.getElementById('historyTableBody');

    // Clear any existing content in the table body.
    tableBody.innerHTML = '';

    // Iterate over each row of game history data.
    data.forEach(row => {
        // Create a new table row element.
        const tr = document.createElement('tr');

        // Set the inner HTML of the row with game history data.
        tr.innerHTML = `
            <td>${row.id}</td>
            <td>${row.fName}</td>
            <td>${row.lName}</td>
            <td>${row.outcome}</td>
            <td>${row.livesUsed}</td>
            <td>${row.scoreTime}</td>
        `;

        // Append the new row to the table body.
        tableBody.appendChild(tr);
    });
}

// Function to close the history popup.
function closeHistoryPopup() {
    // Hide the history popup by setting its style to 'none'.
    document.getElementById('historyPopup').style.display = 'none';
}