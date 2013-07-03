(function($) {
  $(document).ready(function() {
    $('.pane-views-panes .view.concerts').parent().addClass('concerts-content');

    // Adds menu extra height on plenty of sub items.
    if ($('.block-main-menu .expanded .menu').height() > 25 ) {
      $('.zone-menu').css('height', '100px');
    }

    // Playlist title.
    $('.pane-emusik-playlist .node').each(function() {
      $(this).find('.field-name-body').prepend($(this).find('header'));
    });
  });
})(jQuery);
