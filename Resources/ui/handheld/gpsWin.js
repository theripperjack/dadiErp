Ti.include('/includes/prototype.js');
Ti.include('/includes/user.js');

Ti.include('/ui/common/baseUI.js');

var oAuth = require('/includes/oAuth');
var Map = require('ti.map');
var mapView = null;
var pageLoaded = false;

function initGpsView() {
	var rmview = Ti.UI.createView({
		top : 0,
		bottom : 55
	});

	Ti.Geolocation.getCurrentPosition(function(e) {
		if (e.error) {
			alert(e.error);
			Ti.App.fireEvent('tabChange', {
				tabName : 'cam'
			});
			return;
		}
		var region = {
			latitude : e.coords.latitude,
			longitude : e.coords.longitude,
			animate : true,
			latitudeDelta : 0.01,
			longitudeDelta : 0.01
		};
		mapView = Map.createView({
			mapType : Map.NORMAL_TYPE,
			region : region,
			animate : true,
			regionFit : true,
			userLocation : true,
			visible : true
		});
		rmview.add(mapView);

		var locationButton = Ti.UI.createButton({
			backgroundImage : '/images/cam/location_icon.png',
			width : 24,
			height : 24,
			right : 10,
			bottom : 10
		});
		locationButton.addEventListener('click', function(e) {
			setLocationSelf();
		});
		rmview.add(locationButton);
		currentView.add(rmview);
	});

	var checkinButton = Ti.UI.createButton({
		title : L('action_checkin'),
		backgroundColor : '#BCFF6D',
		borderRadius : 5,
		bottom : 5,
		height : 40,
		width : 100,
		left : 10
	});
	checkinButton.addEventListener('click', function(e) {
		submitGPS('checkin');
	});
	currentView.add(checkinButton);

	var checkoutButton = Ti.UI.createButton({
		title : L('action_checkout'),
		backgroundColor : '#6DFFE2',
		borderRadius : 5,
		bottom : 5,
		height : 40,
		width : 100,
		right : 10
	});
	checkoutButton.addEventListener('click', function(e) {
		submitGPS('checkout');
	});
	currentView.add(checkoutButton);
}

function setLocationSelf() {
	Ti.Geolocation.getCurrentPosition(function(e) {
		var region = {
			latitude : e.coords.latitude,
			longitude : e.coords.longitude,
			animate : true,
			latitudeDelta : 0.01,
			longitudeDelta : 0.01
		};
		mapView.setLocation(region);
	});
}

function submitGPS(ac) {
	var dialog = Ti.UI.createAlertDialog({
		title : L('action_' + ac),
		message : String.format(L('submit_confirm'), L('action_' + ac)),
		cancel : 1,
		buttonNames : [L('button_ok'), L('button_cancel')]
	});
	dialog.addEventListener('click', function(e) {
		if (e.index != e.cancel) {
			Ti.Geolocation.getCurrentPosition(function(gps) {
				var act = ac == 'checkin' ? 'gpsCheckin' : 'gpsCheckout';
				var res = oAuth.ajaxRequest(act, {
					'device' : Ti.Platform.id,
					'lat' : gps.coords.latitude,
					'lng' : gps.coords.longitude
				});
				var msg_lg = L(ac + '_success_message');
				if (!res) {
					msg_lg = L(ac + '_fail_message') + oAuth.getErrorMsg();
				}
				Ti.UI.createAlertDialog({
					title : L('alert_tips_title'),
					message : msg_lg
				}).show();
			});
		}
	});
	dialog.show();
}

currentWin.addEventListener('open', function() {
	if (!pageLoaded) {
		pageLoaded = true;
		innerBaseUI.initNavBar = true;
		initBaseUITopBar(false, false);
		if (isAndroid) {
			initBaseUINavBar('gps');
		}
		initBaseView();
		initGpsView();
	}
});

currentWin.addEventListener('close', function() {
	removeAllChildren(currentWin);
});

