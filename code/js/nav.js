/* global clearTimeout, setTimeout, document */


// ...existing code...

//	===== SCROLL TO =====  //

function boogieTo(element) {
	// element.scrollIntoView({ behavior: "smooth"});
	document.getElementById(element).scrollIntoView({
		behavior: "smooth",
		block: "start",
		inline: "nearest"
	});
}

//	===== BTN HIT ===== //

function btnHit (source, btn, option) {
	const srcEl = source;
	const srcName = srcEl.dataset.name;
	const srcState = srcEl.dataset.state;
	const btnEl = btn;
	// const btnEl = (typeof btn === "string") ? docu÷ment.getElementById(btn) : btn;
	const btnName = btnEl.dataset.name;
	const btnState = btnEl.dataset.state;
	const optFlag = !option? "" : `option: ${option}`;
	
	console.log(`btnHit(): ${srcName}: ${btnName} ${optFlag}`);
	// ==== MAIN MENU BUTTONS ===== //

if (srcName === "main-menu") {
	switch (btnName) {
		case 'Home':
			if (theUser.touch) {
				console.log(`btnHit() "touch event" detected from ${srcName}: ${btnName}`);
				if (srcState === "closed") {
					showMenu(srcEl);
				} else { 
					boogieTo('home');
					hideMenu(srcEl, 1, "click");
					srcEl.dataset.state = "closed";
				}
				break;
			} else {
				boogieTo('home');
				hideMenu(srcEl, 1, "click");
			}
			break;
		case 'Dictionary':
			boogieTo('dictionary');
			hideMenu(srcEl, 1, "click");
			break;
		case 'Film':
			boogieTo('gallery-film');
			hideMenu(srcEl, 1, "click");
			break;
		case 'Print':
			boogieTo('gallery-print');
			hideMenu(srcEl, 1, "click");
			break;
		case 'Photo':
			boogieTo('gallery-photo')
			hideMenu(srcEl, 1, "click");
			break;
		case 'Clients':
			boogieTo('clients')
			hideMenu(srcEl, 1, "click");
			break;
		case 'Contact':
			boogieTo('contact-page');
			hideMenu(srcEl, 1, "click");
			break;
		case 'getMedia':
			console.info ('btnHit(): getMedia() is not implemented');
			// getMedia();
			break;
		default:
			console.error('btnHit(): requested item not found in switch statement');
		}
	}
}

//	===== SHOW/HIDE MENU ===== //

function showMenu (srcEl, option){
	// const theMenu = srcEl;
	const srcClasses = srcEl.classList;
	const srcName = srcEl.dataset.name;
	const theOption = !option? "" : `option: ${option}`;
	clearTimeout(srcEl.dataset.timeoutID);
	srcClasses.remove("closed");
	srcClasses.add("open");
	srcEl.dataset.state = "open";
	console.log(`showMenu(79): ${srcName} ${theOption}`);
}
async function hideMenu(srcEl, delay, option) {
	const srcClasses = srcEl.classList;
	const srcName = srcEl.dataset.name;
	const theDelay = (typeof delay === "number") ? delay : 2000;
	const proceed = await pause(srcEl, theDelay);
	//  wait for resolved promise//
	srcClasses.remove("open");
	srcClasses.add("closed");
	srcEl.dataset.state = "closed";
	console.log(`hideMenu(89): ${srcName} ${option? `option: ${option}` : ""} delay: ${theDelay}`);
}

// ==== TOUCH HANDLERS ===== //

const navTouch = (event) => {
	event.preventDefault();
	const link =   event.currentTarget;
	const source = link.dataset.source;
	const item =   link.dataset.name;
	const state = 	link.dataset.state;
	const option = link.dataset.option;
	console.log(`navTouch(): ${source}: ${item}`);
	btnHit(source, item);};

// ==== CLICK HANDLERS ===== //

// const navClick = (event) => {
// 	event.preventDefault();
// 	const link =   event.currentTarget;
// 	const source = link.dataset.source;
// 	const item =   link.dataset.name;
// 	const state = 	link.dataset.state;
// 	console.log(`navClick(): ${source}: ${item}`);
// 	btnHit(source, item)};

// const devClick = (event) => {
// 	event.preventDefault();
// 	const link = event.currentTarget;
// 	const source = link.dataset.source;
// 	const item = link.dataset.name;
// 	const state = 	link.dataset.state;
// 	console.log(`devClick(): ${source}: ${item}`);
// 	btnHit(source, item);};

// ===== EVENT LISTENERS ===== //

function setEvents() {
	// console.log(`setEvents()`);
	const mainMenu = 	  document.getElementById('main-menu');
	const homeBtn = 	  document.getElementById('home-btn');
	const devPanel =    document.getElementById('dev-panel');
	const devPanelBtn = document.getElementById('dev-panel-btn');
	let hideTimerID = null;

	const clearHideTimer = () => {
		if (hideTimerID) {
			clearTimeout(hideTimerID);
			hideTimerID = null;
		}
	};

	const queueHide = () => {
		if (hideTimerID) {
			return;
		}
		hideTimerID = setTimeout(() => {
			hideTimerID = null;
			hideMenu(mainMenu, 1, "mouseleave");
		}, 2000);
	};

	const isHoveringMenuArea = (node) => {
		if (!node) {
			return false;
		}
		return homeBtn.contains(node) || mainMenu.contains(node);
	};

	const onMenuAreaEnter = () => {
		clearHideTimer();
		showMenu(mainMenu);
	};

	const onMenuAreaLeave = (event) => {
		const nextTarget = event.relatedTarget;
		if (isHoveringMenuArea(nextTarget)) {
			return;
		}
		queueHide();
	};
	
	// --- HOME BTN TOUCH ---
	// homeBtn.addEventListener('touchstart', navTouch);

	// --- HOME BTN ---
	homeBtn.addEventListener('mouseenter', onMenuAreaEnter);
	homeBtn.addEventListener('mouseleave', onMenuAreaLeave);
	homeBtn.addEventListener("click", (event) => {
		const source = mainMenu;
		const btn = homeBtn;
		btnHit(source, btn);
	 });

	// --- MAIN MENU ---
	mainMenu.addEventListener('mouseenter', onMenuAreaEnter);
	mainMenu.addEventListener('mouseleave', onMenuAreaLeave);
	mainMenu.querySelectorAll('.btn').forEach(link => {
		link.addEventListener('click', (event) => { 
			const source = mainMenu;
			const btn = link;
			clearHideTimer();
			btnHit(source, btn);
		});
	});

	// --- MAIN MENU EVENT ---
	// mainMenu.querySelectorAll('img').forEach(link => {
	// 	// link.addEventListener('touchstart', navTouch);
	// 	link.addEventListener('click', navClick);
	// });
	
	// ===== DEV PANEL ===== //
	dragMe('dev-panel');
	devPanelBtn.addEventListener('click', function() { toggleMe('dev-panel'); });
	if (typeof devClick === "function") {
		devPanel.querySelectorAll('.btn').forEach(link => {
			link.addEventListener('click', devClick);
		});
	}
}

// ===== LAUNCH ===== //

document.addEventListener('DOMContentLoaded', setEvents);

// ===== DRAGABLE ===== //

function dragMe(target) {
	const elmnt = document.getElementById(target);
	if (!elmnt) {
		return;
	}

	let pos1 = 0;
	let pos2 = 0;
	let pos3 = 0;
	let pos4 = 0;

	elmnt.addEventListener('pointerdown', dragStart);
	
	function dragStart(e) {
		const isControl = e.target.closest('a, button, input, select, textarea, [contenteditable="true"], .btn');
		if (isControl) {
			return;
		}
		e.preventDefault();
		elmnt.setPointerCapture(e.pointerId);
		// cursor position start:
		pos3 = e.clientX;
		pos4 = e.clientY;
		// position while dragging:
		document.addEventListener('pointermove', dragIt);
		document.addEventListener('pointerup', dragStop);
		document.addEventListener('pointercancel', dragStop);
	}
	
	function dragIt(e) {
		e.preventDefault();
		// calculate cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// position end:
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	}
	
	function dragStop(e) {
		if (e && elmnt.hasPointerCapture(e.pointerId)) {
			elmnt.releasePointerCapture(e.pointerId);
		}
		document.removeEventListener('pointerup', dragStop);
		document.removeEventListener('pointercancel', dragStop);
		document.removeEventListener('pointermove', dragIt);
	}
}

// ===== TOGGLE ===== //

function toggleMe(item, event) {
	const target = (typeof item === "string") ? document.getElementById(item) : item;
	console.log(`toggleMe(): ${item} event.`);
	if (!target) {
		console.error(`toggleMe(): ${item} not found`);
		return;
	}
	const classes = target.classList;
	if (classes.contains("open")) {
		classes.remove("open");
		classes.add("closed");
		if (target.id === "dev-panel") {
			// Reset drag offsets and fall back to CSS rule values.
			target.style.left = "";
			target.style.top = "";
		}
	} else {
		classes.remove("closed");
		classes.add("open");
	}	
}