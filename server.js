const bcrypt = require('bcrypt');

// Registration logic
async function registerUser(user) {
    user.password = await bcrypt.hash(user.password, 10); // Hash the password before saving
    // Save user to the database
}

// Login logic
async function loginUser(plaintextPassword, user) {
    const isMatch = await bcrypt.compare(plaintextPassword, user.password); // Compare hashed passwords
    if (isMatch) {
        // Proceed with login
    } else {
        // Handle incorrect password
    }
}