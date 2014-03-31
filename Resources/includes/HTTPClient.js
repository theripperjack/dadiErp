Ti.include('/includes/TiToast.js');
var counter = 0;

function ajaxQuery(url, type, params, header, qtype) {
	if (Ti.Network.networkType === Ti.Network.NETWORK_NONE) {
		TiToast.show(getMessageByCode(250));
		return null;
	}
	var request = Titanium.Network.createHTTPClient({
		timeout : 30000,
		onerror : function(e) {
			Ti.API.debug(e.error);
		}
	});
	var res_type = typeof qtype === 'undefined' ? 'json' : qtype.toString().toLocaleLowerCase();
	if (type == 'GET' && params != null) {
		url += '?';
		for (var p in params) {
			if (params.hasOwnProperty(p)) {
				url += p + '=' + params[p] + '&';
			}
		}
		url = encodeURI(url);
	}
	request.open(type, url, false);
	if (header) {
		request.setRequestHeader('Authorization', header);
	}
	if (type == 'POST' && params != null) {
		request.send(params);
	} else {
		request.send();
	}

	var timeout = 30000;
	var expire_time = new Date().getTime() + timeout;
	while (request.readyState <= 4) {
		if (request.readyState == 4 && request.status == 200) {
			var responseData = {};
			if (res_type == 'json') {
				var jsonLength = request.getResponseHeader("Content-Length");
				if (request.responseText.length == jsonLength) {
					Ti.API.info("request.responseText=" + request.responseText);
					var responseData = JSON.parse(request.responseText);
					if (responseData.meta.stat != "ok") {
						TiToast.show(getMessageByCode(responseData.meta.code));
					}
				}
			} else if (res_type == 'source') {
				var responseData = request.responseData;
			}
			if ( typeof responseData.meta === 'undefined') {
				TiToast.show(L('net_error_message'));
				return null;
			} else {
				return responseData;
			}
		}
		var now_time = new Date().getTime();
		if (now_time > expire_time) {
			/*
			 counter++;
			 if (counter >= 3) {
			 var a = Titanium.UI.createAlertDialog({
			 title : 'Failed',
			 message : L('net_error_message2'),
			 buttonNames : ['OK', 'Cancel']
			 }).show();
			 a.addEventListener('click', function(e) {
			 if (e.index == 0) {
			 Ti.App.fireEvent('logout');
			 }
			 a.hide();
			 });
			 counter = 0;
			 } else {
			 TiToast.show(L('net_error_message'));
			 }
			 */
			TiToast.show(L('net_error_message'));
			return null;
		}
	}
}

function getMessageByCode(code) {
	return L('error_' + code);
}