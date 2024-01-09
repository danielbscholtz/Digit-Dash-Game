<?php
// Retrieve 'field' and 'value' from POST request; use empty string as default if not set
$field = $_POST['field'] ?? '';
$value = $_POST['value'] ?? '';

// Initialize a response array with 'valid' key set to true
$response = ['valid' => true];

// Check if the field is one of 'firstName', 'lastName', or 'username'
if (in_array($field, ['firstName', 'lastName', 'username'])) {
    // Validate that the value starts with a letter (a-z or A-Z)
    if (!preg_match("/^[a-zA-Z]/", $value)) {
        // If validation fails, set 'valid' key to false
        $response['valid'] = false;
    }
}

// Encode the response array into JSON format and output it
echo json_encode($response);
?>