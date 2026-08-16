
// Un-modified from Discord. Missing elements or rules probably
// cause errors... 

<script>
(function () {
  'use strict';

  function moveProgressToBottomBar() {
    // The timeline/progress slider in the new Bunny Stream Player
    var timeRange = document.querySelector('bunny-media-time-range');
    if (!timeRange) return false;

    // Collect all control bars (player may use either element name)
    var allBars = Array.from(
      document.querySelectorAll('media-control-bar, bunny-media-control-bar')
    );
    if (!allBars.length) return false;

    // Target the bar that contains the play button (the real bottom bar)
    var bottomBar = allBars.find(function (bar) {
      return bar.querySelector('media-play-button');
    }) || allBars[allBars.length - 1];

    if (!bottomBar) return false;

    // Already in the right place — nothing to do
    if (bottomBar.contains(timeRange)) return true;

    // Insert the timeline between the play button and the mute/volume controls
    var anchor = bottomBar.querySelector('media-mute-button') ||
                 bottomBar.querySelector('media-volume-range');

    if (anchor) {
      bottomBar.insertBefore(timeRange, anchor);
    } else {
      bottomBar.appendChild(timeRange);
    }

    return true;
  }

  function init() {
    if (!moveProgressToBottomBar()) {
      // Player web components load asynchronously — watch for them
      var observer = new MutationObserver(function (_, obs) {
        if (moveProgressToBottomBar()) {
          obs.disconnect();
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>

<style>
/* Allow the timeline to stretch and fill the available space in the bottom bar */
bunny-media-time-range {
  flex: 1 1 auto;
  min-width: 0;
}
</style>