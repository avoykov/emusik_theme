<?php

/**
 * Implements hook_panels_layouts().
 */
function bmc_theme_omega_12_article_page_panels_layouts() {
  $items['omega_12_article_page'] = array(
    'title' => t('Article page standard layout'),
    'category' => t('Omega: 12 Column Grid'),
    'icon' => 'omega_12_article_page.png',
    'theme' => 'omega_12_article_page',
    'admin css' => '../omega_panels_admin_12.css',
    'regions' => array(
      'top_left' => t('Top left side'),
      'top_right' => t('Top right side'),
      'bottom_left' => t('Bottom left side'),
      'bottom_middle' => t('Bottom middle side'),
      'bottom_right' => t('Bottom right side'),
    ),
  );

  return $items;
}
