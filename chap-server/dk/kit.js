const fs = require('fs');

function getUserDb(){
    const fs = require('fs');
    const user= JSON.parse(fs.readFileSync('./dk/user.json', 'utf8'));
    console.log('user db: ', user);
    return user;
}


module.exports = {getUserDb:getUserDb()}