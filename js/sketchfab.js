/*globals $*/
'use strict';
$(function() {

	var template = [
		'<div class="embed-sketchfab-plugin-overlay">',
		'	<section class="embed-sketchfab-plugin-pane">',
		'		<span class="close">X</span>',
		'		<h3 class="sketchfab-icon">Sketchfab Embedder</h3>',
		'		<div class="inner">',
		'			<label for="sketchfab-model">Paste your model link in the following field :</label><br />',
		'			<input type="text" placeholder="https://sketchfab.com/models/931f6451ca0e433589980f2243821c86" id="sketchfab-model" name="sketchfab-model"/>',
		'		</div>',
		'		<footer>',
		'			<input type="submit" disabled value="Continue">',
		'			<input type="reset" value="Cancel">',
		'		</footer>',
		'	</section>',
		'</div>'
	].join('');

	/**
	 * The plugin works as follows :
	 * When the user writes a discussion or a comment, he can click the sketchfab button in the editor.
	 * If he does, this JS code creates the plugin pane and appends it on the page. In the pane, the user
	 * pastes his URI.
	 * The plugin extracts the ID from the URI, and places an <a> tag in the content where the charet was.
	 * This tag is then replaced on-the-go by the embed iframe code. This is unfortunately necessary
	 * because vanilla doesn't let iframes be saved -> displayed on a page. Other embedding plugins
	 * use the same technique.
	 */
	var sketchfab = new SketchfabPlugin({
		button: '#embed-sketchfab-plugin-button',
		template: template,
		container: 'body',
		tag: '<a href="https://sketchfab.com/models/{{}}#UNIQSKFBVANILLA" data-sketchfab type="sketchfab" rel="sketchfab">model</a>',
		embed: '<iframe width="640" height="480" src="https://sketchfab.com/models/{{}}/embed?autostart=0" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" onmousewheel=""></iframe>',
		bbCodeRegex: /\[SKETCHFAB\]([0-9A-Fa-f]+)\[\/SKETCHFAB\]/i
	});

	// Initial tag replacement
	sketchfab.renderLegacyTags();
	sketchfab.renderTags();

});


var SketchfabPlugin = function SketchfabPlugin(opt) {

	opt = opt || {};

	this.$button = $(opt.button);
	this.$pane = $(opt.template);

	if (opt.container) {
		this.$container = $(opt.container);
	} else {
		this.$container = $('body');
	}

	this.$editor = $('.BodyBox');
	this.editor = this.$editor[0];
	this.$toolbar = $('.editor');
	this.tag = opt.tag;
	this.embed = opt.embed;
	this.mode = 'html';
	this.bbCodeRegex = opt.bbCodeRegex;

	// Put the button at the end of the editor toolbar.
	// Unfortunately, there is no hook to render the button
	// *after* the toolbar has been generated, only before.
	// So we move the button around in JS.
	this.$toolbar.append(this.$button);

	this.$container.on('click', opt.button, this.open.bind(this));
	this.$container.on('click', '.embed-sketchfab-plugin-pane .close', this.close.bind(this));
	this.$container.on('click', '.embed-sketchfab-plugin-pane input[type=reset]', this.close.bind(this));
	this.$container.on('click', '.embed-sketchfab-plugin-pane input[type=submit]', this.onSubmit.bind(this));
	this.$container.on('keyup', '.embed-sketchfab-plugin-pane input[type=text]', this.onChange.bind(this));
	$(document).on('DOMNodeInserted', '.MessageList', this.renderTags.bind(this));
	$(document).on('DOMNodeInserted', function(e) {
		var $t = $(e.target);
		if ($t.attr('id') !== 'embed-sketchfab-plugin-button') {
			$t = $t.find('#embed-sketchfab-plugin-button');
		}

		if ($t.length) {
			var $p = $t.parent();
			if (!$p.hasClass('editor')) {
				var $e = $p.closest('form').find('.editor');
				$e.append($t);
			}

			setTimeout(function() {

				if ((this.mode || '').toLowerCase() === 'wysiwyg') {
					var iframe = $t.closest('form').find('iframe')[0];
					if (iframe && iframe.contentWindow) {
						var a = iframe.contentWindow.document.querySelectorAll('a[href*="#UNIQSKFBVANILLA"], a[rel*=sketchfab]');
						for (var b = 0; b < a.length; b++) {
							var $a = $(a[b]);
							if (!$a.next().length || $a.next()[0].tagName.toLowerCase() !== 'iframe') {
								this.renderPreviewTag(a[b]);
							}
						}
					}
				}
			}.bind(this), 200);
		}


	}.bind(this));
	$(document).on('editorParseRules', function() {
		this.mode = 'wysiwyg';
	}.bind(this));

};


SketchfabPlugin.prototype.open = function open(e) {
	this.$editor = $(e.currentTarget).closest('form').find('.BodyBox');
	this.$container.append(this.$pane);
	$('.embed-sketchfab-plugin-pane input[type=text]').val('').focus();
};
SketchfabPlugin.prototype.close = function close() {
	this.$pane.remove();
	this.$editor[0].focus();
};
SketchfabPlugin.prototype.get = function get() {
	return $('.embed-sketchfab-plugin-pane input[type=text]').val();
};


// On change value of the text input in the popup, validate the URI.
SketchfabPlugin.prototype.onChange = function onChange(e) {
	var url = this.get();

	if (e.keyCode === 13) {
		return this.onSubmit();
	}
	if (e.keyCode === 27) {
		return this.close();
	}

	if (!this.validate(url)) {
		return $('.embed-sketchfab-plugin-pane input[type=submit]').prop('disabled', true);
	}

	$('.embed-sketchfab-plugin-pane input[type=submit]').prop('disabled', false);
};
SketchfabPlugin.prototype.onSubmit = function onSubmit() {

	var url = this.get();

	if (!this.validate(url)) {
		window.alert('Invalid model URL');
	}

	var modelId = url.substring(url.lastIndexOf('/') + 1);
	var text = this.renderText(modelId);

	if ((this.mode || '').toLowerCase() === 'wysiwyg') {
		var iframe = this.$editor.parent().find('iframe')[0];
		this.$editor.trigger('appendHtml', text);

		if (iframe && iframe.contentWindow) {
			var a = iframe.contentWindow.document.querySelectorAll('a[href*="#UNIQSKFBVANILLA"], a[rel*=sketchfab]');

			for (var b = 0; b < a.length; b++) {
				var $a = $(a[b]);
				if (!$a.next().length || $a.next()[0].tagName.toLowerCase() !== 'iframe') {
					this.renderPreviewTag(a[b]);
				}
			}
		}

	} else {
		this.replaceSelectedText(text);
	}

	this.close();

};


// pasted URL to custom tag (to DB)
SketchfabPlugin.prototype.renderText = function renderText(modelId) {

	return this.tag.replace('{{}}', modelId);

};


// (DB to) legacy BBCode tags
SketchfabPlugin.prototype.renderLegacyTags = function renderTags(e) {

	$('.MessageList .Item .Message').each(function(i, el) {

		var html = $(el).html();
		var uid = html.match(this.bbCodeRegex);
		if (uid && uid[1]) {
			var toReplace = this.renderText(uid[1]);
			html = html.replace(uid[0], toReplace);
			$(el).html(html);
		}

	}.bind(this));

};

// (DB to) Custom tag to embed
SketchfabPlugin.prototype.renderTags = function renderTags(e) {

	if (e && e.target && e.target.tagName.toLowerCase() === 'iframe') {
		return;
	}

	// Using rel= as a tag is not exactly ideal, but Vanilla removes
	// data-attr and overall fishy attributes.
	$('a[href*="#UNIQSKFBVANILLA"], a[rel*=sketchfab]').each(function(i, el) {
		this.renderTag(el);
	}.bind(this));
};
SketchfabPlugin.prototype.renderTag = function renderTag(el) {

	var url = el.href;
	var parent = el.parentNode;

	var embed;
	var modelId = url.substring(url.lastIndexOf('/') + 1);
	modelId = modelId.split('#').shift();

	if (parent) {

		embed = $(this.embed.replace('{{}}', modelId));
		parent.replaceChild(embed[0], el);

	}

};
// 'preview render' doesn't remove the link and adds an iframe beside it knowing that it
// will be stripped by vanilla on submit.
SketchfabPlugin.prototype.renderPreviewTag = function renderTag(el) {

	var url = el.href;
	var embed;
	var modelId = url.substring(url.lastIndexOf('/') + 1);
	modelId = modelId.split('#').shift();

	embed = $(this.embed.replace('{{}}', modelId));

	$(el).after(embed);
	$(el).css('display', 'none');

};

// Check that the provided string matches our need
SketchfabPlugin.prototype.validate = function validate(url) {

	url = url.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	var regexp = /^(http|https):\/\/sketchfab.com\/(show|models)\/([^/]+)$/;

	return regexp.test(url);

};
// Insert the rendered tag at the current position of the caret in the textarea
SketchfabPlugin.prototype.replaceSelectedText = function replaceSelectedText(myValue) {

	var myField = this.$editor[0];
	var sel;

	//IE support
	if (document.selection) {
		myField.focus();
		sel = document.selection.createRange();
		sel.text = myValue;
	} else if (myField.selectionStart || myField.selectionStart == '0') {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
	} else {
		myField.value += myValue;
	}
};
