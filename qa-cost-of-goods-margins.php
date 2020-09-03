<?php // -*- coding: utf-8 -*-

/**
 * Plugin Name: QA Cost of Goods & Margins
 * Description: Manage cost prices for your products and variations and instantly see the impact on margin, markup and value on hand in your store.
 * Plugin URI:  https://quickassortments.com/products/
 * Author:      Quick Assortments AB
 * Author URI:  https://quickassortments.com/
 * Version:     2.4.0
 * License:     GPL-2.0
 * Text Domain: qa-cost-of-goods-margins.
 */

namespace QuickAssortments\COG;

/**
 * Defining base constant.
 */
defined('ABSPATH') || die;

if (! defined('QA_COG_VERSION')) {
    define('QA_COG_VERSION', __('2', 'qa-cost-of-goods-margins'));
}
if (! defined('QA_COG_BASE_PATH')) {
    define('QA_COG_BASE_PATH', plugin_dir_path(__FILE__));
}
if (! defined('QA_COG_BASE_URL')) {
    define('QA_COG_BASE_URL', plugin_dir_url(__FILE__));
}
if (! defined('QA_COG_BASENAME')) {
    define('QA_COG_BASENAME', plugin_basename(__FILE__));
}
if (! defined('QA_COG_DEBUG')) {
    define('QA_COG_DEBUG', false);
}
if (! defined('QA_COG_PREFIX')) {
    define('QA_COG_PREFIX', '_qa_cog_');
}
if (! defined('QA_COG_RI_SLUG')) {
    define('QA_COG_RI_SLUG', QA_COG_PREFIX . 'retail_insights');
}
if (! defined('QA_COG_SETTINGS_SLUG')) {
    define('QA_COG_SETTINGS_SLUG', QA_COG_PREFIX . 'retail_insights_settings');
}

/**
 * Initialize a hook on plugin activation.
 *
 * @return void
 */
function activate()
{
    include_once QA_COG_BASE_PATH . '/src/Helpers/DB.php';
    Helpers\DB::create_db_tables();
}
register_activation_hook(__FILE__, __NAMESPACE__ . '\\activate');

/**
 * Initialize a hook on plugin deactivation.
 *
 * @return void
 */
function deactivate()
{
    wp_clear_scheduled_hook('qa_cog_update_category_lookup_table');
}
register_deactivation_hook(__FILE__, __NAMESPACE__ . '\\deactivate');

/**
 * Initialize all the plugin things.
 *
 * @throws \Throwable
 *
 * @return array | bool | void
 */
function initialize()
{
    try {
        // Translation directory updated !
        load_plugin_textdomain(
            'qa-cost-of-goods-margins',
            true,
            basename(dirname(__FILE__)) . '/languages'
        );

        /**
         * Check if WooCommerce is active.
         **/
        require_once ABSPATH . 'wp-admin/includes/plugin.php';

        if (! is_plugin_active('woocommerce/woocommerce.php')) {
            deactivate_plugins(plugin_basename(__FILE__));
            add_action(
                'admin_notices',
                function () {
                    $class	 = 'notice notice-error is-dismissible';
                    $message = __('Quick Assortments Error: <b>WooCommerce</b> isn\'t active.', 'qa-cost-of-goods-margins');
                    printf('<div class="%1$s"><p>%2$s</p></div>', $class, $message);
                }
            );

            return false;
        }

        /**
         * Checking if vendor/autoload.php exists or not.
         */
        if (file_exists(__DIR__ . '/vendor/autoload.php')) {
            /** @noinspection PhpIncludeInspection */
            require_once __DIR__ . '/vendor/autoload.php';
        }

        ( new Helpers\Template(QA_COG_BASE_PATH . 'src/Templates/') );
        ( new Assets\Assets() )->init();
        ( new Admin\Page() )->init();
        // Cost of goods
        ( new CoG\Columns() )->init();
        ( new CoG\Fields() )->init();
        ( new CoG\Settings() )->init();
        // Retail Insights
        ( new RI\DataSync() )->init();
        ( new RI\RI() )->init();
        ( new RI\Settings() )->init();

        RI\CategoryLookup::instance()->init();  // Category lookup table updater
    } catch (\Throwable $throwable) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            throw $throwable;
        }
        do_action('qa_cog_error', $throwable);
    }
}

add_action('plugins_loaded', __NAMESPACE__ . '\\initialize');
