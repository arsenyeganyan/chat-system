var form = document.getElementById('login__form');

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    var username = form.username.value;
    var password = form.password.value;

    var url = '';
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
    
    const responseData = await response.json(); 
    const token = responseData.token;
    if (token){
        localStorage.setItem('token', token);
        window.location.href = '/home.html';
    }
    else {
        var error = document.getElementById('error__msg');
        error.innerHTML = 'Bad username or password';
    }
});