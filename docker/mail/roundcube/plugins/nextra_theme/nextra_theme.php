<?php
/**
 * NextExtra Theme — Roundcube plugin.
 *
 * Injects brand CSS into every page to restyle the
 * elastic skin with NextExtra colours and typography.
 */
class nextra_theme extends rcube_plugin
{
    public function init()
    {
        $this->add_hook(
            'render_page',
            [$this, 'inject_css']
        );
    }

    public function inject_css($args)
    {
        $css_path = $this->urlbase . 'nextra.css';
        $this->include_stylesheet($css_path);
        return $args;
    }
}
