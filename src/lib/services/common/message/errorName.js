"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorDef = exports.ErrorName = void 0;
var ErrorName;
(function (ErrorName) {
    ErrorName[ErrorName["ok"] = 0] = "ok";
    ErrorName[ErrorName["argument_null"] = 1] = "argument_null";
    ErrorName[ErrorName["compute_invalid_ratingSystem"] = 2] = "compute_invalid_ratingSystem";
    ErrorName[ErrorName["db_delete_no_id"] = 3] = "db_delete_no_id";
    ErrorName[ErrorName["db_delete_fail"] = 4] = "db_delete_fail";
    ErrorName[ErrorName["db_error"] = 5] = "db_error";
    ErrorName[ErrorName["db_fail_create"] = 6] = "db_fail_create";
    ErrorName[ErrorName["db_fail_delete"] = 7] = "db_fail_delete";
    ErrorName[ErrorName["db_fail_fetchRange"] = 8] = "db_fail_fetchRange";
    ErrorName[ErrorName["db_fail_update"] = 9] = "db_fail_update";
    ErrorName[ErrorName["db_invalid_digit"] = 10] = "db_invalid_digit";
    ErrorName[ErrorName["db_invalid_key"] = 11] = "db_invalid_key";
    ErrorName[ErrorName["db_save_no_id"] = 12] = "db_save_no_id";
    ErrorName[ErrorName["db_add_id_to_auto_id"] = 13] = "db_add_id_to_auto_id";
    ErrorName[ErrorName["db_notFound"] = 14] = "db_notFound";
    ErrorName[ErrorName["db_unexpected_multiple"] = 15] = "db_unexpected_multiple";
    ErrorName[ErrorName["idGenerator_fail_setup_new_table"] = 16] = "idGenerator_fail_setup_new_table";
    ErrorName[ErrorName["field_invalid"] = 17] = "field_invalid";
    ErrorName[ErrorName["field_invalid_tooShort"] = 18] = "field_invalid_tooShort";
    ErrorName[ErrorName["field_invalid_tooLong"] = 19] = "field_invalid_tooLong";
    ErrorName[ErrorName["field_invalid_email"] = 20] = "field_invalid_email";
    ErrorName[ErrorName["field_invalid_key"] = 21] = "field_invalid_key";
    ErrorName[ErrorName["field_invalid_number"] = 22] = "field_invalid_number";
    ErrorName[ErrorName["field_invalid_numberTooLarge"] = 23] = "field_invalid_numberTooLarge";
    ErrorName[ErrorName["field_invalid_numberTooSmall"] = 24] = "field_invalid_numberTooSmall";
    ErrorName[ErrorName["field_unknown"] = 25] = "field_unknown";
    ErrorName[ErrorName["field_unsupported"] = 26] = "field_unsupported";
    ErrorName[ErrorName["gdrive_error"] = 27] = "gdrive_error";
    ErrorName[ErrorName["gdrive_missing_fileId"] = 28] = "gdrive_missing_fileId";
    ErrorName[ErrorName["gdrive_missing_id"] = 29] = "gdrive_missing_id";
    ErrorName[ErrorName["gdrive_file_notFound"] = 30] = "gdrive_file_notFound";
    ErrorName[ErrorName["missing_id"] = 31] = "missing_id";
    ErrorName[ErrorName["missing_field"] = 32] = "missing_field";
    ErrorName[ErrorName["missing_implementation"] = 33] = "missing_implementation";
    ErrorName[ErrorName["missing_param"] = 34] = "missing_param";
    ErrorName[ErrorName["missing_value"] = 35] = "missing_value";
    ErrorName[ErrorName["not_implemented_in_default"] = 36] = "not_implemented_in_default";
    ErrorName[ErrorName["not_implemented_in_subclass"] = 37] = "not_implemented_in_subclass";
    ErrorName[ErrorName["req_invalid_action"] = 38] = "req_invalid_action";
    ErrorName[ErrorName["req_missing_id"] = 39] = "req_missing_id";
    ErrorName[ErrorName["req_no_id"] = 40] = "req_no_id";
    ErrorName[ErrorName["server_error"] = 41] = "server_error";
    ErrorName[ErrorName["spreadsheet_no_name"] = 42] = "spreadsheet_no_name";
    ErrorName[ErrorName["type5_error"] = 43] = "type5_error";
})(ErrorName || (exports.ErrorName = ErrorName = {}));
exports.ErrorDef = {
    ok: { httpCode: 200 },
    compute_invalid_ratingSystem: { httpCode: 500 },
    db_error: {},
    db_fail_create: {},
    db_fail_delete: {},
    db_fail_fetchRange: {},
    db_fail_update: {},
    db_invalid_digit: {},
    db_invalid_key: {},
    db_notFound: {},
    db_unexpected_multiple: {},
    idGenerator_fail_setup_new_table: {},
    field_invalid: { httpCode: 400 },
    field_invalid_email: { httpCode: 400 },
    field_invalid_key: { httpCode: 400 },
    field_invalid_number: { httpCode: 400 },
    field_invalid_numberTooLarge: { httpCode: 400 },
    field_invalid_numberTooSmall: { httpCode: 400 },
    field_unknown: { httpCode: 400 },
    field_unsupported: { httpCode: 400 },
    not_implemented_in_subclass: { httpCode: 500 },
    req_invalid_action: { httpCode: 400 },
    req_missing_id: { httpCode: 400 },
    req_no_id: { httpCode: 400 },
    server_error: { httpCode: 500 },
    type5_error: { httpCode: 505 },
};
