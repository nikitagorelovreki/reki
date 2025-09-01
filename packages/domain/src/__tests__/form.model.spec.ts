import { FormModel, FormStatus, FormType } from '../models/form.model';

describe('FormModel', () => {
  let form: FormModel;
  const mockFormData = {
    title: 'Test Assessment Form',
    description: 'A test form for assessments',
    type: FormType.ASSESSMENT,
    schema: { fields: [] },
  };

  beforeEach(() => {
    form = new FormModel(mockFormData);
  });

  describe('Constructor', () => {
    it('should create form with provided data', () => {
      expect(form.title).toBe('Test Assessment Form');
      expect(form.description).toBe('A test form for assessments');
      expect(form.type).toBe(FormType.ASSESSMENT);
      expect(form.schema).toEqual({ fields: [] });
    });

    it('should generate UUID if no id provided', () => {
      const newForm = new FormModel({ title: 'New Form' });
      expect(newForm.id).toBeDefined();
      expect(typeof newForm.id).toBe('string');
      expect(newForm.id.length).toBeGreaterThan(0);
    });

    it('should set default values', () => {
      const newForm = new FormModel({ title: 'Form with defaults' });
      
      expect(newForm.title).toBe('Form with defaults');
      expect(newForm.type).toBe(FormType.ASSESSMENT);
      expect(newForm.status).toBe(FormStatus.DRAFT);
      expect(newForm.version).toBe(1);
      expect(newForm.schema).toEqual({});
      expect(newForm.createdAt).toBeInstanceOf(Date);
      expect(newForm.updatedAt).toBeInstanceOf(Date);
    });

    it('should preserve provided values over defaults', () => {
      const customForm = new FormModel({
        title: 'Custom Form',
        type: FormType.QUESTIONNAIRE,
        status: FormStatus.ACTIVE,
        version: 5,
        schema: { custom: 'schema' },
        createdBy: 'user-123',
      });

      expect(customForm.type).toBe(FormType.QUESTIONNAIRE);
      expect(customForm.status).toBe(FormStatus.ACTIVE);
      expect(customForm.version).toBe(5);
      expect(customForm.schema).toEqual({ custom: 'schema' });
      expect(customForm.createdBy).toBe('user-123');
    });
  });

  describe('update', () => {
    it('should update form properties', () => {
      const originalUpdatedAt = form.updatedAt;
      const updateData = {
        title: 'Updated Form Title',
        description: 'Updated description',
        status: FormStatus.ACTIVE,
      };

      form.update(updateData);

      expect(form.title).toBe('Updated Form Title');
      expect(form.description).toBe('Updated description');
      expect(form.status).toBe(FormStatus.ACTIVE);
      expect(form.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

    it('should only update provided properties', () => {
      const originalType = form.type;
      const originalVersion = form.version;
      
      form.update({ title: 'Partially Updated' });
      
      expect(form.title).toBe('Partially Updated');
      expect(form.type).toBe(originalType);
      expect(form.version).toBe(originalVersion);
    });

    it('should always update the updatedAt timestamp', () => {
      const originalUpdatedAt = form.updatedAt;
      
      form.update({});
      
      expect(form.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('createNewVersion', () => {
    it('should create new version with incremented version number', () => {
      form.version = 3;
      form.status = FormStatus.ACTIVE;
      
      const newVersion = form.createNewVersion();
      
      expect(newVersion.version).toBe(4);
      expect(newVersion.status).toBe(FormStatus.DRAFT);
      expect(newVersion.title).toBe(form.title);
      expect(newVersion.description).toBe(form.description);
      expect(newVersion.type).toBe(form.type);
      expect(newVersion.schema).toBe(form.schema);
      expect(newVersion.createdBy).toBe(form.createdBy);
      expect(newVersion.updatedBy).toBe(form.updatedBy);
    });

    it('should create independent instance', () => {
      const newVersion = form.createNewVersion();
      
      expect(newVersion).not.toBe(form);
      expect(newVersion.id).not.toBe(form.id);
      expect(newVersion.createdAt).not.toBe(form.createdAt);
      expect(newVersion.updatedAt).not.toBe(form.updatedAt);
    });

    it('should always set status to DRAFT for new version', () => {
      form.status = FormStatus.ACTIVE;
      
      const newVersion = form.createNewVersion();
      
      expect(newVersion.status).toBe(FormStatus.DRAFT);
    });
  });

  describe('Static Properties', () => {
    it('should have correct table name', () => {
      expect(FormModel.tableName).toBe('form_templates');
    });

    it('should have field mappings for database', () => {
      expect(FormModel.fieldMappings).toBeDefined();
      expect(FormModel.fieldMappings.id).toBe('id');
      expect(FormModel.fieldMappings.title).toBe('title');
      expect(FormModel.fieldMappings.createdAt).toBe('created_at');
      expect(FormModel.fieldMappings.updatedAt).toBe('updated_at');
    });
  });
});