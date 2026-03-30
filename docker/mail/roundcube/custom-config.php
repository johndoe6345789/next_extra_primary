<?php
/**
 * NextExtra custom Roundcube configuration.
 * Mounted into /var/roundcube/config/.
 */

// Brand name shown in page title and UI.
$config['product_name'] = 'NextExtra Webmail';

// Include custom brand CSS in every page.
$config['include_host_config'] = false;

// Default address book type.
$config['default_addressbook'] = 'sql';

// Compose HTML by default for nicer email formatting.
$config['htmleditor'] = 1;

// Preview pane enabled by default.
$config['preview_pane'] = true;

// Refresh interval in seconds (check for new mail).
$config['refresh_interval'] = 30;

// Pre-fill the login username hint.
$config['username_domain'] = 'nextra.local';

// Custom CSS loaded after skin styles.
$config['skin_logo'] = null;
