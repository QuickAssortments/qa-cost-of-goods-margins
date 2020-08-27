<?php // -*- coding: utf-8 -*-

namespace QuickAssortments\COG\Admin;

use QuickAssortments\COG\Helpers;

/**
 * Class Page.
 *
 * @author  Khan Mohammad R. <khan@quickassortments.com>
 *
 * @package QuickAssortments\COG\Admin
 *
 * @since   1.0.0
 */
final class Page
{
    /**
     * Including necessary classes.
     *
     * @since    1.0.0
     *
     * @access   private
     *
     * @var array $classes Including necessary classes.
     */
    private $controller;

    /**
     * Product settings.
     *
     * @since    1.0.0
     *
     * @access   private
     *
     * @var array $classes Including necessary classes.
     */
    private $prod_sett = [];

    /**
     * Page constructor.
     *
     * @since  1.0.0
     *
     * @retuen void
     */
    public function __construct()
    {
        $this->controller = new PageController();
        $this->prod_sett  = [
            'markup'          => get_option('qa_cog_main_settings_show_markup_checkbox'),
            'stock_value'     => get_option('qa_cog_main_settings_show_stock_value_checkbox'),
            'margin_incl_tax' => get_option('qa_cog_main_settings_show_margin_incl_tax_checkbox'),
            'margin_excl_tax' => get_option('qa_cog_main_settings_show_margin_excl_tax_checkbox'),
        ];
    }

    /**
     * Initial Method.
     *
     * @return object
     *
     * @since 1.0.0
     *
     */
    public function init()
    {
        add_action('admin_menu', [$this, 'register_pages']);

        add_action('qa_cog_admin_page_callback', [$this, 'admin_page_content']);
        add_action('qa_cog_admin_page_body', [$this, 'qa_cog_admin_page_body'], 0, 1);

        add_filter('qa_cog_additional_columns', [$this, 'addition_columns_settings'], 0, 1);
    }

    /**
     * Registers report pages.
     */
    public function register_pages()
    {
        $report_pages = [
            [
                'id'       => 'qa-analytics',
                'title'    => __('QuickAssortments', 'woocommerce-admin'),
                'path'     => QA_COG_RI_SLUG,
                'icon'     => QA_COG_BASE_URL . 'assets/img/icon-sq-bg.svg',
                'position' => 50, // After WooCommerce & Product menu items.
            ],
            [
                'id'     => 'qa-retail-insights',
                'title'  => __('Retail Insights', 'woocommerce-admin'),
                'parent' => 'qa-analytics',
                'path'   => QA_COG_RI_SLUG,
            ],
            [
                'id'       => 'qa-retail-insights-settings',
                'title'    => __('Settings', 'woocommerce-admin'),
                'parent'   => 'qa-analytics',
                'path'     => QA_COG_SETTINGS_SLUG,
                'callback' => [$this, 'admin_page_callback'],
            ],
        ];

        $report_pages = apply_filters('woocommerce_analytics_report_menu_items', $report_pages);

        foreach ($report_pages as $report_page) {
            if (! is_null($report_page)) {
                $this->controller->register_page($report_page);
            }
        }
    }

    /**
     * Method for handling admin page callback.
     *
     * @return void
     *
     * @since 1.0.0
     *
     */
    public function admin_page_callback()
    {
        do_action('qa_cog_admin_page_callback');
    }

    /**
     * Method for admin page content.
     *
     * @return void
     *
     * @since 1.0.0
     *
     */
    public function admin_page_content()
    {
        $args = [
            'icon' => QA_COG_BASE_URL . 'assets/img/icon-sq-bg.svg',
        ];
        Helpers\Template::include_template(__FUNCTION__, $args, 'admin/settings');
    }

    /**
     * Method for handling admin page body content.
     *
     * @param $page
     *
     * @retuen void
     *
     * @since  1.0.0
     *
     */
    public function qa_cog_admin_page_body($page)
    {
        if (QA_COG_SETTINGS_SLUG !== $page) {
            return;
        }

        $current_tab = empty($_GET['tab']) ? 'qa_cog_main_settings' : sanitize_key($_GET['tab']);
        $args        = [
            'module'      => 'main',
            'current_tab' => $current_tab,
            'page_slug'   => QA_COG_SETTINGS_SLUG,
        ];

        $args['tabs'] = apply_filters('qa_cog_' . $args['module'] . '_tabs_array', []);

        Helpers\Template::include_template(__FUNCTION__, $args, 'admin/settings');
    }

    /**
     * Implementing the settings for columns.
     *
     * @param array $columns
     *
     * @return mixed
     *
     * @since 1.0.0
     *
     */
    public function addition_columns_settings($columns)
    {
        foreach ($this->prod_sett as $pk => $ps) {
            if ($ps === 'no') {
                unset($columns[$pk]);
            }
        }

        return $columns;
    }
}
