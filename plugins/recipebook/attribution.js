(function(){
/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const Widget = require("$:/core/modules/widgets/widget.js").widget;

class AttributionWidget extends Widget {
	get prefixTiddler () {
		return "$:/plugins/paulsweeney/recipebook/attribution-prefix"
	}

	get prefix () {
		return this.wiki.getTiddlerText(this.prefixTiddler).trim() + ' '
	}

	refresh (changedTiddlers) {
		const changedAttributes = this.computeAttributes();
		
		if (changedAttributes.field || changedTiddlers[this.prefixTiddler]) {
			this.refreshSelf();
			return true;
		} else {
			return false;
		}
	}
	
	render (parent, nextSibling) {
		this.parentDomNode = parent;
		this.computeAttributes();

		let source = this.getAttribute("source", null);
		const sourceTitle = this.getAttribute("title", null);
		const style = this.getAttribute("style", "");
		const prefix = this.wiki.getTiddlerText("$:/plugins/paulsweeney/recipebook/attribution-tag")
		
		if (!source && !sourceTitle) { return }

		if (source) {
			try {
				source = new URL(source);
			} catch (error) {}
		}

		const title = sourceTitle || source.hostname || source;
		
		const container = this.document.createElement("div")
		container.className = "rating-attribution"
		container.style = style;
		
		const span = this.document.createElement("span")

		span.innerText = this.prefix;
		span.className = "rating-attribution-text";
		container.appendChild(span);
		
		if (source) {
			const anchor = this.document.createElement("a");
			anchor.innerText = title;
			anchor.href = source.href;
			anchor.className = "tc-tiddlylink-external rating-attribution-link";
			anchor.target = "_blank"
			container.appendChild(anchor);
		} else {
			const label = this.document.createElement("span");
			label.innerText = title;
			container.appendChild(label);
		}
		
		this.domNodes.push(container);
		parent.insertBefore(container, nextSibling);
	}
}
	
exports.attribution = AttributionWidget;
})();
