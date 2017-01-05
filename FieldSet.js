"use strict";

var Data = require("lapis-data");


Data.Fieldset.define("getTBFormType", function (our_form_type) {
    var tb_form_type = our_form_type;
    if (tb_form_type === "basic") {
        tb_form_type = "row";
    } else if (tb_form_type === "table-cell") {
        tb_form_type = "";
    } else if (tb_form_type === "form-inline-labelless") {
        tb_form_type = "form-inline";
    // } else if (tb_form_type === "form-horizontal-readonly") {
    //     tb_form_type = "form-horizontal";
    }
    return tb_form_type;
});


Data.Fieldset.define("addToPage", function (page, field_group) {
    this.page = page;
//    if (this.modifiable) {
    this.each(function (field) {
        if (!field_group || field_group === field.field_group) {
            field.addToPage(page);
        }
    });
//    }
});


Data.Fieldset.define("removeFromPage", function (field_group) {
    var page = this.page;
    if (this.modifiable) {
        this.each(function (field) {
            if (!field_group || field_group === field.field_group) {
                field.removeFromPage(page);
            }
        });
    }
});

