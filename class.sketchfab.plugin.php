<?php if (!defined('APPLICATION')) exit();

// Define the plugin:
$PluginInfo['Sketchfab'] = array(
   'Description' => 'Provides an Advanced Editor button to embed a Sketchfab model easily.',
   'Version' => '1.6',
   'RequiredApplications' => array('Vanilla' => '>=2.2'),
   'RequiredPlugins' => array('editor' => '>=1.7'),
   'Author' => "Sketchfab",
   'AuthorEmail' => 'arthur@sketchfab.com',
   'AuthorUrl' => 'https://sketchfab.com',
   'License' => 'GPLv2'
);

class SketchfabPlugin extends Gdn_Plugin {

  /**
   * Add a Javascript file to every page.
   *
   * @param $Sender Gdn_Controller Sending controller instance.
   */
  public function Base_Render_Before($Sender) {
    $Sender->AddJsFile('sketchfab.js', 'plugins/sketchfab');
  }

  /**
   * Add CSS file to asset handler.
   *
   * @param $Sender AssetModel Where we add the CSS file.
   */
  public function AssetModel_StyleCss_Handler($Sender) {
    $Sender->AddCssFile('sketchfab.css', 'plugins/sketchfab');
  }

  /**
   * Add Sketchfab button to the editor's toolbar.
   *
   * Custom hook, emitted by the Advanced Editor plugin. This makes the Advanced Editor a dependency of this plugin.
   *
   * @param $Sender EditorPlugin Not used but required.
   */
  public function EditorPlugin_InitEditorToolbar_Handler($Sender) {
    echo '<span id="embed-sketchfab-plugin-button" class="editor-action icon editor-action-sketchfab sketchfab-icon"></span>';
  }

  /**
   * No setup.
   */
  public function Setup() {
  }
}
