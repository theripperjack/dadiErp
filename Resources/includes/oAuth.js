Ti.include("/includes/APIConfig.js");
Ti.include("/includes/HTTPClient.js");

var oAuthErrorNo = null;
var oAuthErrors = null;

/**
 * submit params only Ajax
 * @param {String} apiName
 * @param {Object} params
 */
exports.ajaxRequest = function(apiName, params) {
	if ( typeof APIConfig[apiName] !== 'undefined') {
		var api = APIConfig[apiName];
		var url = APIConfig.baseUrl + api.url;
		var submit_params = {};
		var params_count = 0;
		oAuthErrors = null;

		if ( typeof api.params !== 'undefined') {
			for (var p in api.params) {
				if (api.params.hasOwnProperty(p)) {
					submit_params[p] = api.params[p];
					params_count++;
				}
			}
		}

		if ( typeof params !== 'undefined') {
			for (var p in params) {
				if (params.hasOwnProperty(p)) {
					submit_params[p] = params[p];
					params_count++;
				}
			}
		}
		if (params_count == 0) {
			submit_params = null;
		}
		var responseData = ajaxQuery(url, api.method, submit_params, USER.getAuth(), 'json');
		if (responseData) {
			if (responseData.response && responseData.response.errors) {
				oAuthErrors = responseData.response.errors;
			}
			oAuthErrorNo = (responseData.meta.code != 200) ? responseData.meta.code : null;
		}
		return (responseData && responseData.meta.code == 200) ? (responseData.response ? responseData.response : true) : false;
	}
};

exports.getErrors = function() {
	return oAuthErrors;
};

exports.getErrorNo = function() {
	return oAuthErrorNo;
};

exports.getErrorMsg = function() {
	return oAuthErrorNo ? L('error_' + oAuthErrorNo) : '';
};
