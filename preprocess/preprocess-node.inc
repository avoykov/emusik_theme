<?php

/**
 * mkdru
 */
drupal_add_css(drupal_get_path('theme', 'bmc_theme').'/mkdru/mkdru.css', array('weight'=>100));
drupal_add_js(drupal_get_path('theme', 'bmc_theme').'/mkdru/mustache.js');
drupal_add_js(drupal_get_path('theme', 'bmc_theme').'/mkdru/mkdru.theme.js', array('scope'=>'footer','weight'=>100));