


function ImageGrid (gridname, action){
	// var gridname = "";
	// 
	// gridcells = 0;
	// var action = "";
	// console.log(`ImageGrid called with gridname: ${gridname} and action: ${action}`);



	// determine the number of cells in the grid and assign to gridCells
	// assign the gridname to the gridname variable
	// log the number of cells and the gridname to the console for debugging purposes.

	// The second arg, action, will be "count-cells"

	if (action === "count-cells") {
		const grid = document.querySelector(gridname);
		if (grid) {
			const gridCells = grid.children.length;
			console.log(`ImageGrid: ${gridname} contains ${gridCells} cells.`);
			return gridCells;
		} else {
			console.error(`ImageGrid: ${gridname} grid not found.`);
		}
	}
	
}

// ImageGrid(".client-logo-gallery", "count-cells");

/*

	CARDS - Possble method for building prototype cards in Javascript:
	https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript
	Create  a class called "card", make instances with:

		const cardName = new card (cardName)          */



//  ===== IMAGE GRID ===== //

	// var ImageGrid = function (Action, Callback, Caller, NewClass){

	// 	var MyName = "ImageGrid";
	// 	var my = ImageGrid;
	// 		my.Success = false;
	// 		my.Caller = Caller || my.Caller ;		//	} in other words, keep existing (previous) arguments unless a new set is sent;
	// 		my.Callback = Callback || my.Callback;		//	} if Flash is running; we have to loop there first to turn it off, then
	// 		my.Action = Action || my.Action;			//	} come back and use the original Action and Callback. Lame. (??)

	// 		// WHOA, DUDE!  Modern times!

	// 		var myMarqueeSet = presets.ImageGrid.toys;

	// 		// End modern times

	// 	var Class = NewClass || Schema.Current || Schema.Default;	//	Schema.Pending ||

	// 	if (Action == "Activate" && !GotFlash){						// NO FLASH
	// 		// this trap obsoleted by a test in WidgetMaster{} and should never be called;
	// 		// left it in until the whole mess is re-written; this may, however,
	// 		// screw up Breadcrumbs and doesn't account for the Clients{} widget.
	// 		console.log ("  ImageGrid():  No Flash plugin found; requesting ShowMe instead");
	// 		Breadcrumbs.reset();
	// 		WidgetMaster('ShowMe','Activate','none','ImageGrid');	// Go straight to ShowMe{}

	// 	}else{
	// 		switch (Action){

	// 			case "Ini":
	// 				console.log("  ImageGrid(): Ini");				// acknowledge even if there is nothing to initiate
	// 				break;

	// 			case "Activate":
	// 				var MakeCurrent = true;
	// 				Marquee.set(myMarqueeSet);						// use my Marquee Toys
	// 				PosterDimmer.show(
	// 					function(){									// notify me if dimmer is clicked
	// 						//console.log("  Dimmer{}: ImageGrid Broom alert fired");
	// 						ImageGrid("Broom");
	// 					},
	// 					function(){									// callback
	// 						console.log("  Dimmer{}: ImageGrid callback fired but it has no methods");
	// 					},
	// 					"ImageGrid"									// caller
	// 				);

	// 			case "Show":
	// 				console.log("  -- Show ImageGrid -- " ); //(class = " + Class + ")
	// 				console.log("  ImageGrid(): requesting " + Class + " cards" );
	// 				$("#FlashMovie").css("visibility","visible");
	// 				FlashFunc("ImageGrid.UnPoof");
	// 				console.log("  ImageGrid(): un-hiding" );
	// 				FlashFunc("ImageGrid", null, Class);
	// 				FlashTime = true ;
	// 				ImageGrid.Success = true;				//	Oh, really...
	// 				ImageGrid.Visible = true;
	// 				UpdateWidgetArray ("ImageGrid", "Show");
	// 				Respondo();
	// 				break;

	// 			case "Dismiss":
	// 				//	Don't forget that WidgetMaster sometimes differentiates between Dismiss and Hide;
	// 				//	Here, Dismiss simply falls through;  var Deactivate = true;

	// 			case "Hide":											// FLASH IS RUNNING
	// 				if (FlashTime){										//	} if a Flash show is runinng, tell it to stop, then
	// 					ImageGrid("Broom");								//	} exit and wait for the Flash show to clear itself;
	// 					break;											//	} when done, FlashTime will == false and Flash asks for the js Broom() command

	// 				}else if(ImageGrid.Visible){						// FLASH IS NOT RUNNING
	// 					console.log("  -- Hide ImageGrid --" );
	// 					$("#FlashMovie").css("visibility","hidden");	// take Flash off the stage so things underneath can be clicked
	// 					if (Widgets.Current() == MyName){				// notify the Widgets data
	// 						Widgets.Current("none");
	// 					}
	// 					ImageGrid.Visible = false ;						// hide myself; (is this necessary?  Probably for an old WidegtMaster test)
	// 					ImageGrid.Active = false ;						//
	// 					UpdateWidgetArray ("ImageGrid", "Hide");		// update Widget array
	// 					ImageGrid.Success = true ;						// for WidgetMAster?

	// 					PosterDimmer.hide();

	// 					Respondo();
	// 					break;
	// 				}else{
	// 					console.log("  ImageGrid(): Already hidden");
	// 				}
	// 				break;

	// 			// ---------------------------------						//	*** A Call from Flash ***

	// 			case "FlashBroom":
	// 				if (FlashTime) {										//	Flash initiated brooming and cleared the stage so...
	// 					console.log("  ImageGrid(): FlashBroom (from Flash)");
	// 					FlashTime = false ;									//	Ask WidgetMaster() to Dismiss
	// 					WidgetMaster	(	Widgets.Current(),				//	the Current Widget, which might be ImageGrid or might be another Widget that is the parent of ImageGrid.  Hmmm.  Really?
	// 						"Dismiss",						//
	// 						function (){FlashReturn();},	//	Callback - This does nothing but run a function saying it ran; but it could do something if needed...
	// 						"Flash"							//	Caller - does nothing; just a text string for reporting to the console
	// 					);									//	} WidgetMaster will dismiss the "current Widget," which, if it isn't ImageGrid,
	// 																		//	} will in turn release any Widgets under its control.
	// 				}else{
	// 					console.log("  ImageGrid(): FlashBroom (return)");	//	a Callback from javascript asking for the "Broom"
	// 					ImageGrid("Hide");									//	sure hope the original Callbacks are still there...  stupido!
	// 				}
	// 				break;


	// 			// --------------------------------- 					//	*** Calls from Javascript ***

	// 			case "Broom":

	// 				if (FlashTime) {									//	Flash show is running so
	// 					console.log("  ImageGrid(): Broom - waiting for Flash.ImageGrid...");
	// 					FlashFunc("ImageGrid.Broom");					//	ask for a broom, wait for Flash to callback with "FlashBroom," indicating it has swept the stage
	// 					FlashTime = false ;								//	turn FlashTime off so the return call goes straight back to "Hide"

	// 				}else{												//	Flash is not running so just...
	// 					console.log("  ImageGrid(): Broom - Flash is not running");
	// 					ImageGrid("Hide");								//	hide myself
	// 					PosterDimmer.hide();
	// 				}
	// 				break;												//	** If Flash asks for a sample, the call will go to WidgetMaster(),
	// 																	//	** which will in turn hide ImageGrid



	// 			case "Preload":
	// 				var msg = GotFlash ? "ImageGrid" : "ImageGrid (no Flash)";
	// 				console.log("  Preload: " + msg);
	// 				// no preloads
	// 				Respondo();
	// 				break;

	// 			case "Ping":
	// 				console.log("  PING!  ImageGrid");
	// 				break;

	// 			default:
	// 				console.log("  ImageGrid():  !!  command not recognized: " + Action);
	// 		}
	// 	}

	// 	function Respondo (){

	// 		if (typeof my.Callback == "function"){
	// 			console.log ("  " + MyName + "(): Respondo to " + my.Caller);
	// 			my.Callback();
	// 		}else{
	// 			console.log ("  " + MyName + "(): empty Callback from " + my.Caller);
	// 		}
	// 	}
	// }

	// 	ImageGrid.Success = false ;			//	crude but effective
	// 	ImageGrid.Callback = null;			//	storage for a Callback function
	// 	ImageGrid.Caller = "";				//	for console and dev; no methods should be tied to this
	// 	ImageGrid.Visible =	false;			//	} being fazed out in favor of a central
	// 	ImageGrid.Active =	false;			//	} place to track these states
	// 	ImageGrid.Action = "";				//	for Flash commnuication? (SWF is now obsolete)
	// 	//ImageGrid.Alternate = function (){	//  If no Flash, do this instead; WidgetMaster will look here
	// 	//	WidgetMaster('ShowMe','Activate','none','ImageGrid');
	// 	//};
	// 	//ImageGrid.MarqueeSet = [];			//  my Toys; hard coded above or from site Presets() in content.js
	// 	//ImageGrid.MarqueeSetSaved = [];		//  The set to return when ImageGrid exits
	// 	ImageGrid.Init = false ;			//	N/A WIP
	// 	ImageGrid.State = "";				//	N/A WIP
