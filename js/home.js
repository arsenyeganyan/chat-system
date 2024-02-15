var sidebar = document.getElementById('sidebar');
var user_edit = document.getElementById('user__edit');
var edit_form = document.getElementById('edit__form');
var success_message = document.getElementById('success__message');
var error_message = document.getElementById('error__message');
var cancel_icons = document.getElementsByClassName('cancel__icon');
var new_chat = document.getElementById('new__chat');
var sidebar_settings = document.getElementById('sidebar__settings');
var chat_box_header_settings = document.getElementById('chat__box__header__settings');
var profile__picture__label =  document.getElementById('profile__picture__label');
var change_password = document.getElementById('change__password');
var change_password_form = document.getElementById('change__password__form');

change_password_form.addEventListener('submit', async function(event){
    event.preventDefault();
    var oldPassword = change_password_form.oldPassword.value;
    var newPassword = change_password_form.newPassword.value;
    var csrf_token = edit_form._csrf.value;

    if (oldPassword == newPassword){
        var url = '/api/edit/password';
        
        var response = await fetch(url, {
            headers: {
                'X-CSRF-Token': csrf_token,
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
            method: 'POST',
            body: {'new_password': newPassword},
        });

        var notification_sound = new Audio('../sounds/new-message-2-125765.mp3');
        await notification_sound.play();

        if(!response.ok) {
            error_message.style.display = 'flex';
            throw new Error("An error occured", response.status);
        }
        
        const responseData = await response.json();
        console.log(responseData);

        document.getElementById('error__msg__in__change__password').innerHTML = '';
        document.getElementById('error__msg__in__change__password').style.display = 'none';

        error_message.style.display = 'none';
        success_message.style.display = 'flex';
        return;
    }
    else {
        document.getElementById('error__msg__in__change__password').style.display = 'block';
    }

})

// document.getElementById

document.getElementById('settings__change__password').addEventListener('click', function(){
    sidebar.style.display = 'none';
    change_password.style.display = 'flex';  
})

document.getElementById('change__password__close').addEventListener('click', function(){
    change_password.style.display = 'none';
    sidebar.style.display = 'flex'; 
})

document.getElementById('sidebar__settings__icon').addEventListener('click', function(){
    if (sidebar_settings.style.display == 'flex'){
        sidebar_settings.style.display = 'none';
    }  
    else {
        sidebar_settings.style.display = 'flex';
    } 
})

document.getElementById('chat__box__header__settings__icon').addEventListener('click', function(){
    if (chat_box_header_settings.style.display == 'flex'){
        chat_box_header_settings.style.display = 'none';
    }   
    else {
        chat_box_header_settings.style.display = 'flex';
    }    
})

document.getElementById('new__chat__close').addEventListener('click', function(){
    new_chat.style.display = 'none';
    sidebar.style.display = 'flex'
})

function new__chat__diplay() {
    new_chat.style.display = 'flex';
    sidebar.style.display = 'none';
}

document.getElementById('new__chat__icon').addEventListener('click', new__chat__diplay);
document.getElementById('settings__new__chat').addEventListener('click', new__chat__diplay);

document.getElementById('user__edit__close').addEventListener('click', function(){
    var profile_picture_url = localStorage.getItem('profile_picture');
    if (profile_picture_url){
        profile__picture__label.style.backgroundImage = `url(${profile_picture_url})`;
    }
    else {
        profile__picture__label.style.backgroundImage = "url('../img/[removal.ai]_cb530dbb-90ac-4ea4-81cb-53aa823bde6e-user2.png')";
    }
    user_edit.style.display = 'none';
    sidebar.style.display = 'flex';
})

document.getElementById('pic__label').addEventListener('input', function(){
    var file = this.files[0];

    const render = new FileReader();
    render.onloadend = function(){
        profile__picture__label.style.backgroundImage = `url(${render.result})`;
    };
    render.readAsDataURL(file); 
})

document.getElementById('user__pic').addEventListener('click', function(){
    sidebar.style.display = 'none';
    user_edit.style.display = 'flex';
    
    var username = localStorage.getItem('username');
    var profile_picture_url = localStorage.getItem('profile_picture');
    if (profile_picture_url){
        profile__picture__label.style.backgroundImage = `url(${profile_picture_url})`;
    }
    document.getElementById('edit__username__input').value = username;
})

edit_form.addEventListener('submit', async function(event) {
    try {
        event.preventDefault();
        var profile_picture = edit_form.profile__picture;
        var username = edit_form.username.value;
        var csrf_token = edit_form._csrf.value;

        const file = profile_picture.files[0];
        
        var formData = new FormData();
        if(file) {
            formData.append('profile__picture', file);
        }
        if(username) {
            formData.append('username', username);
        }
    
        var url = '/api/edit/user';
        var response = await fetch(url, {
            headers: {
                'X-CSRF-Token': csrf_token,
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
            method: 'POST',
            body: formData,
        });
        
        var notification_sound = new Audio('../sounds/new-message-2-125765.mp3');
        await notification_sound.play();

        if(!response.ok) {
            error_message.style.display = 'flex';
            throw new Error("An error occured", response.status);
        }
        
        const responseData = await response.json();
        console.log(responseData);

        error_message.style.display = 'none';
        success_message.style.display = 'flex';
        return;
    } catch(err) {
        console.error(err);
    }
})

for(var i = 0; i < cancel_icons.length; i++){
    var cancel_icon = cancel_icons[i]
    cancel_icon.addEventListener('click', function(){
        success_message.style.display = 'none';
        error_message.style.display = 'none';
    }) 
}

document.getElementById('log__out').addEventListener('click', function(){
    localStorage.removeItem('token');
    window.location.href = '/login.html';
})