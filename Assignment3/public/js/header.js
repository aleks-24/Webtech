const header = document.getElementById("header--navigation");

const li = document.createElement("li");
const anchor = document.createElement("a");

fetch('/api/user', {
    method: 'GET'
}).then(async (ret) => {
    const body = await ret.json();
    if (!body.success) {
        // not logged in
        anchor.href = "/login.html";
        anchor.innerText = "Login";
    } else {
        // logged in
        anchor.href = "/user.html";
        anchor.innerText = body.user.username;
    }
});

li.appendChild(anchor);
header.appendChild(li);