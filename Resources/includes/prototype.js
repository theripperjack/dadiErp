Date.prototype.parseDate = function(dt) {
	var dtstr = dt.replace(/-/g, '/');
	return new Date(Date.parse(dtstr));
};

Date.prototype.setGMT = function(dt) {
	var dtstr = dt.replace(/-/g, '/') + ' GMT';
	return new Date(Date.parse(dtstr));
};

Date.prototype.toLocal = function() {
	var min = this.getTime() / 1000 / 60;
	var localNow = new Date().getTimezoneOffset();
	var localTime = min - localNow;
	return new Date(localTime * 1000 * 60);
};

Date.prototype.timeAgo = function() {
	var time_formats = [[60, 'just now', 'just now'], // 60
	[120, '1 minute ago', '1 minute from now'], // 60*2
	[3600, 'minutes', 60], // 60*60, 60
	[7200, '1 hour ago', '1 hour from now'], // 60*60*2
	[86400, 'hours', 3600], // 60*60*24, 60*60
	[172800, 'yesterday', 'tomorrow'], // 60*60*24*2
	[604800, 'days', 86400], // 60*60*24*7, 60*60*24
	[1209600, 'last week', 'next week'], // 60*60*24*7*4*2
	[2419200, 'weeks', 604800] // 60*60*24*7*4, 60*60*24*7
	];
	var seconds = (new Date - this.getTime()) / 1000;
	var token = 'ago', list_choice = 1;
	if (seconds < 0) {
		seconds = Math.abs(seconds);
		token = 'from now';
		list_choice = 2;
	}
	var i = 0, format;
	while ( format = time_formats[i++]) {
		if (seconds < format[0]) {
			if ( typeof format[2] == 'string') {
				return format[list_choice];
			} else {
				return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
			}
		}
	}
	return this.format("N d, yyyy");
};

Date.prototype.format = function(format) {
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var o = {
		"M+" : this.getMonth() + 1, //month
		"d+" : this.getDate(), //day
		"h+" : this.getHours(), //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
		"S" : this.getMilliseconds(), //millisecond
		"F" : monthNames[this.getMonth()],
		"N" : shortMonthNames[this.getMonth()]
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	var use_month_flag = false;
	for (var k in o) {
		if (!use_month_flag && new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			if (k == 'F' || k == 'N') {
				use_month_flag = true;
			}
		}
	}
	return format;
};

Date.prototype.timeAmPm = function() {
	var hours = this.getHours();
	var minutes = this.getMinutes();
	var format = "am";
	if (hours > 12) {
		format = "pm";
		hours -= 12;
	}
	if (hours == 0) {
		hours = 12;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	return hours + ":" + minutes + " " + format;
};

Array.prototype.inArray = function(value) {
	var i;
	for ( i = 0; i < this.length; i++) {
		// Matches identical (===), not just similar (==).
		if (this[i] === value) {
			return true;
		}
	}
	return false;
};

Array.prototype.clear = function() {
	this.length = 0;
};

Array.prototype.insert = function(index, obj) {
	this.splice(index, 0, obj);
};

Array.prototype.remove = function(index) {
	this.splice(index, 1);
};

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
};

String.prototype.ucfirst = function() {
	return this.length > 0 ? this.charAt(0).toUpperCase() + this.slice(1).toLowerCase() : '';
};

String.prototype.addslashes = function() {
	return this ? this.replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/'/g, '\\\'').replace(/"/g, '\\"') : '';
};

String.prototype.sizeFormat = function() {
	var thresh = 1024;
	var bytes = parseInt(this);
	if (bytes < thresh)
		return bytes + ' B';
	var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var u = -1;
	do {
		bytes /= thresh; ++u;
	} while(bytes >= thresh);
	return bytes.toFixed(1) + ' ' + units[u];
};

function elementsMerge(obj1, obj2) {
	for (var p in obj2) {
		if (obj2.hasOwnProperty(p)) {
			obj1[p] = obj2[p];
		}
	}
	return obj1;
}

function elementsTotal(obj1) {
	var count = 0;
	for (var p in obj1) {
		if (obj1.hasOwnProperty(p)) {
			count++;
		}
	}
	return count;
}
