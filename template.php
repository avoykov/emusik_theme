<?php

/**
 * @file
 * This file is empty by default because the base theme chain (Alpha & Omega) provides
 * all the basic functionality. However, in case you wish to customize the output that Drupal
 * generates through Alpha & Omega this file is a good place to do so.
 *
 * Alpha comes with a neat solution for keeping this file as clean as possible while the code
 * for your subtheme grows. Please read the README.txt in the /preprocess and /process subfolders
 * for more information on this topic.
 */

drupal_add_css(drupal_get_path('theme', 'bmc_theme') . '/mkdru/mkdru.css', array('weight' => 100));
drupal_add_js(drupal_get_path('theme', 'bmc_theme') . '/mkdru/mustache.js');
drupal_add_js(drupal_get_path('theme', 'bmc_theme') . '/mkdru/mkdru.theme.js', array('scope' => 'footer', 'weight' => 100));
