"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedClientsResponseDto = exports.ClientResponseDto = exports.UpdateClientDto = exports.CreateClientDto = exports.ClientStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ClientStatus;
(function (ClientStatus) {
    ClientStatus["INTAKE"] = "intake";
    ClientStatus["ACTIVE"] = "active";
    ClientStatus["INACTIVE"] = "inactive";
    ClientStatus["DISCHARGED"] = "discharged";
})(ClientStatus || (exports.ClientStatus = ClientStatus = {}));
class CreateClientDto {
}
exports.CreateClientDto = CreateClientDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client first name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client last name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client middle name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client date of birth' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client phone number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client email' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client diagnosis' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "diagnosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client status', enum: ClientStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ClientStatus),
    __metadata("design:type", String)
], CreateClientDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinic ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "clinicId", void 0);
class UpdateClientDto {
}
exports.UpdateClientDto = UpdateClientDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client first name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client last name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client middle name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client date of birth' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client phone number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client email' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client diagnosis' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "diagnosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client status', enum: ClientStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ClientStatus),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinic ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "clinicId", void 0);
class ClientResponseDto {
}
exports.ClientResponseDto = ClientResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client ID' }),
    __metadata("design:type", String)
], ClientResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client first name' }),
    __metadata("design:type", String)
], ClientResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client last name' }),
    __metadata("design:type", String)
], ClientResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client middle name' }),
    __metadata("design:type", String)
], ClientResponseDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client date of birth' }),
    __metadata("design:type", String)
], ClientResponseDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client phone number' }),
    __metadata("design:type", String)
], ClientResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client email' }),
    __metadata("design:type", String)
], ClientResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client address' }),
    __metadata("design:type", String)
], ClientResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client diagnosis' }),
    __metadata("design:type", String)
], ClientResponseDto.prototype, "diagnosis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client status', enum: ClientStatus }),
    __metadata("design:type", String)
], ClientResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinic ID' }),
    __metadata("design:type", String)
], ClientResponseDto.prototype, "clinicId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation date' }),
    __metadata("design:type", String)
], ClientResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update date' }),
    __metadata("design:type", String)
], ClientResponseDto.prototype, "updatedAt", void 0);
class PaginatedClientsResponseDto {
}
exports.PaginatedClientsResponseDto = PaginatedClientsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ClientResponseDto], description: 'List of clients' }),
    __metadata("design:type", Array)
], PaginatedClientsResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pagination information',
        example: {
            page: 1,
            limit: 10,
            total: 100,
            totalPages: 10,
        },
    }),
    __metadata("design:type", Object)
], PaginatedClientsResponseDto.prototype, "pagination", void 0);
