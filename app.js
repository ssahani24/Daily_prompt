const express = require('express');
const path = require('path');
const cron = require('node-cron');
const app = express();
const fetch = require("node-fetch");
const mailgun = require("mailgun-js");
const bodyParser = require('body-parser');
const emailRoutes = require('./routes/email');
const mongoose = require('mongoose');
const Email = require('./models/handler');
const errorController  = require('./controllers/error');
app.set('view engine', 'ejs');
app.set('views','views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(emailRoutes);
var port = process.env.PORT || 3000;
//var port = 3000;
const Count = require('./models/counter');

// const sett = new Count({
//     count: 0
// });

// sett.save().then(res=>{
//     console.log(res);
// }).catch(err=> {
//     console.log(err);
// });

app.use(errorController.get404);

cron.schedule('0 10 * * *', () => {
    Email.find().then(res=>{
        let to_list = [];
            for(k in res){
                to_list.push({name: res[k].name ,email: res[k].email });
              }
              return to_list;
        }).then(ress=>{
            Count.find().then(res =>{
                cnt = res[0].count;
            });
            console.log(cnt);
            const api_key = process.env.API_KEY;
            const DOMAIN = process.env.DOMAIN;
            fetch("https://type.fit/api/quotes")
                .then(function(response) {
                    return response.json();
                })
                .then(function(qdata) {
                        let quotee = qdata[cnt].text;
                        let author = qdata[cnt].author;
                        return {quote: quotee, author: author};
                }).then(q =>{
                        for(k in ress){
                            console.log(q.quote);
                            const mg = mailgun({apiKey: api_key, domain: DOMAIN});
                            const data = {
                            from: process.env.EMAIL,
                            to: ress[k].email,
                            subject: 'Daily News letter',
                            text: 'This is your sign to get going today!',
                            template: "first", //Instead of 'html'
                            'v:name': ress[k].name,
                            'v:quote': JSON.stringify(q.quote),
                            'v:author': JSON.stringify(q.author)
                            };
                    
                            mg.messages().send(data, function (error, body) {
                                if(error){
                                    console.log(error);
                                }
                                console.log(body);
                            });
                            }
                            cnt++;
                            const tmp = new Count({
                                count: cnt
                            });
                            tmp.save().catch(err=>{
                                console.log(err);
                            });
                            if(cnt>1400){
                                cnt = 0;
                            }
                        });
        }).catch(err=>{
            console.log(err);
        })
  }, {
    scheduled: true,
    timezone: "America/New_York"
  });


mongoose
    .connect(process.env.MOONGO)
    .then(app.listen(port))
    .catch(err => {
        console.log(err);
    });