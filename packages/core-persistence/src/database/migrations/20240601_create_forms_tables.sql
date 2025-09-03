-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES users(id) ON DELETE SET NULL,
  therapist_name VARCHAR(255),
  submission_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_forms_type ON forms(type);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_client_id ON form_submissions(client_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_submission_date ON form_submissions(submission_date);

-- Insert default forms
INSERT INTO forms (id, name, type, description, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'LFK Examination', 'lfk', 'Physical therapy examination form for patient assessment', NOW(), NOW()),
  (gen_random_uuid(), 'FIM Assessment', 'fim', 'Functional Independence Measure assessment form', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
