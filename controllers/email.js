 const Email = require('../models/handler');

exports.getIndex = (req,res,next) => {
    res.render('main/index');
};

exports.postIndex = (req,res,next) => { 
    const name = req.body.name;
    const email = req.body.email;

    const itemsToStore = new Email({
        name: name,
        email: email
    });
    itemsToStore.save()
    .then( result => {
        res.redirect('/thankyou');
    }).catch(err=>{
        console.log(err);
    });
};

exports.getThanks = (req,res,next) => {
    res.render('main/thankyou');
};
