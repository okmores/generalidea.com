
/*	MC()
	****************
	
	MC stands for "Master of Ceremonies."  MC() switches Schemas, or major sections of the 
	site.  It controls the process using the fall-through behavior of a switch() statement.
	
		 MC()		 Steps through a Schema switch; just manages methods performed 
		 MC Methods	 A collection of methods that carry out MC() tasks, then return to MC
		 
	MC() is left over from the very first iteration of the site before jQuery or much 
	else was introduced and is therefore completely out of date. Most of all, beware that
	it is sometimes "blind," meaning it initiates subroutines that depend on other data
	or states already being present and it has no way to know if they are or not, and no way
	to recover if something goes wrong. Aside from just being a dumb way to do things, one 
	of the most unfortunate results of this occurs when there's a slow internet conncetion 
	and the site struggles to load all the pieces it needs to function. In other words, the WIP
	below is an understatement. When somebody with a slow coneection loads this site for the 
	first time, everything is broken until they've hit reload a few times.  Oy. 
	
	Over time, almost every step has been patched so what's left is more a collection of
	patches than a coherent process. 

	WIP: Need more reliable methods to defeat slow internet speeds, javascript parallel prcessing;	
		 Slack error checking in many places -- image loading, for example */
			

	var MCAuto = false;				// true == continue processing to the next step
	var MCStep = "";					// the current step (case statement); where we are in the process
	var MCCounter = 0;				// aid for detecting runaway or looping routines
	
	function MC (Step, param1){
		
		if (param1 == "Scene_1" || param1 == "Ini"){			//	!!  HACK  !!  TEMPORARY trap for stupid Internet Explorer; doesn't work anyway...
			return;
		}	
		
		if (param1 == "Ad"){param1 = "Ads";}					//	!!  HACK  !!  MISERABLE HACK FIX	

		switch (Step) {

			// SET SCHEMA	Pick a schema; do not change or display elements

			case "SetSchema":						
				MCAuto = true;
				console.log ("MC(): SetSchema " + param1);
				Schema.Pending.name = param1;					

			case "LockNav":										//	LOCK all Nav btns;
				//console.log ("MC(): Locking Widget btns ");											
				var ActiveWidgets = Widgets.Roster.toString();
				var Mod = 0 ;
				for (i in NavBar){								//	Later, we'll turn available Nav for 
					var n = NavBar[i].Name;						//	the new Schema back on (er, "OFF") 
					if (ActiveWidgets.indexOf(n) > -1) {
						Mod ++ ;								
						UpdateNavArray ( "NavBar", i, n, "LOCKED", "Batch"); //	"LOCKED" means unavailable
					}														 //	"OFF" means available but not "ON" (ACTIVE would be more accurate)
				}
				
				if (Mod > 0){
					UpdateNavSet("NavBar") ;
				}
				
			case "Spin":
				
				Loading.show("StageIMG");
				//Spinner.show();
			

			// PARSE SCHEMA - search array(s) for data pertaining to the Schema set above.
			// Note: This appears to be a useless step since we could now just as easily read the data 
			// directly from the Schemas array. But I digress...
			
			case "ParseSchema":
				if (MCStep != "ParseSchema") {		
					console.log ("MC(): ParseSchema for " + Schema.Pending.name + " data");
					ParseSchema (Schema.Pending.name);
					break;
					}
					
			//	HIDE WIDGETS -- Hide all currently visible Widgets; don't call this from anything 
			//	but MC(); a loop into WidgetMaster() will continue until all Widgets are hidden, 
			//	then call back; to Hide a single Widget from anywhere else, 
			//	use HideWidget(WidgetName).
			
			case "HideAllWidgets":

				if (MCStep != "HideAllWidgets"){
					console.log ("MC(): Hide All Widgets");
					HideAllWidgets();			
					break;
				}
				
			//	PARSE POSTER DATA -- look for the default image and associated data pertaining to 
			//	the new Schema.  Each Poster has various elements associated with it (caption, 
			//	credits, etc).  The posters can change without a Schema switch; here we are
			//	looking for a default image and data for the new Schema.
			
			//	Note: this appears to have been replaced by the Poster{} object...

			case "ParsePosterData":							//	grab image name, data from Schema.xml
				//if (MCStep != "ParsePosterData") {
				//	console.log ("MC(): ParsePosterData for " + Schema.Pending.name + " Schema...");
				//	ParsePosterData (
				//		Schema.StageFG, 							//	image to grab
				//		function(){MCReturn("ParsePosterData")}		//	callback
				//				);
				//	break;
				//	}			
				if (!MCAuto){								//	safety stop -- probably no longer used
					console.log("MC(): Exiting; AutoLoad off");
					break;
					}

			/***** PRELOAD ******/
			
			//	!!  HACK  !!  FETCHQUE and PRELOADIMAGES are SERIOUSLY out of date !! 
			//	FETCHQUE -- make a queue of images to preload; data from Schema.xml contains the  
			//	initial (default) description of assets related to the Schema being loaded;
					
			case "FetchQue":
				if (MCStep != "FetchQue"){
					console.log ("MC(): Fetch list of images to load" );
					FetchQue();
					break;
				}
				
			// PRELOAD IMAGES -- Write schema metadata to DOM elements while they are hidden;
			// WIP -- Currently coupled to FetchQue() above.  Needs re-write.  

			case "PreloadImages" :
				if (MCStep != "PreloadImages"){
					console.log("MC(): Preload Images");
					PreloadImages();
					break;
				}

			// PARSE WIDGETS -- Different Schemas can use different sets of plugins.
			// This step involves switch-in/switch-out logic for these components, which are collected 
			// into Widgets (or newer jQuery Widget Factory objects we're calling Features).  
			// First, figure out which Widgets/Features to use with the new Schema. 
			
			case "ParseWidgets":

				if (MCStep != "ParseWidgets") {
					console.log ("MC(): ParseWidgets for " + Schema.Pending.name + " Schema..." );
					ParseWidgets (Schema.Pending.name);	
					break;		
				}

			// PRELOAD WIDGETS -- Preload any Schema-specific Widget data/elements. This can trigger  
			// subroutines inside individual Widgets that pertain to that Widget only. Loop through 
			// all Widgets singled out for the incoming Schema and tell them to "preload" or do 
			// whatever is necessary to be ready when activated. If there are no subroutines in a 
			// Widget, it will just ping back to say it's there.
			
			case "PreloadWidgets":
				if (MCStep != "PreloadWidgets"){
					console.log("MC(): PreloadWidgets");
					PreloadWidgets();
					break;
				}
					
			/***** SCHEMA LOADED *****/	
			
			case "Showtime":
				
				console.log("MC().Showtime:");			
				var OldWidget = Widgets.Current() || "none",		// New Schema loaded but current Widget not changed			
					OldSchema = Schema.Current.length > 0 ? Schema.Current : "none",
					PendingMedia = Schema.Pending.mediaCode.length > 0 ? Schema.Pending.media : "none";
				
				console.log("  Old Schema......." + OldSchema);
				console.log("  New Schema......." + Schema.Pending.name);
				console.log("  Old Widget......." + OldWidget);
				console.log("  New Widget......." + Widgets.InitWidget);	// ?? Stage = pending data; need to clarify...
				console.log("  Pending media...." + PendingMedia);
				console.log("  Flash running...." + FlashTime);
				//Spinner("StageFG","stop");
				
			case "Commit" :
				//Loading.hide("StageIMG");
				Schema.Current = Schema.Pending.name;
				UpdateNavArray("NavBar", null, Schema.Current, "ON");//	(arrayName, index, name, state)
												
			//	DISPLAY POSTER -- display the main image/background poster
					
			case "DisplayPoster":
				if (MCStep != "DisplayPoster"){
					console.log("MC(): Display Poster:")
					DisplayPoster(Schema.StageFG);
					break;
				}

			//	DISPLAY WIDGETS
			
			case "ShowWidgets":								
				if (MCStep != "ShowWidgets"){
					WidgetBoot = true;
					console.log("MC(): ShowWidgets:")
					ShowWidgets();
					break;
				}
				
				WidgetBoot = false;				//	!!  HACK  !!  this doesn't work; need trap for too muck clicking...
				
				Schema.Pending.name = "none";		
				

			/***** UPDATE NAV *****/
			
			case "NavUpdate":
				console.log ("MC(): UnLocking navigation ");
				var WidgetList = Widgets.Roster.toString();
				var Mod = 0 ;
				for (var i in NavBar){
					var n = NavBar[i].Name;
					if (WidgetList.indexOf(n) > -1){
						Mod ++ ;
						UpdateNavArray ( "NavBar", i, n, "OFF", "Batch");
					}				
				}
				
				if (Mod > 0){
					UpdateNavSet("NavBar") ;
					Breadcrumbs.reset();
				}
			
			/***** DONE *****/
			
			case "SchemaReady":	
				$("#FlashMovie").css("visibility","hidden");	
				vInfoPane.tinyscrollbar_update();			//	<--  What's this doing here?	
				//Widgets.Current = Widgets.Pending;
				//Widgets.Pending = "";
				

			//case "devOnly" :
			//	console.log ("-----------------------------------------");	
			//	console.log ("MC(): DEV - Playlist items = " + Playlist.length);
				
				
				
			case "PendingMedia" :
				var pendingMedia = Schema.Pending.mediaCode;
				if(pendingMedia){
					//Loading.hide("StageIMG");
					console.log ("  MC(): requesting pending media " + pendingMedia);
					$.doTimeout( "MC-Media", 1000, function(){			// Ben Alman doTimeout() is in utilities.js
									ShowMe.LoadMedia(pendingMedia, null);
									Schema.Pending.mediaCode = "";
									//Loading.hide("StageIMG");
								})
				}					
				
				
			case "End" :
				Loading.hide("StageIMG");				
				console.log("MC(): Idle " + localTime() );
				console.log("-----------------------------------------");
				MCAuto = false;
				Showtime = false;
				
				break;



			default :
				console.log ("MC():  !!  \"" + Step + "\"  is an unknown parameter --  !!");
				MCAuto = false;
				break;
		} 
	}
	

/*	MC METHODS()
	**************
	Functions called by MC() that perform a simple task, then call MC() back, normally 
	using their own names as the first argument.  MC() then proceeds where it left off. Newer methods, 
	which can be usefull outside of MC(), are gradually replacing some MCMethods.
	
	Specific to MC():
		MCReturn()			Controls Callbacks to MC()
		FetchQue()			extract a queue of images to be loaded; currently specific only to the main stage poster 
		PreloadImages()		Attempt to get around JS parallel processing
		PreloadWidgets()	Cycles through all available Widgets; some only ping back 
		SetPoster()			Specific to main stage image; load images into DOM els; does not display poster
		DisplayPoster()		Dsiplay new poster, usually with an effect like a dissolve (WIP)
		ParseSchema()		Reads the Schemas array; extracts metadata for the requested Schema
		ParseWidgets()		Assign states to incoming Widgets

	Search for "HACK" to find hard-coded, stupid or just plain lousy programming.  	
	Unlike MC(), these functions are not in any particular order.*/
	

/*	*******
	MCRETURN()
	controls callbacks to MC()  */
	
	function MCReturn (TheCaller, param1){
				
		if (MCStep == TheCaller) {		// Trap for potential infinite loops
			MCCounter ++ ;
		} else {
			MCStep = TheCaller;
			MCCounter = 0;
		}

		if (MCCounter > 4) {
			MCCounter = 0;
			console.log ("  MCReturn(): " + TheCaller + " cancelled because it appears to be in a loop" ); 
		} else if (MCAuto){
			MC(MCStep, param1); 
		} else {
			console.log ("  MCReturn(): canceled " + TheCaller + " because MCAuto is off" );
		}
	}		


/*	********
	PARSE SCHEMA ARRAY
	loads default Schema data into a pending array.  
	WIP: This step is now essentially pointless since it makes more sense to simply
	get the data directly from the Schemas array.  But it still works more or less
	the way it's supposed to so we'll fix it when this whole MC() mess is re-written.  
	
	WIP: As per above, just grab the whole record from the array; it's already a 
	plain object.  See getMedia() in utilities.js.*/
		
	function ParseSchema (TheSchema){
		console.log ("  ParseSchema(): " + TheSchema);
		if (Schema.Current != TheSchema) {
			var s = TheSchema || Schema.Default() ;
			var v = "" ;
			var i = -1 ;			
			
			// get index for the Schema we want
			for (i in Schemas){
				v = Schemas[i].Class ; 
				if (v == s){
			
					Schema.Class =			Schemas[i].Class ;
					Schema.Title = 			Schemas[i].Title ;
					Schema.Mainhead = 		Schemas[i].Headline ;
					Schema.Subhead = 		Schemas[i].Subhead ;
					Schema.InfoPane = 		Schemas[i].InfoPane ;
					Schema.StageBG = 		Schemas[i].StageBG ;
					Schema.StageFG = 		Schemas[i].StageFG ;
					Schema.InfoPanelSpecs =	Schemas[i].InfoPanel.split(",");
					Schema.ImageGrid =	 	Schemas[i].ImageGrid;
					Schema.ImageGridSpec = 	Schemas[i].ImageGrid;
					Schema.InitWidget =		Schemas[i].Init;
					Schema.Widgets =		Schemas[i].Widgets.split(",");
					Schema.Player =			Schemas[i].Player;						
					
					MCReturn ("ParseSchema", TheSchema);
					return;
				}
			}
					
		} else {
			console.log ("  ParseSchema(): " + TheSchema + " Schema is already loaded");
		}		
	}
	

	/*	*********
		PARSE WIDGETS -- extract Widget names and related settings from the Schema array;
		Widgets are specific to each Schema.  
	
			Widgets key: [string:name, bool:visible, bool:active, bool:initWidget]
	
		Uh, gee, doesn't this sort of look like an extra step?  Get record straight from Schema?  !!  HACK  !!
		Update -- actually this is getting ahead of ourselves because we're loading data into the
		working Current Widgets array while the Pending Widget is still pending.  Shouldn't we put 
		it in a pending stack first?  NO.  Just grab the pending Schema data as an object. See ParseSchema
		above, then just grab the datafrom there.  Right?*/
	
	function ParseWidgets (SchemaName){	
		var Init = Schema.InitWidget,			//	"Home" or default Widget to show on loading (or switching to) SchemaName
			TheWidget = "",
			OnDeck = false,
			Tag = "",
			WidgetCount = 0;
			
		for (i in Schema.Widgets){							
			TheWidget = Schema.Widgets[i];		//	get Widget name			
			if (Init == TheWidget){				//	if this is the initially active Widget, mark it
				OnDeck = true;
				Tag = " <-- Init";				//	for log only			
			}else{ 
				OnDeck = false;
				Tag = "";
			}
			Schema.Widgets[i] = ([TheWidget, false, false, OnDeck]);	//	load the Widget name with data
			//console.log("  ParseWidgets(): Preparing " + TheWidget + Tag);
		}
		
		//Schema.InitWidget = Init;
		Widgets.Roster = Schema.Widgets;			//	need to break connection?
		Widgets.Pending(Init);
		WidgetCount = Schema.Widgets.length ;
				
		console.log("  ParseWidgets(): Prepared " + WidgetCount + " Widgets");
		//console.log("  ParseWidgets(): List of Stage.Widgets… " );
		//ListArray (Schema.Widgets);
		MCReturn("ParseWidgets");
	}	
	
	
/*	*******
	HIDEALLWIDGETS()
	Remove all Widgets from the stage. */
	
	function HideAllWidgets() {			
		HideWidget (  "All",										//	Action, 
					  function() { MCReturn("HideAllWidgets"); },	//	Callback,
					  "HideAllWidgets"								//	Caller; eyewash for the console 
				   )
		}


/*	********
	FETCHQUE
	Queue images to be preloaded;				

	!!  HACK ALERT !!	Too much hard-coding here, you dweeb.  All this needs to be accomplished dynamically.
	!!	HACK ALERT !!	Shouldn't Main Head and Subhead be handled by PosterChrome?

	WIP: Make an option for a single call to cache and load instead of using two seperate calls.  
	
	*/

	function FetchQue(){
		//var DefaultPoster = GetPath("Posters") + Schema.StageFG;		//	default images for the Schema
		//	DefaultHead   = GetPath("Heads") + Schema.Mainhead;			//	default headline for the Schema
				
		// get the default Poster for the incoming Schema:

		//var mediaIndex = Poster.MediaIndex(Schema.StageFG),
		//	mediaFilename = MediaVault[mediaIndex].Filename;
		//ImageQue.push(GetPath("Posters") + mediaFilename);

		ImageQue.push(GetPath("Heads") + Schema.Mainhead);
		//ImageQue.push(Poster.FullPathDK);
		//ImageQue.push(Schema.MainheadFullPath);			
		//ImageQue.push(Stage.SubheadFullPath);
		//for (var i in ImageQue){
		//	console.log ("  FetchQue(): added " + ImageQue[i] );
		//}
		console.log ("  FetchQue(): added " + ImageQue.length + " images to the queue" );
		//ListArray(ImageQue, null, "ImageQue");
		MCReturn("FetchQue");	
	}
	
	//	PRELOAD IMAGES - Clunky attempt at defeating JS parallel processing
	
	function PreloadImages() {									//	populate ImageQue (above) first; otherwise, use LoadImage() directly
		if (ImageQue.length > 0) {								//	see if images remain to be loaded
			LoadImage( ImageQue.shift(), 0, "PreloadImages" );	//	This is in Ajax.js; load each image then remove it from the queue
		}else{													//	until ImageQue is empty
			MCReturn("PreloadImages");							//	then return to MC()
		}
	}

	
	//	PRELOAD WIDGETS() -- Call this ONLY from MC(); this sets up a loop and returns only to MC()
	
	function PreloadWidgets() {
		if (Widgets.Q < 0){											//	initiate a temp queue
			Widgets.Q = Widgets.Count();
		}
		if (Widgets.Q > 0) {										//	Loop until all Widgets for the Schema are processed
			var i = Widgets.Q -1 ,									//	!!  HACK  !!  Danger Will Robinson!  What if somebody else wants this queue?!  Besides, it's not a queue.
				TheWidget = Widgets.Roster[i][0],					//	pluck a Widget name from the array
				Widget = window[TheWidget],							//	make the string a function we can call
				WidgetObj = window[TheWidget],
				Obj = Features.Roster.indexOf(TheWidget) > -1 ;		//	temp trap for newer Widgets, which are object literals with different syntax
			Widgets.Q --;

			if (Obj){						
				WidgetObj.Preload(	null,							//	Action or option
									function() {PreloadWidgets();},	//	Callback function
									"PreloadWidgets"				//	Caller
								)
			}else{
				Widget			(	"Preload", 						//	[key: TheWidget(Action, Callback, Caller {,…})]
									function() {PreloadWidgets();},	//	Callback function
									"PreloadWidgets"				//	Caller
								)
			}
		}else{
			Widgets.Q = -1;											//	reset
			MCReturn("PreloadWidgets");								//	remember MC.methods only return to MC()
		}
	}
	
	
	//	SHOW WIDGETS() -- Turn on the Init Widget(s)
	
	function ShowWidgets (WidgetName) {										//	Locked to MC() and InitWidget
		
		var PendingWidget = (Widgets.Pending() == "none") ? null : Widgets.Pending();
		var TheWidget = Schema.InitWidget || Widgets.Default;
		console.log ("MC(): ShowWidgets -  " + TheWidget);
		
		WidgetMaster(	TheWidget,					
						"Activate",
						function() {MCReturn("ShowWidgets");},
						"ShowWidgets"
					);
	}

	
/*	********	
	DISPLAY POSTER
	Show the poster (with an effect, now hard-coded to be a dissolve);
	WIP: Trap for no image?  Some images not used in some situations.   */
	
	function DisplayPoster(TheImage){
		Poster.Post(
				TheImage, 
				function(){
					MCReturn("DisplayPoster");
				})
	}

/*	********	
	REFRESH MARQUEE
	Trigger the Marquee to update/adjust/show itself; theoretically, it should have 
	been updated already by Poster{} or the InitWidget of the Schema, but who knows...   */
	
	function RefreshMarquee(){
		Marquee.refresh(
				null, 										// action, N/A
				function(){MCReturn("RefreshMarquee");},	// callback
				"MC"										// caller
				)
	}