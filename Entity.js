"use strict";

var Data = require("lapis-data");
var UI = require("lapis-ui");


Data.Entity.define("getSearchPage", function () {
    var page_id = this.id + "_search";
    if (typeof this.search_page === "string") {
        page_id = this.search_page;
    }
    return UI.Page.getPage(page_id);        // can't declare at top due to circularity!!!!
});


Data.Entity.define("getDisplayPage", function () {
    var page_id = this.id + "_display";
    if (typeof this.display_page === "string") {        // ignores this.display_page if boolean
        page_id = this.display_page;
    }
    return UI.Page.getPage(page_id);
});


Data.Entity.define("getDisplayURL", function (key) {
    key = key || this.getFullKey();
    return this.getDisplayPage().getSimpleURL(key);
});


// This function is NOT defined in an entity unless it actually does something
// - so the existence of this function indicates whether or not record security is applicable for
// the entity.
// Data.Entity.define("addSecurityCondition", function (query, session) {
// });  //---addSecurityCondition
Data.Entity.define("renderLineItem", function (element, render_opts) {
    var display_page = this.getDisplayPage();
    var anchor = element.makeAnchor(this.getLabel("list_item"),
        display_page && display_page.getSimpleURL(this.getFullKey()));

    return anchor;
});


Data.Entity.define("renderTile", function (parent_elem, render_opts) {
    var div_elem = parent_elem.makeElement("div", "css_tile", this.getUUID());
    this.addTileURL(div_elem, render_opts);
    this.addTileContent(div_elem, render_opts);
});


Data.Entity.define("addTileURL", function (div_elem, render_opts) {
    var display_page = this.getDisplayPage();
    if (display_page) {
        div_elem.attr("url", display_page.getSimpleURL(this.getKey()));
    }
});


Data.Entity.define("addTileContent", function (div_elem, render_opts) {
    if (this.glyphicon) {
        div_elem.makeElement("i", this.glyphicon);
        div_elem.text("&nbsp;");
    } else if (this.icon) {
        div_elem.makeElement("img")
            .attr("alt", this.title)
            .attr("src", "/cdn/" + this.icon);
    }
    div_elem.text(this.getLabel("tile"));
});


Data.Entity.define("getDotGraphNode", function (highlight) {
    var key = this.getFullKey();
    var out = key + " [ label=\"" + this.getLabel("dotgraph") + "\" URL=\"" +
        this.getDisplayURL(key) + "\"";

    if (highlight) {
        out += " style=\"filled\" fillcolor=\"#f8f8f8\"";
    }
    return out + "]; ";
});


Data.Entity.define("getDotGraphEdge", function (parent_key) {
    var out = "";
    if (parent_key) {
        out = parent_key + " -> " + this.getKey() + ";";            // add label property if relevant
    }
    return out;
});


Data.Entity.define("replaceTokenRecord", function (key) {
    var page = this.getDisplayPage();
    var row = this.getRow(key);

    if (!page) {
        return "(ERROR: no display page for entity: " + this.id + ")";
    }
    if (!row) {
        return "(ERROR: record not found: " + this.id + ":" + key + ")";
    }
    return "<a href='" + page.getSimpleURL(row.getKey()) + "'>" + row.getLabel("article_link") + "</a>";
    // return XmlStream.left_bracket_subst + "a href='" +
    //     page.getSimpleURL(row.getKey()) + "'" + XmlStream.right_bracket_subst +
    //     row.getLabel("article_link") +
    //     XmlStream.left_bracket_subst + "/a" + XmlStream.right_bracket_subst;
});
