<?php if (!defined('APPLICATION')) exit();

// Define the plugin:
$PluginInfo['Sketchfab'] = array(
   'Description' => 'Provides an Advanced Editor button to embed a Sketchfab model easily.',
   'Version' => '1.0',
   'RequiredApplications' => array('Vanilla' => '>=2.2'),
   'RequiredPlugins' => array('editor' => '>=1.7'),
   'Author' => "Sketchfab",
   'AuthorEmail' => 'arthur@sketchfab.com',
   'AuthorUrl' => 'https://sketchfab.com'
);

class SketchfabPlugin extends Gdn_Plugin {

 /**
  * Base_Render_Before Event Hook
  *
  * This is a common hook that fires for all controllers (Base), on the Render method (Render), just 
  * before execution of that method (Before). It is a good place to put UI stuff like CSS and Javascript 
  * inclusions. Note that all the Controller logic has already been run at this point.
  *
  * @param $Sender Sending controller instance
  */
  public function Base_Render_Before($Sender) {
    $Sender->AddCssFile($this->GetResource('design/sketchfab.css', FALSE, FALSE));
    $Sender->AddJsFile($this->GetResource('js/sketchfab.js', FALSE, FALSE));
  }
  /**
   * Custom hook, emitted by the Advanced Editor plugin. This makes the Advanced Editor a dependency of this plugin.
   */
  public function EditorPlugin_InitEditorToolbar_Handler($Sender, $args) {
    echo '<span id="embed-sketchfab-plugin-button" class="editor-action icon editor-action-sketchfab">S</span>';
  }
   
}
