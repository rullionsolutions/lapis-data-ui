"use strict";

var Form = require("./Form.js");


module.exports = Form.clone({
    id: "Display",
    layout: "form-horizontal-readonly",
});


/**
* To prepare the Display section, calling setFieldSet() on the page's primary_row, if the entity
* id's match and there is no link_field defined
*/
module.exports.defbind("setupFieldSet", "setup", function () {
    if (this.fieldset) {
        return;             // set already
    }
    if (this.link_field) {
        this.throwError("not implemented yet");
    } else if (this.entity.id === this.owner.page.entity.id) {
        this.setFieldSet(this.owner.page.getPrimaryRecord());
    } else {
        this.throwError("no fieldset and can't create one");
    }
});
