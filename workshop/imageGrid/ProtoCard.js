
/*	PROTOCARD code from the original SWF object.  WILL NOT WORK in Javascript yet  

	IMAGEGRID AND PROTOCARD (C) 2016  Preuit Holland

	This is part of ImageGrid, which was originally written in Flash ActionScript.  This is an
	attempt to re-write ImageGrid and this component, ProtoCard, in javascript. 
	
	ActionScript code runs in a timeline.  Sequential frames hold code that executes in order as 
	the timeline progresses. 
	
	Being based on a timeline means different images or objects can appear on the screen depending 
	on which frame the playhead is on.  Very convenient.  Javascript, of course, lacks this convention.    
	
	It also means the graphic objects referred to here already exist on the "stage."  These objects 
	may also contain an internal timeline, which may in turn execute it's own code.
	
	In Javascript, the objects will have to be created some other way.  
	
	HOW IT WORKS:
	
	ProtoCard is a generic object with placeholders for an image (or other object) that is attached 
	at initialization.  What gets attached is controlled by the calling script, which is located inside 
	ImageGrid.  Once created, ImageGrid organizes multiple instances of ProtoCard into a grid of 
	animated cards.
	
	The generic proxy objects replaced by the incoming image (or whatever) are 32x32 pixels in 
	size and located in the upper left corner. Theoretically, then, the assembled card will adopt to 
	whatever image size is attached.  (At this writing, ImageGrid assigns jpegs that are 256 pixels wide.)
	
	There's also an optional button, a hard-coded graphic in the bottom right corner and the ability 
	assign a hyperlink to the card.
	
	WIP (2016):
	
	--  Remove specific SWF code and references
	
	--  Rebuild the Card, the ClipWell object, it's shadow and buttons or other graphics with the Greensock 
	animation platform in mind.
	
	--  Sort out how the timeline was used to build and display the objects in the 
	correct sequence and translate the effect into javascript instead.  
	
	--  Determine if this should be included in ImageGrid or loaded separately.  May be easier to sort 
	everything out as a standalone first.  (??)  
	
	--  See bottom of this file for code examples stolen from the web.
	
	
	*/


/*	**********  FRAME 1  ***********  */

/*	**
	INI	
	
	BEWARE -- publish settings may exclude hidden layers from the SWF.  */		
	
	this._visible = false ;
	var Ready = false ;	
	

	var CardName = this._name ;
	var CellNumber = _parent.CellNumber ;	//	Position on the grid; should match OnStage [i]
	var Depth = this.getDepth() ;
	
	var CardData = _parent.CurrentMedia ;
	var Code = CardData.Code ;
	var Filename = CardData.Filename ;
	var Link = CardData.Link ;
	
	//	Random Rotation option:
	
	if (_parent.Rotation > 0) { 	
		var a = _parent.Rotation*2 ;
		var r = random (a) - (a/2) ;
		this._rotation = r ;
	}

	if (Link) {
	
		this.createEmptyMovieClip("Btn", 100 ) ;
		
		Btn._alpha = 0 ;
		//Btn._visible = false ;
		Btn.blendMode = 14 ;
	
		Btn.beginFill(0x9999FF, 100);				//	(RGB,_alpha)
		Btn.lineTo(_parent.ImageW, 0);
		Btn.lineTo(_parent.ImageW, _parent.ImageH);
		Btn.lineTo(0, _parent.ImageH);
		Btn.lineTo(0, 0);
		Btn.endFill();
	}
	
	
/*	**********
	BTN HANDLERS */
	
	this.Btn.onRollOver = function () {
		Btn._alpha = _parent.OverAmt ;
	}

	this.Btn.onRollOut = function () {
		Btn._alpha = 0 ;
	}
	
	this.Btn.onPress = function () {
    	Btn._alpha = _parent.HitAmt ;
	}
	
	this.Btn.onRelease = function () {
		Btn._alpha = _parent.OverAmt ;
		_parent.BtnHit( CellNumber, "ProtoCard", Link ) ;	//	Link = VaultCode or Filename of full-size media (not the VaultCode or Filename of the Card media)
	}
	
	this.Btn.onReleaseOutside = function () {
		Btn._alpha = 0 ;
	}	
	
	
/*	**********
	BLUR HANDLER 
	The image has a blur filter applied to it for one frame; see below  
	
	2016 -- Obviously, Javascript won't recognize this Flash filter so this has to be changed...   */	
	
	import flash.filters.BlurFilter;
	import flash.filters.DropShadowFilter;
	import flash.filters.GlowFilter;

	//var blurX = 0;
	//var blurY = 16;
	//var quality = 1;

	var ShadowFilter:DropShadowFilter = new DropShadowFilter	(6, 85, 0x000000, 1, 5, 6, .2, 2, false, false, false);
	var ShadowFilterArray = new Array();
		ShadowFilterArray.push(ShadowFilter);
	
	//BlurCard.filters = BlurFilterArray;
	
	ClipWell._visible = false ;
	//ClipWell.filters = ShadowFilterArray;

	var BlurCardFilter:	BlurFilter = new BlurFilter	(0, 16, 2);
	
	var BlurCardFilterArray = new Array();
	
		BlurCardFilterArray.push(BlurCardFilter);
	
	this.filters = BlurCardFilterArray;
	//this._y += -32 ;


	// DropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality, inner, knockout, hideObject)

/*function createRectangle(w:Number, h:Number, bgColor:Number, name:String):MovieClip {
    var mc:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
    mc.beginFill(bgColor);
    mc.lineTo(w, 0);
    mc.lineTo(w, h);
    mc.lineTo(0, h);
    mc.lineTo(0, 0);
    mc._x = 20;
    mc._y = 20;
    return mc;
}*/


/*	*********
	READY  */

	_parent.ProtoCardLoaded = true ;
	_parent.MC("FetchPrototype")			//  Callback when card is ready
	
	//stop() ;
	
	
	
/*	**********  FRAME 2  ***********  */
	
	//this._visible = false ;
	stop() ;								//  Wait for the master controller to respond
	
	
	
/*	**********  FRAME 5  ***********  */

	this._visible = true ;					//  Show the card;  this frame has a blur filter applied to the image
	
	

/*	**********  FRAME 6  ***********  */
	
	Ready = true ;
	
	this.filters = [];						//	Remove the blur filter

	_parent.MC("PlayCard")					//  Call master controller when card is displayed
	
	if (!Link){								//  { If the card has a link, go to the next frame, which contains a link btn;
		stop();								//  { Otherwise, stop here
	}


/*	**********  FRAME 7  ***********  */	

stop();										//  All done
		
	
/*	**********  
	SAMPLE CODE
	Code samples stolen from the web that might be useful...
	
	
	STACKBLUR
	A nifty method to blur a canvas object -- but it looks like it only blurs the image
	in all directions, so it won't work for a directional blur like dropping cards.
	But maybe it can be modified.  There is a js script file in the js folder.
	
	
	******
	
	FAKE BLUR FILTER for HTML CANVAS:
	This overlays eight instances of an image over itself, each with 1/8th full opacity. 
	The images are placed around the original image like a square filter, giving the 
	impression that the image has been blurred. The browser can create the overlays fast 
	enough to make this solution faster than attempting to write an algorithm in JavaScript:
	
	function blur(imageObj, context, passes) {
	  var i, x, y;
	  passes = passes || 4;
	  context.globalAlpha = 0.125;
	  // Loop for each blur pass.
	  for (i = 1; i <= passes; i++) {
		for (y = -1; y < 2; y++) {
		  for (x = -1; x < 2; x++) {
			  context.drawImage(imageObj, x, y);
		  }
		}
	  }
	  context.globalAlpha = 1.0;
	}
 
	//add the function call in the imageObj.onload
	imageObj.onload = function(){
	  blur(imageObj, context);
	};
	
	******
	
	Semi-helpful tutorial on canvas filters:
	http://www.html5rocks.com/en/tutorials/canvas/imagefilters/#disqus_thread
	
	
	*/
	