// Search result item.
Drupal.theme.prototype.mkdruResult = function(hit, num, detailLink) {
  // Escape if there is no title to avoid showig empty blocks.
  if (hit["md-title"] == undefined) {
    return;
  }
  var view = {
      recid: 'rec_' + hit.recid,
      detailLink: detailLink,
      title: hit["md-title"],
      author: hit["md-author"],
      category: hit["md-subject"] != undefined ? hit["md-subject"][0] : '',
      year: hit["md-date"],
      external_link: mkdruParseResources(hit.location)
  };

  var tpl = [
      '<tr class="mkdru-result" id="{{recid}}">',
          '<td class="e-mkdru-result-title">{{title}}</td>',
          '<td class="e-mkdru-result-author">{{author}}</td>',
          '<!--<td class="e-mkdru-result-category">{{category}}</td>-->',
          '<td class="e-mkdru-result-year">{{year}}</td>',
          '<td class="e-mkdru-result-category">{{category}}</td>',
          '<td class="external">{{&external_link}}</td>',
      '</tr>'].join('');

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
  return res.match(/(\w+)\s/)[0].toLowerCase();
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
    return ' '

  var loader = '<img class="mkdru-status-loader" src="data:image/png;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQACgABACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkEAAoAAgAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkEAAoAAwAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkEAAoABAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQACgAFACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQACgAGACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAAKAAcALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA== "> '

  return loader + Drupal.t('Waiting on ') + activeClients + Drupal.t(' out of ')
         + clients + Drupal.t(' targets');
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

  return Mustache.render(tpl, view);
};
