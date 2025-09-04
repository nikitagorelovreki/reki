export const FORM_TEMPLATES = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'FIM Assessment',
    title: 'Functional Independence Measure',
    description: 'Comprehensive functional assessment tool',
    category: 'assessment',
    fields: [
      { id: 'motor_score', name: 'Motor Score', type: 'number', required: true },
      { id: 'cognitive_score', name: 'Cognitive Score', type: 'number', required: true },
      { id: 'total_score', name: 'Total Score', type: 'number', required: false }
    ],
    isActive: true,
    version: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'LFK Examination',
    title: 'Лечебная физкультура - обследование',
    description: 'Assessment for therapeutic physical exercise',
    category: 'evaluation',
    fields: [
      { id: 'flexibility', name: 'Flexibility', type: 'number', required: true },
      { id: 'strength', name: 'Strength', type: 'number', required: true },
      { id: 'endurance', name: 'Endurance', type: 'number', required: true },
      { id: 'progress_score', name: 'Progress Score', type: 'number', required: false }
    ],
    isActive: true,
    version: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Progress Evaluation',
    title: 'Patient Progress Evaluation',
    description: 'Regular progress tracking form',
    category: 'feedback',
    fields: [
      { id: 'progress_score', name: 'Progress Score', type: 'number', required: true },
      { id: 'notes', name: 'Notes', type: 'text', required: false }
    ],
    isActive: true,
    version: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];
