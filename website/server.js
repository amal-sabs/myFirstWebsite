const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const port = 5244;

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('homepage');
});

app.get('/privacy', (req, res) => {
    res.render('privacystatement');
});

app.get('/browseAvailablePets', (req, res) => {
    res.render('browseAvailablePets');
});

app.get('/catcare', (req, res) => {
    res.render('catcare');
});

app.get('/contactus', (req, res) => {
    res.render('contactus');
});

app.get('/dogcare', (req, res) => {
    res.render('dogcare');
});

app.get('/finddogcat', (req, res) => {
    res.render('finddogcat');
});

app.get('/havepetgiveaway', (req, res) => {
    if(!req.session.username)
        res.render('havepetgiveaway');
    else
        res.render('formgiveaway');
});

app.get('/formgiveaway', (req, res) => {
    res.render('formgiveaway');
});

app.get('/createaccount', (req, res) =>{
    res.render('createaccount');
});

app.get('/logout', (res, req) => {
    res.render('logout');
})

app.post('/createAccount', (req, res) => {
    const { username, password } = req.body;

    if (checkUsernameExists(username)) {
        return res.status(400).send('Username already exists.');
    }

    registerUser(username, password);

    return res.render('formgiveaway');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!checkUsernameExists(username) || !verifyLogin(username, password)) {
        return res.status(401).send('Invalid username or password.');
    }

    req.session.username = username;
    return res.render('formgiveaway');
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    return showMessageAndRedirect(res);
});

function showMessageAndRedirect(res) {
    res.render('logout', { message: 'Logged out successfully.' });
}

const availablePetsInfo = 'availablePetsInfo.txt';

app.post('/submitPet', (req, res) => {
    const formData = req.body;
    const username = req.session.username;
    
    if (!username) {
        return res.status(401).send('You must be logged in to submit a pet.');
    }

    savePetInfo(formData);
    
    return res.send('Pet submitted successfully.');
});

function findID(){
    let data = fs.readFileSync(availablePetsInfo, 'utf8');
    let lines = data.trim().split('\n');
    let lastLine = lines[lines.length - 1];
    let lastId = parseInt(lastLine.split(':')[0]);
    let id = lastId+1;


    return id;
}

function savePetInfo(formData) {
    let {petType, breed,age, gender,'petAlongDog': alongDogs,'petAlongCat': alongCats,'petAlongKids': alongChildren, owner1 ,owner2,email, comments} = formData;
    if(!alongChildren)
    {
        alongChildren= false;
    }
    if(!alongCats)
    {
        alongCats=false;
    }
    if(!alongDogs)
    {
        alongDogs=false;
    }
    const petInfo = `${petType}:${breed}:${age}:${gender}:${alongDogs}:${alongCats}:${alongChildren}:${owner1} ${owner2}:${email}:${comments}\n`;
    return fs.appendFile(availablePetsInfo, findID()+":"+ petInfo, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Pet submitted successfully:', formData);
        }
    });
}

const loginFile = 'login.txt';

function verifyLogin(username, password){
    const loginInfo = fs.readFileSync(loginFile, 'utf-8').split('\n');

    for(const entry of loginInfo)
    {
        const[storedUsername, storedPassword] = entry.split(':');
            if (storedUsername === username && storedPassword === password) {
            return true; 
        }
    }
    return false; 
}

function registerUser(username, password) {
    fs.appendFileSync(loginFile, `\n${username}:${password}\n`);
}

function checkUsernameExists(username) {
    const loginInfo = fs.readFileSync(loginFile, 'utf-8').split('\n');

    for(const entry of loginInfo)
    {
        const[storedUsername, storedPassword] = entry.split(':');
            if (storedUsername === username) {
            return true; 
        }
    }
    return false; 
}

function parseTextFile() {
    const data = fs.readFileSync(availablePetsInfo, 'utf8');
    const lines = data.split('\n');
    const pets = lines.map(line => {
        const [id, type, breed, age, gender, alongDog, alongCat, alongKids, owner, email, description] = line.split(':');
        return { id, type, breed, age, gender, alongDog, alongCat, alongKids, owner, email, description};
    });
    return pets;
}

function filterPets(formData, pets) {
    const filteredPets = pets.filter(pet => {
        if (formData.petType && formData.petType !== pet.type) {
            return false;
        }
        if (formData.breed && formData.breed !== 'Does not matter' && formData.breed !== pet.breed) {
            return false;
        }
        if (formData['age'] && formData['age'] !== 'Does not matter' && !checkAgeCategory(formData['age'], pet.age)) {
            return false;
        }
        if (formData['gender'] && formData['gender'] !== 'Does not matter' && formData['gender'] !== pet.gender) {
            return false;
        }
        if (formData.petAlongDog && pet.alongDog !== 'True') {
            return false;
        }
        if (formData.petAlongCat && pet.alongCat !== 'True') {
            return false;
        }
        if (formData.petAlongKids && pet.alongKids !== 'True') {
            return false;
        }
        return true;
    });
    return filteredPets;
}

function checkAgeCategory(category, age) {
    switch (category) {
        case 'Less than 2':
            return age < 2;
        case 'Between 2 and 8':
            return age >= 2 && age <= 8;
        case 'Between 8 and 14':
            return age > 8 && age <= 14;
        default:
            return false;
    }
}

app.post('/finddogcat', (req, res) => {
    const formData = req.body;
    const pets = parseTextFile();
    const filteredPets = filterPets(formData, pets);
    res.render('browseAvailablePets', { filteredPets: filteredPets });
});


app.listen(port, () => {
    console.log(`Server started at http://soen287.encs.concordia.ca:${port}`);
});