if (!localStorage.getItem('toke')) {
    console.log('redirect');
}

var sidebar = document.getElementById('sidebar');
var user_edit = document.getElementById('user__edit');
var edit_form = document.getElementById('edit__form');
var success_message = document.getElementById('success__message');
var error_message = document.getElementById('error__message');

document.getElementById('arrow__left').addEventListener('click', function(){
    user_edit.style.display = 'none';
    sidebar.style.display = 'flex';
})

document.getElementById('user__pic').addEventListener('click', function(){
    sidebar.style.display = 'none';
    user_edit.style.display = 'flex';
    
    var username = localStorage.getItem('username');
    document.getElementById('edit__username__input').value = username;
})

edit_form.addEventListener('submit', function(event) {
    event.preventDefault();
    var profile_picture = edit_form.profile_picture;
    var username = edit_form.username.value;
    
    var formData = new FormData();
    formData.append('profile_picture', profile_picture);
    formData.append('username', username);

    var url = '';
    var response = fetch(url, {
        method: 'POST',
        body: formData,
    })

    console.log(profile_picture)
    if (response.ok) {
        error_message.style.display = 'none';
        success_message.style.display = 'block';
    }
    else {
        success_message.style.display = 'none';
        error_message.style.display = 'block';
    }
})
