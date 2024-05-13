function dateTime(){
    let currentDate = new Date();

    let day = currentDate.getDate();
    let month = currentDate.getMonth()+1;
    let year = currentDate.getFullYear();
    let hour = currentDate.getHours();
    let minute = currentDate.getMinutes();
    let second = currentDate.getSeconds();

    let now = day + "-" + month + "-" + year + "  " + hour + ":" + minute + ":" + second;
    document.getElementById("dateTime").innerHTML = now;

}

dateTime();
setInterval(dateTime, 1000)

function validateForm(){
    const type = document.querySelector('select[name="petType"]');
    const breed = document.querySelector('input[name="breed"]:checked');
    const age = document.querySelector('select[name="age category cat"]');
    const gender = document.querySelector('select[name = "gender category"]');

    if(type.value=="" || !breed || age.value=="" || gender.value=="")
    {
        event.preventDefault();
        alert("Please fill in all fields in the form before submitting the form.");
    }
}

document.getElementById("giveawayform").addEventListener('submit', function(event) {
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const type = document.querySelector('select[name="petType"]');
    const breed = document.querySelector('input[name="breed"]:checked');
    const age = document.querySelector('select[name="age category cat"]');
    const gender = document.querySelector('select[name = "gender category"]');
    const along_dogs = document.querySelector('input[name="along-dogs"]:checked');
    const along_cats = document.querySelector('input[name="along-cats"]:checked');
    const along_children = document.querySelector('input[name="along-children"]:checked');

    if(firstname == "" || lastname == "" || email == "" || type.value=="" || !breed || age.value=="" || gender.value=="" || !along_cats || !along_children || !along_dogs)
    {
        alert("Please fill in all fields before submitting the form.");
        event.preventDefault();
    }

    const expression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!email.match(expression))
    {
        alert("The email format is incorrect."+email);
        event.preventDefault();
    }
});

document.getElementById('login').addEventListener('submit', function(event) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        event.preventDefault();
        alert('Please fill in empty fields');
    } else {
        this.submit();
    }
});

document.getElementById('formanimal').addEventListener('submit', function(event) {
    event.preventDefault(); // prevent default form submission
    const formData = new FormData(this); // get form data
    sendData(formData);
});

function sendData(formData) {
    fetch('/filterPets', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        document.body.innerHTML = data; // replace current HTML with filtered pets
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function validateCreate(){
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    if(!username || !password)
    {
        event.preventDefault();
        alert('Please fill in empty fields');
        return false;
    }

    let expressionForUsername = /^[a-zA-Z0-9]+$/;
    let expressionForPassword = /^(?=.*[a-zA-Z])(?=.*\d).{4,}$/;

    if(!username.match(expressionForUsername))
    {
        event.preventDefault();
        alert('The username entered does not follow the requirements. Please try again.');
        return false;
    }
    if(!password.match(expressionForPassword))
    {
        event.preventDefault();
        alert('The password entered does not follow the requirements. Please try again.');
        return false;
    }
}
document.getElementById('create').addEventListener('submit', function(event){
    event.preventDefault();
    const formData = new FormData(this); // get form data
    sendData(formData);
});

