(function(){
/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const Widget = require("$:/core/modules/widgets/widget.js").widget;

class RatingsWidget extends Widget {
	get isEditable () {
		return this.wiki.getTiddlerText("$:/status/IsReadOnly") === "no"
	}

	get ratingString () {
		let ratingString = "";

		for (let i = 0; i < this.rating; i++) {
		}

		return ratingString;
	}
	
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
	
	createStar (value) {
		const selected = "★"
		const unselected = "☆"
		const star = this.document.createElement("span")
		
		star.innerText = value < this.rating ? selected : unselected
		star.dataset.value = value + 1
		
		return star
	}
	
	render (parent, nextSibling) {
		this.parentDomNode = parent;
		this.computeAttributes();

		this.title = this.getAttribute("tiddler")
		this.tiddler = this.wiki.getTiddler(this.title);
		this.rating = this.tiddler &&
			this.tiddler.fields.rating &&
			parseInt(this.tiddler.fields.rating, 10)
		
		if (!this.tiddler) { return }
				
		const style = this.getAttribute("style", "");
		const container = this.document.createElement("span");
		
		for (let i = 0; i < 5; i++) {
			const star = this.createStar(i)
			container.appendChild(star);
			this.domNodes.push(star)
		}
		
		container.className = "recipebook rating-stars ${editable}";
		container.title = `${this.rating} out of 5 stars`;

		if (this.isEditable) {
			container.addEventListener("click", (event) => {
				const value = event.target.dataset.value
				this.wiki.setText(this.title, "rating", null, value)
			})
		}
		
		parent.insertBefore(container, nextSibling);

		this.domNodes.push(container);
	};
}

exports.rating = RatingsWidget;
})();
