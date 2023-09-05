(function(){
/*jslint node: true, browser: true */
"use strict";

const Widget = require("$:/core/modules/widgets/widget.js").widget;
const Rating = require("$:/plugins/paulsweeney/recipebook/rating.js").widget;

class CardWidget extends Widget {
	refresh (changedTiddlers) {
		const changedAttributes = this.computeAttributes();
		if (!this.tiddler) { return false }

		const title = this.tiddler.fields.title
		const myTiddler = changedTiddlers[title]

		if ( changedAttributes.tiddler || (myTiddler && myTiddler.modified )) {
			this._tiddler = null;
			this.refreshSelf();
			return true;
		} else {
			return false;
		}
	}

	get placeholderTiddler() {
		return "$:/plugins/paulsweeney/recipebook/placeholder-image"
	}

	dataUri ({ type, text }) {
		if (type == "image/svg+xml") {
			return "data:image/svg+xml," + encodeURIComponent(text);
		} else {
			return "data:" + type + ";base64," + text;
		}
	}

	get imageSource () {
		const placeholder = this.wiki.getTiddlerText(this.placeholderTiddler).trim()
		const imageReference = this.tiddler.fields.image || placeholder
		const targetTiddler = this.wiki.getTiddler(imageReference);

		// External image
		if (!targetTiddler) {
			return imageReference

		// Internal image
		} else if (this.wiki.isImageTiddler(imageReference)) {
			const { type, text, _canonical_uri } = targetTiddler.fields
			return _canonical_uri ? _canonical_uri : this.dataUri({ type, text })
		}
	}

	createElement (type, attributes = {}, innerText = null) {
		const element = this.document.createElement(type);
		this.domNodes.push(element);

		for (const [key, value] of Object.entries(attributes)) {
			element[key] = value;
		}

		if (innerText) {
			element.innerText = innerText;
		}

		return element;
	}

	get tiddler () {
		if (!this._tiddler) {
			const title = this.getAttribute("tiddler")
			this._tiddler = this.wiki.getTiddler(title);
		}

		return this._tiddler
	}

	get ratingString () {
		const { rating } = this.tiddler.fields
		const selected = "★"
		const unselected = "☆"
		let result = ""

		for (let i = 0; i < 5; i++) {
			result += i < rating ? selected : unselected
		}

		return result
	}

	render (parent, nextSibling) {
		this.parentDomNode = parent;
		this.computeAttributes();

		if (!this.tiddler) { return }
		
		const { title, rating } = this.tiddler.fields
		const href = "#" + $tw.utils.encodeURIComponentExtended(title)

		const container = this.createElement("a",
			{ className: "recipebook card-container tc-tiddlylink-resolves", href });

		const imageContainer = this.createElement("div",
			{ className: "recipebook card-image-container" })
		container.appendChild(imageContainer);

		const imageEl = this.createElement("img",
			{ className: "recipebook card-image", src: this.imageSource });
		imageContainer.appendChild(imageEl);
		
		const metaEl = this.createElement("div",
			{ className: "recipebook card-meta" });
		container.appendChild(metaEl);

		const titleEl = this.createElement("h3",
			{ className: "recipebook card-title" }, title);
		metaEl.appendChild(titleEl);

		const ratingEl = this.createElement("span",
			{ className: "recipebook card-rating" },
			this.ratingString);
		metaEl.appendChild(ratingEl);

		parent.insertBefore(container, nextSibling);
	};
}

exports.card = CardWidget;
})();

