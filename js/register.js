var form = document.getElementById('login__form');
var error_msg = document.getElementById('error__msg');
var code_form = document.getElementById('code__form');

form.addEventListener('submit', async function(event) {
    error_msg.innerHTML = 'Loading...';
    
    try {
        event.preventDefault();
    
        var username = form.username.value;
        var email = form.email.value;
        var password = form.password.value;
        var repassword = form.repassword.value;
        var csrf_token = form._csrf.value;

        if (password != repassword){
            error_msg.innerHTML = 'Passwords do not match';
            return;
        }

        var url = '/api/auth/create-user';
        var response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrf_token,
            },
            body: JSON.stringify({
                name: username,
                email: email,
                password: password,
            }),
        });

        var responseData = await response.json();
        var code = responseData.confirmation;
        console.log(code);
        localStorage.setItem('code', code);
        localStorage.setItem('username', username);
        form.style.display = 'none';
        code_form.style.display = 'flex';
        document.getElementById('login__text').innerHTML = 'User Code'
    } catch(err) {
        console.error(err);
    } finally {
        error_msg.innerHTML = '';
    }
})

code_form.addEventListener('submit', async function(event) {
    try {
        event.preventDefault();

        var code = code_form.code.value;
        var csrf_token = code_form._csrf.value;
        if (code != localStorage.getItem('code')) {
            error_msg.innerHTML = 'Invalid Code';
            return;
        }

        var url = '/api/auth/create-user';
        var response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrf_token,
            },
            body: JSON.stringify({
                name: localStorage.getItem('username'),
                confirm: code
            }),
        });

        if (response.ok) {
            window.location.href = '/login';
        }
    } catch(err) {
        console.error(err);
    }
    
});
