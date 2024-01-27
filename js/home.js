if (!localStorage.getItem('toke')) {
    console.log('redirect');
}

var sidebar = document.getElementById('sidebar');
var user_edit = document.getElementById('user__edit');
var edit_form = document.getElementById('edit__form');
var success_message = document.getElementById('success__message');
var error_message = document.getElementById('error__message');
var cancel_icons = document.getElementsByClassName('cancel__icon');
var new_chat = document.getElementById('new__chat');
var sidebar_settings = document.getElementById('sidebar__settings');
chat_box_header_settings = document.getElementById('chat__box__header__settings');

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
    sidebar.style.display = 'flex';    
})

document.getElementById('new__chat__icon').addEventListener('click', function() {
    new_chat.style.display = 'flex';
    sidebar.style.display = 'none';
})

document.getElementById('user__edit__close').addEventListener('click', function(){
    user_edit.style.display = 'none';
    sidebar.style.display = 'flex';
})

document.getElementById('user__pic').addEventListener('click', function(){
    sidebar.style.display = 'none';
    user_edit.style.display = 'flex';
    
    var username = localStorage.getItem('username');
    document.getElementById('edit__username__input').value = username;
})

edit_form.addEventListener('submit', async function(event) {
    event.preventDefault();
    var profile_picture = edit_form.profile_picture;
    var username = edit_form.username.value;
    
    var formData = new FormData();
    formData.append('profile_picture', profile_picture);
    formData.append('username', username);

    var url = '';
    var response = await fetch(url, {
        method: 'POST',
        body: formData,
    })

    console.log(profile_picture)
    
    var notification_sound = new Audio('../sounds/new-message-2-125765.mp3');
    await notification_sound.play();

    if (response.ok) {
        error_message.style.display = 'none';
        success_message.style.display = 'flex';
    }
    else {
        success_message.style.display = 'none';
        error_message.style.display = 'flex';
    }
})

for(var i = 0; i < cancel_icons.length; i++){
    var cancel_icon = cancel_icons[i]
    cancel_icon.addEventListener('click', function(){
        success_message.style.display = 'none';
        error_message.style.display = 'none';
    }) 
}