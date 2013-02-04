// Search result item.
Drupal.theme.prototype.mkdruResult = function(hit, num, detailLink) {
  // Escape if there is no title to avoid showig empty blocks.
  if (hit["md-title"] == undefined) {
    return;
  }
  var view = {
      recid: hit.recid[0],
      recid_html: (new MkdruRecid(hit.recid[0])).toHtmlAttr(),
      is_album: function() {
        try {
          return (jQuery.inArray("album", hit["md-medium"]) > -1);
        }
        catch (e) {
          return false;
        }
      },
      detailLink: detailLink,
      title: hit["md-title"],
      author: hit["md-author"],
      category: hit["md-subject"] != undefined ? hit["md-subject"][0] : '',
      year: hit["md-date"],
      external_link: mkdruParseResources(hit.location)
  };

  var tpl = [
    '<tr class="mkdru-result {{#is_album}}album{{/is_album}}" id="{{recid_html}}" {{#is_album}}onclick="javascript: bindMkdruDetailsHandler(\'{{recid}}\');"{{/is_album}}>',
      '<td class="e-mkdru-result-title">{{title}}</td>',
      '<td class="e-mkdru-result-author">{{author}}</td>',
      '<td class="e-mkdru-result-year">{{year}}</td>',
      '<td class="e-mkdru-result-category">{{category}}</td>',
      '<td class="external">{{&external_link}}</td>',
    '</tr>'
  ].join('');

  return Mustache.render(tpl, view);
};

mkdruParseResources = function(data) {
  var resources = {};
  var tpl = '<a href="{{link}}" class="{{classname}}" target="_blank"></a>';
  for(var i in data) {
    var url = choose_url(data[i]);
    if (!url) continue;
    var classname = mkdruResourceTitle2ClassName(data[i]['@name']);
    var view = {
      link : url,
      classname: classname
    };
    resources[classname] = Mustache.render(tpl, view);
  }
  var html = '';
  for(var i in resources) {
    html += resources[i];
  }
  return html;
};

mkdruResourceTitle2ClassName = function(res) {
  return res.match(/(\w+)/)[0].toLowerCase();
};

// Item details.
Drupal.theme.prototype.mkdruEmusicDetail = function(data) {

  var view = {
    available: {
      // In some cases pz2 response has no both artist and album sections.
      lastfm: {
        status: function () {
          try {
            return data.lfm.length > 1;
          }
          catch (e) {
            return false;
          }
        },
        message: Drupal.t('<p>Sorry, no data available.</p>')
      }
    },
    thumb: function () {
      try {
        return data.lfm[1].album[0].image[2]['#text'];
      }
      catch(e) {
        return null;
      }
    },
    label: {
      name: Drupal.t('Label'),
      value: false // This is a stub. For now there is no data.
    },
    date: {
      name: Drupal.t('Release date'),
      value: function () {
        try {
          // Replace dublicated spaces and time.
          var date = data.lfm[1].album[0].releasedate[0].replace(/(\s{2,}|, 00:00)/g, '');
          if (!date) {
            throw 'Date is empty';
          }
          return date;
        }
        catch (e) {
          return Drupal.t('n/a');
        }
      }
    },
    length: {
      name: Drupal.t('Running length'),
      value: function () {
        try {
          return data.lfm[1].album[0].tracks[0].track.length;
        }
        catch (e) {
          return Drupal.t('n/a');
        }
      }
    },
    duration: {
      name: Drupal.t('Running time'),
      value: function () {
        try {
          var duration = 0;
          jQuery.each(data.lfm[1].album[0].tracks[0].track, function (i, e) {
            duration += parseInt(e.duration[0]);
          });
          return duration.toString().toHHMMSS();
        }
        catch (e) {
            return Drupal.t('n/a');
        }
      }
    },
    tracks: function () {
      var tracks_view = {
        position: Drupal.t('Position'),
        title: Drupal.t('Title'),
        duration: Drupal.t('Duration'),
        externals: Drupal.t('Externals'),
        items: []
      };

      try {
        jQuery.each(data.lfm[1].album[0].tracks[0].track, function (i, e) {
          tracks_view.items.push({
            position: i+1,
            title: e.name[0],
            duration: e.duration[0].toHHMMSS(),
            externals: [{
              url: e.url[0],
              source: 'fm'
            }]
          })
        });
      }
      catch (e) {
        return false;
      }

      return Mustache.render(tracks_tpl, tracks_view);
    },
    bio: {
      title: Drupal.t('Biography'),
      content: function () {
        try {
          // Also strip HTML tags.
          return data.lfm[0].artist[0].bio[0].summary[0].replace(/(<([^>]+)>)/ig, "");
        }
        catch (e) {
          return Drupal.t('n/a');
        }
      },
      thumb: function () {
        try {
          return data.lfm[0].artist[0].image[2]['#text'];
        }
        catch (e) {
          return null;
        }
      }
    },
    suggested_albums: {
      title: Drupal.t('Other albums'),
      status: function () {
        return this.suggested_albums.items().length > 0;
      },
      items: function () {
        try {
          var albums = [];
          var uri_fragment = jQuery.deparam.fragment();

          for (var i = 0; i <= 3; i++) {
            var fragment = jQuery.extend({}, uri_fragment); // clone.
            var title = data.lfm[2].topalbums[0].album[i].name[0];
            fragment.limit_Album = encodeURI(title);

            albums.push({
              url: jQuery('<a>').fragment(fragment).attr('href'),
              title: title
            });
          }

          return albums;
        }
        catch (e) {
          return [];
        }
      }
    },
    suggested_articles: {
      /* This will be replaced while implementation.
      title: Drupal.t('Other articles'),
      items: [{url: 'http://example.com', 'title': 'Some title'}]
      */
    }
  };

  var tracks_tpl = [
    '<table class="e-track-list">',
      '<thead>',
        '<tr>',
          '<th class="b-header position">{{position}}</th>',
          '<th class="b-header title">{{title}}</th>',
          '<th class="b-header duration">{{duration}}</th>',
          '<th class="b-header externals">{{externals}}</th>',
        '</tr>',
      '<thead>',
      '{{#items}}<tbody>',
        '<tr>',
          '<td class="b-data position">{{position}}</td>',
          '<td class="b-data title">{{title}}</td>',
          '<td class="b-data duration">{{duration}}</td>',
          '<td class="b-data external">{{#externals}}<a href="{{url}}" class="{{source}}" target="_blank"></a> {{/externals}}</td>',
        '</tr>',
      '</tbody>{{/items}}',
    '</table>',
  ].join('');

  var tpl = ['<tr class="mkdru-result details">',
      '<td colspan="5" class="mkdru-result-details">',
        '{{^available.lastfm.status}}{{&available.lastfm.message}}{{/available.lastfm.status}}',
        '{{#available.lastfm.status}}<div class="mkdru-result-details-album">',
          '<div class="b-album-info">',
            '<div class="e-close">close</div>',
            '{{#thumb}}<div class="e-album-info-thumb"><img src="{{thumb}}" ></div>{{/thumb}}',
            '{{#label.value}}<div class="e-album-info-item label">',
              '<span class="b-album-info-item name">{{label.name}}</span>',
              '<span class="b-album-info-item value">{{label.value}}</span>',
            '</div>{{/label.value}}',
            '<div class="e-album-info-item date">',
              '<span class="b-album-info-item name">{{date.name}}</span>',
              '<span class="b-album-info-item value">{{date.value}}</span>',
            '</div>',
            '<div class="e-album-info-item length">',
              '<span class="b-album-info-item name">{{length.name}}</span>',
              '<span class="b-album-info-item value">{{length.value}}</span>',
            '</div>',
            '<div class="e-album-info-item duration">',
              '<span class="b-album-info-item name">{{duration.name}}</span>',
              '<span class="b-album-info-item value">{{duration.value}}</span>',
            '</div>',
          '</div>',
          '{{#tracks}}<div class="b-tracks">{{&tracks}}</div>{{/tracks}}',
        '</div>',
        '<div class="mkdru-result-details-suggestions">',
          '<div class="e-bio">',
            '<h4 class="b-bio-title">{{bio.title}}</h4>',
            '<img class="b-bio-thumb" src="{{bio.thumb}}" >',
            '<div class="b-bio-content">{{&bio.content}}</div>',
          '</div>',
          '{{#suggested_albums.status}}<div class="e-suggestion albums">',
            '<h4 class="b-suggestion-title">{{suggested_albums.title}}</h4>',
            '<ul class="b-suggestions">{{#suggested_albums.items}}<li>{{title}}</li>{{/suggested_albums.items}}</ul>',
          '</div>{{/suggested_albums.status}}',
          '{{#suggested_articles}}<div class="e-suggestion editorial">',
            '<h4 class="b-suggestion-title">{{suggested_articles.title}}</h4>',
            '<ul class="b-suggestions">{{#suggested_articles.items}}<li><a href="{{url}}">{{title}}</a></li>{{/suggested_articles.items}}</ul>',
          '</div>{{/suggested_articles}}',
        '</div>{{/available.lastfm.status}}',
      '</td>',
    '</tr>'
  ].join('');

  return Mustache.render(tpl, view);
};

// Details of found item.
Drupal.theme.prototype.mkdruDetail = function(data, linkBack) {
    return ' ';
};

/**
 * Pager theme.
 *
 * @param pages Array of hrefs for page links.
 * @param start Number of first page.
 * @param current Number of current page.
 * @param total Total number of pages.
 * @param prev Href for previous page.
 * @param next Href for next page.
 */
Drupal.theme.prototype.mkdruPager = function (pages, start, current, total, prev, next) {
  var indexed_pages = [];
  for (key in pages)
      indexed_pages.push({'current': parseInt(key)+parseInt(start)==current, page: parseInt(key)+parseInt(start),'link': pages[key]});

  var view = {
      pages: indexed_pages,
      prev: prev,
      start: start,
      current: current,
      total: total,
      next: next,
      before: function(){
          return this.start > 1
      },
      after: function() {
          return this.total > pages.length
      }
  };

  var tpl = '<span class="mkdru-pager-prev">{{#prev}}<a href="{{prev}}" class="mkdru-pager-prev-link">{{/prev}}'+Drupal.t("Prev")+'{{#prev}}</a>{{/prev}}</span>\
    {{#before}}<span class="mkdru-pager-before">...</span>{{/before}}\
    {{#pages}}<span class="mkdru-pager-item">\
        {{#current}}{{page}}{{/current}}\
        {{^current}}<a href="{{link}}">{{page}}</a>{{/current}}\
    </span>{{/pages}}\
    {{#after}}<span class="mkdru-pager-after">...</span>{{/after}}\
    <span class="mkdru-pager-next">{{#next}}<a href="{{next}}" class="mkdru-pager-next-link">{{/next}}'+Drupal.t("Next")+'{{#next}}</a>{{/next}}</span>\
  ';

  return Mustache.render(tpl, view);
};

// Counts.
Drupal.theme.prototype.mkdruCounts = function(first, last, available, total) {
  var tpl = '{{first}} to {{last}} of {{available}} available ({{total}} found)';
  return Mustache.render(tpl, {first: first, last: last, available: available, total: total});
};

// Search status.
Drupal.theme.prototype.mkdruStatus = function(activeClients, clients) {

  if (activeClients == 0)
    return ' ';

  var loader = '<img class="mkdru-status-loader" src="' + Drupal.settings.images_path + '/loader.png"> ';

  return loader + Drupal.t('Waiting on @activeClients out of @clients targets',
    {'@activeClients': activeClients, '@clients': clients}
  );
};

// Toggler for facet.
jQuery('.mkdru-facet-title').css({cursor:'pointer'}).live("click", function() {
  jQuery(this).parent().toggleClass('closed-facet-group');
  jQuery(this).siblings('.mkdru-facet').toggle()
});

// By default collapse all facets except first.
jQuery('.mkdru-facet:not(:first)').hide().parent().addClass('closed-facet-group');
jQuery('.mkdru-facet:first').show().parent().removeClass('closed-facet-group');

// Facet item.
Drupal.theme.prototype.mkdruFacet = function (terms, facet, max, selections) {
  var view = {
    terms: []
  }
  for (var key in terms.slice(0, max)) {
    if (terms[key].name != 'video' && terms[key].name != 'artist') {
      if (terms[key].id != undefined) {
        // Escape special chars to use as CSS class.
        terms[key].id = terms[key].id.replace(/[\.\:]/g, "_");
      }
      view.terms.push(terms[key]);
    }
  }
  var tpl = '{{#terms}}<a href="{{toggleLink}}" class="{{#selected}}cross{{/selected}} {{id}}">{{#selected}}<strong>{{/selected}}{{name}}{{#selected}}</strong>{{/selected}} (<span class="facet-freq">{{freq}}</span>)</a>{{/terms}}'

  // Trigger onAfterFacet event.
  setTimeout(function () { jQuery(document).trigger('mkdru.theme.onAfterFacet'); }, 100);

  return Mustache.render(tpl, view);
};

// Mkdru record id wrapper.
function MkdruRecid(recid) {
  this.recid = recid;
  this.toHtmlAttr = function() {
    return this.recid.replace(/[\s\:]+/g, '_');
  };
}

// Helper to format seconds.
String.prototype.toHHMMSS = function () {
  sec_numb    = parseInt(this);
  var hours   = Math.floor(sec_numb / 3600);
  var minutes = Math.floor((sec_numb - (hours * 3600)) / 60);
  var seconds = sec_numb - (hours * 3600) - (minutes * 60);

  if (minutes < 10) {minutes = "0" + minutes;}
  if (seconds < 10) {seconds = "0" + seconds;}
  var time = minutes + ':' + seconds;

  if (hours > 0) {
    if (hours < 10) {
      time = "0" + hours + ":" + time;
    }
    else {
      time = hours + ":" + time;
    }
  }

  return time;
}

// Open details box.
function bindMkdruDetailsHandler(recid) {
  // Try to close details box if it open.
  if (closeDetailsBox(recid)) {
    return;
  }

  // Are details already loading?
  if (jQuery('.mkdru-details-loader').length) {
    return;
  }

  var selector = jQuery('#' + (new MkdruRecid(recid)).toHtmlAttr());
  var loader = jQuery('<img class="mkdru-details-loader" src="' + Drupal.settings.images_path + '/loader.png">');
  selector.after(loader);

  // Hide all other details boxes if any.
  jQuery.each(jQuery('.mkdru-result.details'), function(i, e) {
    closeDetailsBox(jQuery(this).prev().attr('id'));
    jQuery(this).remove();
  });

  // Clear mkdru handler and set own.
  jQuery(document).unbind('mkdru.onrecord');
  jQuery(document).bind('mkdru.onrecord', function(event, data) {
    var selector = jQuery('#' + (new MkdruRecid(data.recid[0])).toHtmlAttr());

    clearTimeout(mkdru.pz2.showTimer);
    jQuery('.mkdru-details-loader').remove();

    var details = jQuery(Drupal.theme('mkdruEmusicDetail', data))
      .insertAfter(selector);

    details.find('.e-close').click(function () {
      closeDetailsBox(recid);
    });

    selector.addClass('open');

    // Copy external links from album to each track.
    jQuery('.external a', selector).appendTo(jQuery('.b-data.external', details));

    // Scroll to details.
    var offset = details.offset();
    if (offset) {
      jQuery('html, body').animate({
        scrollTop: offset.top-50,
        scrollLeft: offset.left
      });
    }

    mkdru.pz2.errorHandler = null;
    clearTimeout(mkdru.pz2.recordTimer);
  });

  // Call to pz webservice.
  mkdru.pz2.errorHandler = function () {
    jQuery('.mkdru-details-loader').replaceWith(Drupal.theme('mkdruEmusicDetail'));
  };
  mkdru.pz2.record(recid);
};

// Close details box.
function closeDetailsBox(recid) {
  var row = jQuery('#' + (new MkdruRecid(recid)).toHtmlAttr());
  var details = row.next();
  if (details.hasClass('mkdru-result details')) {
    details.remove();
    row.removeClass('open');
    return true;
  }
  return false;
}
