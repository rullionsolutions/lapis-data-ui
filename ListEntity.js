"use strict";

var Data = require("lapis-data");
var UI = require("lapis-ui");


module.exports = UI.List.clone({
    id: "ListEntity",
});


/**
* To setup this grid, by setting 'entity' to the entity specified by 'entity', then calling
*/
module.exports.defbind("setupFromEntity", "setup", function () {
//    this.generated_title = this.entity.getPluralLabel();
    this.deriveParentRecord();
    this.setupColumns();
    // this.loadRecords();
});


/**
* To set 'parent_record' if not already, as follows: if the owning page has 'page_key_entity'
* and it is the
* @return this.parent_record
*/
module.exports.define("deriveParentRecord", function () {
    if (!this.dataset && this.entity && this.link_field) {
        this.setupDataSet(this.entity.id, this.link_field, this.owner.page.page_key);

        // if (this.owner.page.page_key_entity && this.entity.getField(this.link_field).ref_entity
        // === this.owner.page.page_key_entity.id) {
            // this.document = this.owner.page.getMainDocument();
            // this.setParentRecord(this.owner.page.data_manager.getRecord(
            // this.owner.page.page_key_entity.id, this.owner.page.page_key));

        // } else if (this.entity.getField(this.link_field).ref_entity
        // === this.owner.page.entity.id) {
            // this.document = this.owner.page.getMainDocument();
            // this.setParentRecord(this.owner.page.getPrimaryRecord());
        // }
    }
    // this.debug(this + " has parent_record " + this.parent_record);
});


module.exports.define("setupDataSet", function (entity_id, link_field_id, link_field_value) {
    // this.parent_record = record;
    this.dataset = Data.DataSetConditional.clone({
        id: "DataSet." + this.id,
        instance: true,
        data_manager: this.owner.page.data_manager,
    });
    this.dataset.addCriterion({ entity_id: entity_id, });
    this.dataset.addCriterion({
        field_id: link_field_id,
        value: link_field_value,
    });
    this.linkToDataSet(this.dataset);
});


/**
* To create a delete record control column if 'allow_delete_records', and then to loop through
* the fields in
*/
module.exports.define("setupColumns", function () {
    this.addEntityColumns(this.entity);
});


module.exports.define("addEntityColumns", function (entity) {
    var that = this;
    entity.each(function (field) {
        var col;
        if (field.accessible !== false) {
            col = that.columns.add({ field: field, });
            that.trace("Adding field as column: " + field.id + " to section " + that.id);
            if (col.id === that.link_field) {
                col.visible = false;
            }
        }
    });
});

/*
module.exports.define("loadRecords", function () {
    var that = this,
        allow_add_records = this.allow_add_records;

    this.allow_add_records = true;
    if (!this.parent_record) {
        this.throwError("no parent record identified");
    }
    this.parent_record.eachChildRecord(
        function (record) {
            that.addRecord(record);
        },
        this.entity.id);
    this.allow_add_records = allow_add_records;
});
*/
