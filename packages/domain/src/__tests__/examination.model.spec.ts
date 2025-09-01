import { 
  ExaminationFormModel, 
  ExaminationFormEntryModel, 
  ExaminationFormType, 
  ExaminationFormStatus 
} from '../models/examination.model';

describe('ExaminationFormModel', () => {
  let examinationForm: ExaminationFormModel;
  const mockData = {
    title: 'LFK Assessment',
    type: ExaminationFormType.LFK,
    schema: { sections: [] },
  };

  beforeEach(() => {
    examinationForm = new ExaminationFormModel(mockData);
  });

  describe('Constructor', () => {
    it('should create examination form with provided data', () => {
      expect(examinationForm.title).toBe('LFK Assessment');
      expect(examinationForm.type).toBe(ExaminationFormType.LFK);
      expect(examinationForm.schema).toEqual({ sections: [] });
    });

    it('should set default values', () => {
      const newForm = new ExaminationFormModel({ title: 'FIM Form', type: ExaminationFormType.FIM });
      
      expect(newForm.version).toBe(1);
      expect(newForm.status).toBe(ExaminationFormStatus.DRAFT);
      expect(newForm.createdAt).toBeInstanceOf(Date);
      expect(newForm.updatedAt).toBeInstanceOf(Date);
    });

    it('should preserve provided values over defaults', () => {
      const customForm = new ExaminationFormModel({
        title: 'Custom Examination',
        type: ExaminationFormType.FIM,
        version: 3,
        status: ExaminationFormStatus.ACTIVE,
        description: 'Custom description',
      });

      expect(customForm.version).toBe(3);
      expect(customForm.status).toBe(ExaminationFormStatus.ACTIVE);
      expect(customForm.description).toBe('Custom description');
    });
  });

  describe('update', () => {
    it('should update examination form properties', () => {
      const originalUpdatedAt = examinationForm.updatedAt;
      const updateData = {
        title: 'Updated LFK Form',
        description: 'Updated description',
        status: ExaminationFormStatus.ACTIVE,
      };

      examinationForm.update(updateData);

      expect(examinationForm.title).toBe('Updated LFK Form');
      expect(examinationForm.description).toBe('Updated description');
      expect(examinationForm.status).toBe(ExaminationFormStatus.ACTIVE);
      expect(examinationForm.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

    it('should only update provided properties', () => {
      const originalType = examinationForm.type;
      const originalVersion = examinationForm.version;
      
      examinationForm.update({ title: 'Partially Updated' });
      
      expect(examinationForm.title).toBe('Partially Updated');
      expect(examinationForm.type).toBe(originalType);
      expect(examinationForm.version).toBe(originalVersion);
    });
  });

  describe('createNewVersion', () => {
    it('should create new version with incremented version number', () => {
      examinationForm.version = 2;
      examinationForm.status = ExaminationFormStatus.ACTIVE;
      
      const newVersion = examinationForm.createNewVersion();
      
      expect(newVersion.version).toBe(3);
      expect(newVersion.status).toBe(ExaminationFormStatus.DRAFT);
      expect(newVersion.title).toBe(examinationForm.title);
      expect(newVersion.type).toBe(examinationForm.type);
      expect(newVersion.schema).toBe(examinationForm.schema);
      expect(newVersion.description).toBe(examinationForm.description);
    });

    it('should create independent instance', () => {
      const newVersion = examinationForm.createNewVersion();
      
      expect(newVersion).not.toBe(examinationForm);
      expect(newVersion.createdAt).not.toBe(examinationForm.createdAt);
      expect(newVersion.updatedAt).not.toBe(examinationForm.updatedAt);
    });
  });

  describe('Static Properties', () => {
    it('should have correct table name', () => {
      expect(ExaminationFormModel.tableName).toBe('forms');
    });

    it('should have field mappings for database', () => {
      expect(ExaminationFormModel.fieldMappings).toBeDefined();
      expect(ExaminationFormModel.fieldMappings.id).toBe('id');
      expect(ExaminationFormModel.fieldMappings.title).toBe('title');
      expect(ExaminationFormModel.fieldMappings.createdAt).toBe('created_at');
      expect(ExaminationFormModel.fieldMappings.updatedAt).toBe('updated_at');
    });
  });
});

describe('ExaminationFormEntryModel', () => {
  let formEntry: ExaminationFormEntryModel;
  const mockData = {
    formId: 'exam-form-123',
    clientId: 'client-456',
    therapistId: 'therapist-789',
    therapistName: 'Доктор Иванов',
    data: { examination: 'data' },
  };

  beforeEach(() => {
    formEntry = new ExaminationFormEntryModel(mockData);
  });

  describe('Constructor', () => {
    it('should create examination form entry with provided data', () => {
      expect(formEntry.formId).toBe('exam-form-123');
      expect(formEntry.clientId).toBe('client-456');
      expect(formEntry.therapistId).toBe('therapist-789');
      expect(formEntry.therapistName).toBe('Доктор Иванов');
      expect(formEntry.data).toEqual({ examination: 'data' });
    });

    it('should set default values for timestamps', () => {
      const newEntry = new ExaminationFormEntryModel({
        formId: 'form-def',
        clientId: 'client-ghi',
      });
      
      expect(newEntry.submissionDate).toBeInstanceOf(Date);
      expect(newEntry.createdAt).toBeInstanceOf(Date);
      expect(newEntry.updatedAt).toBeInstanceOf(Date);
    });

    it('should preserve provided timestamps', () => {
      const submissionDate = new Date('2023-05-15');
      const createdAt = new Date('2023-05-10');
      const updatedAt = new Date('2023-05-12');
      
      const entryWithDates = new ExaminationFormEntryModel({
        formId: 'form-jkl',
        clientId: 'client-mno',
        submissionDate,
        createdAt,
        updatedAt,
      });

      expect(entryWithDates.submissionDate).toBe(submissionDate);
      expect(entryWithDates.createdAt).toBe(createdAt);
      expect(entryWithDates.updatedAt).toBe(updatedAt);
    });

    it('should handle optional properties', () => {
      const minimalEntry = new ExaminationFormEntryModel({
        formId: 'form-min',
        clientId: 'client-min',
      });

      expect(minimalEntry.therapistId).toBeUndefined();
      expect(minimalEntry.therapistName).toBeUndefined();
      expect(minimalEntry.data).toBeUndefined();
    });
  });

  describe('Static Properties', () => {
    it('should have correct table name', () => {
      expect(ExaminationFormEntryModel.tableName).toBe('form_entries');
    });

    it('should have field mappings for database', () => {
      expect(ExaminationFormEntryModel.fieldMappings).toBeDefined();
      expect(ExaminationFormEntryModel.fieldMappings.id).toBe('id');
      expect(ExaminationFormEntryModel.fieldMappings.formId).toBe('form_id');
      expect(ExaminationFormEntryModel.fieldMappings.clientId).toBe('client_id');
      expect(ExaminationFormEntryModel.fieldMappings.therapistId).toBe('therapist_id');
      expect(ExaminationFormEntryModel.fieldMappings.submissionDate).toBe('submission_date');
      expect(ExaminationFormEntryModel.fieldMappings.createdAt).toBe('created_at');
      expect(ExaminationFormEntryModel.fieldMappings.updatedAt).toBe('updated_at');
    });
  });

  describe('Data Handling', () => {
    it('should preserve complex data structures', () => {
      const complexData = {
        sections: [
          { id: 1, answers: ['answer1', 'answer2'] },
          { id: 2, score: 85, notes: 'Good progress' },
        ],
        metadata: {
          duration: 45,
          difficulty: 'medium',
        },
      };

      const entry = new ExaminationFormEntryModel({
        formId: 'form-complex',
        clientId: 'client-complex',
        data: complexData,
      });

      expect(entry.data).toEqual(complexData);
      expect(entry.data.sections).toHaveLength(2);
      expect(entry.data.metadata.duration).toBe(45);
    });
  });
});