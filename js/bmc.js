(function($) {
  $(document).ready(function() {
    $('.page-node .node-details .date-value').after($('.page-node .pane-node-content .pane-title'));

    var custom_facets = [
      {key: 'streaming', name: Drupal.t('Streaming Services'), fragment: {limit_source: 'P-3.A.local-13-313-27|P-2.dbc-spotify:album-3|P-2.dbc-spotify:artist-4|P-2.dbc-last_fm:artist-30|P-2.dbc-last_fm:album-29|P-2.dbc-spotify:track-12|P-2.dbc-last_fm:track-31'}},
      {key: 'videos', name: Drupal.t('Videos'), fragment: {limit_source: 'P-2.dbc-youtube_api:video-20'}},
      {key: 'books', name: Drupal.t('Books and sheet music'), fragment: {limit_source: 'P-3.A.local-13-311-25|P-3.A.local-13-312-26'}},
    ]

    // Sets panel layout.
    var facets = $('<div class="grid-3 alpha"></div>');
    var results = $('<div class="grid-9 omega"></div>');
    setTimeout(function() {

      // Adopt mkdru facets markup.
      $('.mkdru-facet-section').appendTo(facets);
      facets.prependTo($('.page-search-meta .grid-12.region-content .region-inner'));

      // Adopt mkdru search result markup.
      $('.page-search-meta .region-content .block-system-main').appendTo(results);
      results.appendTo($('.page-search-meta .grid-12.region-content .region-inner'));

      // Create custom facet group on top of search.
      var uri_fragment = $.deparam.fragment();
      var facets_ontop = $('<div class="mkdru-facet-section"><h3 class="mkdru-facet-title"></h3><div class="mkdru-facet mkdru-facet-custom"></div></div>');
      $.each(custom_facets, function(i,e){
        var link = $('<a href="">'+e.name+'</a> ').fragment($.extend(uri_fragment, e.fragment, {'facet_group': e.key}));
        $('.mkdru-facet-custom', facets_ontop).append(link);
      });
      $('.mkdru-facet-custom', facets_ontop).append('<a href="'+'/search/node/' + Drupal.settings.mkdru.search_query+'">'+Drupal.t('Editorial')+'</a>');

      facets_ontop.prependTo($('.page-search-meta .grid-12.region-content .grid-9'));
    }, 1000);

    $('.mkdru-facet-title').live("click", function() {
      $(this).parent().toggleClass('closed-facet-group');
    });

    // Playlist title.
    $('.pane-emusik-playlist .node').each(function() {
      $(this).find('.field-name-body').prepend($(this).find('header'));
    });

    // Handle changes of hash
    jQuery(window).hashchange(function(){

      if (query.facet_group == undefined)
        return;

      var query = jQuery.deparam.fragment();

      if (query.facet_group == 'streaming') {
        // Re-order facets.
        jQuery(".mkdru-facet-section:has(.mkdru-facet-source):gt(0)").insertBefore(jQuery(".grid-3.alpha .mkdru-facet-section:first"));
        jQuery(".mkdru-facet-section:has(.mkdru-facet-Album)").insertBefore(jQuery(".grid-3.alpha .mkdru-facet-section:first"));
        jQuery(".mkdru-facet-section:has(.mkdru-facet-Date)").insertBefore(jQuery(".grid-3.alpha .mkdru-facet-section:first"));
        jQuery(".mkdru-facet-section:has(.mkdru-facet-author)").insertBefore(jQuery(".grid-3.alpha .mkdru-facet-section:first"));
        jQuery(".mkdru-facet-section:has(.mkdru-facet-Type)").insertBefore(jQuery(".grid-3.alpha .mkdru-facet-section:first"));
      } else {
        // @TODO: Make this by making backup before ordering.
        jQuery(".mkdru-facet-section:has(.mkdru-facet-Type):gt(0)").insertBefore(jQuery(".grid-3.alpha .mkdru-facet-section:first"));
        jQuery(".mkdru-facet-section:has(.mkdru-facet-Date)").insertBefore(jQuery(".grid-3.alpha .mkdru-facet-section:first"));
        jQuery(".mkdru-facet-section:has(.mkdru-facet-Album)").insertBefore(jQuery(".grid-3.alpha .mkdru-facet-section:first"));
        jQuery(".mkdru-facet-section:has(.mkdru-facet-author)").insertBefore(jQuery(".grid-3.alpha .mkdru-facet-section:first"));
        jQuery(".mkdru-facet-section:has(.mkdru-facet-source)").insertBefore(jQuery(".grid-3.alpha .mkdru-facet-section:first"));
      }

    })

  });
})(jQuery);
