async function login(e) {
    console.log(e);

    const data = {};
    data.username = document.getElementById("loginUsername").value;
    data.password = document.getElementById("loginPassword").value;

    const ret = await fetch('/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    console.log(ret);
}

async function register() {
    const data = {};
    data.username = document.getElementById("username").value;
    data.password = document.getElementById("password").value;
    data.firstname = document.getElementById("firstName").value;
    data.lastname = document.getElementById("lastName").value;
    data.email = document.getElementById("emailAddress").value;
    data.address = document.getElementById("address").value;
    data.phonenumber = document.getElementById("phoneNumber").value;
    data.postcode = document.getElementById("postalCode").value;

    const ret = await fetch('/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    console.log(ret);
}
