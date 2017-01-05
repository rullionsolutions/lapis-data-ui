"use strict";

var Form = require("./Form.js");


module.exports = Form.clone({
    id: "Create",
});

/**
* To prepare the Create section, calling setFieldSet() on the page's primary_row,
* if the entity id's match and there is no link_field defined
*/
module.exports.defbind("setupFieldSet", "setup", function () {
    var fieldset;
    if (this.fieldset) {
        return;             // set already
    }
    if (this.link_field) {
        fieldset = this.owner.page.getPrimaryRecord().createChildRecord(this.entity,
            this.link_field);
    } else if (this.entity.id === this.owner.page.entity.id) {
        fieldset = this.owner.page.getPrimaryRecord();
    } else {
        this.throwError("no fieldset and can't create one");
    }
    this.setFieldSet(fieldset);
    this.generated_title = "Create a new " + fieldset.title + " Record";
});

/*
module.exports.defbind("setExitURL", "presave", function () {
    if (this.fieldset === this.owner.page.getPrimaryRow() && this.fieldset.isKeyComplete() &&
            this.fieldset.getDisplayPage()) {
        this.owner.page.exit_url_save = this.fieldset.getDisplayURL();
    }
});
*/
