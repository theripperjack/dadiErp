Ti.include('/includes/prototype.js');
Ti.include('/includes/user.js');
Ti.include('/includes/TiLoad.js');
Ti.include('/ui/common/baseUI.js');

var pageLoaded = false;
var registerWin = null;
var oAuth = require('/includes/oAuth');
var textFields = [];
var currentWin = Ti.UI.currentWindow;
currentWin.vType = 'win';

function initLoginView() {
	currentWin.add(Ti.UI.createImageView({
		image : '/images/login/logo.png',
		height : 53,
		width : 165,
		top : 36,
		left : 32
	}));

	var login_box = Ti.UI.createView({
		backgroundImage : '/images/login/inputbox.png',
		height : 86,
		width : 256,
		top : 125
	});

	var username_input = Ti.UI.createTextField({
		color : '#7F8283',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_NONE,
		keyboardType : Ti.UI.KEYBOARD_EMAIL,
		returnKeyType : Ti.UI.RETURNKEY_NEXT,
		top : 4,
		height : 40,
		left : 50,
		right : 15,
		hintText : L('login_username_hint'),
		autocapitalization : Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
	});
	username_input.addEventListener('return', function(e) {
		password_input.focus();
	});
	textFields.push(username_input);
	login_box.add(username_input);

	var password_input = Ti.UI.createTextField({
		color : '#7F8283',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType : Ti.UI.RETURNKEY_DONE,
		passwordMask : true,
		top : 46,
		height : 40,
		left : 50,
		right : 15,
		hintText : L('login_password_hint')
	});
	password_input.addEventListener('return', function(e) {
		signin_btn.fireEvent('click');
	});
	textFields.push(password_input);
	login_box.add(password_input);
	currentWin.add(login_box);

	var signin_btn = Ti.UI.createButton({
		backgroundImage : '/images/login/login_btn.png',
		top : 230,
		width : 109,
		height : 28
	});
	signin_btn.addEventListener('click', function(e) {
		var fields = [username_input, password_input];
		for (var i = 0; i < fields.length; i++) {
			if (!fields[i].value.length) {
				fields[i].focus();
				return;
			}
			fields[i].blur();
		}

		var res = oAuth.ajaxRequest('userLogin', {
			'login' : username_input.value,
			'password' : password_input.value
		});
		if (res && res.authCode) {
			USER.login({
				'LOGIN_AUTH' : res.authCode,
				'LOGIN_UID' : res.profile.uid,
				'LOGIN_NAME' : res.profile.name,
				'LOGIN_EMAIL' : res.profile.email,
				'LOGIN_PHONE' : res.profile.phone,
				'LOGIN_DEPARTMENT' : res.profile.department,
			});
			Ti.API.info('Login UID: ' + res.profile.uid);
			Ti.App.fireEvent('userLogined');
		}
	});
	currentWin.add(signin_btn);
}

currentWin.addEventListener('updateInput', function(e) {
	textFields[0].setValue(e.username);
	textFields[1].setValue(e.password);
});

currentWin.addEventListener('click', function(e) {
	if (e.source.vType == 'win') {
		for (var i = 0; i < textFields.length; i++) {
			textFields[i].blur();
		}
	}
});

currentWin.addEventListener('open', function() {
	if (!pageLoaded) {
		pageLoaded = true;

		TiLoad.init({
			rotate : false
		});
		initLoginView();
	}
});

