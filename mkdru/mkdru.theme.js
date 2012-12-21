// Modify the structure of results
var results = jQuery('<table><thead><tr><th>'+'Title'+'</th><th>'+'Album'+'</th><th>'+'Year'+'</th></tr></thead><tbody class="mkdru-result-list"></tbody></table>')
jQuery('.mkdru-result-list').replaceWith(results)

// Search result item
Drupal.theme.prototype.mkdruResult = function(hit, num, detailLink) {
    
    var view = {
        recid: 'rec_' + hit.recid,
        detailLink: detailLink,
        title: hit["md-title"],
        author: hit["md-author"],
        category: hit["md-title"],
        year: hit["md-date"],
        external_link: hit['location'][0]['md-electronic-url']
    };

    var tpl = '\
        <tr class="mkdru-result" id="{{recid}}">\
            <td class="e-mkdru-result-title"><a href="{{external_link}}" class="mkdru-result-title">{{title}}</a></td>\
            <td class="e-mkdru-result-author">{{author}}</td>\
            <!--<td class="e-mkdru-result-category">{{category}}</td>-->\
            <td class="e-mkdru-result-year">{{year}}</td>\
        </tr>\
    ';

  return Mustache.render(tpl, view);
};

// Details of found item
Drupal.theme.prototype.mkdruDetail = function(data, linkBack) {
    return ' ';
};

/**
 * Pager theme
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

// Counts
Drupal.theme.prototype.mkdruCounts = function(first, last, available, total) {
  return ' '
};

// Search status
Drupal.theme.prototype.mkdruStatus = function(activeClients, clients) {
    
  if (activeClients == 0)
    return ' '
  
  var loader = '<img class="mkdru-status-loader" src="data:image/png;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQACgABACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkEAAoAAgAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkEAAoAAwAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkEAAoABAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQACgAFACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQACgAGACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAAKAAcALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA== "> '
  
  return loader + Drupal.t('Waiting on ') + activeClients + Drupal.t(' out of ')
         + clients + Drupal.t(' targets');
};

// Toggler for facet groups
jQuery('.mkdru-facet-title').css({cursor:'pointer'}).click(function(){
    jQuery(this).siblings('.mkdru-facet').toggle()
})

// Facet item
Drupal.theme.prototype.mkdruFacet = function (terms, facet, max, selections) {
    
  var view = {
      terms: terms.slice(0,max)
  }
    
  var tpl = '{{#terms}}<a href="{{toggleLink}}" {{#selected}}class="cross"{{/selected}}>{{#selected}}<strong>{{/selected}}{{name}}{{#selected}}</strong>{{/selected}}</a><br />{{/terms}}'

  return Mustache.render(tpl, view);
};
