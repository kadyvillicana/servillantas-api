module.exports = function(){
    switch(process.env.NODE_ENV){
      case 'dev':
        return{
          'url': 'mongodb://10.16.0.25:27017/lgt_dev',
          options : {
            useNewUrlParser: true,
            user: 'lgtadmin_usr',
            pass: '6fSLNCCkhvTK'
          }
        }
    default : 
    return{
        'url': 'mongodb://10.16.0.25:27017/lgt_dev',
         options : {
          useNewUrlParser: true,
          user: 'lgtadmin_usr',
          pass: '6fSLNCCkhvTK'
        }
      }
    }
  }