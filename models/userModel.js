const fs = require ('fs');
const path = require ('path');
                                                        // Current file, source file
const usersFilePath = path.join (__dirname, '../data/users.json');

class User {
    constructor (id, username, email, password) {       // given the entity as parameters
        this.id = id;                                   // "this" assigns the parameters into the properties
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static findUserById(id) {
        const users = User.getAllUsers();               // Get all users from JSON
        return users.find(user => user.id === id);      // Map until equal to user with ID 
    }                                                   // Otherwise, undefined

    static getAllUsers() {                              // Read the users.json file and parse the data into JavaScript objects
        const usersData = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(usersData);
    }

    static createUser(newUser) {                        // To create new user
        const users = User.getAllUsers();               // Get current users
        users.push(newUser);                            // Add new user to the array
                                                        // Save the updated users array to the users.json file
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    }
}