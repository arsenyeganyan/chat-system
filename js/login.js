var form = document.getElementById('login__form');
var error = document.getElementById('error__msg');

form.addEventListener('submit', async function(event) {
    error.innerHTML = 'Loading...';

    try {
        event.preventDefault();
        var username = form.username.value;
        var password = form.password.value;
        var csrf_token = form._csrf.value;

        var url = '/api/auth/login';
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-CSRF-Token': csrf_token,
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
            error.innerHTML = 'Bad username or password';
        }
    } catch(err) {
        console.error(error);
    } finally {
        error.innerHTML = '';
    }
});