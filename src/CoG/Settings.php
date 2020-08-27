<?php // -*- coding: utf-8 -*-

namespace QuickAssortments\COG\CoG;

use QuickAssortments\COG\Helpers\AbstractSettings;

/**
 * Class Settings.
 *
 * @author   Khan M Rashedun-Naby <naby88@gmail.com>
 *
 * @package  QuickAssortments\COG\Premium\Settings
 *
 * @since    1.0.0
 */
class Settings extends AbstractSettings
{
    /**
     * Settings constructor.
     */
    public function __construct()
    {
        $this->id              = 'qa_cog_main_settings';
        $this->label           = __('Cost of Goods & Margins Settings', 'qa-cost-of-goods-margins');
        $this->default_section = $this->id;
    }

    /**
     * Initialization Method.
     *
     * @return void
     *
     * @since 1.0.0
     *
     */
    public function init()
    {
        add_filter('qa_cog_main_tabs_array', [$this, 'tabs_array']);
        add_action('qa_cog_main_tabs', [$this, 'sections']);
        add_action('qa_cog_settings_save_' . $this->id, [$this, 'save_data']);
        add_filter('qa_cog_main_sections_' . $this->id, [$this, 'html_page_content']);
        add_action('qa_cog_main_' . $this->id, [$this, 'output_sections']);

        return $this;
    }

    /**
     * Method for outputting html content.
     *
     * @return void
     *
     * @since 1.0.0
     *
     */
    public function html_page_content()
    {
        parent::output_fields($this->get_settings());
    }

    /**
     * Get settings array.
     *
     * @return array
     *
     * @since 1.0.0
     *
     */
    public function get_settings()
    {
        $section  = isset($_GET['section']) ? sanitize_key($_GET['section']) : $this->default_section;
        $settings = [];

        switch ($section) {
            case $this->id:
                $settings = apply_filters('qa_cog_main_' . $section . '_body', [
                    [
                        'title' => __('Product Settings', 'qa-cost-of-goods-margins'),
                        'type'  => 'title',
                        'id'    => $this->id . '_product_settings_section',
                    ],
                    [
                        'title'    => __('Show Markup', 'qa-cost-of-goods-margins'),
                        'desc_tip' => __('Show/Hide Markup column in product list', 'qa-cost-of-goods-margins'),
                        'id'       => $this->id . '_show_markup_checkbox',
                        'default'  => 'no',
                        'type'     => 'checkbox',
                    ],
                    [
                        'title'    => __('Show Stock Value', 'qa-cost-of-goods-margins'),
                        'desc_tip' => __('Show/Hide Stock Value column in product list', 'qa-cost-of-goods-margins'),
                        'id'       => $this->id . '_show_stock_value_checkbox',
                        'default'  => 'no',
                        'type'     => 'checkbox',
                    ],
                    [
                        'title'    => __('Show Margin', 'qa-cost-of-goods-margins') . ' ' . esc_html__('(incl. Tax)', 'qa-cost-of-goods-margins'),
                        'desc_tip' => __('Show/Hide Margin(incl. Tax) column in product list', 'qa-cost-of-goods-margins'),
                        'id'       => $this->id . '_show_margin_incl_tax_checkbox',
                        'default'  => 'no',
                        'type'     => 'checkbox',
                    ],
                    [
                        'title'    => __('Show Margin', 'qa-cost-of-goods-margins') . ' ' . esc_html__('(excl. Tax)', 'qa-cost-of-goods-margins'),
                        'desc_tip' => __('Show/Hide Margin(excl. Tax) column in product list', 'qa-cost-of-goods-margins'),
                        'id'       => $this->id . '_show_margin_excl_tax_checkbox',
                        'default'  => 'no',
                        'type'     => 'checkbox',
                    ],
                    [
                        'type' => 'sectionend',
                        'id'   => $this->id . '_product_settings_section',
                    ],
                    [
                        'type'         => 'submit_button',
                        'display_text' => __('Save Changes', 'qa-cost-of-goods-margins'),
                        'id'           => '',
                        'name'         => 'save',
                        'class'        => '',
                    ],

                    [
                        'type'      => 'nonce',
                        'nonce_key' => 'qa-cog-settings',
                    ],
                ]);
                break;
            default:
                wp_die('Either there is no defined page for current section or you do not have the sufficient permission to access this page.');
                break;
        }

        // echo 'qa_cog_get_settings_' . $this->id;
        return apply_filters('qa_cog_main_get_settings_' . $this->id, $settings);
    }

    /**
     * Method for rendering the sections.
     *
     * @param $sections
     *
     * @return mixed
     *
     * @since 1.0.0
     *
     */
    public function sections($sections)
    {
        $sections[$this->id] = __('Cost of Goods Settings', 'qa-cost-of-goods-margins');

        return $sections;
    }

    /**
     * Save settings.
     *
     * @return void
     *
     * @since 1.0.0
     */
    public function save_data()
    {
        $settings = $this->get_settings();
        parent::save_fields($settings);
    }
}
