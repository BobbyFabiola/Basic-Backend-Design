const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

class User {
    constructor(id, username, email, password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static findUserById(id) {
        const users = User.getAllUsers();
        return users.find(user => user.id === id);
    }

    static getAllUsers() {                                                      // Read the user data from the JSON file
        try {
            const usersData = fs.readFileSync(usersFilePath, 'utf-8');
            return JSON.parse(usersData);
        } catch (error) {
            console.error('Error reading users file:', error);
            return [];                                                          // Return an empty array in case of error
        }
    }

    static createUser(newUser) {
        try {
            const users = User.getAllUsers();

            const lastUser = users[users.length - 1];                           // Determine the next available ID (auto-increment)
            const newId = lastUser ? lastUser.id + 1 : 1;                       // If no users exist, start at ID 1
            newUser.id = newId;                                                 // Assign the new ID

            users.push(newUser);
            fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
            
        } catch (error) {
            console.error('Error saving user:', error);
            throw new Error('Could not save user.');
        }
    }
}

module.exports = User;