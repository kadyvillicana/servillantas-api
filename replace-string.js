const fs  = require('fs');
const map = {
    '%node_env%' : process.env['node_env'],
    '%node_port%' : process.env['node_port'],
    '%db_url%' : process.env['db_url'],
    '%db_user%' : process.env['db_user'],
    '%db_password%' : process.env['db_password'],
    '%session%' : process.env['express_session'],
    '%email%' : process.env['email'],
    '%email_password%' : process.env['email_password'],
    '%smtp_host%' : process.env['smtp_host'],
    '%smtp_port%' : process.env['smtp_port']
};

validateKeys(map);

fs.readFile('.env', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var result = replaceAll(data, map);

  fs.writeFile('.env', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });

});

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

function replaceAll(str, map){
  for(key in map){
    str = str.replaceAll(key, map[key]);
  }
  return str;
}

function validateKeys(map){
  for(key in map){
      if(!map[key]){
        throw new Error(key + " is not defined");
      }
  }
}