export declare enum ErrorName {
    ok = 0,
    'compute_invalid_ratingSystem' = 1,
    'db_delete_no_id' = 2,
    'db_delete_fail' = 3,
    'db_error' = 4,
    'db_fail_create' = 5,
    'db_fail_delete' = 6,
    'db_fail_fetchRange' = 7,
    'db_fail_update' = 8,
    'db_invalid_digit' = 9,
    'db_invalid_key' = 10,
    'db_save_no_id' = 11,
    'db_add_id_to_auto_id' = 12,
    'db_notFound' = 13,
    'db_unexpected_multiple' = 14,
    'idGenerator_fail_setup_new_table' = 15,
    'field_invalid' = 16,
    'field_invalid_tooShort' = 17,
    'field_invalid_tooLong' = 18,
    'field_invalid_email' = 19,
    'field_invalid_key' = 20,
    'field_invalid_number' = 21,
    'field_invalid_numberTooLarge' = 22,
    'field_invalid_numberTooSmall' = 23,
    'field_unknown' = 24,
    'field_unsupported' = 25,
    'gdrive_error' = 26,
    'gdrive_missing_fileId' = 27,
    'gdrive_missing_id' = 28,
    'gdrive_file_notFound' = 29,
    'missing_id' = 30,
    'missing_field' = 31,
    'missing_implementation' = 32,
    'missing_param' = 33,
    'missing_value' = 34,
    'not_implemented_in_default' = 35,
    'not_implemented_in_subclass' = 36,
    'req_invalid_action' = 37,
    'req_missing_id' = 38,
    'req_no_id' = 39,
    'server_error' = 40,
    'spreadsheet_no_name' = 41,
    'type5_error' = 42
}
export declare const ErrorDef: {
    ok: {
        httpCode: number;
    };
    compute_invalid_ratingSystem: {
        httpCode: number;
    };
    db_error: {};
    db_fail_create: {};
    db_fail_delete: {};
    db_fail_fetchRange: {};
    db_fail_update: {};
    db_invalid_digit: {};
    db_invalid_key: {};
    db_notFound: {};
    db_unexpected_multiple: {};
    idGenerator_fail_setup_new_table: {};
    field_invalid: {
        httpCode: number;
    };
    field_invalid_email: {
        httpCode: number;
    };
    field_invalid_key: {
        httpCode: number;
    };
    field_invalid_number: {
        httpCode: number;
    };
    field_invalid_numberTooLarge: {
        httpCode: number;
    };
    field_invalid_numberTooSmall: {
        httpCode: number;
    };
    field_unknown: {
        httpCode: number;
    };
    field_unsupported: {
        httpCode: number;
    };
    not_implemented_in_subclass: {
        httpCode: number;
    };
    req_invalid_action: {
        httpCode: number;
    };
    req_missing_id: {
        httpCode: number;
    };
    req_no_id: {
        httpCode: number;
    };
    server_error: {
        httpCode: number;
    };
    type5_error: {
        httpCode: number;
    };
};
