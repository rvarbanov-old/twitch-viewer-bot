var http = require('http'),
	childProcess = require('child_process'),
	request = require('request'),
	prompt = require('prompt'),
	activeViewers = 0,
	totalViewers = (process.argv.length > 2 ? parseInt(process.argv[2], 10) : 10),
	viewerMin = Math.floor(totalViewers - (totalViewers / 6)),
	viewerMax = Math.floor(totalViewers + (totalViewers / 6)),
	streamName = (process.argv.length > 3 ? process.argv[3] : undefined),
	showDebug = (process.argv.length > 4),
	proxyList = [];

function displayIntro() {
	console.log('--------------------------------------------');
	console.log('--                                        --');
	console.log('--           Twitch Viewer Bot            --');
	console.log('--          by Beau West (shhh)           --');
	console.log('--                                        --');
	console.log('--------------------------------------------');
	console.log('     spinning up ' + viewerMin + ' to ' + viewerMax + ' bots\n');
	manuallyChangeViewerCount();
};
displayIntro();

// http://letushide.com/fpapi/?key=3def5dbafa85dada46c4bc59&format=json&ps=http
(function prepareProxyList() {
	var response = JSON.parse('{"status":0,"message":"","quota":98,"count":120,"data":[{"host":"201.221.131.70","port":"8080","anonymity":"TP","protocol":"HTTP","country":"CO"},{"host":"188.165.158.83","port":"3128","anonymity":"AP","protocol":"HTTP","country":"FR"},{"host":"200.110.243.150","port":"3128","anonymity":"TP","protocol":"HTTP","country":"VE"},{"host":"41.207.106.77","port":"3128","anonymity":"TP","protocol":"HTTP","country":"KE"},{"host":"190.96.220.70","port":"80","anonymity":"TP","protocol":"HTTP","country":"CO"},{"host":"125.214.171.26","port":"8080","anonymity":"TP","protocol":"HTTP","country":"LK"},{"host":"112.90.146.76","port":"3128","anonymity":"TP","protocol":"HTTP","country":"CN"},{"host":"189.85.29.98","port":"8080","anonymity":"TP","protocol":"HTTP","country":"BR"},{"host":"27.17.33.122","port":"8001","anonymity":"HAP","protocol":"HTTP","country":"CN"},{"host":"183.136.221.6","port":"3128","anonymity":"HAP","protocol":"HTTP","country":"CN"},{"host":"190.0.46.66","port":"8080","anonymity":"TP","protocol":"HTTP","country":"CO"},{"host":"109.224.62.197","port":"80","anonymity":"TP","protocol":"HTTP","country":"IQ"},{"host":"218.108.242.108","port":"3128","anonymity":"TP","protocol":"HTTP","country":"CN"},{"host":"110.77.137.220","port":"8080","anonymity":"TP","protocol":"HTTP","country":"TH"},{"host":"60.52.157.178","port":"3128","anonymity":"TP","protocol":"HTTP","country":"MY"},{"host":"190.122.98.147","port":"8080","anonymity":"TP","protocol":"HTTP","country":"DO"},{"host":"109.224.62.197","port":"8080","anonymity":"TP","protocol":"HTTP","country":"IQ"},{"host":"114.80.136.112","port":"7780","anonymity":"AP","protocol":"HTTP","country":"CN"},{"host":"177.99.197.1","port":"3128","anonymity":"TP","protocol":"HTTP","country":"BR"},{"host":"202.51.102.34","port":"8080","anonymity":"TP","protocol":"HTTP","country":"ID"},{"host":"202.98.123.126","port":"8080","anonymity":"AP","protocol":"HTTP","country":"CN"},{"host":"93.123.45.23","port":"8008","anonymity":"TP","protocol":"HTTP","country":"BG"},{"host":"197.210.252.44","port":"80","anonymity":"TP","protocol":"HTTP","country":"NG"},{"host":"202.151.248.22","port":"80","anonymity":"TP","protocol":"HTTP","country":"MY"},{"host":"186.237.16.198","port":"80","anonymity":"TP","protocol":"HTTP","country":"BR"},{"host":"67.136.153.130","port":"3128","anonymity":"DP","protocol":"HTTP","country":"US"},{"host":"200.75.51.148","port":"8080","anonymity":"AP","protocol":"HTTP","country":"CO"},{"host":"50.116.14.74","port":"80","anonymity":"AP","protocol":"HTTP","country":"US"},{"host":"115.29.164.173","port":"80","anonymity":"AP","protocol":"HTTP","country":"CN"},{"host":"202.143.185.107","port":"8080","anonymity":"TP","protocol":"HTTP","country":"TH"},{"host":"187.61.245.199","port":"3129","anonymity":"TP","protocol":"HTTP","country":"BR"},{"host":"200.61.21.75","port":"8080","anonymity":"TP","protocol":"HTTP","country":"AR"},{"host":"41.215.7.94","port":"8080","anonymity":"AP","protocol":"HTTP","country":"KE"},{"host":"202.106.16.36","port":"3128","anonymity":"TP","protocol":"HTTP","country":"CN"},{"host":"186.238.51.149","port":"8080","anonymity":"TP","protocol":"HTTP","country":"BR"},{"host":"210.22.59.66","port":"3128","anonymity":"DP","protocol":"HTTP","country":"CN"},{"host":"203.201.164.4","port":"8000","anonymity":"TP","protocol":"HTTP","country":"ID"},{"host":"140.206.86.68","port":"8080","anonymity":"AP","protocol":"HTTP","country":"CN"},{"host":"187.61.117.11","port":"8080","anonymity":"TP","protocol":"HTTP","country":"BR"},{"host":"109.175.8.49","port":"8080","anonymity":"TP","protocol":"HTTP","country":"BA"},{"host":"117.59.224.58","port":"80","anonymity":"TP","protocol":"HTTP","country":"CN"},{"host":"116.112.66.102","port":"808","anonymity":"AP","protocol":"HTTP","country":"CN"},{"host":"187.32.127.161","port":"3128","anonymity":"TP","protocol":"HTTP","country":"BR"},{"host":"186.5.102.162","port":"8080","anonymity":"DP","protocol":"HTTP","country":"EC"},{"host":"177.21.227.129","port":"8080","anonymity":"TP","protocol":"HTTP","country":"BR"},{"host":"190.122.186.220","port":"8080","anonymity":"TP","protocol":"HTTP","country":"GT"},{"host":"188.121.63.235","port":"80","anonymity":"HAP","protocol":"HTTP","country":"NL"},{"host":"183.207.228.114","port":"80","anonymity":"TP","protocol":"HTTP","country":"CN"},{"host":"202.43.188.156","port":"8080","anonymity":"TP","protocol":"HTTP","country":"ID"},{"host":"217.16.9.173","port":"3128","anonymity":"TP","protocol":"HTTP","country":"FR"},{"host":"71.15.31.70","port":"8090","anonymity":"TP","protocol":"HTTP","country":"US"},{"host":"41.207.116.197","port":"3128","anonymity":"TP","protocol":"HTTP","country":"KE"},{"host":"50.198.197.234","port":"3128","anonymity":"AP","protocol":"HTTP","country":"US"},{"host":"37.187.16.186","port":"80","anonymity":"HAP","protocol":"HTTP","country":"FR"},{"host":"200.84.106.128","port":"8080","anonymity":"AP","protocol":"HTTP","country":"VE"},{"host":"122.226.73.248","port":"8080","anonymity":"TP","protocol":"HTTP","country":"CN"},{"host":"121.199.60.143","port":"3128","anonymity":"TP","protocol":"HTTP","country":"CN"},{"host":"41.220.28.138","port":"8080","anonymity":"TP","protocol":"HTTP","country":"ZW"},{"host":"121.33.222.228","port":"9999","anonymity":"TP","protocol":"HTTP","country":"CN"},{"host":"98.137.63.242","port":"80","anonymity":"TP","protocol":"HTTP","country":"US"},{"host":"177.99.176.146","port":"8080","anonymity":"AP","protocol":"HTTP","country":"BR"},{"host":"111.161.126.85","port":"80","anonymity":"TP","protocol":"HTTP","country":"CN"},{"host":"219.148.47.124","port":"11119","anonymity":"HAP","protocol":"HTTP","country":"CN"},{"host":"188.237.180.55","port":"80","anonymity":"TP","protocol":"HTTP","country":"MD"},{"host":"176.31.99.48","port":"3128","anonymity":"TP","protocol":"HTTP","country":"FR"},{"host":"65.48.113.25","port":"9999","anonymity":"TP","protocol":"HTTP","country":"US"},{"host":"211.103.250.145","port":"80","anonymity":"HAP","protocol":"HTTP","country":"CN"},{"host":"186.93.127.247","port":"8080","anonymity":"AP","protocol":"HTTP","country":"VE"},{"host":"210.212.97.139","port":"3128","anonymity":"TP","protocol":"HTTP","country":"IN"},{"host":"82.119.113.2","port":"80","anonymity":"","protocol":"HTTP","country":"SK"},{"host":"41.207.106.85","port":"3128","anonymity":"TP","protocol":"HTTP","country":"KE"},{"host":"95.38.32.29","port":"8080","anonymity":"TP","protocol":"HTTP","country":"IR"},{"host":"95.38.112.35","port":"8080","anonymity":"TP","protocol":"HTTP","country":"IR"},{"host":"177.136.224.17","port":"8080","anonymity":"TP","protocol":"HTTP","country":"BR"},{"host":"201.251.156.17","port":"8080","anonymity":"TP","protocol":"HTTP","country":"AR"},{"host":"79.120.71.29","port":"5555","anonymity":"TP","protocol":"HTTP","country":"RU"},{"host":"115.29.193.159","port":"80","anonymity":"AP","protocol":"HTTP","country":"CN"},{"host":"190.248.131.214","port":"8080","anonymity":"TP","protocol":"HTTP","country":"CO"},{"host":"115.29.164.39","port":"80","anonymity":"AP","protocol":"HTTP","country":"CN"},{"host":"189.80.213.213","port":"3128","anonymity":"TP","protocol":"HTTP","country":"BR"},{"host":"87.98.216.22","port":"3128","anonymity":"TP","protocol":"HTTP","country":"FR"},{"host":"77.249.40.94","port":"8080","anonymity":"TP","protocol":"HTTP","country":"NL"},{"host":"183.63.131.18","port":"9999","anonymity":"TP","protocol":"HTTP","country":"CN"},{"host":"176.61.136.76","port":"8080","anonymity":"DP","protocol":"HTTP","country":"SE"},{"host":"213.209.107.179","port":"80","anonymity":"DP","protocol":"HTTP","country":"DE"},{"host":"118.97.20.19","port":"8080","anonymity":"TP","protocol":"HTTP","country":"ID"},{"host":"212.144.254.122","port":"3128","anonymity":"TP","protocol":"HTTP","country":"DE"},{"host":"222.87.129.29","port":"80","anonymity":"AP","protocol":"HTTP","country":"CN"},{"host":"193.136.132.142","port":"80","anonymity":"HAP","protocol":"HTTP","country":"PT"},{"host":"115.28.2.224","port":"80","anonymity":"HAP","protocol":"HTTP","country":"CN"},{"host":"71.15.31.70","port":"80","anonymity":"TP","protocol":"HTTP","country":"US"},{"host":"188.168.82.131","port":"3128","anonymity":"HAP","protocol":"HTTP","country":"RU"},{"host":"203.172.248.70","port":"3128","anonymity":"TP","protocol":"HTTP","country":"TH"},{"host":"111.1.32.51","port":"8089","anonymity":"HAP","protocol":"HTTP","country":"CN"},{"host":"183.238.133.43","port":"80","anonymity":"HAP","protocol":"HTTP","country":"CN"},{"host":"93.184.33.166","port":"8080","anonymity":"TP","protocol":"HTTP","country":"FR"},{"host":"186.101.72.121","port":"80","anonymity":"HAP","protocol":"HTTP","country":"EC"},{"host":"176.61.136.2","port":"8080","anonymity":"AP","protocol":"HTTP","country":"SE"},{"host":"41.207.116.217","port":"3128","anonymity":"TP","protocol":"HTTP","country":"KE"},{"host":"119.6.79.142","port":"80","anonymity":"AP","protocol":"HTTP","country":"CN"},{"host":"109.196.210.110","port":"8080","anonymity":"AP","protocol":"HTTP","country":"RU"},{"host":"94.137.239.19","port":"81","anonymity":"HAP","protocol":"HTTP","country":"RU"},{"host":"223.4.55.66","port":"80","anonymity":"AP","protocol":"HTTP","country":"CN"},{"host":"200.196.234.30","port":"8080","anonymity":"TP","protocol":"HTTP","country":"BR"},{"host":"188.237.180.55","port":"8080","anonymity":"TP","protocol":"HTTP","country":"MD"},{"host":"119.188.46.42","port":"8080","anonymity":"AP","protocol":"HTTP","country":"CN"},{"host":"177.43.168.35","port":"80","anonymity":"TP","protocol":"HTTP","country":"BR"},{"host":"117.59.224.62","port":"80","anonymity":"TP","protocol":"HTTP","country":"CN"},{"host":"183.61.240.126","port":"1080","anonymity":"HAP","protocol":"HTTP","country":"CN"},{"host":"120.85.132.234","port":"80","anonymity":"DP","protocol":"HTTP","country":"CN"},{"host":"212.144.254.123","port":"3128","anonymity":"TP","protocol":"HTTP","country":"DE"},{"host":"218.204.52.138","port":"9000","anonymity":"TP","protocol":"HTTP","country":"CN"},{"host":"220.110.137.44","port":"8080","anonymity":"TP","protocol":"HTTP","country":"JP"},{"host":"221.204.231.55","port":"3128","anonymity":"TP","protocol":"HTTP","country":"CN"},{"host":"111.161.126.93","port":"8080","anonymity":"TP","protocol":"HTTP","country":"CN"},{"host":"213.125.24.236","port":"8080","anonymity":"AP","protocol":"HTTP","country":"NL"},{"host":"41.207.116.229","port":"3128","anonymity":"TP","protocol":"HTTP","country":"KE"},{"host":"218.104.118.54","port":"8080","anonymity":"TP","protocol":"HTTP","country":"CN"},{"host":"190.122.186.197","port":"8080","anonymity":"TP","protocol":"HTTP","country":"GT"},{"host":"80.193.214.237","port":"3128","anonymity":"TP","protocol":"HTTP","country":"GB"}]}');

	response.data.forEach(function (proxy) {
		proxyList.push({
			'host': proxy.host,
			'port': proxy.port,
			'urls': []
		});
	});
})();

// Manually enter a new viewer count.
function manuallyChangeViewerCount() {
	prompt.start();
	prompt.get([
		{
			description: 'Choose a new viewer amount',
			name: 'newViewers',
			type: 'number',
			validator: /^[0-9]+$/,
			warning: 'Please enter a valid number.',
			default: totalViewers
		}
	], function (error, result) {
		if(error) {
			console.log('\n');
			process.exit();
		}
		totalViewers = result.newViewers;
		viewerMin = Math.floor(totalViewers - (totalViewers / 6));
		viewerMax = Math.floor(totalViewers + (totalViewers / 6));
		displayIntro();
	});
}

// Randomize the viewer total every minute.
(function randomizeViewerTotal() {
	totalViewers = Math.floor(Math.random() * (viewerMax - viewerMin + 1)) + viewerMin;
	if (totalViewers !== activeViewers) {
		console.log('Adjusting viewer count to: ' + totalViewers);
	}
	setTimeout(randomizeViewerTotal, 60000);
})();

(function viewsLoop() {
	var countViewers = 0;
	if (proxyList.length > 0) {
		proxyList.forEach(function (proxy, proxyIndex) {
			if (proxy.urls.length > 0) {
				proxy.urls.forEach(function (address, addressIndex) {
					++countViewers;
					view(proxy, address, proxyIndex, addressIndex);
				});
			}
		});
	}
	activeViewers = countViewers;
	console.log('Total viewers: ' + countViewers + '/' + totalViewers);
	if (activeViewers !== totalViewers) {
		adjustToViewerCount();
	}
	setTimeout(viewsLoop, 5000);
})();

var running = false;
function adjustToViewerCount() {
	if (running && new Date().getTime() - running.getTime() <= (5000)) {
		return;
	}
	running = new Date();
	if (activeViewers < totalViewers) {
		var proxyIndex = getAvailableProxy();
		addToProxy(proxyIndex, function () {
			if (totalViewers !== activeViewers) {
				running = false;
				adjustToViewerCount();
			}
		});
	}
	else if (activeViewers > totalViewers) {
		var remove = true;
		proxyList.forEach(function (proxy, proxyIndex) {
			if (remove && proxy.urls && proxy.urls.length > 0) {
				proxyList[proxyIndex].urls.shift();
				--activeViewers;
				remove = false;
			}
		});
		if (totalViewers !== activeViewers) {
			running = false;
			adjustToViewerCount();
		}
	} else {
		running = false;
	}
}

function addToProxy(proxyIndex, callback) {
	console.log('Adding viewer #' + (activeViewers + 1) + ' - Proxy: ' + proxyIndex);
	getNewViewerURL(function (address) {
		if (address) {
			++activeViewers;
			proxyList[proxyIndex].urls.push(address);
		}
		callback();
	});
}

function getAvailableProxy() {
	var keys = Object.keys(proxyList);
	var proxy = keys[Math.floor(Math.random() * keys.length)];
	if (proxyList[proxy].urls.length >= 10) {
		return getAvailableProxy();
	}
	return proxy;
}

// Send a view.
function view(proxy, address, proxyIndex, addressIndex) {
	request.head({
		'url': address,
		'proxy': 'http://' + proxy.host + ':' + proxy.port,
		'timeout': 5000
	}, function (error, response) {

		// Remove the URL if it errors.
		if (error && error.code !== 'ETIMEDOUT' && error.code !== 'ECONNRESET') {
			if (showDebug) {
				console.error(error);
			}
			if (typeof proxyList[proxyIndex].urls[addressIndex] !== 'undefined') {
				proxyList[proxyIndex].urls.splice(addressIndex, 1);
				--activeViewers;
				adjustToViewerCount();
			}
		}
	});
}

// Get the viewer URL.
var livestreamerProxy = undefined;
function getNewViewerURL(callback) {
	try {
		if (livestreamerProxy === undefined) {
			livestreamerProxy = getAvailableProxy();
		}

		childProcess.exec('livestreamer twitch.tv/' + streamName + ' -j --http-timeout 5 --http-proxy http://' + proxyList[livestreamerProxy].host + ':' + proxyList[livestreamerProxy].port + '/',
			function (error, stdout, stderr) {
				var details = JSON.parse(stdout);
				if (details.error) {
					if (showDebug) {
						console.error(details.error);
					}
					livestreamerProxy = undefined;
					callback();
				} else {
					callback(details.streams.worst.url);
				}
			});
	} catch (exception) {
		if (showDebug) {
			console.error(exception);
		}
		if (exception.code && exception.code === 'EMFILE') {
			setTimeout(callback, 1000);
		} else {
			callback();
		}
	}
}
