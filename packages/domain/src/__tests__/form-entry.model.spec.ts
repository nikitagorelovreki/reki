import { FormEntryModel, FormEntryStatus } from '../models/form-entry.model';

describe('FormEntryModel', () => {
  let formEntry: FormEntryModel;
  const mockFormEntryData = {
    formId: 'form-123',
    patientId: 'patient-456',
    data: { field1: 'value1', field2: 'value2' },
  };

  beforeEach(() => {
    formEntry = new FormEntryModel(mockFormEntryData);
  });

  describe('Constructor', () => {
    it('should create form entry with provided data', () => {
      expect(formEntry.formId).toBe('form-123');
      expect(formEntry.patientId).toBe('patient-456');
      expect(formEntry.data).toEqual({ field1: 'value1', field2: 'value2' });
    });

    it('should generate UUID if no id provided', () => {
      const newEntry = new FormEntryModel({ formId: 'form-456' });
      expect(newEntry.id).toBeDefined();
      expect(typeof newEntry.id).toBe('string');
      expect(newEntry.id.length).toBeGreaterThan(0);
    });

    it('should set default values', () => {
      const newEntry = new FormEntryModel({ formId: 'form-789' });
      
      expect(newEntry.formId).toBe('form-789');
      expect(newEntry.status).toBe(FormEntryStatus.IN_PROGRESS);
      expect(newEntry.data).toEqual({});
      expect(newEntry.createdAt).toBeInstanceOf(Date);
      expect(newEntry.updatedAt).toBeInstanceOf(Date);
    });

    it('should preserve provided values over defaults', () => {
      const customEntry = new FormEntryModel({
        formId: 'form-abc',
        patientId: 'patient-def',
        deviceId: 'device-ghi',
        clinicId: 'clinic-jkl',
        status: FormEntryStatus.COMPLETED,
        data: { custom: 'data' },
        score: 85,
        completedAt: new Date('2023-06-01'),
        createdBy: 'user-123',
        updatedBy: 'user-456',
      });

      expect(customEntry.formId).toBe('form-abc');
      expect(customEntry.patientId).toBe('patient-def');
      expect(customEntry.deviceId).toBe('device-ghi');
      expect(customEntry.clinicId).toBe('clinic-jkl');
      expect(customEntry.status).toBe(FormEntryStatus.COMPLETED);
      expect(customEntry.data).toEqual({ custom: 'data' });
      expect(customEntry.score).toBe(85);
      expect(customEntry.completedAt).toBeInstanceOf(Date);
      expect(customEntry.createdBy).toBe('user-123');
      expect(customEntry.updatedBy).toBe('user-456');
    });
  });

  describe('update', () => {
    it('should update form entry properties', () => {
      const originalUpdatedAt = formEntry.updatedAt;
      const updateData = {
        data: { updatedField: 'updatedValue' },
        score: 90,
        updatedBy: 'user-789',
      };

      formEntry.update(updateData);

      expect(formEntry.data).toEqual({ updatedField: 'updatedValue' });
      expect(formEntry.score).toBe(90);
      expect(formEntry.updatedBy).toBe('user-789');
      expect(formEntry.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

    it('should only update provided properties', () => {
      const originalData = formEntry.data;
      const originalFormId = formEntry.formId;
      
      formEntry.update({ score: 75 });
      
      expect(formEntry.score).toBe(75);
      expect(formEntry.data).toBe(originalData);
      expect(formEntry.formId).toBe(originalFormId);
    });

    it('should always update the updatedAt timestamp', () => {
      const originalUpdatedAt = formEntry.updatedAt;
      
      formEntry.update({});
      
      expect(formEntry.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('complete', () => {
    it('should complete form entry without score', () => {
      const originalUpdatedAt = formEntry.updatedAt;
      
      formEntry.complete();
      
      expect(formEntry.status).toBe(FormEntryStatus.COMPLETED);
      expect(formEntry.completedAt).toBeInstanceOf(Date);
      expect(formEntry.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
      expect(formEntry.score).toBeUndefined();
    });

    it('should complete form entry with score', () => {
      const score = 85;
      
      formEntry.complete(score);
      
      expect(formEntry.status).toBe(FormEntryStatus.COMPLETED);
      expect(formEntry.completedAt).toBeInstanceOf(Date);
      expect(formEntry.score).toBe(score);
    });

    it('should update timestamps when completing', () => {
      const originalUpdatedAt = formEntry.updatedAt;
      
      formEntry.complete(92);
      
      expect(formEntry.completedAt).toBeInstanceOf(Date);
      expect(formEntry.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

    it('should handle zero score', () => {
      formEntry.complete(0);
      
      expect(formEntry.status).toBe(FormEntryStatus.COMPLETED);
      expect(formEntry.score).toBe(0);
    });
  });

  describe('cancel', () => {
    it('should cancel form entry', () => {
      const originalUpdatedAt = formEntry.updatedAt;
      
      formEntry.cancel();
      
      expect(formEntry.status).toBe(FormEntryStatus.CANCELLED);
      expect(formEntry.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

    it('should not affect completedAt when cancelling', () => {
      expect(formEntry.completedAt).toBeUndefined();
      
      formEntry.cancel();
      
      expect(formEntry.completedAt).toBeUndefined();
    });

    it('should not affect score when cancelling', () => {
      formEntry.score = 75;
      
      formEntry.cancel();
      
      expect(formEntry.score).toBe(75);
      expect(formEntry.status).toBe(FormEntryStatus.CANCELLED);
    });
  });

  describe('Static Properties', () => {
    it('should have correct table name', () => {
      expect(FormEntryModel.tableName).toBe('form_entries');
    });

    it('should have field mappings for database', () => {
      expect(FormEntryModel.fieldMappings).toBeDefined();
      expect(FormEntryModel.fieldMappings.id).toBe('id');
      expect(FormEntryModel.fieldMappings.formId).toBe('form_id');
      expect(FormEntryModel.fieldMappings.patientId).toBe('patient_id');
      expect(FormEntryModel.fieldMappings.createdAt).toBe('created_at');
      expect(FormEntryModel.fieldMappings.updatedAt).toBe('updated_at');
    });
  });

  describe('Status Transitions', () => {
    it('should allow transition from IN_PROGRESS to COMPLETED', () => {
      expect(formEntry.status).toBe(FormEntryStatus.IN_PROGRESS);
      
      formEntry.complete(88);
      
      expect(formEntry.status).toBe(FormEntryStatus.COMPLETED);
    });

    it('should allow transition from IN_PROGRESS to CANCELLED', () => {
      expect(formEntry.status).toBe(FormEntryStatus.IN_PROGRESS);
      
      formEntry.cancel();
      
      expect(formEntry.status).toBe(FormEntryStatus.CANCELLED);
    });

    it('should allow completing already completed entry', () => {
      formEntry.complete(90);
      expect(formEntry.status).toBe(FormEntryStatus.COMPLETED);
      
      // Should be able to update score
      formEntry.complete(95);
      
      expect(formEntry.status).toBe(FormEntryStatus.COMPLETED);
      expect(formEntry.score).toBe(95);
    });
  });
});