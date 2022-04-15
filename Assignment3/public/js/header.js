const navHeader = document.getElementById("header--navigation");

const li = document.createElement("li");
const anchor = document.createElement("a");

fetch('api/user', {
    method: 'GET'
}).then(async (ret) => {
    const body = await ret.json();
    if (!body.success) {
        // not logged in
        anchor.href = "login.html";
        anchor.innerText = "Login";
    } else {
        // logged in
        anchor.href = "user.html";
        anchor.innerText = body.user.username;

        {
            const li = document.createElement("li");
            const anchor = document.createElement("a");
            anchor.innerText = "Logout";
            anchor.href = "#";
            anchor.addEventListener("click", async () => {
                await fetch("api/logout", { method: 'POST' });
                window.location.href = "index.html";
            });
            li.appendChild(anchor);
            navHeader.appendChild(li);
        }
    }
});

li.appendChild(anchor);
navHeader.appendChild(li);