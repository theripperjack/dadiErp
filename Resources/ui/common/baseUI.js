Ti.include('/includes/prototype.js');

var currentWin = Ti.UI.currentWindow;
var currentView = null;
var topBarUI = null;
var navBarUI = null;

var topBarBackButton = null;
var topBarRightButton = null;
var navBarGpsButton = null;
var navBarCamButton = null;
var navBarManualButton = null;

var innerBaseUI = {
	initTopBar : false,
	initNavBar : false,
	topBarVisable : false,
	navBarVisable : false,
	topBarHeight : 44,
	navBarHeight : 50
};

var osname = Ti.Platform.osname, version = Ti.Platform.version, height = Ti.Platform.displayCaps.platformHeight, width = Ti.Platform.displayCaps.platformWidth;
var isAndroid = osname === 'android' ? true : false;
var isIphone = osname === 'iphone' ? true : false;
var isIos = osname === 'iphone' || osname == 'ipad' ? true : false;
var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
var jsPath = '/ui/' + ( isTablet ? 'tablet/' : 'handheld/');

function nullEvent() {
	// nothing
}

function changeTab(e) {
	Ti.App.fireEvent('tabChange', {
		tabName : e.source.tabName
	});
}

function initEvents() {
	if ( typeof topBarBackFn === 'undefined') {
		topBarBackFn = nullEvent;
	}

	if ( typeof topBarRightFn === 'undefined') {
		topBarRightFn = nullEvent;
	}
}

function initBaseUITopBar(backBtn, rightBtn) {
	var btop = 0;
	if (isIos && parseInt(Ti.Platform.version) == 7 && !currentWin.getFullscreen()) {
		btop = 20;
		innerBaseUI.topBarHeight += btop;
	}
	topBarUI = Ti.UI.createView({
		id : 'topBar',
		backgroundImage : '/images/common/top_bar.png',
		top : 0,
		height : 44,
		width : Ti.UI.FILL,
		zIndex : 90,
		top : btop
	});

	var top_bar_label = Ti.UI.createLabel({
		id : 'topBarTitle',
		color : '#FFFFFF',
		font : {
			fontSize : 20,
			fontWeight : 'bold'
		},
		shadowColor : '#000000',
		shadowOffset : {
			x : -1,
			y : -1
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		orizontalWrap : true,
		top : 10,
		left : 65,
		right : 65,
		height : 24,
		zIndex : 105,
		text : currentWin.getTitle()
	});
	topBarUI.add(top_bar_label);

	if (backBtn) {
		topBarBackButton = Ti.UI.createButton({
			backgroundImage : '/images/common/btn_back.png',
			height : 31,
			width : 52,
			top : 7,
			left : 5,
			zIndex : 105
		});
		topBarBackButton.addEventListener('click', function(e) {
			topBarBackFn(e);
		});
		topBarUI.add(topBarBackButton);
	}

	if (rightBtn) {
		// edit/save/dot/refresh/logout
		var buttonId = 'topBar' + rightBtn.toString().ucfirst();
		var rightBtnAttArr = {
			topBarEdit : ['/images/common/btn_edit.png', 50],
			topBarSave : ['/images/common/btn_save.png', 50],
			topBarDot : ['/images/common/btn_dot.png', 31],
			topBarShare : ['/images/common/btn_share.png', 50],
			topBarRefresh : ['/images/common/btn_refresh.png', 31],
			topBarLogout : ['/images/common/btn_logout.png', 61]
		};
		topBarRightButton = Ti.UI.createButton({
			id : buttonId,
			height : 31,
			top : 7,
			right : 5,
			zIndex : 105,
			backgroundImage : rightBtnAttArr[buttonId][0],
			width : rightBtnAttArr[buttonId][1]
		});
		topBarRightButton.addEventListener('click', function(e) {
			topBarRightFn(e);
		});
		topBarUI.add(topBarRightButton);
	}

	currentWin.add(topBarUI);
	innerBaseUI.initTopBar = true;
	innerBaseUI.topBarVisable = true;
}

function initBaseUINavBar(navActive, winTarget) {
	var curWin = winTarget ? winTarget : currentWin;
	navBarUI = Ti.UI.createView({
		id : 'navBar',
		backgroundImage : '/images/common/bottom_bar.png',
		bottom : 0,
		height : 50,
		width : Ti.UI.FILL,
		zIndex : 100
	});

	navBarGpsButton = Ti.UI.createButton({
		id : 'navBarGPS',
		bottom : 0,
		width : 48,
		height : 48,
		left : 36,
		zIndex : 105,
		backgroundImage : (navActive == 'gps' ? '/images/common/gps_active.png' : '/images/common/gps_inactive.png'),
		active : (navActive == 'gps'),
		tabName : 'gps'
	});
	navBarGpsButton.addEventListener('click', function(e) {
		changeTab(e);
	});
	navBarUI.add(navBarGpsButton);

	navBarManualButton = Ti.UI.createButton({
		id : 'navBarManual',
		bottom : 0,
		width : 48,
		height : 48,
		right : 36,
		zIndex : 105,
		backgroundImage : (navActive == 'manual' ? '/images/common/manual_active.png' : '/images/common/manual_inactive.png'),
		active : (navActive == 'manual'),
		tabName : 'manual'
	});
	navBarManualButton.addEventListener('click', function(e) {
		changeTab(e);
	});
	navBarUI.add(navBarManualButton);

	navBarCamButton = Ti.UI.createButton({
		id : 'navBarCam',
		bottom : 0,
		width : 84,
		height : 70,
		zIndex : 105,
		verticalAlign : 'center',
		backgroundImage : (navActive == 'cam' ? '/images/common/cam_active.png' : '/images/common/cam_inactive.png'),
		active : (navActive == 'cam'),
		tabName : 'cam'
	});
	navBarCamButton.addEventListener('click', function(e) {
		changeTab(e);
	});
	curWin.add(navBarCamButton);
	curWin.add(navBarUI);
	innerBaseUI.initNavBar = true;
}

function initBaseView() {
	currentView = Ti.UI.createView({
		id : 'mainView',
		top : (innerBaseUI.initTopBar ? innerBaseUI.topBarHeight : 0),
		bottom : (innerBaseUI.initNavBar ? innerBaseUI.navBarHeight : 0),
		zIndex : 10
	});
	currentWin.add(currentView);
}

function changeViewTitle(title) {
	var objs = topBarUI.getChildren();
	objs[0].setText(title);
}

function hideAndShowTopBar() {
	if (innerBaseUI.initTopBar) {
		if (innerBaseUI.topBarHeightBarVisable) {
			topBarUI.hide();
			currentView.setTop(0);
		} else {
			currentView.setTop(innerBaseUI.topBarHeight);
			topBarUI.show();
		}
		innerBaseUI.topBarHeightBarVisable = !innerBaseUI.topBarHeightBarVisable;
	}
}

function removeAllChildren(viewObj) {
	/*
	 var children = viewObj.children.slice(0);
	 for (var i = 0; i < children.length; i++) {
	 viewObj.remove(children[i]);
	 }
	 */
}