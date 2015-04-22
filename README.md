# Sketchfab Vanilla Forums Plugin

This repo contains the code for a plugin that can be installed on instances of Vanilla Forum > 2.2. It's fairly simple : it allows (enforces really) the embedding of sketchfab viewers in topics or comments.

The plugin can either be built by cloning this repo and executing build.sh, or by visiting [The Vanilla forums addon marketplace](http://vanillaforums.org/addons) or the [plugin page](http://vanillaforums.org/addon/sketchfab-plugin) directly.


### Scope
----

There are several limitations which resulted in the current behaviour of the plugin :

- We have to hook into the advanced editor plugin
- Vanilla Forums doesn't allow < iframe /> embed to be saved in DB (and many other HTML features : HTML is extremely stripped down before save, and there isn't too much control on that. At all.)
- Vanilla Forums doesn't handle BBCode too much, it has some basic support for migration from other platforms but is not extensible. Plugins could make it extensible, but dependencies ... Besides, the plugin ecosystem of Vanilla Forums does not seem to be extremely trustworthy (save for the offical plugins, of which Advanced Editor is a part).


### How it works
----

The plugin has a main .php file that describes it (its dependencies, repo, author etc.) and hooks into the rendering process of the Vanilla page to insert its own html/js/css at the relevant places. Most if not all the work is done by the js file.

At page load, two things happen :

- The plugin initializes the sketchfab button in all the editor instances on the page. Binds events to the button, constructs the popup, etc.
- The plugin looks for tags on the page that had been saved before and replaces these tags by the sketchfab embed code.

Then, the user can click the sketchfab button and paste his model URI in the ensuing popup, which will insert the correct tag in the body of the text that's being written. This tag will be replaced by the plugin once it is posted.
