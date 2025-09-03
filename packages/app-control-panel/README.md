# Reki Frontend

React-based user interface for the Reki Control Panel.

## Overview

This package contains the frontend application built with React, TypeScript, and Ant Design. It provides a comprehensive interface for managing medical devices, patients, and assessment forms.

## Technology Stack

- **React 18** with TypeScript
- **Ant Design (antd)** for UI components
- **React Router** for navigation
- **Axios** for API communication
- **Chart.js** for data visualization
- **Vite** for build tooling

## Getting Started

### Development

```bash
# Start development server
npm run frontend:dev

# Build for production
npm run frontend:build

# Run linting
npm run lint
```

### Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Layout/      # Application layout
│   └── FlowerForm/  # Form integration components
├── pages/           # Page-level components
├── api/             # API client modules
├── types/           # TypeScript types
└── assets/          # Static assets
```

## Features

- **Device Management**: CRUD operations for medical devices
- **Patient Management**: Comprehensive patient information system
- **Form Integration**: Embedded assessment forms (LFK, FIM)
- **Russian Localization**: Complete Russian language support
- **Responsive Design**: Mobile-friendly interface

## API Integration

The frontend communicates with the Reki API server running on port 3002. API configuration is handled in `src/api/config.ts`.

## For More Information

See the main [Reki Documentation](../../docs/README.md) for complete system documentation.
