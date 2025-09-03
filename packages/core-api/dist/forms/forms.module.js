"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormsModule = void 0;
const common_1 = require("@nestjs/common");
const forms_controller_1 = require("./forms.controller");
const form_entries_controller_1 = require("./form-entries.controller");
const form_entries_seed_controller_1 = require("./form-entries-seed.controller");
const form_entries_seed_service_1 = require("./seed/form-entries-seed.service");
const core_service_1 = require("@reki/core-service");
let FormsModule = class FormsModule {
};
exports.FormsModule = FormsModule;
exports.FormsModule = FormsModule = __decorate([
    (0, common_1.Module)({
        imports: [core_service_1.CoreServiceModule],
        controllers: [forms_controller_1.FormsController, form_entries_controller_1.FormEntriesController, form_entries_seed_controller_1.FormEntriesSeedController],
        providers: [form_entries_seed_service_1.FormEntriesSeedService],
    })
], FormsModule);
