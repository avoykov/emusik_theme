(function($) {
  $(document).ready(function() {
    $('.page-node .node-details .date-value').after($('.page-node .pane-node-content .pane-title'));

    // Adapt default mkdru markup to panel layout.
    var facets = $('<div class="grid-3 alpha"></div>');
    var results = $('<div class="grid-9 omega"></div>');
    setTimeout(function() {

      facets.prependTo($('.page-search-meta .grid-12.region-content .region-inner'))
        .append($('.mkdru-facet-section'));

      results.appendTo($('.page-search-meta .grid-12.region-content .region-inner'))
        .append($('.page-search-meta .region-content .block-system-main'));

      init_facet_groups().prependTo($('.page-search-meta .grid-12.region-content .grid-9'));
      window.facets_backup = facets.clone();

    }, 1000);

    $('.mkdru-facet-title').live("click", function() {
      $(this).parent().toggleClass('closed-facet-group');
    });

    // Playlist title.
    $('.pane-emusik-playlist .node').each(function() {
      $(this).find('.field-name-body').prepend($(this).find('header'));
    });

    // Handle changes of hash.
    jQuery(window).hashchange(function() {

      var query = jQuery.deparam.fragment();
      if (query.facet_group == undefined) {
        return;
      }

      var container = jQuery('.grid-3.alpha');
      if (query.facet_group == 'streaming') {
        // Re-order facets.
        jQuery('.mkdru-facet-section:has(.mkdru-facet-source):gt(0)').insertBefore(jQuery('.mkdru-facet-section:first', container));
        jQuery('.mkdru-facet-section:has(.mkdru-facet-Album)').insertBefore(jQuery('.mkdru-facet-section:first', container));
        jQuery('.mkdru-facet-section:has(.mkdru-facet-Date)').insertBefore(jQuery('.mkdru-facet-section:first', container));
        jQuery('.mkdru-facet-section:has(.mkdru-facet-author)').insertBefore(jQuery('.mkdru-facet-section:first', container));
        jQuery('.mkdru-facet-section:has(.mkdru-facet-Type)').insertBefore(jQuery('.mkdru-facet-section:first', container));
      }
      else if (container[0] != window.facets_backup[0]) {
        // Restore original order of facets.
        container.replaceWith(window.facets_backup.clone());
      }

    });
  });

  // Initialize custom facet groups.
  function init_facet_groups() {
    var custom_facets = [{
      key: 'streaming',
      name: Drupal.t('Streaming Services'),
      fragment: {
        limit_Type: 'album|track|artist'
      }
    }, {
      key: 'videos',
      name: Drupal.t('Videos'),
      fragment: {
        limit_Type: 'video'
      }
    }, {
      key: 'books',
      name: Drupal.t('Books and sheet music'),
      fragment: {
        limit_Type: 'text'
      }
    }];

    // Create custom facet group on top of search.
    var uri_fragment = $.deparam.fragment();
    var facets_ontop = $('<div class="mkdru-facet-section"><h3 class="mkdru-facet-title"></h3><div class="mkdru-facet mkdru-facet-groups"></div></div>');
    $.each(custom_facets, function(i, e) {
      $('<a href="">' + e.name + ' (<span class="mkdru-facet-group-amount '+e.key+'">0</span>)</a> ')
        .fragment($.extend(uri_fragment, e.fragment, {'facet_group': e.key}))
        .appendTo($('.mkdru-facet-groups', facets_ontop));
    });
    $('.mkdru-facet-groups', facets_ontop).append('<a href="' + '/search/node/' + Drupal.settings.mkdru.state.query+'">' + Drupal.t('Editorial') + '</a>');

    // Populate facet amounts.
    $(document).bind('mkdru.onterm', function(event, data) {
      $('.mkdru-facet-group-amount').text(0);
      $.each(data, function(i, e) {
        $.each(e, function(i, term) {
          $.each(custom_facets, function(i, e) {
            var types = e.fragment.limit_Type.split('|');
            if (jQuery.inArray(term.name, types)) {
              var amount = parseInt($('.mkdru-facet-group-amount.' + e.key).text());
              amount += parseInt(term.freq);
              $('.mkdru-facet-group-amount.' + e.key).text(amount);
            }
          });
        });
      });
    });

    return facets_ontop;
  }

})(jQuery);
