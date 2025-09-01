# Frontend Components Guide

## Overview

The Reki frontend is built with React and TypeScript, using Ant Design (antd) as the UI component library. The application follows a modular component architecture with clear separation of concerns.

## Technology Stack

- **React 18** with TypeScript
- **Ant Design (antd)** for UI components
- **React Router** for navigation
- **Axios** for API communications
- **Chart.js** for data visualization
- **Day.js** for date handling
- **Vite** for build tooling

## Component Architecture

```
src/
├── components/           # Reusable UI components
│   ├── Layout/          # Application layout components
│   └── FlowerForm/      # Form-related components
├── pages/               # Page-level components (routes)
├── api/                 # API client modules
├── types/               # TypeScript type definitions
└── assets/              # Static assets
```

## Layout Components

### MainLayout

**File**: `components/Layout/MainLayout.tsx`

**Purpose**: Primary application layout with navigation sidebar and header.

**Key Features**:

- Collapsible sidebar navigation
- User authentication status
- Route-based menu highlighting
- Responsive design

**Props**:

```typescript
interface MainLayoutProps {
  children: React.ReactNode;
}
```

**Menu Structure**:

- Dashboard (`/dashboard`)
- Devices (`/devices`) - Device management
- Clients (`/clients`) - Patient management
- Forms (`/forms`) - Form and assessment management
- Settings (`/settings`) - Application settings

**Usage**:

```jsx
<MainLayout>
  <YourPageComponent />
</MainLayout>
```

## Form Components

### FlowerFormIntegration

**File**: `components/FlowerFormIntegration.tsx`

**Purpose**: Embeds the standalone Flower Form application within the React app using iframe.

**Key Features**:

- Iframe-based integration with postMessage communication
- Bidirectional data exchange with parent application
- Loading states and error handling
- Support for different form types (LFK, FIM)

**Props**:

```typescript
interface FlowerFormIntegrationProps {
  clientId?: string;
  formType?: 'lfk' | 'fim' | 'patients';
  onFormSubmit?: (data: any) => void;
}
```

### NativeFlowerForm

**File**: `components/FlowerForm/NativeFlowerForm.tsx`

**Purpose**: Native React implementation of form functionality as an alternative to iframe integration.

**Key Features**:

- Tabbed interface for different form sections
- Support for LFK and FIM form types
- Form validation and data management
- Integration with backend API

**Props**:

```typescript
interface NativeFlowerFormProps {
  clientId: string;
  formType?: 'lfk' | 'fim';
  onSubmit?: (data: any) => void;
  onClose?: () => void;
}
```

### LFKExamForm

**File**: `components/FlowerForm/LFKExamForm.tsx`

**Purpose**: Specialized component for LFK (physical therapy) examination forms.

**Key Features**:

- Structured form sections for physical assessment
- Checkbox groups for multi-select options
- Text areas for notes and observations
- Progress tracking and validation

### FIMForm

**File**: `components/FlowerForm/FIMForm.tsx`

**Purpose**: Specialized component for FIM (Functional Independence Measure) assessment forms.

**Key Features**:

- Chart.js integration for radar charts
- Scoring system for functional assessments
- Data visualization of patient progress
- Export and print functionality

**Dependencies**:

```typescript
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
```

### FormViewer

**File**: `components/FlowerForm/FormViewer.tsx`

**Purpose**: Display and review completed form submissions.

**Key Features**:

- Read-only form data display
- Historical submission viewing
- Support for multiple form formats

### FlowerFormButton

**File**: `components/FlowerForm/FlowerFormButton.tsx`

**Purpose**: Reusable button component for launching form interfaces.

**Props**:

```typescript
interface FlowerFormButtonProps {
  formType: 'lfk' | 'fim';
  clientId: string;
  onFormSubmit?: (data: any) => void;
  displayMode?: 'modal' | 'drawer' | 'page';
}
```

## Page Components

### Pages Structure

```
pages/
├── Clients/            # Client management pages
├── Dashboard/          # Dashboard and overview pages
├── Devices/            # Device management pages
└── Forms/              # Form management pages
```

Each page directory typically contains:

- `index.tsx` - Main page component
- `components/` - Page-specific components
- `hooks/` - Page-specific custom hooks (if applicable)

## API Client Architecture

### Base API Client

**File**: `api/client.ts`

**Purpose**: Configured Axios instance with interceptors for authentication and error handling.

**Features**:

- Automatic token injection for authenticated requests
- Global error handling for 401 responses
- Base URL configuration
- Request/response interceptors

### API Modules

#### Clients API (`api/clients.ts`)

**Available Methods**:

```typescript
const clientsApi = {
  getAll(params?: PaginationParams): Promise<PaginatedResponse<Client>>;
  getById(id: string): Promise<Client>;
  search(query: string, params?: PaginationParams): Promise<PaginatedResponse<Client>>;
  getByClinic(clinicId: string, params?: PaginationParams): Promise<PaginatedResponse<Client>>;
  getByStatus(status: ClientStatus, params?: PaginationParams): Promise<PaginatedResponse<Client>>;
  create(data: CreateClientDto): Promise<Client>;
  update(id: string, data: Partial<CreateClientDto>): Promise<Client>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: ClientStatus): Promise<Client>;
}
```

#### Devices API (`api/devices.ts`)

**Available Methods**:

```typescript
const devicesApi = {
  getAll(params?: PaginationParams): Promise<PaginatedResponse<Device>>;
  getById(id: string): Promise<Device>;
  getBySerial(serial: string): Promise<Device>;
  getByClinic(clinicId: string, params?: PaginationParams): Promise<PaginatedResponse<Device>>;
  getByStatus(status: DeviceStatus, params?: PaginationParams): Promise<PaginatedResponse<Device>>;
  create(data: CreateDeviceDto): Promise<Device>;
  update(id: string, data: Partial<CreateDeviceDto>): Promise<Device>;
  delete(id: string): Promise<void>;
  assignPatient(deviceId: string, patientId: string): Promise<Device>;
  unassignPatient(deviceId: string): Promise<Device>;
}
```

#### Forms API (`api/forms.ts`)

**Available Methods**:

```typescript
// Form Templates
export const getForms: (page?: number, limit?: number) => Promise<PaginatedResponse<Form>>;
export const getFormsByType: (type: 'lfk' | 'fim', page?: number, limit?: number) => Promise<PaginatedResponse<Form>>;
export const createForm: (data: any) => Promise<Form>;

// Form Submissions
export const getFormSubmissions: (params?: any) => Promise<PaginatedResponse<FormSubmission>>;
export const createFormSubmission: (data: any) => Promise<FormSubmission>;
export const importFlowerFormData: (data: any) => Promise<any>;
```

## Component Patterns

### Standard Component Structure

```typescript
// Component interface
interface ComponentProps {
  // Required props
  id: string;
  // Optional props
  className?: string;
  onAction?: (data: any) => void;
}

// Component implementation
const Component: React.FC<ComponentProps> = ({
  id,
  className,
  onAction
}) => {
  // State management
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // Effect hooks
  useEffect(() => {
    // Component initialization
  }, []);

  // Event handlers
  const handleAction = useCallback((actionData: any) => {
    onAction?.(actionData);
  }, [onAction]);

  return (
    <div className={className}>
      {/* Component JSX */}
    </div>
  );
};

export default Component;
```

### Data Fetching Pattern

```typescript
// Custom hook for data fetching
const useEntityData = (id: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiClient.getById(id);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading, error };
};
```

## Form Integration Patterns

### PostMessage Communication

The Flower Form integration uses the browser's postMessage API for secure cross-frame communication:

```typescript
// Sending data to iframe
const sendDataToForm = (data: any) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage(
      {
        type: 'INIT_FORM',
        payload: data,
      },
      '*'
    );
  }
};

// Receiving data from iframe
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'FORM_SUBMIT') {
      handleFormSubmit(event.data.payload);
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);
```

### Form Data Handling

Form data is structured as JSON objects with flexible schemas:

```typescript
// LFK Form Data Structure
interface LFKFormData {
  patient_info: {
    name: string;
    age: number;
    diagnosis: string;
  };
  assessment: {
    mobility_score: number;
    balance_score: number;
    coordination_score: number;
    notes: string;
  };
  therapy_plan: {
    goals: string[];
    exercises: Exercise[];
    duration_weeks: number;
  };
}

// FIM Form Data Structure
interface FIMFormData {
  assessment_date: string;
  therapist_name: string;
  scores: {
    motor_function: number;
    cognitive_function: number;
    communication: number;
    social_cognition: number;
  };
  total_score: number;
  notes: string;
}
```

## State Management

### Local State

Components use React's built-in state management:

```typescript
// Component state
const [clients, setClients] = useState<Client[]>([]);
const [loading, setLoading] = useState(false);
const [selectedClient, setSelectedClient] = useState<Client | null>(null);

// Complex state with reducer
const [state, dispatch] = useReducer(formReducer, initialState);
```

### Global State

For application-wide state, the system uses:

- Local Storage for user preferences and authentication
- Context API for theme and user information
- Props drilling for component communication

## Error Handling

### API Error Handling

```typescript
// Global error interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Component-level error handling
const [error, setError] = useState<string | null>(null);

try {
  await apiCall();
} catch (err) {
  setError(err.response?.data?.message || 'An error occurred');
}
```

### User Feedback

The application uses Ant Design's message system for user notifications:

```typescript
import { message } from 'antd';

// Success message
message.success('Operation completed successfully');

// Error message
message.error('Failed to save data');

// Loading message
const hide = message.loading('Processing...', 0);
// Later: hide();
```

## Styling Guidelines

### CSS Structure

The application uses a combination of:

- Ant Design's built-in theming system
- Custom CSS for specific styling needs
- CSS Modules for component-specific styles

### Theme Configuration

```typescript
// Ant Design theme customization
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
    // ... other theme tokens
  },
};
```

## Testing Patterns

### Component Testing

```typescript
// Jest + React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component id="test" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    const mockHandler = jest.fn();
    render(<Component id="test" onAction={mockHandler} />);

    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalledWith(expect.any(Object));
  });
});
```

## Best Practices

### Component Design

1. **Single Responsibility**: Each component has one clear purpose
2. **Prop Interfaces**: Always define TypeScript interfaces for props
3. **Default Props**: Use default parameters for optional props
4. **Memoization**: Use React.memo for performance optimization when needed

### Code Organization

1. **File Naming**: Use PascalCase for component files
2. **Directory Structure**: Group related components together
3. **Export Pattern**: Use default exports for components, named exports for utilities
4. **Import Organization**: Group imports by type (React, libraries, local)

### Performance

1. **Lazy Loading**: Use React.lazy for code splitting on routes
2. **Memo Usage**: Memoize expensive calculations and components
3. **Effect Dependencies**: Properly manage useEffect dependency arrays
4. **Bundle Size**: Monitor and optimize bundle size

## Development Workflow

### Adding New Components

1. Create component file in appropriate directory
2. Define TypeScript interfaces for props
3. Implement component with proper error handling
4. Add to parent component or route
5. Write unit tests if complex logic exists

### Form Integration

To integrate a new form type:

1. **Create Form Component**:

   ```typescript
   const NewFormComponent: React.FC<FormProps> = ({ clientId, onSubmit }) => {
     // Form implementation
   };
   ```

2. **Add to Form Router**:

   ```typescript
   // In NativeFlowerForm or similar
   const formComponents = {
     lfk: LFKExamForm,
     fim: FIMForm,
     newForm: NewFormComponent, // Add new form
   };
   ```

3. **Update API Integration**:
   ```typescript
   // Add to forms API
   export const createNewFormSubmission = async (data: NewFormData) => {
     const response = await apiClient.post('/form-entries', {
       formType: 'new_form',
       data,
     });
     return response.data;
   };
   ```

## Debugging and Development Tools

### Browser DevTools

- **React DevTools**: Component inspection and state debugging
- **Network Tab**: API request monitoring
- **Console**: Error logging and debugging

### Development Commands

```bash
# Start development server
npm run frontend:dev

# Build for production
npm run frontend:build

# Run linting
npm run lint

# Run tests
npm run test
```

This frontend documentation provides a comprehensive guide for understanding and working with the React-based user interface components in the Reki system.
