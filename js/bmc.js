(function ($) {
  $(document).ready(function() {
    $('.pane-views-panes .view.concerts').parent().addClass('concerts-content');

    // Adds active menu class on hover.
    $('.block-main-menu .expanded').hover(function() {
      $(this).toggleClass('active');
    });

    // Playlist title.
    $('.pane-emusik-playlist .node').each(function() {
      $(this).find('.field-name-body').prepend($(this).find('header'));
    });
  });
})})(jQuery);
