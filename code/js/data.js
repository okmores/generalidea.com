
// 	===== DATA BANK ===== //

var theUser = {
	navigator: 	navigator.userAgent,
	device: 		"",
	platform: 	navigator,
	mobile: 		false,
	retina:		window.devicePixelRatio > 1,
	touch:		'ontouchstart' in window || navigator.maxTouchPoints > 0,
	os:			"",
	browser:		"",
	supports: 	{ item1: "", item2: "" }
	}

const OPSZ_IPHONE_NONE_MAX_PX = 72;

function setOpticalSizingPolicy() {
	const rootStyle = getComputedStyle(document.documentElement);
	const rootFontSize = parseFloat(rootStyle.fontSize) || 16;
	const opszThresholdVar = rootStyle.getPropertyValue("--opsz-threshold-px").trim();
	const opszThreshold = parseFloat(opszThresholdVar) || OPSZ_IPHONE_NONE_MAX_PX;
	const isIPhone = /iPhone/i.test(theUser.navigator);
	const useNone = isIPhone && theUser.retina && rootFontSize < opszThreshold;

	document.documentElement.dataset.opsz = useNone ? "none" : "auto";
	document.documentElement.dataset.opszThreshold = opszThreshold;
}

// Detect OS, Browser, and Device
function detectUserAgent() {
    const ua = theUser.navigator;
    let os = "Unknown OS";
    let browser = "Unknown";
    let device = "Desktop";

    // Detect OS
    if (/Windows Phone/i.test(ua)) {
        os = "Windows Phone";
    } else if (/Android/i.test(ua)) {
        os = "Android";
    } else if (/webOS/i.test(ua)) {
        os = "webOS";
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
        os = "iOS";
    } else if (/Mac/i.test(ua)) {
        os = "macOS";
    } else if (/Windows/i.test(ua)) {
        os = "Windows";
    } else if (/Linux/i.test(ua)) {
        os = "Linux";
    }
	theUser.os = os;

    // Detect Browser
    if (/Edge\/\d+/i.test(ua)) {
        browser = "Edge";
    } else if (/Chrome\/\d+/i.test(ua)) {
        browser = "Chrome";
    } else if (/Firefox\/\d+/i.test(ua)) {
        browser = "Firefox";
    } else if (/Safari\/\d+/i.test(ua)) {
        browser = "Safari";
    } else if (/MSIE|Trident/i.test(ua)) {
        browser = "IE";
    } else if (/Opera|OPR/i.test(ua)) {
        browser = "Opera";
	}
	theUser.browser = browser;

	// Detect Device Type
	if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
		device = "Mobile";
	} else if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		device = "Tablet";
	}
	theUser.device = device;

	// Log Retina and Touch Support
	document.documentElement.dataset.retina = theUser.retina ? "true" : "false";
	document.documentElement.dataset.touch = theUser.touch ? "true" : "false";
	document.documentElement.dataset.touchValue = theUser.touch ? 1 : 0;
	setOpticalSizingPolicy();
	if (devMode) {
		console.log(`   Retina: ${document.documentElement.dataset.retina}`);
		console.log(`   Touch: ${document.documentElement.dataset.touch}`);
		console.log(`   Touch Value: ${document.documentElement.dataset.touchValue}`);
	}
}

var theWindow = {
	orientation: 	"",
	width: 			0,
	height:			0,
	area:				0,
	ratio:			0
	}

var theSite = {
	currentPage:	"",
	showtime:		false,	// media playing
	showMe:			""   	   // name of presentation
	}

/*	===== PATHS ===== */

const paths = {
	JSON : "code/json" ,
	CSS :  "code/css" ,
	js :   "code/js"
	}

	// const segments = window.viewport.segments;

	// segments.forEach((segment) =>
	//   console.log(
	// 	 `Segment ${segments.indexOf(segment)} is ${segment.width}px x ${segment.height}px`,
	//   ),
	// );
	