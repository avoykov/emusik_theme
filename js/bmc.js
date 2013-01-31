(function($) {
  $(document).ready(function() {
    $('.page-node .node-details .date-value').after($('.page-node .pane-node-content .pane-title'));
    $('.pane-views-panes .view.concerts').parent().addClass('concerts-content');

    // Adds active menu class on hover.
    $('.block-main-menu .expanded').hover(function() {
      $(this).toggleClass('active');
    });

    // Adapt default mkdru markup to panel layout.
    var facets = $('<div class="grid-3 alpha"></div>');
    var results = $('<div class="grid-9 omega"></div>');
    setTimeout(function() {

      facets.prependTo($('.page-search-meta .grid-12.region-content .region-inner'))
        .append($('.mkdru-facet-section'));

      results.appendTo($('.page-search-meta .grid-12.region-content .region-inner'))
        .append($('.page-search-meta .region-content .block-system-main'));

      init_facet_groups().prependTo($('.page-search-meta .grid-12.region-content .grid-9'));

    }, 1000);

    // Playlist title.
    $('.pane-emusik-playlist .node').each(function() {
      $(this).find('.field-name-body').prepend($(this).find('header'));
    });

    window.related_sources = [];
    var last_facet_group;

    // Handle changes of hash.
    jQuery(window).hashchange(function() {

      // Handle only facet_group params.
      var query = jQuery.deparam.fragment();
      if (query.facet_group == undefined || last_facet_group == query.facet_group) {
        return;
      }

      last_facet_group = query.facet_group;

      // Reset sources list. It will be filled on search result processing.
      window.related_sources = [];

      var container = jQuery('.grid-3.alpha');

      // Restore original order of facets.
      container.restore = function (backup) {
        if (this[0] !== backup[0]) {
          this.replaceWith(backup.clone(true));
        }
      };

      // Store the backup.
      if (window.facets_backup == undefined) {
        window.facets_backup = container.clone(true);
      }

      if (query.facet_group == 'streaming') {
        // Re-order facets.
        container.restore(window.facets_backup);
        jQuery('.mkdru-facet-section:has(.mkdru-facet-source):gt(0)').insertBefore(jQuery('.mkdru-facet-section:first'));
        jQuery('.mkdru-facet-section:has(.mkdru-facet-Album)').insertBefore(jQuery('.mkdru-facet-section:first'));
        jQuery('.mkdru-facet-section:has(.mkdru-facet-Date)').insertBefore(jQuery('.mkdru-facet-section:first'));
        jQuery('.mkdru-facet-section:has(.mkdru-facet-author)').insertBefore(jQuery('.mkdru-facet-section:first'));
        jQuery('.mkdru-facet-section:has(.mkdru-facet-Type)').insertBefore(jQuery('.mkdru-facet-section:first'));
      }
      else if (query.facet_group == 'books') {
        jQuery('.mkdru-facet-section:has(.mkdru-facet-author,.mkdru-facet-Type)', container).remove();
      }
      else if (query.facet_group == 'videos') {
        // Re-order facets.
        container.restore(window.facets_backup);
        jQuery('.mkdru-facet-section:has(.mkdru-facet-author)').insertBefore(jQuery('.mkdru-facet-section:first'));
      }
      else {
        container.restore(window.facets_backup);
      }

      // By default collapse all facets except first.
      jQuery('.mkdru-facet').empty();
      jQuery('.mkdru-facet:not(:first)').hide().parent().addClass('closed-facet-group');
      jQuery('.mkdru-facet:first').show().parent().removeClass('closed-facet-group');

      // Mark according link as active.
      jQuery('.mkdru-facet-group-amount.' + query.facet_group).parent().addClass('active');

    });

    // Show only source terms that exists in search results.
    $(document).bind('mkdru.theme.onAfterFacet', function(event, data) {
      // Hide all not related facet terms.
      $('.mkdru-facet-source a:not(.related_source)').hide();

      // Show only terms found in results.
      $(window.related_sources.join()).addClass('related_source').show();
    });

    // Populate facet terms from search results.
    $(document).bind('mkdru.onshow', function(event, data) {
      $.each(data, function(i, elements) {
        $.each(elements, function(i, e) {
          var id = '.' + e.location[0]['@id'].replace(/[\.\:]/g, "_");
          window.related_sources.push(id);
        });
      });

      // Unique values in array.
      var sources = $.grep(window.related_sources, function(v, k) {
        return $.inArray(v, window.related_sources) === k;
      });

      window.related_sources = sources;
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
    var facets_ontop = $('<div class="mkdru-facet-section"><h3 class="mkdru-facet-title"></h3><div class="mkdru-facet-groups"></div></div>');
    $.each(custom_facets, function(i, e) {
      $('<a href="">' + e.name + ' (<span class="mkdru-facet-group-amount ' + e.key + '">0</span>)</a> ')
        .fragment($.extend(uri_fragment, e.fragment, {'facet_group': e.key}))
        .appendTo($('.mkdru-facet-groups', facets_ontop))
        .click(function() {
          $(this).addClass('active').siblings().removeClass('active');
        });
    });
    $('.mkdru-facet-groups', facets_ontop)
      .append('<a href="' + '/search/node/' + Drupal.settings.mkdru.search_query + '">' + Drupal.t('Editorial') + ' (<span class="mkdru-facet-group-amount editorial">0</span>)</a>');

    // Activate first group by default.
    document.location.hash = $('.mkdru-facet-groups a:first', facets_ontop).attr('href');

    // Populate facet amounts.
    $(document).bind('mkdru.onterm', function(event, data) {
      $('.mkdru-facet-group-amount:not(.editorial)').text(0);
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

    // Amount of editorial search results.
    $.getJSON('/json/search/node/' + Drupal.settings.mkdru.search_query, function(data) {
      $('.mkdru-facet-group-amount.editorial').text(data.count);
    });

    return facets_ontop;
  }

})(jQuery);
