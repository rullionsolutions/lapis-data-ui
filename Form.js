"use strict";

var Section = require("./Section.js");

/**
* To represent a single record or other FieldSet
*/
module.exports = Section.clone({
    id: "Form",
    columns: 1,
    layout: "form-horizontal",        // for Create/Update/Display, or "basic", form-inline", "form-inline-labelless", or "table-cell"
    hide_section_if_empty: true,
    hide_blank_uneditable_fields: true,
});


/**
* Add the FieldSet argument to this object and call its addFieldsByControl() method to add its
* fields to the page-level field collection
* @param FieldSet object to apply to this section
*/
module.exports.define("setFieldSet", function (fieldset) {
    this.fieldset = fieldset;
    this.fieldset.id_prefix = this.id;
    // this.fieldset.addToPage(this.owner.page, this.field_group);
});


/**
* Return this section's FieldSet object
* @return This section's FieldSet object
*/
module.exports.define("getFieldSet", function () {
    return this.fieldset;
});


// module.exports.define("setDocument", function (document) {
//     if (this.document) {
//         this.throwError("can't change document once set");
//     }
//     this.document = document;
// });


// module.exports.define("getDocument", function () {
//     return this.document;
// });


module.exports.override("isValid", function () {
    return !this.fieldset || this.fieldset.isValid(null, this.field_group);
});


module.exports.defbind("renderRecord", "render", function () {
    var that = this;
    if (!this.fieldset) {
        this.throwError("Form has no fieldset");
    }
    if (typeof this.fieldset.getReadyPromise === "function") {
        this.fieldset.getReadyPromise()
            .then(function () {
                that.renderForm();
            });
    } else {
        this.renderForm();
    }
});


/**
* To return the form_elem XmlStream object (a div) during render, creating it if it doesn't
* already exist
* @param render_opts
* @return XmlStream object for this section's form div element
*/
module.exports.define("getFormElement", function () {
    if (!this.form_elem) {
        this.form_elem = this.getSectionElement().makeElement("form", this.fieldset.getTBFormType(this.layout));
    }
    return this.form_elem;
});


/**
* To determine whether the given field is visible in this Form context
* @return true if the field should be visible, otherwise false
*/
module.exports.define("isFieldVisible", function (field) {
    var visible = field.isVisible(this.field_group, this.hide_blank_uneditable_fields);
    return visible;
});


/**
* Generate HTML output for this section, given its current state; depending on 'layout' property,
* it calls renderFormHorizontal()
* @param XmlStream object for the parent div to add this section HTML to; render_opts
* @return XmlStream object for this section's div element
*/
module.exports.define("renderForm", function () {
    this.form_elem = null;
    if (!this.fieldset) {
        this.throwError("formbase no fieldset");
    }
    this.getSectionElement();           // temp make section visible
    this.visible_field_count += this.renderFormFields(this.fieldset);
//    count += this.renderSeparateTextareas(this.fieldset, render_opts);
    if (this.visible_field_count === 0 && this.element) {
                        // this.sctn_elem will be set if hide_section_if_empty = false
        this.element.makeElement("div", "css_form_footer").text("no items");
    }
});


/**
* To render the FieldSet as a form with 1 column, calling renderFieldFunction on each field,
* except where (this.separate_textareas && field.separate_row_in_form)
* @param FieldSet object of fields to render
* @return Number of fields rendered
*/
module.exports.define("renderFormFields", function (fieldset) {
    var that = this;
    var visible_field_count = 0;

    fieldset.each(function (field) {
        if (field.isVisible(that.field_group, that.hide_blank_uneditable_fields)) {
            field.renderFormGroup(that.getFormElement(), that.layout);
            visible_field_count += 1;
        }
    });
    return visible_field_count;
});
