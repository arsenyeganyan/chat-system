var reset_form = document.getElementById('reset__form');
var code_form = document.getElementById('code__form');
var new_password_form = document.getElementById('new__password__form');
var login_text = document.getElementById('login__text')
var error_msg = document.getElementById('error__msg');
var code;


reset_form.addEventListener('submit', async function(event){
    event.preventDefault();

    var email = reset_form.email.value;
    var csrf_token = reset_form._csrf.value;

    var url = '';
    var response = await fetch(url, {
        headers: {
            'X-CSRF-Token': csrf_token,
        },
        method: 'POST',
        body: {
            'email': email,
        },
    });
    var response_data = await response.json();
    code = response_data.code;
    
    if (response.ok){
        reset_form.style.display = 'none';
        login_text.innerHTML = 'Write your code';
        code_form.style.display = 'flex';
    }
})

code_form.addEventListener('submit', function(event){
    event.preventDefault();

    if (code_form.code.value == code){
        code_form.style.display = 'none';
        login_text.innerHTML = 'New password';
        new_password_form.style.display = 'flex';
        error_msg.innerHTML = '';
    }
    else {
        error_msg.innerHTML = 'Codes dont match';
    }
})

new_password_form.addEventListener('submit', async function(event){
    event.preventDefault();

    var newPassword = new_password_form.newPassword.value;
    var csrf_token = new_password_form._csrf.value;

    var response = await fetch(url, {
        headers: {
            'X-CSRF-Token': csrf_token,
            'Authorization': `Token ${localStorage.getItem('token')}`
        },
        method: 'POST',
        body: {
            new_password: newPassword,
        },
    });

    if (response.ok){
        window.location.href = '/home.html';
    }
})