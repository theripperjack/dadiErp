Ti.include('/includes/user.js');
var oAuth = require('/includes/oAuth');
Ti.include('/ui/common/baseUI.js');

var loginWin = null;
var mainWin = null;
var quickWins = {};

function initLoginWin() {
	loginWin = Ti.UI.createWindow({
		title : L('login_title'),
		url : jsPath + 'loginWin.js',
		backgroundImage : '/images/bg.png',
		backgroundRepeat : true,
		fullscreen : false
	});
}

function initQuickWins() {
	quickWins = {
		'gps' : Ti.UI.createWindow({
			title : L('gps_title'),
			isOpen : false,
			runFlag : false,
			url : jsPath + 'gpsWin.js',
			backgroundImage : '/images/bg.png',
			backgroundRepeat : true,
			navBarHidden : true,
			tabBarHidden : true,
			fullscreen : false
		}),
		'cam' : Ti.UI.createWindow({
			title : L('cam_title'),
			isOpen : false,
			runFlag : false,
			url : jsPath + 'camWin.js',
			backgroundImage : '/images/bg.png',
			backgroundRepeat : true,
			navBarHidden : true,
			tabBarHidden : true,
			fullscreen : false
		}),
		'manual' : Ti.UI.createWindow({
			title : L('manual_title'),
			isOpen : false,
			runFlag : false,
			url : jsPath + 'manualWin.js',
			backgroundImage : '/images/bg.png',
			backgroundRepeat : true,
			navBarHidden : true,
			tabBarHidden : true,
			fullscreen : false
		})
	};
}

function initMainWin() {
	if (!isAndroid) {
		mainWin = Ti.UI.createTabGroup({
			backgroundColor : '#FFFFFF',
			title : L('main_title'),
			isOpen : false
		});

		var quickeeGpsTab = Ti.UI.createTab({
			title : L('gps_title'),
			window : quickWins.gps
		});
		mainWin.addTab(quickeeGpsTab);

		var quickeeCamTab = Ti.UI.createTab({
			title : L('cam_title'),
			window : quickWins.cam
		});
		mainWin.addTab(quickeeCamTab);

		var quickeeManualTab = Ti.UI.createTab({
			title : L('manual_title'),
			window : quickWins.manual
		});
		mainWin.addTab(quickeeManualTab);

		mainWin.setActiveTab(1);
		initBaseUINavBar('cam', mainWin);
	}
}

Ti.App.addEventListener('tabChange', function(e) {
	if (isAndroid) {
		for (var w in quickWins) {
			if (quickWins.hasOwnProperty(w)) {
				if (quickWins[w].isOpen && w != e.tabName) {
					quickWins[w].isOpen = false;
					quickWins[w].close();
				} else if (w == e.tabName) {
					quickWins[w].isOpen = true;
					quickWins[w].runFlag = true;
					quickWins[w].open({
						animated : false
					});

				}
			}
		}
	} else {
		var tabs = {
			'gps' : 0,
			'cam' : 1,
			'manual' : 2
		};

		navBarGpsButton.setBackgroundImage((e.tabName == 'gps' ? '/images/common/gps_active.png' : '/images/common/gps_inactive.png'));
		navBarGpsButton.active = (e.tabName == 'gps');

		navBarCamButton.setBackgroundImage((e.tabName == 'cam' ? '/images/common/cam_active.png' : '/images/common/cam_inactive.png'));
		navBarCamButton.active = (e.tabName == 'cam');

		navBarManualButton.setBackgroundImage((e.tabName == 'manual' ? '/images/common/manual_active.png' : '/images/common/manual_inactive.png'));
		navBarManualButton.active = (e.tabName == 'manual');

		mainWin.setActiveTab(tabs[e.tabName]);
	}
});

Ti.App.addEventListener('doLogout', function() {
	USER.logout();
	Ti.App.fireEvent('doLogin');
});

Ti.App.addEventListener('doLogin', function() {
	quickWins.manual.isOpen = false;
	quickWins.manual.close();
	loginWin.open();
});

Ti.App.addEventListener('userLogined', function() {
	loginWin.close();
	if (isAndroid) {
		Ti.App.fireEvent('tabChange', {
			tabName : 'cam'
		});
	} else {
		mainWin.isOpen = true;
		mainWin.open();
		Ti.App.fireEvent('tabChange', {
			tabName : 'cam'
		});
		mainWin.tabs[0].getWindow().fireEvent('reloadData');
	}
});

Ti.App.addEventListener('exitApp', function() {
	if (isAndroid) {
		Ti.Android.currentActivity.finish();
	}
});

initLoginWin();
initQuickWins();
initMainWin();

if (USER.checkLogined()) {
	Ti.App.fireEvent('userLogined');
} else {
	Ti.App.fireEvent('doLogin');
}

