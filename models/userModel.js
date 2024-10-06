const fs = require('fs');
const path = require('path');

// Define the path to the users JSON file
const usersFilePath = path.join(__dirname, '../data/users.json');

class User {
    constructor(id, username, email, password) {
        this.id = id; // "this" assigns the parameters into the properties
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static findUserById(id) {
        const users = User.getAllUsers();
        return users.find(user => user.id === id);
    }

    static getAllUsers() {
        try {
            const usersData = fs.readFileSync(usersFilePath, 'utf-8');
            return JSON.parse(usersData);
        } catch (error) {
            console.error('Error reading users file:', error);
            return []; // Return an empty array in case of error
        }
    }

    static createUser(newUser) {
        try {
            const users = User.getAllUsers();
            users.push(newUser);
            fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        } catch (error) {
            console.error('Error saving user:', error);
            throw new Error('Could not save user.');
        }
    }
}

module.exports = User;