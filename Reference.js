"use strict";

var Data = require("lapis-data");
var UI = require("lapis-ui");


Data.Reference.override("renderNavOptions", function (parent_elem, render_opts, cached_record) {
    var session = this.getSession();
    var that = this;
    var this_val = this.getRefVal();
    var ul_elem;
    var count = 0;
    var display_page;
    var context_page;
    var display_url;
    var context_url;

    if (!this_val || !this.ref_entity) {
        return 0;
    }
    display_page = this.ref_entity.getDisplayPage();
    if (!display_page) {
        return 0;
    }
    if (!cached_record) {
        cached_record = this.ref_entity.getSecurityRecord(session, this_val);
    }
    context_page = UI.Page.getPage(this.ref_entity + "_context");
    if (context_page && context_page.allowed(session, this_val, cached_record).access) {
//        context_url = "modal&page_id=" + this.ref_entity + "_context&page_key=" + this_val;
        context_url = context_page.getSimpleURL(this_val);
    }
    if (display_page.allowed(session, this_val, cached_record).access) {
        display_url = display_page.getSimpleURL(this_val);
    }

    function renderDropdown() {
        ul_elem = that.renderDropdownDiv(parent_elem, "nav_" + that.getControl(), "Navigation options for this item");
        if (context_url) {
            ul_elem.addChild("li").makeAnchor("Preview", context_url, "css_open_in_modal");
            count += 1;
        }
        if (display_url) {
            ul_elem.addChild("li").makeAnchor("Display", display_url);
            count += 1;
        }
        if (count > 0) {
            ul_elem.addChild("li", null, "divider");
        }
    }

    display_page.links.each(function (link) {
        if (link.isVisible(session, this_val, cached_record)) {
            if (!ul_elem) {
                renderDropdown();
            }
            link.renderNavOption(ul_elem, render_opts, this_val);
            count += 1;
        }
    });
    return count;
});


Data.Reference.override("renderUpdateControls", function (div, form_type) {
    var css_class = this.getInputSizeCSSClass(form_type); /* TB3: "form-control" */
    if (this.isAutocompleter()) {
        this.renderAutocompleter(div, css_class);
    } else {
        this.renderDropdown(div, css_class);
    }
});


Data.Reference.define("renderAutocompleter", function (div, css_class) {
    div.makeInput("text", null, this.getText(), css_class, this.placeholder || this.helper_text)
        .attr("autocomplete", "off");
});


Data.Reference.define("renderDropdown", function (div, css_class) {
    var select;
    this.getLoV().reloadComplete();
    if (this.lov) {
        if (!this.lov.complete) {
            this.throwError("lov is incomplete");
            // this.lov.loadEntity();
        }
        if (this.allow_unchanged_inactive_value && this.orig_val
                && this.lov.getItem(this.orig_val)) {
            this.lov.getItem(this.orig_val).active = true;
        }
        if (this.render_radio) {
            select = this.lov.renderRadio(div, this.val, this.getControl(),
                css_class, this.mandatory);
        } else {
            select = this.lov.renderDropdown(div, this.val, this.getControl(),
                css_class, this.mandatory);
        }
    }
    return select;
});
