/*	***********
	CONTENT  */
	

	//	===== IMPORTS ===== //

var mediaVault = {
	name: "mediaVault",
	data: []
};

async function loadMedia(filePath) {
	const url = filePath;
	console.log(`Loading media database`);
	try {
   	const response = await fetch(url);
   	if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
   	}
   	const jsonData = await response.json();
   	// Convert the JSON object into a multi-dimensional array
   	const multiDimensionalArray = Object.entries(jsonData);
   	mediaVault = multiDimensionalArray;
	} catch (error) {
   	console.error(error.message);
	}
}

var	menuArray =   [],
		filmArray =   [],
		printArray =  [],
		photoArray =  [],
		clientArray = [
			{name: "Apple",logo: "media/images/icons/client-logos/Apple Logo.svg"},
			{name: "Lexus",logo: "media/images/icons/client-logos/Lexus Logo.svg"},
			{name: "Audi",logo: "media/images/icons/client-logos/Audi Logo.svg"},
			{name: "Auberge",logo: "media/images/icons/client-logos/Auberge Logo.svg"},
			{name: "BP",logo: "media/images/icons/client-logos/BP Logo.svg"},
			{name: "Catalina",logo: "media/images/icons/client-logos/Catalina Logo.svg"},
			{name: "Cigna", logo: "media/images/icons/client-logos/Cigna Logo.svg"},
			{name: "Colombia", logo: "media/images/icons/client-logos/Colombia Pictures Logo.svg"},
			{name: "Disney", logo: "media/images/icons/client-logos/Disney Logo.svg"},
			{name: "Dos Equis", logo: "media/images/icons/client-logos/Dos Equis Logo.svg"},
			{name: "Fox Studios", logo: "media/images/icons/client-logos/Fox Logo.svg"},
			{name: "IMAX", logo: "media/images/icons/client-logos/IMAX Logo.svg"},
			{name: "JBL", logo: "media/images/icons/client-logos/JBL Logo.svg"},
			{name: "Labatt", logo: "media/images/icons/client-logos/Labatt Logo.svg"},
			{name: "Moosehead", logo: "media/images/icons/client-logos/Moosehead Logo.svg"},
			{name: "Nikon", logo: "media/images/icons/client-logos/Nikon Logo.svg"},
			{name: "Nissan", logo: "media/images/icons/client-logos/Nissan Logo.svg"},
			{name: "Lexus", logo: "media/images/icons/client-logos/Lexus Logo.svg"},
			{name: "Paramount", logo: "media/images/icons/client-logos/Paramount Logo.svg"},
			{name: "Pizza Hut", logo: "media/images/icons/client-logos/Pizza Hut Logo.svg"},
			{name: "Porsche", logo: "media/images/icons/client-logos/Porsche Logo.svg"},
			{name: "Royal Caribbean", logo: "media/images/icons/client-logos/Royal Caribbean Logo.svg"},
			{name: "Singapore Airlines", logo: "media/images/icons/client-logos/Singapore Ailrlines Logo.svg"},
			{name: "Sunset Magazine", logo: "media/images/icons/client-logos/Sunset Logo.svg"},
			{name: "Taco Bell", logo: "media/images/icons/client-logos/Taco Bell Logo.svg"},
			{name: "Tahiti", logo: "media/images/icons/client-logos/Tahiti Logo.svg"},
			{name: "Yamaha", logo: "media/images/icons/client-logos/Yamaha Logo.svg"},
			{name: "Honda", logo: "media/images/icons/client-logos/Honda Logo.svg"},
			{name: "Shelter", logo: "media/images/icons/client-logos/Shelter Logo.svg"}
		];

/* ==== IMAGE GRID ==== */		

var 	onCall = 	[],
		onStage = 	[],
		onHold =  	[],
		cells =	 	[];
