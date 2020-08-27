<div class="wrap woocommerce about-wrap full-width-layout qa-wrap">
<?php do_action('qa_cog_admin_page_top', sanitize_key($_GET['page'])) ?>
	<h1>
		<?php
        esc_html_e('Cost of Goods', 'qa-cost-of-goods-margins');
        echo ' & ';
        esc_html_e('Margins', 'qa-cost-of-goods-margins');
        ?></h1>
	<p class="about-text">
		<?php esc_html_e('Manage cost prices for your products and variations and instantly see the impact on margin, markup and value on hand in your store.') ?>
	</p>
	<div class="wp-badge qa-badge"
		 style="background-image: url('<?php echo $icon ?>')"><?php echo __('Version ', 'qa-cost-of-goods-margins') . QA_COG_VERSION ?></div>

<?php do_action('qa_cog_admin_page_body', sanitize_key($_GET['page'])) ?>
</div>
