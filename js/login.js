var form = document.getElementById('login__form');

form.addEventListener('submit', async function(event) {
    
    try {
        event.preventDefault();
        var username = form.username.value;
        console.log(username);
        var password = form.password.value;
        console.log(password);

        var url = '/api/auth/login';
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
        
        const responseData = await response.json();
        console.log(responseData);
        const token = responseData.token;

        if (token){
            localStorage.setItem('token', token);
            window.location.href = '/';
        } else {
            var error = document.getElementById('error__msg');
            error.innerHTML = 'Bad username or password';
        }
    } catch(err) {
        console.error(error);
    }
});