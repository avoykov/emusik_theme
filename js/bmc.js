(function($) {
  $(document).ready(function() {
    $('.page-node .node-details .date-value').after($('.page-node .pane-node-content .pane-title'));
  });

  // Sets panel layout.
  var facets = $('<div class="grid-3 alpha"></div>');
  var results = $('<div class="grid-9 omega"></div>');
  setTimeout(function() {
    $('.mkdru-facet-section').appendTo(facets);
    facets.prependTo($('.page-search-meta .grid-12.region-content .region-inner'));
    $('.page-search-meta .region-content .block-system-main').appendTo(results);
    results.appendTo($('.page-search-meta .grid-12.region-content .region-inner'));
    $('.mkdru-facet-Type').parent().prependTo($('.page-search-meta .grid-12.region-content .grid-9'));
  }, 1000 );
  
  $('.mkdru-facet-title').live("click", function() {
    $(this).parent().toggleClass("closed-facet-group");
  });

})(jQuery);
