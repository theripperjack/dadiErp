Ti.include('/includes/prototype.js');
Ti.include('/includes/user.js');

Ti.include('/ui/common/baseUI.js');

var oAuth = require('/includes/oAuth');

var pageLoaded = false;

function initManualView() {

}

currentWin.addEventListener('open', function() {
	if (!pageLoaded) {
		pageLoaded = true;
		innerBaseUI.initNavBar = true;
		initBaseUITopBar(false, false);
		if (isAndroid) {
			initBaseUINavBar('manual');
		}
		initBaseView();
		initManualView();
	}
});

currentWin.addEventListener('close', function() {
	removeAllChildren(currentWin);
});
