"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDtoTypes = convertDtoTypes;
function convertDtoTypes(dto) {
    const converted = { ...dto };
    for (const key in converted) {
        if (Object.prototype.hasOwnProperty.call(converted, key)) {
            const value = converted[key];
            if (typeof value === 'string') {
                if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) {
                    converted[key] = new Date(value);
                }
                else if (/^\d{4}-\d{2}-\d{2}$/.test(value) && key.toLowerCase().includes('date') || key === 'warrantyUntil') {
                    converted[key] = new Date(value);
                }
            }
        }
    }
    return converted;
}
