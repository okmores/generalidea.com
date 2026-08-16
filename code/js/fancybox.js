// ===== FANCYBOX AND CAROUSEL ===== //
// https://fancyapps.com/fancybox/

// import { Panzoom } from "@fancyapps/ui/dist/panzoom/panzoom.js";
// import "@fancyapps/ui/dist/panzoom/panzoom.css";

function initializePlayers() {
 
    // Dynamically import Fancybox to avoid top-level import issues
    console.log("Initializing media players");
    Fancybox.bind("[data-fancybox]", {
       // Carousel: {
          // Toolbar: {
          //   display: {
          //     left: [],
          //     middle: [],
          //     right: [ "playpause", "thumbs", "fullscreen", "close" ],
          //   }
          // },
          // Thumbs: { 
          //     showOnStart: false
          // },
        //},

        // Add legend inside the viewport and disable zoom effect (for
        // reasons that are not clear. Seems to work either way.)

        zoomEffect: false,
        on: {
          "Carousel.contentReady": (_fancybox, _carousel, slide) => {
            if (slide.legend) {
              slide.panzoomRef
              ?.getViewport()
              ?.insertAdjacentHTML(
                "beforeend",
                `<legend class="UU"
                  style=  "position:absolute;
                  left:   0;
                  right:  0;
                  bottom: 0;">
                  ${slide.legend}
                </legend>`,
              );
            }
          },
        },  // End of on: event handlers
    });     // End of Fancybox.bind
    

// MANIPULATE FANCYBOX CAROUSEL ASPECT RATION
// ALSO: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/getPropertyValue#browser_compatibility
//       https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@container#syntax
//       https://developer.mozilla.org/en-US/play?uuid=649f2de2ca3ffd79dfa904d48637f2aa7e68066c&state=nVK7bhsxEPyVBZEAsiHdyQac4vRAEsNdkMZFGhamyJWOEbVkyJV0iqF%2FD0jKidymOnA4M7szvFfR886JTsyNPYB2KqWFFMEnlmIpCeAdrlU0Fxxg3t8vH1U0wJYdztv%2B%2Fu0iVFx7YiSet6E6tcYelpLevmIsdEqiEykogtdMMTYFp04drJzX21mGGAeeKGc31IFGYowzSWdJTd6lqnYqbix1cDcNQ9GsfDQYO7gPAxjPjKbAa088SfY3dnDXPODuYpTDVqNrXfLOZtlZUnsLX0oYZQljjTUwrFRCA57AkrOEkJ3htn3n%2BFc14VPA7kItS1Tv6h6CO0Hik8MEdg3c49U8m4BUjP6IEbhXBJ8epmEokz7%2FY42O1nAP83p7U8dflQRQCB08TD%2BWNgBWSm830e%2FJTLR3Pnbg7KbnTVSnC%2BO6sdIXwLmsLcbiZ3467SkxlLwLMF7vd0jc%2FNpjPD2jQ80%2BjqQohUhxM5NUBeXFrwQ6omJ8cphPI1n%2BiMpPQVGT636sPxMs4KX2e4nz4TWfGu0sEv%2FI2DkMLzNJBQ4qIvF3b7CxlDDyV1z7iKNsOy57N4QDP9uVs7TJA9sW9sEoxvyyEXN4SUdLxh8bZczTAYm%2F2cRImKNdGGIMoxtYLGvX%2F7%2F0Oa8gxoJ73KHohFFxK85%2FAA%3D%3D&srcPrefix=%2Fen-US%2Fdocs%2FWeb%2FCSS%2FReference%2FAt-rules%2F%40container%2F

    Fancybox.bind('[data-fancybox]', {
      Carousel: {
        Zoomable: {
          Panzoom: {
            startPos: (panzoomRef) => {
              // this is the carousel slide (container) element
              console.log(panzoomRef.getContainer() );
              
              // this is a panzoom wrapping element that by default makes content fit the container
              console.log(panzoomRef.getWrapper());
    
              // this is scale level needed to display image in full size
              console.log(panzoomRef.getScale());
    
              return {
                // return 1 to make image fit the container
                // rturn 1.5 to make image 1.5 larger that its size when it fits the container
                scale: 1,
              };
            },
          },
        },

        Toolbar: {
          display: {
            left: [],
            middle: [],
            right: [ "playpause", "thumbs", "fullscreen", "close" ],
          }
        },

        Thumbs: { 
            showOnStart: false
        },
        // Add legend inside the viewport and disable zoom effect


      },
    });
}       // End of initializePlayers()



// A crude function to FORCE the slide "container" TO BE square, so 
	// all of the slides fit into the same space.  
	
	// function slideContainerForMyCarousel (myCarouselSlideContainer) {
	// 		if(myCarouselSlideContainer.height > myCarouselSlideContainer.width) {
	// 			myCarouselSlideContainer.height = myCarouselSlideContainer.width }
	// 		else {
	// 			myCarouselSlideContainer.width = myCarouselSlideContainer.height };
	// };

	// Not knowing any better, I suspect this is more complicated than it looks because I
	// still want Fancybox to fill the entire window height and width. 
	
	