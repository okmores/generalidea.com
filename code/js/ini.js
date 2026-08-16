

/* ===== DEV MODE =====
	If the devTools.js file exists in the javascript directory,
	and devMode == false, the developer aids will not load. 
	See devTools.js for more.*/
		
function setDevMode() {
	if (devMode) {
		console.log ("Developer Mode");
		const devBtn = document.getElementById("dev-panel-btn");
		devBtn.style.visibility = "visible";
		// add other devMode features in devTools.js
	} else {
		document.getElementById("dev-panel-btn").style.visibility = "hidden";
	}}

	var iniFirstRun = true;

/*	===== COPYRIGHT =====
	Do not include the (c) symbol in copyright text. */

function doCopyright() {
	const copyrightText = "General Idea, Inc. and Preuit Holland";
	const year = new Date().getFullYear().toString();
	const copyrightEl = document.getElementById("copyright");
	const copyrightLine = `&copy;${year} ${copyrightText}`;
	if (copyrightEl) {
		copyrightEl.innerHTML = copyrightLine;
	}
	console.log(`(C)${year} ${copyrightText}`);
	}

/*	===== INI =====  */

async function ini(){
	console.log ("Initialize...");
	doCopyright();
	setDevMode();
	detectUserAgent();
	if (document.querySelector(".scroller")) {
		document.querySelector(".scroller").scrollTo(0,0);
	}
	// await loadMedia("code/json/mediaVault.json");
	setSitePages();
	updateWindow();
	initializePlayers();
	iniFirstRun = false;
	}

// Wait until the DOM is fully loaded before running ini()

if (document.readyState === "complete") {
	ini();
} else {
	document.addEventListener("DOMContentLoaded", () => ini(), { once: true });
}
