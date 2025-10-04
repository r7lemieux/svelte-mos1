"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.online = exports.defaultDbService = exports.local = void 0;
// import { DbServiceInterface} from '../services/db/db.service.interface'
var Heap_db_service_js_1 = require("../services/db/Heap.db.service.js");
exports.local = {
    signInSuccessUrl: 'http://127.0.0.1:5173',
    uiUrl: 'http://localhost:3000/',
};
exports.defaultDbService = Heap_db_service_js_1.heapDbService;
exports.online = true;
exports.config = exports.local;
