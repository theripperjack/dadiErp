var APIConfig = {
	'baseUrl' : 'http://erpapi.etpec.com/v1.0',

	'userLogin' : {
		'method' : 'POST',
		'url' : '/user/signin',
		'params' : {
			'login' : '',
			'password' : ''
		}
	},
	'qrcodeCheckin' : {
		'method' : 'POST',
		'url' : '/hr/attendance/checkin',
		'params' : {
			'code' : '',
			'lat' : '',
			'lng' : '',
			'device' : ''
		}
	},
	'gpsCheckin' : {
		'method' : 'POST',
		'url' : '/hr/attendance/checkin',
		'params' : {
			'lat' : '',
			'lng' : '',
			'device' : ''
		}
	},
	'qrcodeCheckout' : {
		'method' : 'POST',
		'url' : '/hr/attendance/checkin',
		'params' : {
			'code' : '',
			'lat' : '',
			'lng' : '',
			'device' : ''
		}
	},
	'gpsCheckout' : {
		'method' : 'POST',
		'url' : '/hr/attendance/checkin',
		'params' : {
			'lat' : '',
			'lng' : '',
			'device' : ''
		}
	}
};
