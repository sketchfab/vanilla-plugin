<?php if (!defined('APPLICATION')) exit();
/*
Copyright 2008, 2009 Vanilla Forums Inc.
This file is part of Garden.
Garden is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
Garden is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with Garden.  If not, see <http://www.gnu.org/licenses/>.
Contact Vanilla Forums Inc. at support [at] vanillaforums [dot] com
*/

// Define the plugin:
$PluginInfo['Sketchfab'] = array(
   'Description' => 'Provides a button to embed a model easily. Depends on the Advanced Editor plugin.',
   'Version' => '1.0',
   'RequiredApplications' => array('Vanilla' => '>=2.2'),
   'RequiredTheme' => FALSE, 
   'RequiredPlugins' => array('editor' => '>=1.7'),
   'HasLocale' => FALSE,
   'SettingsPermission' => 'Garden.AdminUser.Only',
   'Author' => "Sketchfab",
   'AuthorEmail' => 'arthur@sketchfab.com',
   'AuthorUrl' => 'https://sketchfab.com'
);

class SketchfabPlugin extends Gdn_Plugin {

 /**
  * Plugin constructor
  *
  * This fires once per page load, during execution of bootstrap.php. It is a decent place to perform
  * one-time-per-page setup of the plugin object. Be careful not to put anything too strenuous in here
  * as it runs every page load and could slow down your forum.
  */
  public function __construct() {
    
  }
 
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
