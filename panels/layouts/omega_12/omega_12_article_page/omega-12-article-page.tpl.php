<div class="panel-display omega-grid omega-12-article-page" <?php if (!empty($css_id)) { print "id=\"$css_id\""; } ?>>
  <div class="panel-panel row-1 grid-12">
    <div class="panel-panel grid-3 alpha">
      <div class="inside"><?php print $content['top_left']; ?></div>
    </div>
    <div class="panel-panel grid-9 omega">
      <div class="inside"><?php print $content['top_right']; ?></div>
    </div>
  </div>
  <div class="panel-panel row-2 grid-12">
    <div class="panel-panel grid-6 alpha">
      <div class="inside"><?php print $content['bottom_left']; ?></div>
    </div>
	<div class="panel-panel grid-3">
      <div class="inside"><?php print $content['bottom_middle']; ?></div>
    </div>
    <div class="panel-panel grid-3 omega">
      <div class="inside"><?php print $content['bottom_right']; ?></div>
    </div>
  </div>
</div>
