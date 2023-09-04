(function(){
/*jslint node: true, browser: true */
"use strict";

const Widget = require("$:/core/modules/widgets/widget.js").widget;
const Rating = require("$:/plugins/paulsweeney/recipebook/rating.js").widget;

class CardWidget extends Widget {
	refresh (changedTiddlers) {
		const changedAttributes = this.computeAttributes();
		
		if (
			changedAttributes.field ||
			changedAttributes.tiddler ||
			changedTiddlers[this.title]
		) {
			this.refreshSelf();
			return true;
		} else {
			return false;
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
			console.log("looking up title", title)
			this._tiddler = this.wiki.getTiddler(title);
		}

		return this._tiddler
	}

	get ratingString () {
		const rating = this.fields
		const selected = "★"
		const unselected = "☆"
		let result = ""

		for (let i = 0; i < 5; i++) {
			result += i < this.rating ? selected : unselected
		}

		return result
	}

	render (parent, nextSibling) {
		this.parentDomNode = parent;
		this.computeAttributes();

		console.log(this.tiddler)

		if (!this.tiddler) { return }
		
		const { title, image, rating } = this.tiddler.fields
		const href = "#" + $tw.utils.encodeURIComponentExtended(title)

		const container = this.createElement("a",
			{ className: "recipebook card-container tc-tiddlylink-resolves", href });

		const imageContainer = this.createElement("div",
			{ className: "recipebook card-image-container" })
		container.appendChild(imageContainer);

		const imageEl = this.createElement("img",
			{ className: "recipebook card-image", src: image });
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

