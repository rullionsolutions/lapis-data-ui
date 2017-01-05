"use strict";

// var Data = require("lapis-data");
var UI = require("lapis-ui");
var Under = require("underscore");


UI.Page.define("store", null);
UI.Page.define("data_manager", null);
// UI.Page.define();


/**
* To determine security access to this page based on its primary record;
* @param session (object); page key (string); cached_record (FieldSet object, optional),
* allowed object if cached_record is supplied, access is implied
*/
UI.Page.defbind("checkRecordSecurity", "allowed", function (spec) {
    var page_entity = this.page_key_entity || this.entity;
    if (spec.allowed.access && page_entity && spec.page_key && !spec.cached_record
            && page_entity.addSecurityCondition) {
        this.trace("checking record security for entity: " + page_entity.id + ", key: " + spec.page_key);
        if (!page_entity.getSecurityRecord(spec.session, spec.page_key)) {
            spec.allowed.access = false;
            spec.allowed.reason = "record security for entity: " + page_entity.id + ", key: " + spec.page_key;
        }
    }
});


UI.Page.defbind("checkWorkflowSecurity", "allowed", function (spec) {
    if (!spec.allowed.access || this.workflow_only) {
        if (spec.page_key && spec.session.allowedPageTask(this.id, spec.page_key, spec.allowed)) {
            spec.allowed.access = true;
            spec.allowed.reason = "page task";
        } else {
            spec.allowed.access = false;    // even if access was set true by checkBasicSecurity()
            spec.allowed.reason = "workflow-only page";
        }
    }
});


UI.Page.defbind("setupTransButtons", "setupStart", function () {
    var that = this;
    Under.each(this.outcomes, function (obj, id) {
        that.buttons.add({
            id: id,
            label: obj.label,
            primary: true,
            page_funct_click: "save",
            show_only_on_last_visible_tab: true,
        });
    });
    if (this.transactional) {
        if (!this.prompt_message) {
            this.prompt_message = "Navigating away from this page will mean losing any data changes you've entered";
        }
        if (!this.outcomes) {           // save is NOT main_button to prevent page
            this.buttons.add({          // submission when enter is pressed
                id: "save",
                label: "Save",
                show_only_on_last_visible_tab: true,
                primary: true,
                page_funct_click: "save",
            });
        }
        this.buttons.add({
            id: "cancel",
            label: "Cancel",
            page_funct_click: "cancel",
        });
    }
});


UI.Page.define("getPrimaryRecord", function () {
    if (!this.primary_record && this.entity) {
        this.primary_record = this.getPrimaryRecordNotAlreadyDefined();
    }
    return this.primary_record;
});


/**
* Returns the primary row of this page, if it has one
* @return Descendent of Entity object, modifiable if the page is transactional
*/
UI.Page.define("getPrimaryRecordNotAlreadyDefined", function () {
    var primary_record;
    if (this.page_key_entity) {        // Setting for page_key to relate to different entity
        primary_record = this.data_manager.createNewRecord(this.entity.id);
    } else if (this.page_key) {
        primary_record = this.data_manager.getRecord(this.entity.id, this.page_key);
    } else {
        primary_record = this.data_manager.createNewRecord(this.entity.id);
    }
    return primary_record;
});


UI.Page.define("save", function () {
    this.data_manager.save();
});


UI.Page.defbind("revertChanges", "cancel", function () {
    this.data_manager.revertChanges();
});

