const fs = require('fs');

function getUserDb(){
    const fs = require('fs');
    const user= JSON.parse(fs.readFileSync('./dk/user.json', 'utf8'));
    return user;
}


module.exports = {getUserDb:getUserDb()}