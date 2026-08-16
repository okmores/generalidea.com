
/* ===== VIDEO PLAYER CONTROLS ===== //

Unfinished; started as a Christmas card but will be the video player for the site.
The default browser controls work and need no programming but they're ugly and
appear differently in differernt browswers, so this is the beginning of a custom
player.

Video element:
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-crossorigin
Source code for custom player controls:
https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player

Note: The code was started using a different (dated) example. Some bits need to be replaced by the
souorce code above.

var player,
	playBtn,
	seekBar;

 function iniPlayer (){
 	console.log("Video player initialized");
 	player = document.getElementById("video-player");
 	playBtn = document.getElementById("play-pause-btn");

 	playBtn.addEventListener("click", playPause())
 }
*/

function playPause (){
	if (player.paused) {
		player.play();
		return;
	}
	player.pause();
	// btn.innerHTML = "Play";
}

// window.onload(iniPlayer());