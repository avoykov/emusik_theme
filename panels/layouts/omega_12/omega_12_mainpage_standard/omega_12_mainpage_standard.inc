<?php

/**
 * Implements hook_panels_layouts().
 */
function bmc_theme_omega_12_mainpage_standard_panels_layouts() {
  $items['omega_12_mainpage_standard'] = array(
    'title' => t('Main page standard layout'),
    'category' => t('Omega: 12 Column Grid'),
    'icon' => 'omega_12_mainpage_standard.png',
    'theme' => 'omega_12_mainpage_standard',
    'admin css' => '../omega_panels_admin_12.css',
    'regions' => array(
      'top_left' => t('Top left side'),
      'top_right' => t('Top right side'),
      'middle_left' => t('Middle left side'),
	  'middle_right' => t('Middle right side'),
	  'middle_bottom_left' => t('Middle bottom left side'),
	  'middle_bottom_right' => t('Middle bottom right side'),
      'bottom_left' => t('Bottom left side'),
      'bottom_middle' => t('Bottom middle side'),
      'bottom_right' => t('Bottom right side'),
    ),
  );

  return $items;
}
