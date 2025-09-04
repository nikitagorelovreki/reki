const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data generators
const generateDevice = (id) => ({
  id: id.toString(),
  serialNumber: `DEV-${1000 + id}`,
  model: ['Model-A', 'Model-B', 'Model-C'][id % 3],
  status: ['ACTIVE', 'INACTIVE', 'MAINTENANCE'][id % 3],
  location: `Location ${id}`,
  createdAt: new Date(Date.now() - id * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
});

const generateClient = (id) => ({
  id: id.toString(),
  name: `Client ${id}`,
  email: `client${id}@example.com`,
  phone: `+1-555-${String(id).padStart(4, '0')}`,
  status: ['ACTIVE', 'INACTIVE'][id % 2],
  address: `${id} Main Street, City, State`,
  createdAt: new Date(Date.now() - id * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
});

const generateForm = (id) => {
  const forms = [
    {
      id: '1',
      title: 'FIM',
      description: 'Functional Independence Measure - оценка функциональной независимости',
      status: 'ACTIVE',
      fields: [
        { name: 'eating', type: 'number', label: 'Прием пищи', required: true, min: 1, max: 7 },
        { name: 'grooming', type: 'number', label: 'Личная гигиена', required: true, min: 1, max: 7 },
        { name: 'bathing', type: 'number', label: 'Мытье', required: true, min: 1, max: 7 },
        { name: 'dressing_upper', type: 'number', label: 'Одевание (верх)', required: true, min: 1, max: 7 },
        { name: 'dressing_lower', type: 'number', label: 'Одевание (низ)', required: true, min: 1, max: 7 },
        { name: 'toileting', type: 'number', label: 'Туалет', required: true, min: 1, max: 7 },
      ],
      createdAt: '2025-09-01T10:00:00.000Z',
      updatedAt: '2025-09-01T10:00:00.000Z',
    },
    {
      id: '2',
      title: 'ЛФК',
      description: 'Лечебная физическая культура - оценка физических упражнений',
      status: 'ACTIVE',
      fields: [
        { name: 'exercise_duration', type: 'number', label: 'Продолжительность упражнений (мин)', required: true },
        { name: 'exercise_intensity', type: 'select', label: 'Интенсивность', required: true, options: ['Низкая', 'Средняя', 'Высокая'] },
        { name: 'pain_level', type: 'number', label: 'Уровень боли (1-10)', required: true, min: 1, max: 10 },
        { name: 'mobility_score', type: 'number', label: 'Оценка подвижности', required: true, min: 1, max: 10 },
        { name: 'notes', type: 'textarea', label: 'Примечания', required: false },
      ],
      createdAt: '2025-09-01T11:00:00.000Z',
      updatedAt: '2025-09-01T11:00:00.000Z',
    }
  ];
  
  return forms[id - 1] || forms[0];
};

const generateFormEntry = (id) => {
  const entries = [
    {
      id: '1',
      formId: '1', // FIM
      clientId: '1',
      data: {
        eating: 6,
        grooming: 5,
        bathing: 4,
        dressing_upper: 6,
        dressing_lower: 5,
        toileting: 6,
      },
      status: 'SUBMITTED',
      submittedAt: '2025-09-02T09:00:00.000Z',
      createdAt: '2025-09-02T09:00:00.000Z',
    },
    {
      id: '2',
      formId: '2', // ЛФК
      clientId: '1',
      data: {
        exercise_duration: 30,
        exercise_intensity: 'Средняя',
        pain_level: 3,
        mobility_score: 7,
        notes: 'Пациент показал хорошие результаты',
      },
      status: 'SUBMITTED',
      submittedAt: '2025-09-02T14:00:00.000Z',
      createdAt: '2025-09-02T14:00:00.000Z',
    },
    {
      id: '3',
      formId: '1', // FIM
      clientId: '2',
      data: {
        eating: 7,
        grooming: 6,
        bathing: 6,
        dressing_upper: 7,
        dressing_lower: 6,
        toileting: 7,
      },
      status: 'REVIEWED',
      submittedAt: '2025-09-03T10:00:00.000Z',
      createdAt: '2025-09-03T10:00:00.000Z',
    },
    {
      id: '4',
      formId: '2', // ЛФК
      clientId: '2',
      data: {
        exercise_duration: 45,
        exercise_intensity: 'Высокая',
        pain_level: 2,
        mobility_score: 8,
        notes: 'Отличный прогресс в упражнениях',
      },
      status: 'SUBMITTED',
      submittedAt: '2025-09-03T15:00:00.000Z',
      createdAt: '2025-09-03T15:00:00.000Z',
    },
    {
      id: '5',
      formId: '1', // FIM
      clientId: '3',
      data: {
        eating: 4,
        grooming: 3,
        bathing: 3,
        dressing_upper: 4,
        dressing_lower: 3,
        toileting: 4,
      },
      status: 'DRAFT',
      submittedAt: null,
      createdAt: '2025-09-04T08:00:00.000Z',
    },
    {
      id: '6',
      formId: '2', // ЛФК
      clientId: '3',
      data: {
        exercise_duration: 20,
        exercise_intensity: 'Низкая',
        pain_level: 6,
        mobility_score: 4,
        notes: 'Требуется осторожный подход из-за болевых ощущений',
      },
      status: 'DRAFT',
      submittedAt: null,
      createdAt: '2025-09-04T08:30:00.000Z',
    }
  ];
  
  return entries[id - 1] || entries[0];
};

// Helper function for pagination
const paginate = (items, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const paginatedItems = items.slice(offset, offset + limit);
  
  return {
    data: paginatedItems,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
    },
  };
};

// Generate mock data
const devices = Array.from({ length: 50 }, (_, i) => generateDevice(i + 1));
const clients = Array.from({ length: 100 }, (_, i) => generateClient(i + 1));
const forms = Array.from({ length: 15 }, (_, i) => generateForm(i + 1));
const formEntries = Array.from({ length: 200 }, (_, i) => generateFormEntry(i + 1));

// Devices endpoints
app.get('/api/devices', (req, res) => {
  console.log('📱 GET /api/devices', req.query);
  
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  
  let sortedDevices = [...devices];
  if (sortBy && sortOrder) {
    sortedDevices.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const modifier = sortOrder === 'desc' ? -1 : 1;
      return aVal > bVal ? modifier : aVal < bVal ? -modifier : 0;
    });
  }
  
  const result = paginate(sortedDevices, page, limit);
  res.json(result);
});

app.get('/api/devices/:id', (req, res) => {
  console.log('📱 GET /api/devices/:id', req.params.id);
  
  const device = devices.find(d => d.id === req.params.id);
  if (!device) {
    return res.status(404).json({ message: 'Device not found' });
  }
  
  res.json(device);
});

// Clients endpoints
app.get('/api/clients', (req, res) => {
  console.log('👥 GET /api/clients', req.query);
  
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  
  let sortedClients = [...clients];
  if (sortBy && sortOrder) {
    sortedClients.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const modifier = sortOrder === 'desc' ? -1 : 1;
      return aVal > bVal ? modifier : aVal < bVal ? -modifier : 0;
    });
  }
  
  const result = paginate(sortedClients, page, limit);
  res.json(result);
});

app.get('/api/clients/:id', (req, res) => {
  console.log('👥 GET /api/clients/:id', req.params.id);
  
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }
  
  res.json(client);
});

// Forms endpoints
app.get('/api/forms', (req, res) => {
  console.log('📋 GET /api/forms', req.query);
  
  const { limit = 100 } = req.query;
  
  const result = forms.slice(0, parseInt(limit));
  res.json({ data: result });
});

app.get('/api/forms/:id', (req, res) => {
  console.log('📋 GET /api/forms/:id', req.params.id);
  
  const form = forms.find(f => f.id === req.params.id);
  if (!form) {
    return res.status(404).json({ message: 'Form not found' });
  }
  
  res.json(form);
});

// Form entries endpoints
app.get('/api/form-entries', (req, res) => {
  console.log('📝 GET /api/form-entries', req.query);
  
  const { limit = 100, formId, clientId } = req.query;
  
  let filteredEntries = [...formEntries];
  
  if (formId) {
    filteredEntries = filteredEntries.filter(entry => entry.formId === formId);
  }
  
  if (clientId) {
    filteredEntries = filteredEntries.filter(entry => entry.clientId === clientId);
  }
  
  const result = filteredEntries.slice(0, parseInt(limit));
  res.json({ data: result });
});

app.get('/api/form-entries/:id', (req, res) => {
  console.log('📝 GET /api/form-entries/:id', req.params.id);
  
  const entry = formEntries.find(e => e.id === req.params.id);
  if (!entry) {
    return res.status(404).json({ message: 'Form entry not found' });
  }
  
  res.json(entry);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'mock-core-server',
    timestamp: new Date().toISOString(),
    endpoints: {
      devices: `${devices.length} items`,
      clients: `${clients.length} items`,
      forms: `${forms.length} items`,
      formEntries: `${formEntries.length} items`,
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Internal server error',
    success: false
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock Core API Server running on http://localhost:${PORT}`);
  console.log('📊 Available endpoints:');
  console.log('   - GET /api/devices (with pagination)');
  console.log('   - GET /api/clients (with pagination)');
  console.log('   - GET /api/forms');
  console.log('   - GET /api/form-entries');
  console.log(`📈 Mock data: ${devices.length} devices, ${clients.length} clients, ${forms.length} forms, ${formEntries.length} entries`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down mock core server...');
  process.exit(0);
});
