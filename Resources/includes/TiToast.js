var TiToast = {
	show : function(message) {
		if (Ti.Platform.osname === 'android') {
			Ti.UI.createNotification({
				message : message,
				duration : Ti.UI.NOTIFICATION_DURATION_LONG
			}).show();
		} else {
			var indWin = Ti.UI.createWindow();

			//  view
			var indView = Ti.UI.createView({
				height : 50,
				width : 250,
				borderRadius : 10,
				backgroundColor : '#000000',
				opacity : 0.7,
				touchEnabled : false,
				top : 320,
			});

			indWin.add(indView);

			// message
			var message = Ti.UI.createLabel({
				text : message,
				color : '#ffffff',
				width : 250,
				height : 'auto',
				font : {
					fontFamily : 'Helvetica Neue',
					fontSize : 13
				},
				textAlign : 'center',
				top : 325
			});

			indWin.add(message);
			indWin.open();

			setTimeout(function() {
				indWin.close({
					opacity : 0,
					duration : 1000
				});
			}, 2000);
		}
	}
};
