/*global x, _, XmlStream */
"use strict";



x.ui.Page.define("reportSaveMessage", function () {
    var text = "Saved";
    if (this.session.online) {
        if (this.trans.next_auto_steps_to_perform.length === 0 && !this.hide_undo_link_on_save) {        // show undo link if online session and no auto steps involved
            text += " " + XmlStream.left_bracket_subst + "a class='css_undo_link' href='" +
                this.getPage("ac_tx_undo").getSimpleURL(this.trans.id) +
                "&page_button=undo'" + XmlStream.right_bracket_subst + "undo" +
                XmlStream.left_bracket_subst + "/a" + XmlStream.right_bracket_subst;
        }
    } else {
        text += " transaction: " + this.trans.id;
    }
    this.session.messages.add({ type: 'I', text: text });
});


x.ui.Page.define("renderDetails", function (page_elem /*, render_opts*/) {
    var details_elmt = page_elem.makeElement("div", "css_hide", "css_payload_page_details"),
        area = this.getArea(),
        entity_search_page;

    details_elmt.attr("data-page-id"   , this.id);
    details_elmt.attr("data-page-skin" , this.skin);
    details_elmt.attr("data-page-title", this.getPageTitle());
    details_elmt.attr("data-area-id"   , (area && area.id) || "");
    details_elmt.attr("data-page-key"  , this.page_key || "");
    details_elmt.attr("data-page-glyphicon", this.glyphicon || (this.entity && this.entity.glyphicon) || (area && area.glyphicon) || "");
    if (this.description) {
        details_elmt.attr("data-page-description", this.description);
    }
    if (this.page_tab) {
        details_elmt.attr("data-page-tab"        , this.page_tab.id);
    }
    if (this.browser_timeout) {
        details_elmt.attr("data-browser-timeout" , this.browser_timeout);
    }
    if (this.prompt_message) {
        details_elmt.attr("data-prompt-message"  , this.prompt_message);
    }
    if (!this.challenge_token) {
        this.challenge_token = Lib.getRandomString(32, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }
    details_elmt.attr("data-challenge-token", this.challenge_token);
    if (this.entity) {
        entity_search_page = this.entity.getSearchPage();
        if (entity_search_page && entity_search_page.id !== this.id && entity_search_page.allowed(this.session).access) {
            details_elmt.attr("data-search-page" , entity_search_page.id);
        }
        if (this.session.refer_sections && this.session.refer_sections[this.id] && this.page_key && this.session.refer_sections[this.id].outputNavLinks) {
            this.session.refer_sections[this.id].outputNavLinks(this.page_key, details_elmt);
        }
    }
});


/**
* Create the digest object returned in JSON form as the response to an HTTP POST
* @return Digest object containing tabs, links, and various other properties of the page
*/
x.ui.Page.define("getJSON", function () {
    var out = {},
        area = this.getArea(),
        entity_search_page,
        i;

    out.id    = this.id;
    out.skin  = this.skin;
    out.title = this.getPageTitle();
    out.area  = area && area.id;
    out.prompt_message = this.prompt_message;
    if (this.page_key) {
        out.page_key = this.page_key;
    }
    if (this.description) {
        out.description = this.description;
    }
    if (this.browser_timeout) {
        out.browser_timeout = this.browser_timeout;
    }
    if (this.redirect_url) {
        if (this.session.allowedURL(this.redirect_url, true)) {                     // §vani.core.7.5.2.5
            this.debug("Redirecting to: " + this.redirect_url);
            out.redirect_url = this.redirect_url;
        } else {
            this.debug("Redirect URL not allowed: " + this.redirect_url + "; going home: " + this.session.home_page_url);
            out.redirect_url = this.session.home_page_url;        // go home if target page is not allowed / does not exist
        }
        if (this.redirect_new_window) {
            out.redirect_new_window = this.redirect_new_window;
        }
        delete this.redirect_url;     // allow redirect to this page, to wipe URL parameters
    }
    if (this.page_tab) {
        out.page_tab = this.page_tab.id;
    }
    if (this.entity) {
        entity_search_page = this.entity.getSearchPage();

//        this.trace("Search Page: " + entity_search_page);
        if (entity_search_page && entity_search_page.id !== this.id && entity_search_page.allowed(this.session).access) {    // §vani.core.7.5.1.5
            out.entity_search_page = entity_search_page.id;
        }
        if (this.session.refer_section && this.session.refer_section.entity === this.entity.id && this.page_key && this.session.refer_section.outputNavLinks) {
            this.session.refer_section.outputNavLinks(this.page_key, out);
        }
    }
    out.glyphicon = this.glyphicon || (this.entity && this.entity.glyphicon) || (area && area.glyphicon);
    out.tabs = [];
    for (i = 0; i < this.tabs.length(); i += 1) {
        if (this.tabs.get(i).visible) {
            out.tabs.push(this.tabs.get(i).getJSON());
        }
    }
    out.links = [];
    for (i = 0; i < this.links.length(); i += 1) {
        if (this.links.get(i).isVisible(this.session, null, this.primary_row)) {
            out.links.push(this.links.get(i).getJSON());
        }
    }
    out.includes = [];
    for (i = 0; this.includes && i < this.includes.length; i += 1) {
        out.includes.push(this.includes[i]);
    }
    return out;
});



/**
* Create an object to be output as JSON containing additional data requested as a separated HTTP request
* @param params object representing the HTTP parameters
* @return Digest object containing additional data, perhaps according to HTTP parameters
*/
x.ui.Page.define("extraJSON", function (/*params*/) {
    return undefined;
});


/**
* Return the singleton Transaction object belonging to this Page instance, creating it if necessary
* @return Transaction object belonging to this Page instance
*/
x.ui.Page.define("getTrans", function () {
    if (!this.trans) {
        this.trans = this.session.getNewTrans({
            page: this,
            allow_no_modifications: this.allow_no_modifications
        });
    }
    return this.trans;
});


x.ui.Page.define("setRedirectUrl", function (obj, params) {
    if (this.login_redirect_url) {
        if (!obj.hasOwnProperty("page")) {
            obj.page = {};
        }
        params.page_id = this.login_redirect_url;
        obj.page.redirect_url = Lib.joinParams(params);
    }
});


x.ui.Page.define("keepAfterNavAway", function () {
    if (typeof this.keep_after_nav_away === "boolean") {
        return this.keep_after_nav_away;
    }
    return this.transactional;
});
