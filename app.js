const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const fs = require('fs');
const nocache = require('nocache');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
//const User = require('./models/User');

//MongoDB database setup:-
const { MongoClient, ObjectId } = require('mongodb');
const { ObjectID } = require('mongodb');
const { reset } = require('nodemon');
const { connect } = require('http2');

const oneDay = 1000 * 60 * 60 * 24;

//Secret for Token generation:-
const secret = 'ThisisMyGreatestSecret,I am AlsafaTheDoctorAndProgrammer';

const url = 'mongodb+srv://alsafaDB:NoMoreWars96@cluster0.f6iy4.mongodb.net/alsafaDB?retryWrites=true&w=majority';
const client = new MongoClient(url);

//Database for Dishes:-
const dbName = 'ordersDB';
const dbRecords = 'recordsDB';
//Database for Contacts:-
const dbContact = 'contactsDB';

//Database for dishes:-
const dbDishes = 'dishesDB';

//Database for users:-
const dbUsers = 'usersDB';

async function initUsersDB() {
    await client.connect();
    const db = client.db(dbUsers);
    const usersCollection = db.collection('Users');
    const adminPassword = bcrypt.hashSync('loveAndHonor', 10);
    const insertNewUser = await usersCollection.insertOne({ 'admin_user_email': 'alsafa_thaar@yahoo.com', 'admin_password': adminPassword });
}

initUsersDB();

async function main(orderName, orderPrice, yourName, yourAddress, yourPhoneNumber) {
    await client.connect();
    console.log('Connected successfully to the server!');
    const db = client.db(dbName);
    const dbR = client.db(dbRecords);
    //Getting the time or our requres:-
    const date_time = new Date();
    const hours = date_time.getHours();
    const minutes = date_time.getMinutes();
    const seconds = date_time.getSeconds();
    const day = date_time.getDate();
    let month = date_time.getMonth();
    month = month + 1;
    const year = date_time.getFullYear();
    const currentDate = day + '/' + month + '/' + year;
    const currentTime = hours + ':' + minutes + ':' + seconds;
    const collection = db.collection('Documents');
    const recordsCollection = dbR.collection('Records');
    const insertResult = await collection.insertOne({ 'orderName': orderName, 'orderPrice': orderPrice, 'customerName': yourName, 'customerAddress': yourAddress, 'phoneNumber': yourPhoneNumber, 'requestTime': currentTime });
    const insertedRecord = await recordsCollection.insertOne({ 'orderName': orderName, 'orderPrice': orderPrice, 'customerName': yourName, 'customerAddress': yourAddress, 'phoneNumber': yourPhoneNumber, 'requestTime': currentTime, 'requestDate': currentDate });

    return 'Done.';
}

async function deleteDayOrders() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('Documents');
    let del = await collection.deleteMany({});
}

let previousHour = 0, currentHour;
setInterval(() => {
    const date_time = new Date();
    currentHour = date_time.getHours();
    if (currentHour === 0 && previousHour > 0) {
        deleteDayOrders().then(console.log)
            .catch(console.error);
    }
    previousHour = currentHour;

}, 1000);

async function contactUs(yourName, yourEmail, yourPhoneNumber, message) {
    await client.connect();
    console.log('Connected successfully to the server for Contacts!');
    const dbC = client.db(dbContact);
    const collectionContact = dbC.collection('Contacts');
    const insertContact = await collectionContact.insertOne({ 'Name:- ': yourName, 'Email:- ': yourEmail, 'Phone Number:- ': yourPhoneNumber, 'message:- ': message });
    const findContact = await collectionContact.find({}).toArray();
    console.log('Inserted Contact:- ', insertContact);
    console.log('Found Contact:- ', findContact);
    return 'Contact Received!';
}

async function addOrEditDish(cardId, dishImg, imgName, dishName, dishDesc, dishPrice, newImageName, newDishImg, newDishName, newDishDescription, newDishPrice) {
    await client.connect();
    const dbDsh = client.db(dbDishes);
    const collectionDishes = dbDsh.collection('Dishes');
    if (!cardId) {
        const newDish = await collectionDishes.insertOne({ 'dishName': dishName, 'dishImage': imgName, 'dishDescription': dishDesc, 'dishPrice': dishPrice });
        if (imgName !== 'empty.jpg') {
            fs.writeFile('./public/src/img/dishes/' + imgName, Buffer.from(dishImg, 'base64'), (error) => {

            })
        }
    }
    else if (cardId) {
        console.log(newDishName, newImageName, newDishDescription, newDishPrice);
        const query = { _id: ObjectID(cardId.trim()) };
        const replacement = [{ '$set': { 'dishName': newDishName, 'dishImage': newImageName, 'dishDescription': newDishDescription, 'dishPrice': newDishPrice } }];
        const options = { 'returnNewDocument': true };
        let replacementDocument = await collectionDishes.findOneAndUpdate(query, replacement, options).then(replacedDocument => {
            if (replacedDocument) {
                fs.writeFile('./public/src/img/dishes/' + newImageName, Buffer.from(newDishImg, 'base64'), (error) => {

                })
                console.log('Successfully updated the menu.');
            }
            else {
                console.log('Couldn"t find the speciefied document.');
            }
        })
            .catch(err => {
                console.log(err);
            })
    }
}


async function loadDishes() {
    //await client.connect();
    await client.connect();
    const dbDsh = client.db(dbDishes);
    const collectionDishes = dbDsh.collection('Dishes');
    const allDishes = await collectionDishes.find({}).toArray();
    //let del = await collectionDishes.deleteMany({});
    return allDishes;
}

//Loading today Orders:-
async function todayOrders() {
    await client.connect();
    const dbTOrders = client.db(dbName);
    const collectionTOrders = dbTOrders.collection('Documents');
    const todayOrders = await collectionTOrders.find({}).toArray();
    return todayOrders;
}

//Loading all the records:-
async function loadRecords() {
    await client.connect();
    const dbRecrds = client.db(dbRecords);
    const recCollection = dbRecrds.collection('Records');
    const allRecords = await recCollection.find({}).toArray();
    console.log(allRecords);
    return allRecords;
}

async function checkIfEmailExists(email) {
    return new Promise((resolved, reject) => {
        client.connect();
        const db = client.db(dbUsers);
        const usersCollection = db.collection('Users');
        let user = usersCollection.findOne({ 'admin_user_email': email });
        if (!user) {
            resolved('No user exists!');
        }
        else {
            resolved(user);
        }
    })
}

//Checking if Id exists:-

async function checkIfIDValid(userId) {
    return new Promise((resolved, reject) => {
        client.connect();
        const db = client.db(dbUsers);
        const usersCollection = db.collection('Users');
        let user = usersCollection.findOne({ '_id': ObjectID(userId) });
        if (!user) {
            resolved('No user exists');
        }
        else {
            resolved(user);
        }
    })
}

function generateAccessToken(emailAddress) {
    return jwt.sign(emailAddress, secret, { expiresIn: 10800 });
}

//Remove Dishes:-
async function removeDish(dishId) {
    await client.connect();
    const dbDsh = client.db(dbDishes);
    const collectionDishes = dbDsh.collection('Dishes');
    const deletedDish = await collectionDishes.findOneAndDelete({ _id: ObjectID(dishId.trim()) }).then(deletedDish => {
        if (deletedDish) {
            console.log('successfully deleted the dish');
        }
        else {
            console.log('An Error has Occured! Please try again later!');
        }
    })
        .catch(err => {
            console.log(err);
        })
}


const app = express();

app.use(session({
    secret: 'thisismysecretkeyprogram',
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}))

//Variable to store session:-
var newSession;

app.use(nocache());
app.use(express.static('./public'));

app.use(bodyParser.urlencoded({ 'limit': '50mb', extended: true }));
app.use(bodyParser.json({ 'limit': '50mb' }));

app.use(cookieParser());

app.get('/', (req, res) => {
    newSession = req.session;
})

app.get('/controlPanel', (req, res) => {
    res.set('Cache-Control', 'no-store');
    /*if (req.cookies.userEmail) {
        res.status(200).sendFile(__dirname + '/public/control-panel.html');
    }*/
    if (req.session.userid) {
        res.status(200).sendFile(__dirname + '/public/control-panel.html');
    }
    else {
        res.redirect('/login');
    }
})

app.get('/login', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/admin-login.html');
})

app.get('/logout', (req, res) => {
    res.clearCookie();
    req.session.destroy();
    res.status(200).sendFile(__dirname + '/public/admin-login.html');
})

app.post('/form', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/dishes.html');
})


app.post('/order_done', (req, res) => {
    let orderName = req.body.order_name;
    let orderPrice = req.body.order_price;
    let yourName = req.body.your_name;
    let yourAddress = req.body.address;
    let yourPhoneNumber = req.body.phone_number;
    if (!orderName || !orderPrice || !yourName || !yourAddress || !yourPhoneNumber) {
        res.status(200).send('Please Complete your order First!');
        return;
    }
    else {
        main(orderName, orderPrice, yourName, yourAddress, yourPhoneNumber).then(console.log)
            .catch(console.error)
            .finally(() => client.close());
        res.status(200).sendFile(__dirname + '/public/order_done.html');
    }

})

app.get('/dishes', (req, res) => {
    let allDishesResult = loadDishes().then(result => {
        res.status(200).send({ arr: result });
        //res.status(200).end();
        return;
    })
        .catch(console.error)
        .finally(() => client.close());
})

app.get('/todayOrders', (req, res) => {
    let allTodayOrders = todayOrders().then(result => {
        res.status(200).send({ arr: result });
        return;
    })
        .catch(console.error)
        .finally(() => client.close());
})

app.get('/allRecords', (req, res) => {
    let recordsList = loadRecords().then(result => {
        if (req.session.userid) {
            res.status(200).send({ arr: result });
            return;
        }
        else {
            res.redirect('/login');
        }

    })
        .catch(console.error)
        .finally(() => client.close());
})

app.post('/contact', (req, res) => {
    let yourName = req.body.name;
    let yourEmail = req.body.email;
    let yourPhoneNumber = req.body.phoneNumber;
    let message = req.body.message;

    if (!yourName || !yourEmail || !yourPhoneNumber || !message) {
        res.status(200).send('Please Fill the contact form first!');
        return;
    }
    else {
        contactUs(yourName, yourEmail, yourPhoneNumber, message).then(console.log)
            .catch(console.error)
            .finally(() => client.close());

        //Preparing the nodemailer to send email to the restaurant email address:-
        let transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 587,
            service: 'yahoo',
            secure: false,
            auth: {
                user: 'alsafa_thaar@yahoo.com',
                pass: 'imjctebmgzgylwxg'
            },
            debug: false,
            logger: true
        });

        let mailOptions = {
            from: 'alsafa_thaar@yahoo.com',
            to: 'tiaoronaitec@yahoo.com',
            subject: 'Customer Contact',
            text: `Sender Email: ${yourEmail} ${message}`
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }

            else {
                console.log('Email Sent' + info.response);
                res.status(200).sendFile(__dirname + '/public/contactReceived.html');
            }
        })
    }

})

app.post('/reset', (req, res) => {
    let email = req.body.email;
    if (!email) {
        res.status(200).send('Please Enter your email!');
    }
    else {
        let email = req.body.email.trim();

        //Checking if the current email exist:-
        checkIfEmailExists(email)
            .then(data => {
                if (!data) {
                    res.status(200).send('This Email does not exist!');
                }
                else {
                    let token = generateAccessToken({ 'email': email });
                    let transporter = nodemailer.createTransport({
                        host: 'smtp.mail.yahoo.com',
                        port: 587,
                        service: 'yahoo',
                        secure: false,
                        auth: {
                            user: 'alsafa_thaar@yahoo.com',
                            pass: 'imjctebmgzgylwxg'
                        },
                        debug: false,
                        logger: true
                    });

                    let mailOptions = {
                        from: 'alsafa_thaar@yahoo.com',
                        to: email,
                        subject: 'Password Recovery',
                        text: `Please Click the link below to help recover your account
                 If you Did not loss your password and you receive this email by mistake,
                 you can Ignore this email
                 http://127.0.0.1:5000/reset-password/${data._id}/${token}`
                    }

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        }

                        else {
                            console.log('Email Sent To Recover your password ' + info.response);
                            res.status(200).send('An Email sent to you to recover your account!');
                        }
                    })
                }

            })
            .catch(err => console.log(err));
        //Preparing the nodemailer to send email to the restaurant email address:-

    }

})

//The URL To be visited for recovery:-
app.get('/reset-password/:id/:token', (req, res) => {
    checkIfIDValid(req.params.id)
        .then(data => {
            if (data) {
                //Verify The token:-
                const authHeader = req.headers['authorization'];
                const theToken = req.params.token;
                if (theToken == null) {
                    res.status(200).send('Invalid URL!');
                }

                else {
                    jwt.verify(theToken, secret, (err, usr) => {
                        if (err) {
                            return res.sendStatus(403);
                        }
                        else {
                            req.usr = usr;
                            //Now After verification completed, redirect to the recovery page:-
                            res.redirect(`/newPassword/${req.params.id}/${req.params.token}`);
                        }
                    })
                }
            }
            else {
                res.status(200).send('Invalid URL!');
            }
        })
        .catch(error => console.log(error));
})

app.get('/newPassword/:id/:token', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/account-recover.html');
})

app.post('/accountRecovered', (req, res) => {
    let email = req.body.email.trim();
    let newPassword = req.body.newPassword.trim();
    let newPasswordRepeat = req.body.newPasswordRepeat.trim();

    if (!email || !newPassword || !newPasswordRepeat) {
        res.status(200).send('Please Fill All the fields first!');
    }
    else {
        checkIfEmailExists(email)
            .then(data => {
                if (!data) {
                    res.status(200).send('Please Make sure the email you entered is correct!');
                }
                else {
                    if (newPassword !== newPasswordRepeat) {
                        res.status(200).send('Please Re enter the new Password Correctly!');
                    }
                    else {
                        let newAdminPassword = bcrypt.hashSync(newPassword, 10);
                        client.connect();
                        const db = client.db(dbUsers);
                        const usersCollection = db.collection('Users');
                        //Parameters to Update the document:-
                        const query = { 'admin_user_email': email };
                        const update = {
                            '$set': {
                                'admin_password': newAdminPassword
                            }
                        };
                        const options = { returnNewDocument: true };
                        let user = usersCollection.findOneAndUpdate(query, update, options).then(updatedDocument => {
                            if (updatedDocument) {
                                res.redirect('/login');
                            }
                            else {
                                res.write('An Error Occured, Please try again later!');
                            }
                        })
                            .catch(error => console.log(error));
                    }
                }
            })
            .catch(error => console.log(error));
    }
})

app.post('/appendDish', (req, res) => {
    console.log('Form was submitted successfully');
    addDish(req.body.image, req.body.name, req.body.description, req.body.price).then(console.log)
        .catch(console.error)
        .finally(() => client.close());
    res.status(200).redirect('back');
})

app.post('/deleteCard', (req, res) => {
    if (!req.body.cardIDName) res.status(200).send('No Document Found!');
    else {
        removeDish(req.body.cardIDName).then(console.log)
            .catch(console.error)
            .finally(() =>
                client.close());
        res.status(200).send('Successfully Deleted Dish!');
    }
})

app.post('/addOrEditDish', (req, res) => {
    let cardId = req.body.cardId;
    let oldImage = req.body.oldImage;
    let oldImageName = req.body.oldImageName;
    let oldTitle = req.body.oldTitle;
    let oldDescription = req.body.oldDescription;
    let oldPrice = req.body.oldPrice;
    let newImageName = req.body.imageName;
    let newImage = req.body.image;
    newImage = newImage.split(',')[1];
    oldImage = oldImage.split(',')[1];
    let newTitle = req.body.name;
    let newDescription = req.body.description;
    let newPrice = req.body.price;
    console.log(newTitle);
    console.log('Form was submitted successfully');
    addOrEditDish(cardId, oldImage, oldImageName, oldTitle, oldDescription, oldPrice, newImageName, newImage, newTitle, newDescription, newPrice).then(console.log)
        .catch(console.error)
        .finally(() => client.close());
    res.status(200).send('Menu was successfully updated!');

    //res.status(200).send(req.body.imageName);
})

app.post('/login', async (req, res) => {
    let email = req.body.email.trim();
    let password = req.body.password.trim();
    if (email == '' || password == '') {
        res.status(200).send('Please Complete the form');
    }

    else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.status(200).send('Invalid email!');
    }
    else if (password.length < 8) {
        res.status(200).send('Password must be at least 8 characters.');
    }
    else {
        try {
            await client.connect();
            const db = client.db(dbUsers);
            const usersCollection = db.collection('Users');
            let user = await usersCollection.findOne({ 'admin_user_email': email });
            if (!user) {
                res.redirect('/login');
            }
            bcrypt.compare(password, user.admin_password, (err, data) => {
                if (err) throw err;
                if (data) {
                    res.cookie('userEmail', email, { maxAge: 600000 });
                    newSession = req.session;
                    newSession.userid = req.body.email;
                    console.log(newSession);
                    res.status(200).redirect('/controlPanel');
                }
                else {
                    res.status(200).send('Incorrect Password! Login failed!');
                }
            })
        }
        catch (e) {
            throw e;
        }
    }
})

app.listen(5000, () => {
    console.log('Server is listening on port 5000');
})


