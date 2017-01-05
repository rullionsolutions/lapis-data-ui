"use strict";

var Form = require("./Form.js");

/**
* To represeent an existing record in the database being deleted
*/
module.exports = Form.clone({
    id: "Delete",
});


/**
* To prepare the Delete section, calling setFieldSet() on the page's primary_row, if the entity
* id's match and there is no link_field defined
*/
module.exports.defbind("setupFieldSet", "setup", function () {
    if (!this.fieldset) {
        this.setFieldSet(this.owner.page.getTrans().getActiveRow(this.entity.id, this.deduceKey()));
        this.fieldset.each(function (field) {
            field.editable = false;
        });
    }
    if (this.entity.id === this.owner.page.entity.id) {
        this.owner.page.exit_url_save = this.owner.page.session.home_page_url;
    }
    this.fieldset.setDelete(true);
});
