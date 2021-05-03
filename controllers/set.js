const Count = require('../models/counter');

const sett = new Count({
    count: 0
});

sett.save().then(res=>{
    console.log(res);
}).catch(err=> {
    console.log(err);
});