//placed in a folder just to install moment {npm i moment}
const moment =require('moment');//to print the current time install  { npm i moment }

var middlewareVariable = function(req,res,next)
    {
        console.log("+++++++ Middlware says Api transfer successfull +++++++");
        console.log(`Getting few details about the transfer :${req.protocol}://${req.get('host')} ${req.originalUrl}`);
        console.log(`Current date and time :${moment().format()}`)
        next();
    };


    module.exports=middlewareVariable;