Ti.include('/includes/user.js');
Ti.include('/ui/common/baseUI.js');
var oAuth = require('/includes/oAuth');

var pageLoaded = false;
var qrCodeWindow = null;
var qrCodeView = null;
var TiBar = null;

if (isAndroid) {
	TiBar = require("com.mwaysolutions.barcode");
} else {
	TiBar = require('com.acktie.mobile.ios.qr');
	qrCodeView = TiBar.createQRCodeView({
		backgroundColor : '#000000',
		width : '100%',
		height : '90%',
		top : 0,
		left : 0,
		userControlLight : false,
		userFrontCamera : false,
		success : function(data) {
			if (data != undefined && data.data != undefined) {
				Ti.Media.vibrate();
				if (scanQRcode(data.data)) {
					qrWinCloseClean();
				}
			}
		},
		cancel : function() {
			Ti.API.info('TiBar cancel callback!');
		},
		error : function() {
			Ti.API.info('TiBar cancel callback!');
		}
	});

}

function initCamView() {
	currentView.add(Ti.UI.createLabel({
		color : '#686B6C',
		font : {
			fontSize : 16
		},
		text : L('touch_to_scan'),
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		top : 60
	}));

	var touchcam_btn = Ti.UI.createButton({
		backgroundImage : '/images/cam/touch_cam.png',
		width : 176,
		height : 176,
		top : 100,
		verticalAlign : 'center'
	});
	touchcam_btn.addEventListener('click', function(e) {
		scanQRcodeStart();
	});

	currentView.add(touchcam_btn);
}

function qrWinCloseClean() {
	qrCodeView.stop();
	qrCodeWindow.remove(qrCodeView);
	qrCodeWindow.close();
	qrCodeWindow = null;
}

function openCamReaderWin() {
	qrCodeWindow = Titanium.UI.createWindow({
		navBarHidden : true,
		exitOnClose : false,
		backgroundColor : '#000000',
		width : '100%',
		height : '100%'
	});
	var closeButton = Titanium.UI.createButton({
		title : "Close",
		bottom : 5,
		left : 5
	});
	closeButton.addEventListener('click', function() {
		qrWinCloseClean();
	});

	qrCodeWindow.add(qrCodeView);
	qrCodeWindow.add(closeButton);

	qrCodeWindow.open();
}

function scanQRcodeStart() {
	if (isAndroid) {
		TiBar.scan({
			success : function(data) {
				Ti.API.info('TiBar success callback!');
				if (data && data.barcode) {
					scanQRcode(data.barcode);
				}
			},
			cancel : function() {
				Ti.API.info('TiBar cancel callback!');
			},
			error : function() {
				Ti.API.info('TiBar error callback!');
			}
		});
	} else {
		openCamReaderWin();
	}
}

function scanQRcode(qrcode) {
	var f4c = qrcode.toString().substring(0, 4).toUpperCase();
	if (f4c == 'DDA:') {
		var acode = qrcode.toString().substring(4);
		var dialog = Ti.UI.createOptionDialog({
			cancel : 2,
			options : [L('action_checkin'), L('action_checkout'), L('button_cancel')],
			selectedIndex : 2,
			title : L('action_options_title')
		});
		dialog.addEventListener('click', function(e) {
			if (e.index != 2) {
				var label_view = createUploadingText();
				currentView.add(label_view);
				Ti.Geolocation.getCurrentPosition(function(gps) {
					var act = e.index == 0 ? 'qrcodeCheckin' : 'qrcodeCheckout';
					var act2 = e.index == 0 ? 'checkin' : 'checkout';
					//alert(e.index + ' ' + act + ' ' + act2 + ' ' + acode + ' ' + gps.coords.latitude + ' ' + gps.coords.longitude + ' ' + Ti.Platform.id);
					var res = oAuth.ajaxRequest(act, {
						'code' : acode,
						'device' : Ti.Platform.id,
						'lat' : gps.coords.latitude,
						'lng' : gps.coords.longitude
					});
					var msg_lg = L(act2 + '_success_message');
					if (!res) {
						msg_lg = L(act2 + '_fail_message') + oAuth.getErrorMsg();
					}
					alert(msg_lg);
					currentView.remove(label_view);
				});
			}
		});
		dialog.show();

	} else {
		Ti.UI.createAlertDialog({
			title : L('qrcode_invalid_title'),
			message : L('qrcode_invalid_message')
		}).show();
	}
	return qrcode;
}

function createUploadingText() {
	var label_view = Ti.UI.createView({
		backgroundImage : '/images/common/tbg.png',
		height : 38,
		top : 0,
		zIndex : 15
	});
	var update_label = Ti.UI.createLabel({
		top : 3,
		left : 5,
		right : 5,
		font : {
			fontSize : 14
		},
		color : '#ffffff',
		text : '提交中,请稍候...'
	});
	label_view.add(update_label);
	return label_view;
}

if (!pageLoaded) {
	pageLoaded = true;
	innerBaseUI.initNavBar = true;
	initBaseUITopBar(false, false);

	if (isAndroid) {
		initBaseUINavBar('cam');
	}

	initBaseView();
	initCamView();
}

currentWin.addEventListener('close', function() {
	removeAllChildren(currentWin);
});
