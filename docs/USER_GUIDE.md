# Reki User Guide

## Reki Medical Device Management System - Control Panel

### Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Navigation & Main Tabs](#navigation--main-tabs)
4. [Dashboard](#dashboard)
5. [Devices Management](#devices-management)
6. [Clients Management](#clients-management)
7. [Forms & Assessments](#forms--assessments)
8. [Settings](#settings)
9. [Common Tasks](#common-tasks)
10. [Troubleshooting](#troubleshooting)

---

## Overview

Reki is a comprehensive control panel designed for healthcare facilities to manage medical devices, patients (clients), and assessment forms. The system helps streamline operations by providing a centralized platform for tracking equipment, managing patient information, and conducting standardized assessments.

### Key Features

- **Device Management**: Track medical devices across different locations and statuses
- **Patient Management**: Manage client information, status, and treatment progress
- **Assessment Forms**: Conduct LFK (Physical Therapy) and FIM (Functional Independence Measure) evaluations
- **Dashboard Overview**: Real-time statistics and activity monitoring

---

## Getting Started

### Accessing the System

1. Open your web browser and navigate to the Reki application URL
2. Log in with your credentials
3. You'll be automatically redirected to the Dashboard

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Login credentials provided by your system administrator

---

## Navigation & Main Tabs

The Reki control panel features a sidebar navigation with the following main sections:

### 🏠 Dashboard

Main overview page showing system statistics and recent activity

### 🔧 Devices

Manage medical devices, track their locations and status

### 👥 Clients

Manage patient information and treatment status

### 📋 Forms

Access assessment forms (LFK and FIM evaluations)

### ⚙️ Settings

System configuration (Coming Soon)

---

## Dashboard

The Dashboard provides a comprehensive overview of your system's current state.

### What You'll See

#### Statistics Cards

- **Total Devices**: Overview of all registered devices
- **Active Devices**: Currently deployed or in-use devices
- **Total Clients**: All registered patients/clients
- **Active Clients**: Clients currently receiving treatment

#### Quick Access Forms

- **LFK Assessment**: Physical therapy examination forms
- **FIM Assessment**: Functional Independence Measure forms

#### Recent Activity Tables

- **Recent Devices**: Latest device updates and status changes
- **Recent Clients**: Newly added or updated client records
- **Activity Feed**: System-wide activity log

#### Progress Indicators

- **Device Usage**: Percentage of devices currently active
- **Client Activity**: Treatment progress indicators

### How to Use the Dashboard

1. **View Statistics**: Monitor overall system health at a glance
2. **Quick Forms Access**: Click "Открыть форму" to quickly start an assessment
3. **Navigate to Details**: Click "View All" links to access detailed views
4. **Monitor Activity**: Check the activity feed for recent system changes

---

## Devices Management

The Devices section allows you to track and manage medical equipment throughout your facility.

### Device Statuses

| Status              | Description                       | Use Case                       |
| ------------------- | --------------------------------- | ------------------------------ |
| **REGISTERED**      | Device registered in system       | New devices added to inventory |
| **IN_STOCK**        | Available in warehouse/storage    | Ready for deployment           |
| **AT_CLINIC**       | Currently at the medical facility | In use for treatments          |
| **AT_PATIENT_HOME** | Deployed to patient's home        | Home therapy equipment         |
| **UNDER_SERVICE**   | Being repaired or maintained      | Temporarily unavailable        |
| **RMA**             | Return merchandise authorization  | Defective, being returned      |
| **DECOMMISSIONED**  | Permanently out of service        | End of device lifecycle        |

### Key Features

#### Device Information

- **Serial Number**: Unique device identifier
- **Model**: Device type and specifications
- **QR Code**: For quick scanning and identification
- **Current Location**: Physical location of the device
- **Telemetry Endpoint**: Data collection URL

#### Device Management Actions

1. **Add New Device**
   - Click the "+" button to register a new device
   - Fill in serial number, model, and initial location
   - Set appropriate status and telemetry endpoint

2. **Edit Device Information**
   - Click the "Edit" button next to any device
   - Update device details, location, or status
   - Save changes to update the record

3. **Change Device Status**
   - Use the "Status" dropdown to update device status
   - Select appropriate status based on device location/condition

4. **Delete Device**
   - Click "Delete" to permanently remove a device
   - Confirm the action when prompted

5. **Search & Filter**
   - Use the search bar to find devices by serial number or model
   - Filter by status or location

---

## Clients Management

The Clients section manages patient/client information and treatment status.

### Client Statuses

| Status             | Description                      | Typical Duration |
| ------------------ | -------------------------------- | ---------------- |
| **INTAKE**         | Initial registration             | 1-2 days         |
| **DIAGNOSTICS**    | Assessment and evaluation phase  | 3-7 days         |
| **ACTIVE_THERAPY** | Currently receiving treatment    | Weeks to months  |
| **PAUSED**         | Treatment temporarily suspended  | Variable         |
| **DISCHARGED**     | Treatment completed successfully | Permanent        |
| **FOLLOWUP**       | Post-treatment monitoring        | 1-6 months       |
| **ARCHIVED**       | Historical record                | Permanent        |

### Client Information Fields

- **Full Name**: Patient's complete name
- **First Name**: Given name
- **Date of Birth**: For age calculation and identification
- **Diagnosis**: Primary medical condition or reason for treatment
- **Status**: Current treatment phase
- **Contact Information**: Phone, email, address
- **Insurance Details**: Coverage information
- **Treatment History**: Previous assessments and forms

### Client Management Actions

1. **Add New Client**
   - Click the "+" button to register a new patient
   - Enter complete personal and medical information
   - Set initial status (usually "INTAKE")

2. **Edit Client Information**
   - Click "Edit" next to any client record
   - Update personal information, diagnosis, or status
   - Save changes to update the record

3. **View Forms**
   - Click the "Forms" button to see client's assessment history
   - Access LFK and FIM evaluations for that specific client

4. **Change Client Status**
   - Use status dropdown to update treatment phase
   - Track progress through the care continuum

5. **Search Clients**
   - Search by name, diagnosis, or other criteria
   - Filter by status or date ranges

---

## Forms & Assessments

The Forms section provides access to standardized assessment tools used in healthcare and rehabilitation.

### Available Form Types

#### 1. LFK Assessment (Осмотр ЛФК)

**Purpose**: Physical therapy examination for evaluating motor skills and movement capabilities

**Form Sections**:

- **1) Осмотр и двигательные навыки** (Examination & Motor Skills)
  - Head control assessment
  - Rolling over capabilities
  - Sitting and standing abilities
  - Motor coordination evaluation

- **2) Походка / установка конечностей** (Gait & Limb Positioning)
  - Walking pattern analysis
  - Limb positioning assessment
  - Balance and coordination testing

- **3) План терапии / задачи** (Therapy Plan & Goals)
  - Treatment objectives
  - Therapy goals and milestones
  - Recommended interventions

#### 2. FIM Assessment (Функциональная независимость)

**Purpose**: Functional Independence Measure for evaluating patient's ability to perform daily activities

**Assessment Areas**:

- Self-care activities
- Mobility and transfers
- Communication abilities
- Social cognition
- Independence levels

### How to Use Forms

#### Creating a New Assessment

1. **From Dashboard**:
   - Click "Открыть форму" on the LFK or FIM card
   - System will prompt you to select a client

2. **From Client Page**:
   - Navigate to Clients tab
   - Find the client you want to assess
   - Click the "Forms" button next to their name
   - Select "New Form" and choose form type

3. **From Forms Page**:
   - Go to Forms tab
   - Click "New Form" button
   - Select client and form type

#### Completing an Assessment

1. **Fill Out Form Sections**:
   - Navigate through tabs (for LFK: Examination → Gait → Therapy Plan)
   - Complete all relevant fields
   - Use checkboxes, dropdowns, and text areas as appropriate

2. **Save Progress**:
   - Forms auto-save as you work
   - You can return to complete them later

3. **Submit Form**:
   - Click "Save" when assessment is complete
   - Form is permanently stored in the client's record

#### Viewing Assessment History

1. Navigate to Forms section
2. Select a client from the sidebar
3. Choose form type (LFK or FIM)
4. View list of all assessments for that client
5. Click on any submission to view detailed results

---

## Settings

**Status**: Coming Soon

This section will provide system configuration options for administrators.

---

## Common Tasks

### Daily Workflow Examples

#### Morning Device Check

1. Go to **Dashboard** → Review device statistics
2. Go to **Devices** → Check devices marked as "UNDER_SERVICE"
3. Update any devices that have been repaired
4. Verify all clinic devices are marked "AT_CLINIC"

#### New Patient Intake

1. Go to **Clients** → Click "+" to add new client
2. Enter complete patient information
3. Set status to "INTAKE"
4. Go to **Forms** → Create initial assessment (LFK or FIM)
5. Complete evaluation forms
6. Update client status to "DIAGNOSTICS" or "ACTIVE_THERAPY"

#### Equipment Deployment

1. Go to **Devices** → Find device with status "IN_STOCK"
2. Edit device → Update status to "AT_PATIENT_HOME"
3. Update location to patient's address
4. Go to **Clients** → Update client record with device information

#### Weekly Assessment Review

1. Go to **Dashboard** → Review Forms section
2. Check clients due for follow-up assessments
3. Go to **Forms** → Complete required evaluations
4. Update client status if treatment phase has changed

### Quick Reference Actions

| Task                   | Steps                                            |
| ---------------------- | ------------------------------------------------ |
| Add new device         | Devices → "+" → Fill form → Save                 |
| Update device location | Devices → Edit → Change location → Save          |
| Add new client         | Clients → "+" → Fill form → Save                 |
| Start assessment       | Forms → New Form → Select client/type → Complete |
| View client history    | Clients → Select client → Forms button           |
| Check system stats     | Dashboard → View statistics cards                |

---

## Troubleshooting

### Common Issues

#### Forms Not Loading

**Problem**: Assessment forms don't display properly
**Solution**:

1. Refresh the browser page
2. Check internet connection
3. Contact system administrator if issue persists

#### Device Status Not Updating

**Problem**: Device status changes don't save
**Solution**:

1. Verify you have appropriate permissions
2. Ensure required fields are completed
3. Try refreshing the page and updating again

#### Client Information Missing

**Problem**: Client data appears incomplete
**Solution**:

1. Check if you have permission to view all client fields
2. Verify client record wasn't archived
3. Use search function to locate client by different criteria

#### Can't Access Forms

**Problem**: Unable to create or view assessment forms
**Solution**:

1. Ensure client is selected before creating forms
2. Check that client status allows for assessments
3. Verify form type is appropriate for client's treatment phase

### Getting Help

If you encounter issues not covered in this guide:

1. Check with your facility's system administrator
2. Review the technical documentation in the repository
3. Contact technical support with specific error messages

### Browser Compatibility

- **Recommended**: Google Chrome, Mozilla Firefox (latest versions)
- **Supported**: Safari, Microsoft Edge
- **Note**: Internet Explorer is not supported

---

## System Access Levels

The Reki system supports different user roles with varying access levels:

- **Therapists**: Can manage clients and create assessments
- **Administrators**: Full system access including device management
- **Supervisors**: Can view all data and generate reports
- **Technical Staff**: Device management and system configuration

Contact your administrator to understand your specific access permissions.

---

_Last updated: [Current Date]_
_For technical documentation, see [README.md](../README.md) and [docs/flower-form-integration.md](./flower-form-integration.md)_
