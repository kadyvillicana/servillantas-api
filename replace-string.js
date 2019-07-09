const fs  = require('fs');
const map = {
  '%node_env%': process.env['node_env'],
  '%node_port%': process.env['node_port'],
  '%db_url%': process.env['db_url'],
  '%db_user%': process.env['db_user'],
  '%db_password%': process.env['db_password'],
  '%email%': process.env['email'],
  '%email_password%': process.env['email_password'],
  '%smtp_host%': process.env['smtp_host'],
  '%smtp_port%': process.env['smtp_port'],
  '%passport_secret%': process.env['passport_secret'],
  '%active_directory_url%': process.env['active_directory_url'],
  '%active_directory_username%': process.env['active_directory_username'],
  '%active_directory_password%': process.env['active_directory_password'],
  '%base_dn%': process.env['base_dn'],
};

validateKeys(map);

fs.readFile('.env', 'utf8', function (err,data) {
  if (err) {
    // eslint-disable-next-line no-console
    return console.log(err);
  }

  var result = replaceAll(data, map);

  fs.writeFile('.env', result, 'utf8', function (err) {
    // eslint-disable-next-line no-console
    if (err) return console.log(err);
  });

});

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

function replaceAll(str, map){
  for(var key in map){
    str = str.replaceAll(key, map[key]);
  }
  return str;
}

function validateKeys(map){
  for(var key in map){
    if(!map[key]){
      throw new Error(key + " is not defined");
    }
  }
}