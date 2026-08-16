

/* ===== UTILITIES ===== */
/*	Stuff that does stuff with other stuff.  */

// ===== PAGE OBSERVER ===== //

var sitePages = {};

const options = {
	root: null,
	threshold: 0.25,
	rootmargin: "-60px"  //  snap sensitivity distance  //
	};

const pageObserver = new IntersectionObserver(
	function (entries, pageObserver) {
		entries.forEach(entry => {
			if(!entry.isIntersecting) {
				return;
			}
			theSite.currentPage = entry.target.id;
			updateWindow ();
			// console.log(theSite.currentPage.toUpperCase());
		});
	}, options);

const setSitePages = function () {
	sitePages = document.querySelectorAll('section');
	sitePages.forEach(section => {
		pageObserver.observe(section);
		});
	}

// ===== WINDOW ===== //

function updateWindow () {
	theWindow.width = window.innerWidth;
	theWindow.height = window.innerHeight;
	theWindow.area = theWindow.width * theWindow.height;
	theWindow.ratio = theWindow.width / theWindow.height;
	theWindow.ratio >= 1 ?
		theWindow.orientation = "landscape":
		theWindow.orientation = "portrait" ;
	if (typeof setOpticalSizingPolicy === "function") {
		setOpticalSizingPolicy();
	}
	setOrientation();

// 	Dev menu only //
	document.getElementById('currentPage').innerHTML = theSite.currentPage ;
	document.getElementById('orientation').innerHTML = theWindow.orientation;
	document.getElementById('size').innerHTML = theWindow.width + "-" + theWindow.height;
	document.getElementById('area').innerHTML = theWindow.area;
	document.getElementById('ratio').innerHTML = theWindow.ratio.toFixed(2);
	document.getElementById('retina').innerHTML = theUser.retina ;
	document.getElementById('touch').innerHTML = theUser.touch ;
	document.getElementById('os').innerHTML = theUser.os ;
	document.getElementById('browser').innerHTML = theUser.browser ;
	document.getElementById('device').innerHTML = theUser.device ;
	}


// ===== WINDOW RESIZE =====

var throttled = false,
		delay = 100,
		calls = 0;

window.addEventListener('resize', function() {
	if (throttled) {
		return;
	}else{
		throttled = true;
		setTimeout(function() {
			updateWindow ();
			throttled = false;
		}, delay);
	}
	});


/*	===== SET ORIENTATION ===== */

function setOrientation() {
	const viewport = window.visualViewport || window;
	const width = viewport.width || window.innerWidth;
	const height = viewport.height || window.innerHeight;
	const isLandscape = width >= height;
	const grids = document.querySelectorAll('.gallery, .client-logos-container, .client-logo-gallery');

	grids.forEach(grid => {
		grid.classList.toggle('landscape', isLandscape);
		grid.classList.toggle('portrait', !isLandscape);
	});
}

window.addEventListener('orientationchange', setOrientation);
if (window.visualViewport) {
	window.visualViewport.addEventListener('resize', setOrientation);
}

//	===== PAUSE ======
//	Generic setTimeout(); if delay arg is omitted,
//	there will be no delay. The item element should
//	have dataset.timeoutID on it to facilitate cancelling
//	the timeout. All timeoutIDs are unique and may
//	exist simultaneusly.

let timeoutID = 0;

function pause (item, delay) {
	// console.log(`pause(): ${delay}ms`);
	return new Promise((resolve) => {
		timeoutID = setTimeout(() => {
		  resolve('go');
		}, delay);
		item.dataset.timeoutID = timeoutID;
	});
	}

/*  ===== GET MEDIA =====  //
	Retrieve specified data record(s) and return the
	requested bits.  */

 function getMedia (vaultName, targetName, itemName) {

	const vault  = MasterVault ;			//	DEV ONLY
	const target = "YMA001-03-04-002";		//  DEV ONLY
	const item   = "Venu";					//  DEV ONLY
	let success  = false;

	console.log(`getMedia() ${target} in ${vault.Name}`.toUpperCase());

	for (const element of vault) {
		// Add option to return entire packet);
		const found = element.Code;
		if (found == target) {
			success = true;
			console.log(`--> ${element.Code} ${element[item]}`);
			const result = element[item];
			// console.log(result);
			return result;
			}
		if (!success){
			console.error(`getMedia(): ${target} not found.`.toUpperCase());}
	  }
	}


/*	===== LOADING =====
	Get JSON, parse it, put it where it needs to go.
	*/

// 	DEV ...
// var loader = {
// 	option: {},
// 	get:	{},
// 	load:	{}
// 	}

/* 	===== LOAD AND RETRIEVE CMS DATA =====

//	===== BUILDVAULT =====

	Import JSON data and put it into "Vault" arrays;
	mostly for media management*/

// function buildVault (sourceURL, targetArrayA, option){
// 	const source = 'json/Masters.json';		// temp testing only
// 	const target =  MasterVault;  			// temp dev testing
// 	const extend =  true;					// BROKEN
// 	if (!extend) {delete(target)};
// 	console.log("buildVault(): " + source);

// 	async function loadData (source, target, extend) {
// 		console.log("LoadMedia(): " + source);
// 		const responce = await fetch(source);
// 		const temp = await responce.json();
// 		target = Object.assign(target, temp);
// 		console.log(target);
// 		}

// 	loadData(source, target, extend)
// }



/*	===== LOAD NEDIA =====

	Retrieve specified media from server

	*/


/* 	===== ISOARRAY =====

	OBSOLETE
	Return an array identical to but not linked
	to the source array.

var IsoArray = function (sourceArray) {
	var iso = [];
	for (var i in sourceArray) {
		iso[i] = sourceArray[i] ;
		console.log(iso[i]);
		}
	return iso;
// 	}*/


/*
		// const theDestination = destination;
		// const theItem = Requset (source);

		MasterVault =
		fetch(source)

			.then((responce) => {responce.json()
				// console.log("LoadMedia() data:   " + responce);
				console.log('response.type =', response.type);
				console.log('response.url =', response.url);
				console.log('response.userFinalURL =', response.useFinalURL);
				console.log('response.status =', response.status);
				console.log('response.ok =', response.ok);
				console.log('response.statusText =', response.statusText);
				console.log('response.headers =', response.headers);
			})
			.then((data) => {destination = data })
			// console.log("LoadMedia() data:   " + data)
			.catch(error => {return console.log(error)})
				console.log("LoadMedia() type:   " + typeof(data));
			}

		function handleResponse (response) {
			let contentType = response.headers.get('content-type');
			if (contentType.includes('application/json')) {
				console.log("handleResponce() return: " + response);
				return handleJSONResponse(response)
			} else if (contentType.includes('text/html')) {
				return handleTextResponse(response)
			} else {
				// Other response types, image for example
				throw new Error(`Sorry, content-type ${contentType} not supported`)
			}
			}

		function handleJSONResponse (response) {
			console.log("handleJSONResponse() return: " + response);
		  return response.json()
			.then(json => {

			  if (response.ok) {
				return json
			  } else {
				return Promise.reject(Object.assign({}, json, {
				  status: response.status,
				  statusText: response.statusText
				}))
			  }
			})
		}

		/* --- FOR HTML? ----

		function handleTextResponse (response) {
		  return response.text()
			.then(text => {
			  if (response.ok) {
				return text
			  } else {
				return Promise.reject({
				  status: response.status,
				  statusText: response.statusText,
				  err: text
				})
			  }
			})
		}


/*	===== PARSE =====

	generic parser for JSON; A "reviver" process (function) is the second argument, following  a "," comma.
	A guide to the "reviver" :
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse   */

	// parseMe = function (json, destination) {
	// 	destination = JSON.parse(
	// 		json, (key, value) => {
	// 		});
	// }

/*	---- Original example code:

	JSON.parse(
		'{"p": 5}',
		(key, value) =>
			typeof value === "number"
			? value * 2 // return value * 2 for numbers
			: value, // return everything else unchanged
		);
		// { p: 10 }

		JSON.parse('{"1": 1, "2": 2, "3": {"4": 4, "5": {"6": 6}}}',
		(key, value) => {
		console.log(key);
		return value;
		});
		// 1
		// 2
		// 4
		// 6
		// 5
		// 3
		// ""   /*



/*	===== LOADING =====

	SAFETY
	Get JSON or XML; only JSON written so far

	function loadIt (targetURL, destination) {

		//	FETCH	https://css-tricks.com/using-fetch/
			MasterVault =
			fetch(targetURL)
			.then(handleResponse)
			.then(data => console.log(data))
			.catch(error => console.log(error))
			}

		function handleResponse (response) {
			let contentType = response.headers.get('content-type')
			if (contentType.includes('application/json')) {
				return handleJSONResponse(response)
			} else if (contentType.includes('text/html')) {
				return handleTextResponse(response)
			} else {
				// Other response types, image for example
				throw new Error(`Sorry, content-type ${contentType} not supported`)
			}
			}

		function handleJSONResponse (response) {
		  return response.json()
			.then(json => {
			  if (response.ok) {
				return json
			  } else {
				return Promise.reject(Object.assign({}, json, {
				  status: response.status,
				  statusText: response.statusText
				}))
			  }
			})
		}

		function handleTextResponse (response) {
		  return response.text()
			.then(text => {
			  if (response.ok) {
				return text
			  } else {
				return Promise.reject({
				  status: response.status,
				  statusText: response.statusText,
				  err: text
				})
			  }
			})
		}

*/


/*	===== JSON & ARRAY ===== */

//	Convert JSON --> array:
//	https://www.w3schools.com/js/js_json_parse.asp

//	Imagine we received this text from a web server:
//	'{"name":"John", "age":30, "city":"New York"}'

//	Use the JavaScript function JSON.parse() to convert text into a JavaScript object:
//	const obj = JSON.parse('{"name":"John", "age":30, "city":"New York"}');

//	Using JSON.parse() on an array will return a JavaScript array instead of a JavaScript object.
//	const text = '["Ford", "BMW", "Audi", "Fiat"]';
//	const myArr = JSON.parse(text);

// var mainMenuArray = Array({"name":"Director"},{"id":0},{"state":1},{"sort":0});

/*

  var json = {
	"name": "John",
	"age": 30,
	"city": "New York"
  };

  var array = jsonToArray(json);

  console.log(array);
  // Output: [["name", "John"], ["age", 30], ["city", "New York"]]

  */


/* 	===== THROTTLE ===== */

// var throttled = false,
// 		delay = 250,
// 		calls = 0;

// function throttle (theEvent, delay) {
// 	const timer = delay || 250;
// 	if (throttled) {
// 		console.log(`Throttle: ${timer}`);
// 		return;
// 	}else{
// 		throttled = true;
// 		setTimeout(function() {
// 			theEvent ();
// 			throttled = false;
// 		}, timer);
// 	}
// };


/*  ===== GOTO =====

	WIP
	Scroll to the top (or bottom) of an element with
	a specific ID.

	https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_element_scrollintoview2 */

// 	EXAMPLES:

// 	const element = document.getElementById("content");

// 	function myFunction() {
//   	const element = document.getElementById("content");
//   	element.scrollIntoView();
// 		}

//   	document.addEventListener('scroll', update);
//  	 update();

	  // ------

	// function boogieToTop() {
	//   element.scrollIntoView(true);
	// }

	// function boogieToBottom() {
	//   element.scrollIntoView(false);
	// }

	// EXAMPLE HTML:

	// <p>
	// 	<button onclick="boogieToTop()">Scroll to the top</button>
	// 	<button onclick="boogieToBottom()">Scroll to the bottom</button>
	// </p>

	// <div id="myDIV">
	// 	<div id="content">
	// 		<div style="position:absolute;top:0;">Some text at the top</div>
	// 		<div style="position:absolute;bottom:0">Some text at the bottom</div>
	// 	</div>
	// </div>

	// EXAMPLE 2

	// 	SCROLL ELEMENT INTO VIEW

	// 	https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#browser_compatibility

	// const myElement = document.getElementById("box");

	// 	myElement.scrollIntoView();
	// 	myElement.scrollIntoView(false);
	// 	myElement.scrollIntoView({block: "end"});
	// 	myElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});

	// const button = document.querySelector('devBtn');

	// button.addEventListener('click', (event) => {
	// button.textContent = Click count: {event.detail};
	// console.log("Button hit: devBtn" );
	// });



/*  ===== ELEMENT DATA EXISTS? =====

    Determine if an element exists and what properties
	or classes it contains.

    var element = document.getElementById("elName");

  	If it isn't "undefined" and it isn't "null", then it exists.

    if(typeof(element) != 'undefined' && element != null){
        alert('Element exists!');
    } else{
        alert('Element does not exist!');
    }
	*/


/*	===== ADD/REMOVE ELEMENT ===== */

/*	Function update() {
	const container = document.getElementById("controls");
	const elem = document.getElementById("example");
	const rect = elem.getBoundingClientRect();

	container.innerHTML = '';
		for (const key in rect) {
			if (typeof rect[key] !== 'function') {
				let para = document.createElement('p');
				para.textContent  = `${key} : ${rect[key]}`;
				container.appendChild(para);
			}
		}
	}
 */




/*	==== LOCAL STORAGE ===== */

/*  function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
		}
	}
	if (storageAvailable('localStorage')) {
		console.log('local storage: true')
		}
	else {
		console.log('local storage: false')
	} */



//	===== GET KEY/VALUE PAIRS FROM OBJECT =====
//	Covert them into an array.
//	object.entries()
//	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries

	//   const object1 = {
	//		a: 'somestring',
	//		b: 42
	//   	}

	//   for (const [key, value] of Object.entries(object1)) {
	//		console.log(`${key}: ${value}`);
	//   	}

	// Expected output:
	// "a: somestring"
	// "b: 42"
	//