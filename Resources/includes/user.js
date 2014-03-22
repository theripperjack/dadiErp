if ( typeof USER === 'undefined') {
	var USER = {
		checkLogined : function() {
			return this.getUID() ? true : false;
		},

		login : function(info) {
			this.saveSession(info);
		},

		logout : function() {
			this.clearSession();
		},

		saveSession : function(info) {
			for (var p in info) {
				if (info.hasOwnProperty(p)) {
					Ti.App.Properties.setString(p, info[p]);
				}
			}
		},

		clearSession : function() {
			this.saveSession({
				'LOGIN_AUTH' : '',
				'LOGIN_UID' : '',
				'LOGIN_NAME' : '',
				'LOGIN_EMAIL' : '',
				'LOGIN_PHONE' : '',
				'LOGIN_DEPARTMENT' : '',
			});
		},

		getAuth : function() {
			return Ti.App.Properties.getString('LOGIN_AUTH');
		},

		getUID : function() {
			return Ti.App.Properties.getString('LOGIN_UID');
		},

		getEmail : function() {
			return Ti.App.Properties.getString('LOGIN_EMAIL');
		}
	};
};
