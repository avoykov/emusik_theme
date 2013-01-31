<?php if ($view_mode == 'teaser'): ?>
<article<?php print $attributes; ?>>
  <div class="node-image">
    <?php print render($content['field_playlist_image']);?>
  </div>
  <div class="node-content">
    <?php print $user_picture; ?>
    <?php print render($title_prefix); ?>
    <?php print render($title_suffix); ?>
    <div class="category"><?php print render($content['field_editorial_base_n']);?></div>
    <div class="date"><?php print $date; ?></div>
    <?php if (!$page && $title): ?>
    <header>
      <h2<?php print $title_attributes; ?>><a href="<?php print $node_url ?>" title="<?php print $title ?>"><?php print $title ?></a></h2>
    </header>
    <?php endif; ?>
    <div<?php print $content_attributes; ?>>
      <?php
        // We hide the comments and links now so that we can render them later.
        hide($content['comments']);
        hide($content['links']);
        print render($content['body']);
      ?>
    </div>
  </div>
</article>
<?php else: ?>
<?php
$field_ding_teaser = field_get_items('node', $variables['elements']['#node'], 'field_ding_teaser');
?>
<article<?php print $attributes; ?>>
  <?php print render($content['field_playlist_image']);?>
  <div class="node-details">
    <div class="date-value"><?php print $date; ?></div>
    <h2 class="pane-title"><?php print htmlspecialchars($title); ?></h2>
    <?php if (isset($field_ding_teaser[0]['safe_value'])): ?>
      <div class="summary"><?php print $field_ding_teaser[0]['safe_value']; ?></div>
    <?php endif; ?>
    <div class="author"><?php print t('by '); ?><?php print $name; ?></div>
    <div class="body"><?php print render($content['body']); ?></div>
  </div>
</article>
<?php endif; ?>
