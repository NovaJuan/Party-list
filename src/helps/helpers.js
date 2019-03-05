const helpers = {};

helpers.randomizer = () =>{
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var randomName = '';
    for(var i = 0;i < 6;i++){
         randomName += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randomName;
}

module.exports = helpers;