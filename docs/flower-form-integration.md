# Flower Form Integration

This document describes the integration of the Flower Form project into the main CUIS (Cosyma Unified Info-system) application.

## Overview

Flower Form is a standalone web application for creating and managing patient assessment forms, specifically LFK (physical therapy) examinations and FIM (Functional Independence Measure) assessments. The integration allows these forms to be used within the CUIS application, with data stored in the main database.

## Architecture

The integration follows these key principles:

1. **Minimal changes to Flower Form**: The original Flower Form code remains largely unchanged, with only a small adapter script added to facilitate communication with the parent application.
2. **Domain-driven design**: The forms and submissions are modeled as domain entities with clear interfaces.
3. **JSON data storage**: Form data is stored as JSON in the database, allowing for flexible schema evolution without requiring database migrations for each form change.

## Components

### Backend

1. **Domain Models**:
   - `Form`: Represents a form template (LFK or FIM)
   - `FormSubmission`: Represents a completed form for a specific client

2. **Repositories**:
   - `FormRepository`: Manages form templates
   - `FormSubmissionRepository`: Manages form submissions

3. **Services**:
   - `FormService`: Business logic for form templates
   - `FormSubmissionService`: Business logic for form submissions

4. **API Endpoints**:
   - `/forms`: CRUD operations for form templates
   - `/form-submissions`: CRUD operations for form submissions

### Frontend

1. **API Client**:
   - `forms.ts`: Client-side API for forms and submissions

2. **Components**:
   - `FlowerFormIntegration`: React component that embeds the Flower Form in an iframe

3. **Pages**:
   - `FormsPage`: Page for managing forms and submissions

4. **Static Files**:
   - `/public/flower-form/`: Contains the Flower Form static files
   - `/public/flower-form/js/integration-adapter.js`: Adapter script for communication between Flower Form and CUIS

## Database Schema

Two new tables are added to the database:

1. **forms**:
   - `id`: UUID primary key
   - `name`: Form name
   - `type`: Form type (lfk or fim)
   - `description`: Form description
   - `created_at`: Creation timestamp
   - `updated_at`: Last update timestamp

2. **form_submissions**:
   - `id`: UUID primary key
   - `form_id`: Foreign key to forms table
   - `client_id`: Foreign key to patients table
   - `therapist_id`: Foreign key to users table (optional)
   - `therapist_name`: Name of the therapist (optional)
   - `submission_date`: Date of form submission
   - `data`: JSON data containing the form values
   - `created_at`: Creation timestamp
   - `updated_at`: Last update timestamp

## Communication Flow

1. User navigates to a client's forms page
2. User selects a form type (LFK or FIM)
3. The `FlowerFormIntegration` component loads the Flower Form in an iframe
4. The parent application sends initialization data to the iframe via `postMessage`
5. User fills out the form
6. When the user clicks "Save", the form data is sent back to the parent application via `postMessage`
7. The parent application saves the form data to the database via the API

## Usage

### Accessing Forms

Forms can be accessed in two ways:

1. From the main navigation menu: Click on "Forms" to see all forms and submissions
2. From the client details page: Click on "Forms" button in the client list to see forms for a specific client

### Creating a New Form Submission

1. Navigate to a client's forms page
2. Click "New Form" button
3. Select the form type (LFK or FIM)
4. Fill out the form
5. Click "Save" to submit the form

### Viewing Form Submissions

1. Navigate to the Forms page
2. Select a client from the sidebar (if not already selected)
3. Select a form type from the sidebar
4. View the list of submissions for that client and form type
5. Click on a submission to view its details

## Development

### Adding a New Form Type

1. Add the new form type to the `FormType` enum in `examination.model.ts`
2. Create the form template in the database
3. Update the Flower Form to support the new form type
4. Update the integration adapter to handle the new form type

### Modifying Existing Forms

The Flower Form project can be modified independently. The integration will continue to work as long as the form data structure remains compatible.

## Troubleshooting

### Form Not Loading

- Check that the Flower Form static files are correctly placed in the `/public/flower-form/` directory
- Check that the integration adapter script is correctly loaded in the Flower Form HTML

### Form Data Not Saving

- Check that the form data is correctly formatted as JSON
- Check that the client ID and form ID are correctly passed to the API
- Check that the database connection is working

## Future Improvements

1. Add support for offline form filling with synchronization when online
2. Add form versioning to track changes over time
3. Add support for form templates created by users
4. Add support for exporting form data to PDF or Excel
