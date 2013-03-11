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

/**
 * Theme function used by mkdru module to include JS.
 */
function bmc_theme_mkdru_js(&$variables) {
  $path = drupal_get_path('module', 'mkdru');

  // Pazpar2 client library.
  $pz_path = variable_get('pz2_js_path', drupal_get_path('theme', 'bmc_theme') . '/mkdru');
  drupal_add_js($pz_path . '/pz2.js', array(
    'scope' => 'footer', 'defer' => FALSE, 'preprocess' => TRUE
  ));

  // jQuery plugin for query string/history manipulation.
  drupal_add_library('system', 'jquery.bbq');
  drupal_add_js(drupal_get_path('theme', 'bmc_theme') . '/mkdru/jquery.ba-hashchange.min.js');

  // Mkdru module client.
  drupal_add_js($path . '/mkdru.client.js', array(
    'type' => 'file', 'scope' => 'footer', 'defer' => FALSE, 'preprocess' => TRUE
  ));
  drupal_add_js($variables['setting'], 'setting');
  drupal_add_js(
    array(
      'mkdru' => array('search_query' => arg(2)),
      'images_path' => '/' . drupal_get_path('theme', 'bmc_theme') . '/images'
    ),
    'setting'
  );

  // Theme scripts.
  drupal_add_css(drupal_get_path('theme', 'bmc_theme') . '/mkdru/mkdru.css', array('weight' => 100));
  drupal_add_js(drupal_get_path('theme', 'bmc_theme') . '/mkdru/mustache.js');
  drupal_add_js(drupal_get_path('theme', 'bmc_theme') . '/mkdru/recipe.js');
  drupal_add_js(drupal_get_path('theme', 'bmc_theme') . '/mkdru/mkdru.theme.js', array('scope' => 'footer', 'weight' => 100));
  drupal_add_js(drupal_get_path('theme', 'bmc_theme') . '/mkdru/mkdru.js', array('scope' => 'footer', 'weight' => 100));
}

drupal_add_js(
  array('images_path' => '/' . drupal_get_path('theme', 'bmc_theme') . '/images'),
  'setting'
);

/**
 * Implements hook_preprocess_views_view.
 */
function bmc_theme_preprocess_views_view(&$vars) {

  if ('ding_node_search' != $vars['view']->name) {
    return;
  }

  $pz_path = variable_get('pz2_js_path', drupal_get_path('theme', 'bmc_theme') . '/mkdru');
  drupal_add_js($pz_path . '/pz2.js', array(
    'scope' => 'footer',
    'defer' => FALSE,
    'preprocess' => TRUE)
  );
  drupal_add_js(drupal_get_path('theme', 'bmc_theme') . '/mkdru/pz2.editorial.js', array(
    'scope' => 'footer',
    'weight' => 100)
  );
  drupal_add_js(array(
    'mkdru' => array(
      'settings' => json_encode(variable_get('mkdru_defaults')),
      'search_query' => arg(2),
    )),
    'setting'
  );
}

/**
 * Implements hook_form_alter().
 *
 * Preprocess the search form, adding a placeholder into the textfield.
 */
function bmc_theme_form_alter(&$form, &$form_state, $form_id) {
  if ($form_id == 'search_block_form') {
    $form['search_block_form']['#attributes']['placeholder'] = t('Enter search here...');
  }
}
