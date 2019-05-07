module.exports = function(){
    switch(process.env.NODE_ENV){
      case 'dev':
        return{
          'url': process.env.DB_URL, //mongodb://10.16.0.25:27017/db_lgtdev
          options : {
            useNewUrlParser: true,
            user: process.env.DB_USER,  //'usr_lgtdev',
            pass: process.env.DB_PASSWORD //'6fSLNCCkhvTK'
          }
        }
    }
  }