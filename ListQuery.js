"use strict";

var ListEntity = require("./ListEntity.js");


module.exports = ListEntity.clone({
    id: "ListQuery",
    allow_add_records: false,
    allow_delete_records: false,
});
