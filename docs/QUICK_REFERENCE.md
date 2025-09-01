# Reki Quick Reference Guide
## Cosyma Unified Info-System - Краткое руководство

### 🚀 Quick Start
1. **Login** → Navigate to Reki URL → Enter credentials
2. **Dashboard** → Overview of system status and recent activity
3. **Navigate** → Use sidebar to access different sections

---

### 📍 Main Navigation Tabs

| Tab | Russian | Purpose | Key Features |
|-----|---------|---------|--------------|
| 🏠 **Dashboard** | Панель управления | System overview | Statistics, quick forms access, recent activity |
| 🔧 **Devices** | Устройства | Equipment management | Track location, status, maintenance |
| 👥 **Clients** | Клиенты | Patient management | Personal info, treatment status, history |
| 📋 **Forms** | Формы | Assessments | LFK and FIM evaluations |
| ⚙️ **Settings** | Настройки | Configuration | *(Coming Soon)* |

---

### 🔧 Device Statuses

| Status | Russian | Meaning | Color |
|--------|---------|---------|-------|
| **REGISTERED** | Зарегистрировано | Newly added to system | Gray |
| **IN_STOCK** | На складе | Available for deployment | Blue |
| **AT_CLINIC** | В клинике | Active at facility | Green |
| **AT_PATIENT_HOME** | У пациента дома | Deployed to patient | Orange |
| **UNDER_SERVICE** | На обслуживании | Being repaired | Purple |
| **RMA** | Возврат | Return/defective | Red |
| **DECOMMISSIONED** | Списано | Permanently retired | Gray |

---

### 👥 Client Statuses

| Status | Russian | Meaning | Duration |
|--------|---------|---------|----------|
| **INTAKE** | Прием | Initial registration | 1-2 days |
| **DIAGNOSTICS** | Диагностика | Assessment phase | 3-7 days |
| **ACTIVE_THERAPY** | Активная терапия | Receiving treatment | Weeks-months |
| **PAUSED** | Приостановлено | Treatment on hold | Variable |
| **DISCHARGED** | Выписан | Treatment completed | Permanent |
| **FOLLOWUP** | Наблюдение | Post-treatment monitoring | 1-6 months |
| **ARCHIVED** | Архивировано | Historical record | Permanent |

---

### 📋 Assessment Forms

#### LFK Assessment (Осмотр ЛФК)
**Purpose**: Physical therapy examination
- **Tab 1**: Examination & Motor Skills (Осмотр и двигательные навыки)
- **Tab 2**: Gait & Limb Positioning (Походка / установка конечностей)  
- **Tab 3**: Therapy Plan & Goals (План терапии / задачи)

#### FIM Assessment
**Purpose**: Functional Independence Measure
- Self-care activities
- Mobility and transfers
- Communication abilities
- Social cognition

---

### ⚡ Quick Actions

#### Add New Items
- **Device**: Devices → "+" → Fill serial, model, location → Save
- **Client**: Clients → "+" → Fill name, DOB, diagnosis → Save
- **Assessment**: Forms → "New Form" → Select client & type → Complete

#### Common Updates
- **Device Location**: Devices → Edit → Update "Current Location" → Save
- **Client Status**: Clients → Edit → Change status dropdown → Save
- **Device Status**: Devices → "Status" dropdown → Select new status

#### Quick Navigation
- **Client Forms**: Clients → Find client → "Forms" button
- **Dashboard Stats**: Click any statistic card to view details
- **Recent Activity**: Dashboard → Scroll to activity section

---

### 🔍 Search & Filter

#### Search Tips
- **Devices**: Search by serial number or model
- **Clients**: Search by name or diagnosis
- **Forms**: Filter by client, form type, or date

#### Shortcuts
- `Ctrl+F` → Browser search within current page
- Click column headers → Sort table data
- Use pagination → Navigate large datasets

---

### 🎯 Daily Workflow Checklist

#### Morning Setup
- [ ] Check Dashboard statistics
- [ ] Review devices needing attention (UNDER_SERVICE)
- [ ] Check clients due for assessments
- [ ] Review recent activity for any issues

#### Patient Intake Process
- [ ] Add new client (status: INTAKE)
- [ ] Complete initial assessment form
- [ ] Update client status to DIAGNOSTICS
- [ ] Assign device if needed (update to AT_PATIENT_HOME)

#### Equipment Management
- [ ] Update device locations when moved
- [ ] Change status when devices go to maintenance
- [ ] Verify clinic devices are marked AT_CLINIC
- [ ] Process any returned devices (IN_STOCK)

#### End of Day
- [ ] Complete any pending assessments
- [ ] Update client statuses as needed
- [ ] Review device deployment status
- [ ] Check for any error messages or issues

---

### 🆘 Emergency Contacts

- **System Administrator**: [Contact Info]
- **Technical Support**: [Contact Info]
- **Training Questions**: [Contact Info]

---

### 💡 Pro Tips

1. **Save Frequently**: Forms auto-save, but click "Save" to ensure data is preserved
2. **Use Search**: Large datasets? Use the search function instead of scrolling
3. **Status Updates**: Keep device and client statuses current for accurate reporting
4. **Dashboard First**: Start each session with Dashboard to see what needs attention
5. **Bulk Operations**: Select multiple items when possible for efficiency

---

### 🐛 Common Issues & Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Form won't load | Refresh page, check internet |
| Can't save changes | Check required fields, refresh page |
| Missing client data | Check permissions, use search |
| Device status won't update | Verify permissions, retry |
| Page loading slowly | Clear browser cache |

---

*Print this page and keep it handy for quick reference!*

For detailed instructions, see:
- [Full User Guide](./USER_GUIDE.md) (English)
- [Полное руководство пользователя](./РУКОВОДСТВО_ПОЛЬЗОВАТЕЛЯ.md) (Russian)