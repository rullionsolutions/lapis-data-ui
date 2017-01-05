"use strict";

var Data = require("lapis-data");


Data.Textarea.override("renderUpdateControls", function (div, form_type) {
    if (this.css_richtext && this.enable_aloha !== false) {
        div.makeElement("div", "css_richtext_target").text(this.val, true);        // true = don't escape markup
    } else {
        div.makeElement("textarea", this.getInputSizeCSSClass(form_type))
            .attr("rows", this.rows.toFixed(0))
            .text(this.val);
    }
});


Data.Textarea.override("renderUneditable", function (elem) {
    var div_elem = elem.makeElement("div", "form-control-static");
    var style = this.getUneditableCSSStyle();

    if (!this.validated) {
        this.validate();
    }
    if (style) {
        div_elem.attr("style", style);
    }
    if (this.getText()) {
        div_elem.text(this.getText(), this.css_richtext);        // don't escape markup if richtext
    }
});
