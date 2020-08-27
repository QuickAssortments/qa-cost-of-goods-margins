<form method="<?php echo esc_attr(apply_filters('woocommerce_settings_form_method_tab_' . $current_tab, 'post')); ?>"
	  id="mainform"
	  action=""
	  enctype="multipart/form-data">

	<?php if (! empty($tabs) && 0 !== count($tabs)): ?>
		<h2 class="nav-tab-wrapper wp-clearfix">
			<?php
            foreach ($tabs as $name => $label) {
                echo '<a href="' . admin_url('admin.php?page=' . $page_slug . '&tab=' . $name)
                     . '" class="nav-tab ' . ($current_tab == $name ? 'nav-tab-active' : '') . '">'
                     . $label
                     . '</a>';
            }
            do_action('qa_cog_' . $module . '_tabs');
            // echo('qa_cog_' . $module . '_tabs');
            ?>
		</h2>
	<?php endif; ?>

	<h1 class="screen-reader-text"><?php echo esc_html($tabs[$current_tab]); ?></h1>

	<?php do_action('qa_cog_' . $module . '_sections_' . $current_tab); ?>
	<?php // echo('qa_cog_' . $module . '_sections_' . $current_tab);?><br>
	<?php do_action('qa_cog_' . $module . '_' . $current_tab); ?>
	<?php // echo('qa_cog_' . $module . '_' . $current_tab);?>

</form>
