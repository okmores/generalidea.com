
/*	IMAGE GRID  (c) 2016 Preuit Holland

/*	Copied from original Flash script.  WILL NOT RUN in javascript (yet)

	This is an attempt to re-write ImageGrid for javascript.  
	
	The original script was written in ActionScript, which is similar, but not identical to Javascript.
	In particular, ActionScript managed the timing of events automatically (via a timeline) while 
	Javascript attempts to slam everything into the page all at once.  
	
	A lot of the ActionScript code should work and the logic is the same(ish) but it's still a project.  
	The original script is very old, too, so it's outdated and clunky to begin with.  	
	
	Work In Progress 2016:
	
	-- Code in the Flash script was distributed over 12 frames and loaded in sequence as the swf 
	file ran along its timeline. So a first step is to figure out what timing issues exist with  
	functions or other processes.
	
	-- The ActionScript script had it's own image loader and xml interpreter.  These are redundant if 
	the host site already has these functions implemented.  On the other hand, maybe these should be left
	in case they're needed for a different solution.
	
	-- There are function and object names that may conflict with names in the host site.  
	Be sure to isolate ImageGrid from any other code.  Investigate jquery or simple 
	javascript methods.  An object prototype?  new()  Hmmm.
	
	-- Investigate introducing the animation platform from greensock.com.    
	
	-- Change references, object and concept names specific to the original site to generic names.  
	For example "HatBtns" refers to the subject of cards being displayed.  Icons of hats were used to 
	indicate different cards because they were about different job types (director, photographer, whatever).  
	ImageGrid should accomodate any subject matter so the names of different classes of cards should be 
	accessible at runtime.    
	
	-- Much of the original language below needs to be reworked.  Some of it has been left in place in the hope
	it aids clarity (but it may be confusing nevertheless).	*/
	

/*	**********
	IMAGE GRID  (c) 2013 Preuit Holland
	
	A programable grid of animated "cards," usually with different images attached to each card.  The images, 
	and the data related to the images is dynamic and programmable.  
	
	ImageGrid can be used as a splash screen, transition effect or main design element.  The code is old and 
	leggy. It was originally built with an early version of Flash ActionScript using modular functions to 
	accomodate optional behaviors and content (some of which were never written or have been deleted).
		
	( Note: In Imagegrid logic, the word "Class" refers to an area of interest or subject matter in the content, 
	( not a programming Class.  In javascript comments, the word "Schema" is sometimes used instead of Class.   
	( Unfortunately, these words imply different meanings in general programming but they were littered through 
	( the old code and it hasn't been practical (worth it) to change to more meaningful expressions.  
	( Remember: "Class" and "Schema" probably mean "an area of interest or subject matter of the CONTENT", like 
	( chapters in a book. Similar, but not exactly what you're thinking in code speak.
	
	HOW IT WORKS:
	
	Start with an understanding of several arrays:
	
		Vault[]			Holds data records for all cards
		DrawStack[]		Holds data records for cards to be placed on the stage (on the screen)
		OnStage[]		Holds data records for cards currently displayed on the screen
		Grid[]			Contains no data; it has a number of records equal to the number of cards to play
		DiscardStack[]	Holds data records for cards removed from the Stage
		
		** WIP:  These arrays are internal ImageGrid arrays (in Flash).  There's a "Vault" array in the host 
		** web site, so this name issue has to be addressed when converting to javascript. 
	
	
	VAULT[] ARRAY
	
	To begin, an XML (or equivalent) data source containing filenames and other info about individual cards is 
	loaded into the Vault array.  
	
	The Vault array can hold data records for any variety of card types (classes of cards).
	
	DRAWSTACK[] ARRAY
	
	Records in the Vault array are copied to the DrawStack array.  It is possible to copy only specific records 
	from the Vault to the Drawstack, although all records or any combination of records can live in 
	the Drawstack at the same time.
	
	From DrawStack, individual data records are assigned to instances of a ProtoCard object from the Library.  
	 
	Each new instance of ProtoCard is given a name of "PrefixName"+"n", where "PrefixName" is the Class name   
	from the Vault record and "n" is a sequence number derived from the order ProtoCards are created.  (The sequence
	number makes each ProtoCard name unique but is otherwise meaningless.)  Each ProtoCard should assume whatever 
	size image is loaded into it but this is not tested, so be sure to manually coordinate card size and grid 
	cell size in the vars.  
	
	GRID[] ARRAY
	
	The Grid array controls where Cards are placed on the stage in a grid of "cells". There's no data 
	in the Grid array.  It's just a list of numbers from 0 to the length of the array, which is the number 
	of cells on the stage.  Array records (Grid numbers) are randomly* plucked from the Grid array and assigned   
	to ProtoCards before being added to the OnStage array. When a grid cell number is used, that record is 
	deleted from the Grid array and is no longer available to be assigned new ProtoCards.  This way, no two 
	cards will fall on the same cell until the entire grid is filled up.
	
	The CellNumber is also used for the z-depth assigned to the card in that cell. Note that when the cards are 
	first created, though, they are given a higher, temporary z-depth, well above the highest cell number.
	
	ONSTAGE[] ARRAY
	
	ProtoCards are added to the OnStage array in Card_n order (Card1, Card2, Cardn... etc) but randomly 
	placed on the grid by the CardSpotter() function*.  The cards are "dropped on the grid" according 
	to what cell number they occupy, not according to card number (in the card name).  After the card is "spotted" 
	on the grid, a test determines if the grid is full.  If so, the Grid array is empty and a new set of cell numbers 
	is generated. Now each new card coming from the Drawstack falls on top of an existing card. 
	
	The new card is assigned the depth of the old card, which also happens to be the CellNumber on the Grid. 
	
	DISCARDSTACK[] ARRAY
	
	When a new card falls on top of an existing card, the old card record is deleted from the OnStage array and 
	added to the DiscardStack array.  (Except if the card has been tagged for deletion, the record is simply deleted.)
	
	Eventually, the DrawStack array is depleted.  When this happens, the records in the DiscardStack are 
	transferred back to the DrawStack and the process repeats.  In this way, even though the cards appear in 
	random order, a card never appears on stage twice at the same time and the grid fills up completely, one 
	cell at a time, before a new cycle is initiated.  A card never falls on top of another card on the grid until 
	all the cells in the current cycle are used. 
	
	**  Note that it is posible for the LAST card from one cycle and the FIRST card from the next cycle to randomly fall 
	**  on the same cell, and it can even be the same card.  Very rare, but it should be fixed.
	
	This process, for the most part, is controlled by the MC() function (short for "Master of Ceremonies"), which 
	uses the fall-through characteristic of the switch statement to step through the process.
	
	A sprite scenario for the cards is not used so the code currently generates a lot of hits on the server.  The upside 
	is that it's easier to dump new cards into a folder and be done with 'em.  (Except the data file has to be
	updated if they're to show up.)
	
	* Cards are currently placed on the grid in random order but it's possible to use a different placement scheme by 
	writing a different module for the CardSpotter() function.
	
	The (original) Flash-based ProtoCard object contains: 
		
		~	A one-frame, blurred drop-down effect generated inside Flash -- other effects, or none, may be better; newer 
			html blur functions might replace this;
		~	Contrast and brightness adjustments for the image; a global color correction function was written but it's 
			also possible to modify a single image; this was done to adjust gamma settings on different platforms but 
			it was never implemented.
		~	The ClipWell object where the media file is attached;
		~	A drop shadow; hard coded for now by way of a Flash filter on the ProtoCard.ClipWell object properties.
		~	A button is created on any card that has a link address associated with it (in the Vault data). Clicking on 
			a card sends the link to the BtnHit() function.)
		
		Note: The media is attached to the ClipWell object inside ProtoCard, not directly to the ProtoCard iteslf (which 
		would effectively replace it).  This way, more stuff can be added to the card -- like a graphics, text, etc. 
	
	DEV NOTES: 
		
		Search for "!!  HACK  !!" in the comments to find obvious bits of crummy coding and stupid fixes.
		The eek() function is a global way to turn comments on and off and to debug the code.
		
	
/*	**********
	DEV
	
	From the Flash file:
	"ImageGrid is primarily designed to run as a level loaded by another swf, in this case, Index.swf. Therefore, it 
	is NOT usually on _level0 and may get confused if launched directly. It has been programmed to detect if it is 
	on _level0 and may try to run anyway but it doesn't work reliably, it requires some overhead and may not be worth it." 
	
	"Dev controls and reporting routines work if this.Debug AND _level0.DeBug are true.  
	See additional Debug conditional at the bottom of this frame."  */

	var Debug = true ; 
	
	if (_level0.Debug == false) {this.Debug = false ; } ;			
	
	function eek (Message) { _level0.eekeek (this, Message) ; }	
	function eekeek (Caller, Message) { trace (Caller + ":\t" + Message) ; } //	in case this is _level0

	if (Debug) { eek ("ImageGrid: loading..."); }

	this._visible = true											//	The loader must run UnPoof() to make ImageGrid appear on the stage.
	_quality = "HIGH" ;
	
	var Standalone = false,											//	false == normal; running as a level attached to a master swf
		RootPath_SWF = _level0.RootPath_SWF || "",					//	} GOTCHA: paths are relative to the parent
		RootPath_XML = _level0.RootPath_XML || "../xml/",			//	} !! HACK !!  Hand coded path to xml files  !!
		RootPath_IMG = _level0.RootPath_IMG || "../images/"			//	} !! HACK !!  Hand coded path to xml files  !!
		
	eek ("ImageGrid: running in " + Object(this)._level);
	
	if (this == _level0) {		
		Standalone = true;
		eek ("ImageGrid: running in Standalone mode" );
	}

	//  testing:

	var ForceHatBtns = true;										//	override visibility of controls (if DeBug is true) 

	function Ping () {eek("ImageGrid: Ping!");}



/*	***********		
	EXTERNAL INTERFACE
	Javascript/Flash interface for communicating FROM and TO javascript is in the parent of this swf.  
	Calls to javascript methods go to the root level first.  */
	
	var gotJavascript = _level0.gotJavascript ;					//	true if external interface established a connection to Javascript
	
	function js (param1, param2, param3) {						//	shorthand Flash > Javascript
		_level0.JavascriptOUT(param1,param2,param3)				//	(string: javascript function name, param, param) 
	}
	
	if (gotJavascript) {
		eek ("ImageGrid: Javascript is active" ) ;
		js ("eek", "ImageGrid.swf loading");
		
	}else{
		eek ("ImageGrid: Javascript is not available" ) ;
	}



/*	***********		
	LEVELS REGISTRY
	Register named levels to match _level0 (Home.swf or Index.swf)  */
	
	var Flicker = new(Object);  								//	!!  HACK  !!  Flicker is hard coded; see Player frame
		Flicker = eval( "_level"+ _level0.FlickerLevel );
	var TextTools = new (Object); 								//	probably obsolete (???)
		TextTools = eval( "_level"+ _level0.TextToolsLevel );
	

/*	**********
	INI  */
	
	//	Controller
	
	var	Host = _level0.Host || "Flash";		//	Switches to Javascript if it's found
		
	//	Grid
	
	var Columns = 4,							//	Horizontal cells 
		Rows = 4,								//	Vertical cells
		CellCount = Columns * Rows,				//	Total cells
		Border = -1, 							//	Padding in pixels; -1 creates a slight overlap; looks better than 0
		GridScale = 100,						//	May cause automatic recentering; see Repo() below
		CellW = 235,							//	} this number is ImageW * CardScale } need to automate this;
		CellH = 132,							//	} this number is ImageH * CardScale } this effects positioning inside the SWF
		Registration = "TopLeft",				//	"Center," "TopLeft" or "Manual"; See Repo() at the bottom
		RepoX = 8,								//	} Offset for RepoMe() when ImageGrid is loaded into another SWF;
		RepoY = 8;								//	} best to set these manually after testing

	//	Cards
	
	var Rotation = 2,							//	Maximum random rotation for each card; 0 = none; 3 = +/- 3 degrees, etc.
		ImageW = 256,							//	Image Width of one cell		}	you need to manually coordinate
		ImageH = 144,							//	Image Height of one cell	}	pixel dimensions with the media imported
		CardScale = 92;
	
	//	Data

	var DefaultClass = "Film",					//	Load this Class first if none is specified
		ClassName = new String(),				//	The current class MC() is working with; Note: using "ClassName" because "Class" is a protected word in ActionScript
		ClassesArray:Array = new Array(),		//	Keeps up with the classes that have been loaded so we don't have to reload them
		VaultClasses = "",						//	Loaded Classs; for quick polling to see which XML files have been loaded into the Vault
		ActiveClassesArray:Array = new Array,	//	Classes in the DrawStack (or on the Stage); the Classes being used
		ActiveClasses = "",						//	cache of active classes (OBSOLETE; use the annonymous function ActiveClass(ClassName) instead, which returns the ActiveClassesArray[index])
		ActiveCards = 0,						//	For quick polling to see how many cards are in play
		ActiveCardsCheckSum = 0;				//	Verify the number of cards
	
	var DataSource = undefined,					//	Filename of an XML data source; set by AddClass()
		DataSourcePath = "xml/";				//	Not used (I think) see RootPath_xml above
	
	var LoadStack:Array = new Array(),			//	XML data is imported to this first
		Vault:Array = new Array(),				//	Then into the Vault as an array within an array
		Grid:Array = new Array(),				//	An array with length equal to the number of cells; 0 based
		DrawStack:Array = new Array(),			//	Items are COPIED from the Vault into DrawStack -- like a deck of cards
		OnStage:Array = new Array(),			//	Items are MOVED to the OnStage array as they are used -- like cards on the table
		DiscardStack:Array = new Array();		//	Items are MOVED to the DiscardStack array when they are removed from the stage 	

	//	Current Item	
	
	var CurrentCard = new Object(),				//	Pointer to the ProtoCard we're currently working with
		CurrentMedia:Array = new Array() ;		//	Placeholder for the media record we're currently working with, which gets attached to CurrentCard, above
	
	var CardPrefix = "Card",					//	CardPrefix + CardNumber = instance name of CurrentCard 
		CardNumber = 0,							//	A number used to differentiate new cards; otherwise meaningless
		CardName = undefined;					//	CardPrefix + CardNumber; target name assigned to instances of ProtoCards

	var MediaFile = "",							//	The media file to import; usually a jpeg but a swf would be cool.  This is the Card icon file, not a master media file.
		MediaClass = "";						//	Class of the media, like "Film", "Photo", "Print", "Doilies", etc.
	
	
	var CellNumber = undefined;					//	counting left to right, top to bottom; this also becomes the card depth and OnStage index (SeeTricky Bits, next)
	
	var Column = 0,								//	} Counting from the top left of the grid	} TRICKY BITS: CardSpotter() currently inverts
		Row = 0;								//	} Counting from the top left of the grid	} this so Cell 0 ends up at bottom right (it effects shadow stacking)
	
	var PosX = 0,								//	X position of column in pixels	} ImageW * Column
		PosY = 0;								//	Y position of row in pixels		} ImageH * Row
	
	//	Loading flags							//	Mostly for "CurrentCard" while MC() steps through the process
	
	var CardSpotted  = false,					//	"Spotted" means placement on the grid has been determined
		MediaFileLoaded = false,				//	Media file for the card (not media for the full-size piece)
		ProtoCardLoaded = false,				//	Attached from the library
		CardInitialized = false,				//	A flag set to true when the card is ready to display; a timming issue
		Progress = undefined,					//	Concantonized trace statements about building the card; eeked when the card is displayed; dev only...
		Counter = 0;							//	Used in OmitClasses to keep up with number of cards omitted <-- ? uhm, really?
	
	var	Reset = false ;							//	} Set to false on Ready frame; true during a reset; FlushCards() is 
												//	} in effect a "reset"; not completely implemented
	
	//	Outgoing Card							//	Card to be removed from the stage after it is covered up by a new card
	
	var OldCard = new Object(),					//	Pointer to a ProtoCard instance to be removed from the stage
		OldMedia = new Object();				//	?? Apparently NOT --> Placeholder for data record to be moved from the OnStage array into the DiscardStack array

	//	Directories								//	Prepend to media filenames; don't forget the "/" at the end

	var MediaFilePath = RootPath_IMG + "cards/";	//	Path to media files (the small files attached to ProtoCard instances)
	var ContentPath = "";							//	Becomes fullpath as MediaFilePath + Filename on Fetch frame
	
	//	Chrome
	
	var	DefaultChromeDepth = 1000,				//	depth of buttons n stuff; 
		PushBtns:Array = new Array(),			//	Enter data manually on Chrome frame ( after MakeBtns() )
		ShowHatBtns = false;					//	Show/Hide the HatBtn menu (2016: HatBtns needs to be changed to something generic; HatBtns were icons that represented the subject of cards being displayed...) 
		
	var HeaderPoof = false ;					//	TEMP(?) big header in the middle of the stage; looked at by FlushCards()?  probably obsolete
	
	var DimAmt =  	30,							//	Prefs for button states inside ProtoCard instances
		OnAmt =   	80,	
		OverAmt = 	40,
		HitAmt =  	100;

	//	States
	
	var CurrentClass = "",						//	The Class currently on the screen (or, the last one activated if not in RadioMode)
		ShowTime = false,						//	Master switch.  ShowTime == cards appear on the stage
		RadioMode = true,						//	true == one Class on stage at a time, false == more than one 
		HotSwitchMode = false,					//	What to do when a new Class is requested: true == do a HotSwitch(); false == just toggle the Class ON/OFF (see HotSwitch() for the skinny)
		AutoExit = true;						//	false prevents unloading the last remaining Class;

	var AutoLoad = false,						//	a State; true == cards are created in an endless loop; related to AutoState below
		AutoState = "Multiple" ;				//	A flag to tell MC() to make a "Single" card or loop for "Multiple" cards

	//	Animation

	var Buffer = 0,								//	Delay before drawing a new card; 0 = as fast as possible, -n = never.  (Probably using a random number from Buffer, so it's a max delay)
		BufferMax = 3500,						//	Max new card delay
		BufferDefault = "Fast",					//	After the Grid is filled up, drop to this refresh rate
		BufferSpeed = BufferDefault,			//	String representation of Buffer makes it easier to update btns; "Medium" = BufferMax/2 (set by Throttle() )
		BufferSave = BufferDefault;				//	Store Buffer value here while paused or doing something else			
		
	var FlashCards = 0,							//	Set to CellCount in Flash() mode; decremented with each new card; at 0 the Flash is over
		FlashMode = undefined,					//	Load as fast as possible until FlashCards = 0, then switch back to Buffer value; set by Flash()
		Paused = false,							//	A special state only true if explicitly "Paused"; see MC("TidyUp") and Throttle ("Pause")
		DefaultSchema = "Random";				//	Animation method; the way the ImageGrid is filled up. "ByRows" fills the grid in order. Use only "Random" for now -- see frame 3

	var PoofBuffer = 20 ;						//	controls speed of removing cards from stage; value is a pause in milliseconds


//	Presentation
	
	ImageW += Border ;							//	Set Border above, in pixels; for no border: -1 looks better than 0 (technically, this means "Padding" because there is no visible border)
	ImageH += Border ;

	var DeltaX = undefined,						//	} offsets for centering the image Grid and/or other content within the SWF;
		DeltaY = undefined;						//	} set by Repo(); NOTE: not the same as registration of the swf
	
	
	Repo (undefined, undefined, undefined, undefined) ;		// HUH?		//	First run will use default vars above
	

/*	*************
	REPO()  
	Adjustments for registration and scale;
	If this SWF is loaded into another SWF, (not Standalone) this function calls _level0.RepoMe(); 
	set params for this above. */
	
	function Repo (NewRepoX, NewRepoY, NewRegistration, NewScale) {	
		
		GridX = NewRepoX || RepoX || 0 ;
		GridY = NewRepoY || RepoY || 0 ;
		
		r = NewRegistration || Registration ;
		s = NewScale || GridScale || 100 ;
		
		eek ("ImageGrid: Repo - ImageGrid Registration: " + r ) ;
		eek ("ImageGrid: Repo - ImageGrid Scale:        " + s ) ;
		
		w = 960 ;							// 	}	Use pixel dimensions; GOTCHA: if this SWF is loaded into 
		h = 570 ; 							//	}	another SWF, Stage.width refers to the master SWF, not this one.
		
		NewW = w;
		NewH = h;
		
		
		GridW = Columns * ImageW ;
		GridH = Rows * ImageH ;
		
		//	Calculate offsets for card position within the swf (re-center the grid within the SWF) based on number of cards
		
		switch (r) {
			case "Manual" :
			case "Center" :
				DeltaX = Math.floor( ((w - GridW) / 2 )  ) ; 	//	re-center the grid within the SWF
				DeltaY = Math.floor( ((h - GridH) / 2 )  ) ; 	
				break ;
			case "TopLeft" :
				DeltaX = 0 + GridX ; 
				DeltaY = 0 + GridY; 
				break ;
			default :
				eek ("  !!  Repo() - error with Registration  !! " ) ;
		}
		
		//	Find scaled dimensions of swf if necessary
								
		if (s != 100) {			
			NewW = ( s * w/100 ) ;							//	New Stage width (the whole swf will be scaled)
			NewH = ( s * h/100 ) ;
			this._xscale = NewW ;
			this._yscale = NewH ;  
		}
		
		//	Calculate/adjust position of swf within the stage
		
		switch (r) {
			case "Center" :
				NewX = ( (Stage.width - NewW) / 2 ); 		//	if NewW == Stage.width -- no change
				NewY = ( (Stage.height - NewH) / 2 );
				break ;
			case "Manual" :
				NewX = GridX ;
				NewY = GridY ;
				break ;
			case "TopLeft" :
				NewX = 0 ; 				
				NewY = 0 ;
				break ;
		}
		
		//	Do it
		
		if (this == _level0) {
			this._x = NewX ;
			this._y = NewY ;
		} else {
			_level0.RepoMe (this, NewX, NewY) ;	
		}
	}
	
/*	***********
	DEV
	Conditional adjustments  */
	
	if (DeBug) {
		
		this.ShowHatBtns = this.ForceHatBtns;
		//eek ("ImageGrid() ShowHatBtns = " + ShowHatBtns) ;
		//eek ("ImageGrid() HatBtns_X = " + ShowHatBtns) ;
	}
	
	
/*	SCALEME()
	Experiment to set scaling from external javascript;
	
	URGENT GOTCHA! In some browsers (most browsers), if the user zooms the web page in or out,
	ImageGrid doesn't scale to match the new size and it's a friggin mess.  The first atttempt to solve this 
	didn't work, so something that actually does is needed. (It was such a calamity, finally 
	just deleted it.)

	//_level0.ScaleMe (GridScale, GridScale);

	*/