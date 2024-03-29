function save_options() {
	var colorMode = document.getElementById('colorMode').value;
	var windowSize = document.getElementById('windowSize').value;
	var keyApi = document.getElementById('keyAPI').value;
	chrome.storage.sync.set({
		colorMode: colorMode,
		windowSize: windowSize,
		keyApi: keyApi
	}, function () {
		var status = document.getElementById('status');
		status.innerHTML = 'Options saved.';
		setTimeout(function () {
			status.innerHTML = '';
		}, 1000);
	});
}

function restore_options() {
	// chrome.storage.sync.clear();
	chrome.storage.sync.get({
		colorMode: 'dark',
		windowSize: '25vw',
		keyApi: ''
	}, function (items) {
		document.getElementById('colorMode').value = items.colorMode;
		document.getElementById('windowSize').value = items.windowSize;
		document.getElementById('keyAPI').value = items.keyApi;
	});
}

function test_api_key() {
	document.getElementById('keyAPI').value;
	var labelTestAPI = document.getElementById('status');
	$.ajax({
		url: 'https://api.stackexchange.com/2.2/info?site=stackoverflow&key=' + document.getElementById('keyAPI').value,
		type: 'GET',
		success: function (data) {
			labelTestAPI.innerHTML = 'Key success!';
		},
		error: function (data) {
			labelTestAPI.innerHTML = 'Bad key !';
		}
	});
	setTimeout(function () {
		labelTestAPI.innerHTML = '';
	}, 1500);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('testAPI').addEventListener('click', test_api_key);