<div class="panel-display omega-grid omega-12-mainpage-standard" <?php if (!empty($css_id)) { print "id=\"$css_id\""; } ?>>
  <div class="panel-panel grid-12">
    <div class="panel-panel grid-8 alpha">
      <div class="inside"><?php print $content['top_left']; ?></div>
    </div>
    <div class="panel-panel grid-4 omega">
      <div class="inside"><?php print $content['top_right']; ?></div>
    </div>
  </div>
  <div class="panel-panel grid-12">
    <div class="panel-panel grid-3 alpha">
      <div class="inside"><?php print $content['middle_left']; ?></div>
    </div>
    <div class="panel-panel grid-9 omega">
      <div class="inside"><?php print $content['middle_right']; ?></div>
	  <div class="panel-panel grid-6 alpha">
        <div class="inside"><?php print $content['middle_bottom_left']; ?></div>
      </div>
      <div class="panel-panel grid-3 omega">
        <div class="inside"><?php print $content['middle_bottom_right']; ?></div>
      </div>
    </div>
  </div>
  <div class="panel-panel grid-12">
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
