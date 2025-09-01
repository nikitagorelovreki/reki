# CUIS Documentation
## Cosyma Unified Info-System

Welcome to the CUIS documentation center. This directory contains all user-facing documentation for the Cosyma Unified Info-System.

## 📚 Documentation Index

### 👨‍💼 For End Users
- **[📖 User Guide (English)](USER_GUIDE.md)** - Complete user documentation with detailed explanations
- **[📖 Руководство пользователя (Русский)](РУКОВОДСТВО_ПОЛЬЗОВАТЕЛЯ.md)** - Полная документация пользователя на русском языке
- **[⚡ Quick Reference](QUICK_REFERENCE.md)** - Printable quick reference guide for daily tasks

### 👨‍💻 For Developers & Administrators
- **[🔗 Flower Form Integration](flower-form-integration.md)** - Technical integration documentation
- **[📋 Main README](../README.md)** - Project setup and technical overview
- **[🌐 API Documentation](http://localhost:3002/api/docs)** - Swagger API docs (requires running server)

---

## 🎯 What is CUIS?

CUIS (Cosyma Unified Info-System) is a comprehensive healthcare management platform that provides:

### Core Functionality
- **Device Management** - Track medical equipment across locations
- **Patient Management** - Manage client information and treatment status  
- **Assessment Forms** - Standardized LFK and FIM evaluations
- **Real-time Dashboard** - System overview and activity monitoring

### Main Interface Tabs

| Tab | Purpose | What You Can Do |
|-----|---------|-----------------|
| 🏠 **Dashboard** | System overview | View statistics, quick access to forms, monitor activity |
| 🔧 **Devices** | Equipment tracking | Add/edit devices, update locations, change status |
| 👥 **Clients** | Patient management | Manage patient info, track treatment progress |
| 📋 **Forms** | Assessments | Create LFK/FIM evaluations, view history |
| ⚙️ **Settings** | Configuration | System settings *(coming soon)* |

---

## 🚀 Getting Started

### For New Users
1. Start with the **[User Guide](USER_GUIDE.md)** for comprehensive instructions
2. Print the **[Quick Reference](QUICK_REFERENCE.md)** for your desk
3. If you speak Russian, use the **[Russian User Guide](РУКОВОДСТВО_ПОЛЬЗОВАТЕЛЯ.md)**

### For Administrators
1. Review the **[Main README](../README.md)** for system setup
2. Check **[Flower Form Integration](flower-form-integration.md)** for form system details
3. Access **[API Documentation](http://localhost:3002/api/docs)** for technical integration

---

## 📋 Assessment Forms Overview

### LFK Assessment (Осмотр ЛФК)
Physical therapy examination with three main sections:
- Motor skills evaluation
- Gait and limb positioning analysis  
- Therapy planning and goal setting

### FIM Assessment 
Functional Independence Measure evaluating:
- Daily living activities
- Mobility and transfers
- Communication skills
- Social cognition

---

## 🎨 System Design

CUIS is built with a modern, user-friendly interface featuring:
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Intuitive Navigation** - Clear sidebar with recognizable icons
- **Real-time Updates** - Live statistics and activity feeds
- **Accessibility** - Designed for healthcare professionals of all technical levels

---

## 🔧 Technical Architecture

The system is built using:
- **Frontend**: React with Ant Design components
- **Backend**: NestJS with PostgreSQL database
- **Architecture**: Clean architecture with domain-driven design
- **Deployment**: Docker containers with Turbo monorepo

---

## 📞 Support

### For Users
- System functionality questions → See User Guide
- Technical issues → Contact your facility's system administrator
- Training needs → Contact your supervisor

### For Developers
- Technical questions → See integration documentation
- API usage → Check Swagger documentation
- System setup → See main README

---

## 📈 System Requirements

### For Users
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- User credentials from administrator

### For Deployment
- Node.js environment
- PostgreSQL database
- Docker (optional)

---

*This documentation is maintained alongside the CUIS codebase. For the latest updates, check the repository.*