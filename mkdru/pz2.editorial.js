var mkdru = {
  active: false,
  callbacks: [],
  pz2: null,
  totalRec: 0,
  pagerRange: 6,
  defaultState: {
    page: 1,
    perpage: 20,
    sort: 'relevance',
    query: Drupal.settings.mkdru.search_query,
    recid: null
  },
  state: {},
  realm: ''
};

(function ($) {

  // IE doesn't decode JSON, jQuery in D7 does, not in D6 but it has its own.
  if ($.parseJSON)
    mkdru.settings = $.parseJSON(Drupal.settings.mkdru.settings);
  else
    mkdru.settings = Drupal.parseJson(Drupal.settings.mkdru.settings);

  // Reference for external use.
  mkdru.facets = mkdru.settings.facets;

  mkdru.pz2Init = function () {
    mkdru.pz2.search(Drupal.settings.mkdru.search_query);
  };

  $(document).ready(function () {
    
    $(document).bind('mkdru.onterm', function (event, data) {
      $.each(data.medium, function (i, e) {
        if (e.name == 'video') {
          $('.mkdru-facet-group-amount.videos').text(e.freq);
        }
        else if (e.name == 'text') {
          $('.mkdru-facet-group-amount.books').text(e.freq);
        }
        else if (e.name == 'album' || e.name == 'artist' || e.name == 'track') {
          $('.mkdru-facet-group-amount.streaming').text(e.freq);
        }
      });
    });

    // generate termlist for pz2.js and populate facet limit state
    var termlist = [];
    for (var key in mkdru.facets) {
      termlist.push(mkdru.facets[key].pz2Name);
      mkdru.defaultState['limit_' + key] = null;
    }

    mkdru.pz2 = new pz2({
      "onshow": function (data) {
        $(document).trigger('mkdru.onshow', [data])
      },
      "showtime": 500, //each timer (show, stat, term, bytarget) can be specified this way
      "pazpar2path": mkdru.settings.pz2_path,
      "oninit": function () {
        $(document).trigger('mkdru.oninit')
      },
      "onstat": function (data) {
        $(document).trigger('mkdru.onstat', [data])
      },
      "onterm": function (data) {
        $(document).trigger('mkdru.onterm', [data])
      },
      "onrecord": function (data) {
        $(document).trigger('mkdru.onrecord', [data])
      },
      "termlist": termlist.join(','),
      "usesessions" : mkdru.settings.use_sessions,
      "showResponseType": mkdru.showResponseType,
      "autoInit": false
    });
    mkdru.pz2.showFastCount = 1;

    // Not running against SP? init, otherwise authenticate.
    if (mkdru.settings.use_sessions === 1) {
      mkdru.pz2.init();
    } else {
      //runnin against SP
      var user = mkdru.settings.sp.user;
      var pass = mkdru.settings.sp.pass;
      var params = {};
      params['command'] = 'auth';
      if (user && pass) {
        params['action'] = 'login';
        params['username'] = user;
        params['password'] = pass;
      } else {
        params['action'] = 'ipauth';
      }
      var authReq = new pzHttpRequest(mkdru.settings.pz2_path,
        function (err) {
          alert(Drupal.t("Authentication against metasearch gateway failed: ") + err);
        }
      );
      authReq.get(params,
        function (data) {
          var s = data.getElementsByTagName('status');
          if (s.length && Element_getTextContent(s[0]) == "OK") {
            mkdru.realm = data.getElementsByTagName('realm');
            mkdru.pz2Init();
          } else {
            alert(Drupal.t("Malformed response when authenticating against the metasearch gateway"));
          }
        }
      );
    }

    // Amount of editorial search results.
    $.getJSON('/json/search/node/' + Drupal.settings.mkdru.search_query, function(data) {
      $('.mkdru-facet-group-amount.editorial').text(data.count);
    });

    $('.pane-emusik-emusik-search-header').prependTo($('.panel-panel.grid-9.omega').parent());

  });
})(jQuery);