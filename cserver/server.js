let express = require('express');
var cors = require('cors');
let myApp = express();
myApp.use(cors());
let fs = require('fs');
let path = require('path');

var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './cserver/allData/uploads/')
    },
    filename: function (req, file, cb) {
        // console.log(file)
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

let BodyParser = require('body-parser');
myApp.use(BodyParser.json());

let config = require('./config');
let jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

let mongoose = require('mongoose');
let SiteUsers = require('./db/models/users');
let MissingPersons = require('./db/models/missingPersons');

mongoose.connect('mongodb+srv://maliraza:Pakistan123@cluster0.oh3c8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', (err, connection) => {
    console.log(err || connection);
});

// myApp.get('/', function(req, res){
//     res.end('Main')
// });


myApp.delete('/delete_ad', async function (req, res) {


    try {

        await MissingPersons.findByIdAndDelete(req.query.id);

        res.json({
            success: true
        });


    } catch (e) {

        res.status(500).json(e);

    }

});


myApp.post('/post_comment', async function (req, res) {

    try {

        let missingAd = await MissingPersons.findById(req.body.id);

        if (missingAd) {
            delete req.body.id;
            missingAd.comments.push({ ...req.body, date: new Date() });
            await missingAd.save();
        }

        await missingAd.populate('comments.from referenceId').execPopulate();

        res.json(missingAd.comments.pop());

    } catch (e) {

        res.status(500).json(e);

    }

});

myApp.post('/checksession', async function (req, res) {
    var decoded = jwt_decode(req.body.token);
    if (decoded.id) {
        SiteUsers.findOne({ _id: decoded.id }, function (err, docs) {
            res.send(docs);
        });
    }
});

myApp.post('/signup', async function (req, res) {
    let user = new SiteUsers();
    user.name = req.body.name,
        user.email = req.body.email,
        user.password = req.body.password,
        user.contact = req.body.contact,
        await user.save();
    res.json({
        msg: "Nabiha"
    });
});
myApp.post('/login', async function (req, res) {
    let user = await SiteUsers.findOne({ email: req.body.email, password: req.body.password })

    if (user) {
        let userToken = { id: user._id }
        jwt.sign(userToken, config.secret, {
            expiresIn: "6d"
        }, (err, token) => {
            res.json({
                token,
                success: true,
                msg: "User Found",
                _id: user._id,
                name: user.name,
                password: user.password,
                email: user.email,
                contact: user.contact
            })
        });
    } else {
        res.json({
            msg: 'User Not Found'
        })
    }
});

function sendEmail(args) {

    return new Promise((c, e) => {

        var nodemailer = require('nodemailer');
        var smtpTransport = require('nodemailer-smtp-transport');

        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'themissingpersonfsd@gmail.com',
                pass: 'A123456@'
            }
        }));

        var mailOptions = {
            from: 'themissingpersonfsd@gmail.com',
            to: args.to,
            subject: 'Reset Password request',
            text: 'Dear user, we just received a reset password request for your account, Here is your PinCode ' + args.pin
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                e(error);
            } else {
                console.log('Email sent: ' + info.response);
                c(info.response);
            }
        });

    });

}

myApp.post('/update-password', async function (req, res) {

    try {

        await SiteUsers.findOneAndUpdate({ resetCoupon: req.body.coupon }, { password: req.body.password });
        res.json({ success: true });


    } catch (e) {

        res.status(500).json(e);

    }

});

myApp.post('/send_reset_email', async function (req, res) {

    try {

        let pinCode = Date.now().toString().slice(-4);

        let targetUser = await SiteUsers.findOne({ email: req.query.email });

        if (targetUser) {

            await SiteUsers.findOneAndUpdate({ email: req.query.email }, { resetCoupon: pinCode });

            sendEmail({ to: req.query.email, pin: pinCode }).then((resp) => {

                res.json({
                    success: true
                });

            }).catch((error) => {

            });

        }else { 

            res.send(404).json({message:"User not found"})

    }

        } catch (e) {

            res.status(500).json(e);

        }

    })

myApp.post('/postad', upload.single('missingPic'), async function (req, res) {
    try {
        let mpeople = new MissingPersons();
        mpeople.referenceId = req.body.id,
            mpeople.mPersonName = req.body.missingName,
            mpeople.mPersonAge = req.body.missingAge,
            mpeople.mPersonDescription = req.body.missingDescription;

        mpeople.location = {
            latitude: req.body.latitude,
            longitude: req.body.longitude
        };

        mpeople.mPersonPic = req.file.filename;
        await mpeople.save();
        res.json({
            msg: "Nabiha"
        });
    } catch (e) {

        res.send(500).status(e);

    }
});

myApp.post('/cards', async function (req, res) {
    MissingPersons.find({}, function (err, mpeople) {
        res.send(mpeople);
    });
})
myApp.post('/delete', async function (req, res) {
    let user = await MissingPersons.findById(req.body.delPersonId);
    fs.unlink(path.resolve(__dirname + '/alldata/uploads/' + user.mPersonPic), (err) => { })

    MissingPersons.findOneAndDelete({ referenceId: req.body.delId, _id: req.body.delPersonId }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Deleted User : ", docs);
        }
    })

    MissingPersons.find({}, function (err, mpeople) {
        res.send(mpeople);
    });

})
myApp.post('/search', async function (req, res) {
    if (req.body.mPersonName == null) {
        MissingPersons.find({}, function (err, mpeople) {
            res.send(mpeople);
        });
    } else {

        if (req.body.mPersonName) {
            const regex = new RegExp(req.body.mPersonName, 'i')
            MissingPersons.find({ mPersonDescription: regex }, function (err, mpeople) {
                res.send(mpeople);
            });
        } else {
            MissingPersons.find({}, function (err, mpeople) {
                res.send(mpeople);
            });
        }
    }
});
myApp.post('/updatevalues', async function (req, res) {
    MissingPersons.findOne({ _id: req.body.id }, function (err, docs) {
        res.send(docs);
    });

});
myApp.post('/updatead', upload.single('missingPic'), async function (req, res) {
    console.log(req.body);
    let name = req.body.missingName;
    let age = req.body.missingAge;
    let desc = req.body.missingDescription;
    let pic = '';
    if (req.file) {
        pic = req.file.originalname;
    }

    if (name == '') { name = req.body.mPersonName }
    if (age == '') { age = req.body.mPersonAge }
    if (desc == '') { desc = req.body.mPersonDescription }
    if (pic == '') { pic = req.body.mPersonPic }

    let user = await MissingPersons.findById(req.body.id);
    if (req.file && req.file.originalname) {
        if (user.mPersonPic != req.file.originalname) {
            fs.unlink(path.resolve(__dirname + '/alldata/uploads/' + user.mPersonPic), (err) => {

            })
        }
    }

    MissingPersons.findByIdAndUpdate(req.body.id, { mPersonName: name, mPersonAge: age, mPersonDescription: desc, mPersonPic: pic }, function (req, res) {
        console.log('Updated' + res)
    })
    res.json({
        msg: "Nabiha"
    });
});





myApp.post('/detail/:id', async function (req, res) {

    await MissingPersons.findOne({ _id: req.params.id }).populate('referenceId comments.from').exec(function (err, docs) {
        res.send(docs);
    });
})

myApp.use(express.static('./allData/uploads'))
myApp.use(express.static('./build'))

myApp.get('*', (req, res) => res.sendFile(path.resolve('build', 'index.html')));


myApp.listen(process.env.PORT || 5050, function () {
    console.log('Server in Working State')
})