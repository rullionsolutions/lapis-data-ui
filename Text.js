"use strict";

var Base = require("lapis-base");
var Data = require("lapis-data");


Data.Text.define("css_type", "text");
Data.Text.define("input_type", "text");
Data.Text.define("tb_input", "input-medium");
Data.Text.define("disp_col_lg", 2);
Data.Text.define("disp_col_md", 3);
Data.Text.define("disp_col_sm", 4);
Data.Text.define("disp_col_xs", 6);
Data.Text.define("edit_col_lg", 6);
Data.Text.define("edit_col_md", 8);
Data.Text.define("edit_col_sm", 10);
Data.Text.define("edit_col_xs", 10);
Data.Text.define("unicode_icon", "&#x27BD;");              // Heavy Wedge-Tailed Rightwards Arrow; x25B7 = open right-pointing triangle
Data.Text.define("unicode_icon_class", "css_uni_icon");
Data.Text.define("hover_text_icon", "&#x24D8;");
Data.Text.define("search_oper_list", "sy.search_oper_list_text");
Data.Text.define("auto_search_oper", "CO");
Data.Text.define("search_filter", "Filter");


/**
* To render a <td> element and its content, by calling render(), to be a list cell
* @param the XmlStream object representing the parent tr element to which this td should be rendered
* @return the XmlStream object representing the td element
*/
Data.Text.define("renderCell", function (row_elem) {
    var cell_elem = row_elem.makeElement("td", this.getCellCSSClass());
    return this.renderFormGroup(cell_elem, "table-cell");
});


/**
* To get the string of CSS classes to use in HTML class attribute for the table cell
* @return css class string
*/
Data.Text.define("getCellCSSClass", function () {
    var css_class = "";
    if (this.css_align) {
        css_class += " css_align_" + this.css_align;
    }
    return css_class;
});


/**
* To render this field as a Twitter-Bootstrap Control Group
* <div class='form-group [css_type_... css_edit css_mand has-error]'
*        !! control-group in TB2, form-group in TB3
*   <label for=...>Label Text -- if label should be rendered, i.e.
*   <div class='col..' -- if form-horizontal
*        !! .controls in TB2, col-... in TB3
*   <input type=... id=... class='form-control'
*   <p class='help-block'>...
*   </div -- if form-horizontal
* @param the XmlStream object representing the parent element to which this field should be rendered
* @param form_type, string, one of: "basic", form-horizontal", "form-inline",
* "form-inline-labelless", "table-cell"
* @return the XmlStream object representing the 'div' element created by this function
*/
Data.Text.define("renderFormGroup", function (parent_elmt, form_type) {
    var editable = (this.isEditable() && (!this.page || !this.page.render_opts.uneditable));
    var div_elmt;

    if (parent_elmt) {
        this.elmt = parent_elmt.makeElement("div");
    } else {
        this.elmt.empty();
    }
    div_elmt = this.elmt;
    div_elmt.attr("class", this.getFormGroupCSSClass(form_type, editable));
    if (form_type !== "table-cell") {
        this.renderLabel(div_elmt, form_type);
    }
    if (form_type === "form-horizontal") {
//        div = div.makeElement("div", this.getAllWidths(editable));                // TB3
        div_elmt = div_elmt.makeElement("div", "controls");
    }
    this.renderControl(div_elmt, form_type);
    return div_elmt;
});


/**
* To get the string of CSS classes to use in HTML class attribute for the field
* @return css class string
*/
Data.Text.define("getFormGroupCSSClass", function (form_type, editable) {
    var css_class = "control-group css_type_" + this.css_type;      // control-group in TB2, form-group in TB3
    if (!this.isValid()) {
        css_class += " error";                          // has-error in TB3
    }
    if (this.isEditable()) {
        css_class += " css_edit";
        if (this.mandatory) {
            css_class += " css_mand";
        }
    } else {
        css_class += " css_disp";
    }
    if (!this.visible) {
        css_class += " css_hide";
    }
    if (this.css_reload) {
        css_class += " css_reload";
    }
    if (this.css_richtext) {
        css_class += " css_richtext";
    }
    if (form_type === "basic") {
        css_class += " " + this.getAllWidths(editable);
    }
    // if (form_type === "flexbox") {
    //     css_class += " fb-item-" + this.getFlexboxSize();
    // }
    return css_class;
});


Data.Text.define("getAllWidths", function (editable) {
    return this.getWidth("lg", editable) + " " + this.getWidth("md", editable) + " " +
           this.getWidth("sm", editable) + " " + this.getWidth("xs", editable);
});


Data.Text.define("getWidth", function (size, editable) {
    return "col-" + size + "-" + this[(editable ? "edit_col_" : "disp_col_") + size];
});


Data.Text.define("getFlexboxSize", function () {
    if (this.flexbox_size) {
        return this.flexbox_size;
    }
    if (typeof this.data_length !== "number" || this.data_length >= 255) {
        return 12;
    }
    if (this.data_length >= 124) {
        return 8;
    }
    if (this.data_length >= 80) {
        return 6;
    }
    if (this.data_length >= 20) {
        return 4;
    }
    return 2;
});


/**
* To render the label of this field, with a 'for' attribute to the control, and a tooltip if
* 'description' is given
* @param the XmlStream object representing the parent element to which this field should be rendered
* @return the XmlStream object representing the 'label' element created by this function
*/
Data.Text.define("renderLabel", function (div, form_type) {
    var elmt = div.makeElement("label", this.getLabelCSSClass(form_type));
    // elmt.attr("for", this.getControl());
    if (this.description && (!this.page || this.page.render_opts.dynamic_page !== false)) {
        elmt.makeTooltip(this.hover_text_icon, this.description);
        elmt.text("&nbsp;", true);
    }
    elmt.text(this.label);
    if (this.page && this.page.render_opts.dynamic_page === false) {
        elmt.text(": ");
    }
    return elmt;
});


Data.Text.define("getLabelCSSClass", function (form_type) {
    var css_class = "control-label";
    if (form_type === "form-inline-labelless") {
        css_class += " sr-only";
    }
    // if (form_type === "form-horizontal") {                           TB3
    //     css_class += " col-lg-2 col-md-2 col-sm-2 col-xs-2";
    // }
    return css_class;
});


Data.Text.define("renderControl", function (div, form_type) {
    if (this.isEditable() && (!this.page || !this.page.render_opts.uneditable)) {
        this.renderEditable(div, form_type);
        this.renderErrors(div);
    } else {
        this.renderUneditable(div);
    }
});


/**
* To render an editable control for this field
* @param the XmlStream object representing the parent div element to which this control should be
* rendered
* @return the XmlStream object representing the control (e.g. input)
*/
Data.Text.define("renderEditable", function (div, form_type) {
    if (this.input_group_addon_before || this.input_group_addon_after) {
//        div = div.makeElement("div", "input-group");              TB3
        div = div.makeElement("div", (this.input_group_addon_before ? "input-prepend " : "") + (this.input_group_addon_after ? "input-append " : ""));
    }
    if (this.input_group_addon_before) {
//        div.makeElement("div", "input-group-addon").text(this.input_group_addon_before);  TB3
        div.makeElement("span", "add-on").text(this.input_group_addon_before);
    }
    this.renderUpdateControls(div, form_type);
    if (this.input_group_addon_after) {
//        div.makeElement("div", "input-group-addon").text(this.input_group_addon_after);   TB3
        div.makeElement("span", "add-on").text(this.input_group_addon_after);
    }
});


Data.Text.define("renderUpdateControls", function (div, form_type) {
    var that = this;
    var elmt = div.makeInput(this.input_type, null, this.getUpdateText(),
        this.getInputSizeCSSClass(form_type),        // form-control for TB3
        this.placeholder || this.helper_text);

    elmt.jquery_elem.bind("blur", function (event) {
        that.set(elmt.jquery_elem.val());
        that.renderFormGroup(null, form_type);
    });
});


Data.Text.define("getInputSizeCSSClass", function (form_type) {
    if (form_type === "form-horizontal") {
        return "input-block-level";
    }
    return this.tb_input;
});


/**
 * Possibilities to support:
 * - simple text
 * - text + single link (internal, external, email address)
 * - text + multiple links as drop-down
 * - text with decoration icon (with or without link)
 * - decoration icon instead of text (with or without link) */

/**
* To render an uneditable representation of this field into a parent div element, setting val and
* style attributes first, optionally an anchor link, and text
* @param the XmlStream object representing the parent div element to which this control should be
* rendered
*/
Data.Text.define("renderUneditable", function (elem) {
    var span_elem = elem.makeElement("span", "form-control-static");
    var url;
    var style;
    var text;
    var nav_options = 0;

    if (!this.validated) {
        this.validate();
    }
    if (this.getText() !== this.val) {
        span_elem.attr("val", this.val);
    }
    style = this.getUneditableCSSStyle();
    if (style) {
        span_elem.attr("style", style);
    }
    url = this.getURL();
    text = this.getText();
    if (!this.page || this.page.render_opts.dynamic_page !== false) {
        nav_options = this.renderNavOptions(span_elem);
    }
    if (url && !nav_options && (!this.page || this.page.render_opts.show_links !== false)) {
        span_elem = span_elem.makeElement("a");
        span_elem.attr("href", url);
        if (this.url_target) {
            span_elem.attr("target", this.url_target);
        }
        if (this.unicode_icon) {
            span_elem.makeElement("span", this.unicode_icon_class).text(this.unicode_icon, true);
        } else if (this.button_class) {            // Render URL Field as button
            span_elem.attr("class", this.button_class);
        }
        if (this.url_link_text && !this.isBlank()) {
            text = this.url_link_text;
        }
    }
    if (text) {             // CL - Image don't tend to render in excel exports
        if (!this.page || !this.page.render_opts.hide_images) {
            if (this.decoration_icon) {
                            // CL - I think HttpServer.escape renders this property useless
                span_elem.text(this.decoration_icon, true);
            }
//            if (this.icon) {
//                elem.makeElement("img")
//                    .attr("alt", this.icon_alt_text || text)
//                    .attr("src", this.icon);
//            }
        }
        span_elem.text(text);
    }
});


/**
* To get the string of a CSS style attribute for this field when uneditable
* @return string CSS style, or null
*/
Data.Text.define("getUneditableCSSStyle", function () {
    return null;
});


/**
* Does nothing for most fields; for a Reference field, renders a drop-down set of context menu
* options
* @param the XmlStream object representing the parent div element to which this control should be
* rendered
*/
Data.Text.define("renderNavOptions", function (parent_elem) {
    return undefined;
});


/**
* To render message text as a span element with a 'help-inline' CSS class
* @param the XmlStream object representing the parent element to which this span should be rendered
* @return text
*/
Data.Text.define("renderErrors", function (parent_elem) {
    // var text,
    //     help_elem;

    if (!this.isValid()) {
        this.messages.render(parent_elem);
        // text = this.messages.getString();
        // help_elem = div.makeElement("span", "help-block").text(text);
        // Log.debug("Error text for field " + this.toString() + " = " + text);
    }
    // return text;
});


// Used in Reference and File
Data.Text.define("renderDropdownDiv", function (parent_elem, control, tooltip) {
    var div_elem = parent_elem.makeElement("div", (this.dropdown_button ? "btn-group" : "dropdown"));
//    div_elem = parent_elem.makeElement("div", (this.nav_dropdown_a_class.indexOf("btn") === -1 ?
//      "dropdown" : "btn-group"));
    if (this.dropdown_button) {
        div_elem.makeDropdownButton(control, this.dropdown_label, this.dropdown_url, tooltip,
            this.dropdown_css_class, this.dropdown_right_align);
    } else {
        div_elem.makeDropdownIcon(control, this.dropdown_label, this.dropdown_url, tooltip,
            this.dropdown_css_class, this.dropdown_right_align);
    }
    return div_elem.makeDropdownUL(control, this.dropdown_right_align);
});


// ONLY called from FieldSet.addToPage() - IF field is intended to appear on a page
/**
* To add this field to the page object, for UI and response parameter purposes, sets control
* property, which must be unique to the page, and calls page.addField()
* @param Page object
*/
module.exports.define("addToPage", function (page) {
    if (!this.control) {
        this.control = "";
        if (this.owner && this.owner.id_prefix) {
            this.control = this.owner.id_prefix + "_";
        }
        this.control += this.id;
    }
    page.addField(this);
});


/**
* To remove this field from the page object by calling page.removeField()
* @param Page object
*/
module.exports.define("removeFromPage", function (page) {
    page.removeField(this);
});


/**
* To return this field's control property, or calls getId() is control not defined (should never
* happen)
* @return Value of this field's control property - should be string
*/
module.exports.define("getControl", function () {
    return this.control || this.getId();
});


module.exports.define("getLoV", function () {
    if (!this.lov) {
        this.lov = this.getLoVInternal({});
    }
    return this.lov;
});


module.exports.define("getOwnLoV", function (spec) {
    spec = spec || {};
    spec.skip_cache = true;
    this.lov = this.getLoVInternal(spec);
    return this.lov;
});


module.exports.define("getLoVInternal", function (spec) {
    var entity;
    spec.list_id = this.list_id || this.list;
    spec.entity_id = this.ref_entity;
    spec.collection_id = this.collection_id || this.config_item;
    spec.label_prop = this.label_prop;
    spec.active_prop = this.active_prop;
    spec.connection = this.owner.connection;
    // include this.owner.connection - to use Transaction's connection if within a transaction
    if (spec.entity_id) {
        entity = Data.Entity.getEntity(this.ref_entity);
        spec.condition = spec.condition || this.selection_filter || this.ref_condition
            || entity.selection_filter;
        if (spec.skip_full_load === undefined) {
            // if (spec.condition) {
            //     spec.skip_full_load = false;
            // } else
            // if (typeof this.isAutocompleter === "function") {
                            // avoid caching large data volumes
            //     spec.skip_full_load = this.isAutocompleter();
            // } else {
            spec.skip_full_load = (entity.data_volume_oom > 1);
            // }
        }
    }
    this.lov = Data.LoV.getLoV(spec, this.getSession());
    if (this.allow_unchanged_inactive_value && this.orig_val && this.lov.getItem(this.orig_val)) {
        this.lov.getItem(this.orig_val).active = true;
    }
    return this.lov;
});


/**
* To get a session object associated with this field, if one is available
* @return session object or null
*/
module.exports.define("getSession", function () {
    return this.session
        || (this.owner && this.owner.session)
        || (this.owner && this.owner.trans && this.owner.trans.session)
        || (this.owner && this.owner.page && this.owner.page.session);
});


module.exports.define("appendClientSideProperties", function (obj) {
    obj.data_length = this.getDataLength();
    obj.regex_label = this.regex_label;
    obj.regex_pattern = this.regex_pattern;
    obj.input_mask = this.input_mask;
    obj.before_validation = this.before_validation;
    obj.auto_search_oper = this.auto_search_oper;
});


module.exports.define("isDatabaseColumn", function () {
    return (!this.sql_function && !this.getComputed);
});


module.exports.define("obfuscate", function () {
    var sql;
    if (!this.obfuscate_funct || !this.isDatabaseColumn()) {
        return;
    }
    sql = "UPDATE " + this.owner.id + " SET " + this.id + "=" + this[this.obfuscate_funct]();
    Connection.shared.executeUpdate(sql);
});


module.exports.define("getTokenValue", function (token) {
    var out;
    if (token.length < 2 || token[1] === "text") {
        out = this.getText();
    } else if (token[1] === "val") {
        out = this.get();
    } else if (Base.Format.isStrictNumber(token[1])) {
        out = this.getText().substr(0, parseInt(token[1], 10) - 3) + "...";
    } else {
        out = "(ERROR: unrecognized token modifier: " + token[1] + " for " + token[0] + ")";
    }
    return out;
});


// Filter Field Generator
module.exports.define("getFilterField", function (fieldset, spec, suffix) {
    return fieldset.cloneField(spec.base_field, {
        id: spec.id + "_filt",
        editable: true,
        mandatory: false,
        css_reload: false,
        instance: spec.instance,
    });
});


/**
* To generate a reasonable test value for this field
* @param session object
* @return test value string
*/
module.exports.define("generateTestValue", function (session) {
    var attempt = 0;
    var valid = false;
    var regex;
    var array;
    var val;
    var length = Math.min(this.getDataLength() / 2, 500);
    if (this.regex_pattern || this.isKey()) {
        regex = this.regex_pattern ? new RegExp(this.regex_pattern) : null;
        array = Base.Format.getRandomStringArray({ space: !this.isKey(), });
        while (!valid && attempt < 100) {
            val = Base.Format.getRandomString(length, array);
            valid = regex ? regex.test(val) : true;
            attempt += 1;
        }
        if (!valid) {
            this.throwError("Couldn't generate test value after 100 attempts: " + this);
        }
    } else {
        val = Base.Format.getRandomWords(length);
    }
    return val;
});
