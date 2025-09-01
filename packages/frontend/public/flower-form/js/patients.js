// ====== Patient Management ======
const PATIENTS_KEY = 'reki_patients_data';
const CURRENT_PATIENT_KEY = 'reki_current_patient';

// Тестовые данные пациентов
const demoPatients = [
  {
    id: 'patient_001',
    name: 'Иванов Иван Иванович',
    birthDate: '2015-03-15',
    diagnosis: 'ДЦП, спастическая диплегия',
    admissionDate: '2024-01-15',
    dischargeDate: '2024-02-15'
  },
  {
    id: 'patient_002', 
    name: 'Петрова Анна Сергеевна',
    birthDate: '2012-07-22',
    diagnosis: 'ДЦП, гемипарез',
    admissionDate: '2024-01-20',
    dischargeDate: '2024-02-20'
  },
  {
    id: 'patient_003',
    name: 'Сидоров Дмитрий Александрович',
    birthDate: '2018-11-08',
    diagnosis: 'ДЦП, атаксическая форма',
    admissionDate: '2024-02-01',
    dischargeDate: '2024-03-01'
  },
  {
    id: 'patient_004',
    name: 'Козлова Елена Викторовна',
    birthDate: '2016-05-12',
    diagnosis: 'ДЦП, спастическая тетраплегия',
    admissionDate: '2024-02-10',
    dischargeDate: '2024-03-10'
  }
];

// Тестовые данные результатов
const demoResults = {
  'patient_001': {
    lfk: {
      type: 'lfk',
      head_hold: ['Удерживает', 'С наклоном вправо'],
      rollover: ['Со спины на живот', 'Вправо'],
      prone: ['Опирается на предплечья', 'D'],
      sitting_on_heels: ['У опоры'],
      kneeling: ['У опоры', 'Передвигается у опоры'],
      to_sit: ['С опорой на правую руку (D)', 'При фиксации ног'],
      sitting: ['С опущенными ногами', 'С опорой на руки', 'D'],
      standing: ['У опоры', 'D'],
      walking: ['У опоры', 'D'],
      gait_spine: ['Гиперлордоз (поясничный отдел)'],
      gait_lower_limbs: ['Вальгус', 'Ассиметрия D'],
      gait_contractures: 'Коленный D 15°, голеностоп S 10°',
      gait_instability: 'Нестабильность коленного сустава D',
      gait_feet: ['Пяточная вальгусная', 'Пронация'],
      gait_comment: 'Асимметричная походка с опорой на правую сторону. Темп медленный.',
      media_refs: 'VID_001, VID_002',
      course_goal: 'Улучшение симметрии походки, снижение спастичности',
      course_duration_weeks: 8,
      sessions_per_week: 3,
      tasks: [
        { task: 'Улучшение опоры на левую ногу', frequency: '3 раза в день', duration: '15 мин' },
        { task: 'Растяжка приводящих мышц', frequency: '2 раза в день', duration: '10 мин' },
        { task: 'Упражнения на равновесие', frequency: 'Ежедневно', duration: '20 мин' }
      ],
      plan_author: 'Смирнова А.В.',
      plan_date: '2024-01-16'
    },
    fim: {
      type: 'fim',
      fim_patient_ref: 'P001',
      fim_date: '2024-01-15',
      fim_eating_adm: '5', fim_eating_dis: '6',
      fim_grooming_adm: '4', fim_grooming_dis: '5',
      fim_bathing_adm: '3', fim_bathing_dis: '4',
      fim_dress_upper_adm: '4', fim_dress_upper_dis: '5',
      fim_dress_lower_adm: '3', fim_dress_lower_dis: '4',
      fim_toileting_adm: '4', fim_toileting_dis: '5',
      fim_bladder_adm: '6', fim_bladder_dis: '7',
      fim_bowel_adm: '6', fim_bowel_dis: '7',
      fim_bed_transfer_adm: '4', fim_bed_transfer_dis: '5',
      fim_toilet_transfer_adm: '3', fim_toilet_transfer_dis: '4',
      fim_bath_transfer_adm: '3', fim_bath_transfer_dis: '4',
      fim_locomotion_adm: '4', fim_locomotion_dis: '5',
      fim_stairs_adm: '3', fim_stairs_dis: '4',
      fim_comprehension_adm: '6', fim_comprehension_dis: '7',
      fim_expression_adm: '5', fim_expression_dis: '6',
      fim_social_interaction_adm: '6', fim_social_interaction_dis: '7',
      fim_problem_solving_adm: '5', fim_problem_solving_dis: '6',
      fim_memory_adm: '5', fim_memory_dis: '6',
      fim_notes: 'Значительное улучшение в двигательных навыках. Пациент стал более независимым в повседневной деятельности.'
    }
  },
  'patient_002': {
    lfk: {
      type: 'lfk',
      head_hold: ['Удерживает'],
      rollover: ['Со спины на живот', 'С живота на спину', 'Влево'],
      prone: ['Опирается на выпрямленные руки', 'S'],
      sitting_on_heels: ['Самостоятельно'],
      kneeling: ['Самостоятельно', 'Передвигается самостоятельно'],
      to_sit: ['Самостоятельно'],
      sitting: ['Самостоятельно'],
      standing: ['Самостоятельно'],
      walking: ['Самостоятельно'],
      gait_spine: ['Наклон влево'],
      gait_lower_limbs: ['Варус', 'Ассиметрия S'],
      gait_contractures: 'Голеностоп S 8°',
      gait_instability: 'Нестабильность голеностопного сустава S',
      gait_feet: ['Пяточная варусная', 'Супинация'],
      gait_comment: 'Легкая хромота на левую ногу. Походка в целом симметричная.',
      media_refs: 'VID_003',
      course_goal: 'Коррекция установки стоп, улучшение походки',
      course_duration_weeks: 6,
      sessions_per_week: 2,
      tasks: [
        { task: 'Упражнения для укрепления мышц голени', frequency: 'Ежедневно', duration: '15 мин' },
        { task: 'Растяжка икроножных мышц', frequency: '2 раза в день', duration: '10 мин' }
      ],
      plan_author: 'Петров И.С.',
      plan_date: '2024-01-21'
    },
    fim: {
      type: 'fim',
      fim_patient_ref: 'P002',
      fim_date: '2024-01-20',
      fim_eating_adm: '6', fim_eating_dis: '7',
      fim_grooming_adm: '6', fim_grooming_dis: '7',
      fim_bathing_adm: '5', fim_bathing_dis: '6',
      fim_dress_upper_adm: '6', fim_dress_upper_dis: '7',
      fim_dress_lower_adm: '5', fim_dress_lower_dis: '6',
      fim_toileting_adm: '6', fim_toileting_dis: '7',
      fim_bladder_adm: '7', fim_bladder_dis: '7',
      fim_bowel_adm: '7', fim_bowel_dis: '7',
      fim_bed_transfer_adm: '6', fim_bed_transfer_dis: '7',
      fim_toilet_transfer_adm: '6', fim_toilet_transfer_dis: '7',
      fim_bath_transfer_adm: '5', fim_bath_transfer_dis: '6',
      fim_locomotion_adm: '6', fim_locomotion_dis: '7',
      fim_stairs_adm: '5', fim_stairs_dis: '6',
      fim_comprehension_adm: '7', fim_comprehension_dis: '7',
      fim_expression_adm: '7', fim_expression_dis: '7',
      fim_social_interaction_adm: '7', fim_social_interaction_dis: '7',
      fim_problem_solving_adm: '6', fim_problem_solving_dis: '7',
      fim_memory_adm: '7', fim_memory_dis: '7',
      fim_notes: 'Отличные результаты. Пациент практически полностью независим.'
    }
  },
  'patient_003': {
    lfk: {
      type: 'lfk',
      head_hold: ['Удерживает несколько минут'],
      rollover: ['Блоком'],
      prone: ['Опоры на руки нет'],
      sitting_on_heels: ['Отсутствует'],
      kneeling: ['Отсутствует'],
      to_sit: ['С поворотом на бок'],
      sitting: ['Не сидит'],
      standing: ['Не стоит'],
      walking: ['Не ходит'],
      gait_spine: ['Гиперкифоз (грудной отдел)'],
      gait_lower_limbs: ['Вальгус'],
      gait_contractures: 'Тазобедренные суставы 20°, коленные 15°',
      gait_instability: 'Нестабильность тазобедренных суставов',
      gait_feet: ['Пяточная вальгусная', 'Приведение'],
      gait_comment: 'Пациент не ходит самостоятельно. Требуется постоянная поддержка.',
      media_refs: 'VID_004',
      course_goal: 'Обучение навыкам сидения, подготовка к вертикализации',
      course_duration_weeks: 12,
      sessions_per_week: 4,
      tasks: [
        { task: 'Упражнения для укрепления мышц спины', frequency: '3 раза в день', duration: '20 мин' },
        { task: 'Обучение навыкам сидения', frequency: 'Ежедневно', duration: '30 мин' },
        { task: 'Массаж для снижения спастичности', frequency: 'Ежедневно', duration: '15 мин' }
      ],
      plan_author: 'Козлова М.А.',
      plan_date: '2024-02-02'
    },
    fim: {
      type: 'fim',
      fim_patient_ref: 'P003',
      fim_date: '2024-02-01',
      fim_eating_adm: '3', fim_eating_dis: '4',
      fim_grooming_adm: '2', fim_grooming_dis: '3',
      fim_bathing_adm: '1', fim_bathing_dis: '2',
      fim_dress_upper_adm: '2', fim_dress_upper_dis: '3',
      fim_dress_lower_adm: '1', fim_dress_lower_dis: '2',
      fim_toileting_adm: '2', fim_toileting_dis: '3',
      fim_bladder_adm: '4', fim_bladder_dis: '5',
      fim_bowel_adm: '4', fim_bowel_dis: '5',
      fim_bed_transfer_adm: '2', fim_bed_transfer_dis: '3',
      fim_toilet_transfer_adm: '1', fim_toilet_transfer_dis: '2',
      fim_bath_transfer_adm: '1', fim_bath_transfer_dis: '2',
      fim_locomotion_adm: '1', fim_locomotion_dis: '2',
      fim_stairs_adm: '1', fim_stairs_dis: '1',
      fim_comprehension_adm: '5', fim_comprehension_dis: '6',
      fim_expression_adm: '4', fim_expression_dis: '5',
      fim_social_interaction_adm: '5', fim_social_interaction_dis: '6',
      fim_problem_solving_adm: '4', fim_problem_solving_dis: '5',
      fim_memory_adm: '5', fim_memory_dis: '6',
      fim_notes: 'Требуется длительная реабилитация. Основной фокус на двигательных навыках.'
    }
  },
  'patient_004': {
    lfk: {
      type: 'lfk',
      head_hold: ['Удерживает', 'С наклоном влево'],
      rollover: ['Со спины на живот', 'Влево'],
      prone: ['Опирается на предплечья', 'S'],
      sitting_on_heels: ['У опоры'],
      kneeling: ['У опоры'],
      to_sit: ['С опорой на левую руку (S)'],
      sitting: ['С опущенными ногами', 'S'],
      standing: ['У опоры', 'S'],
      walking: ['У опоры', 'S'],
      gait_spine: ['Наклон влево'],
      gait_lower_limbs: ['Вальгус', 'Ассиметрия S'],
      gait_contractures: 'Коленный S 12°, голеностоп S 8°',
      gait_instability: 'Нестабильность коленного сустава S',
      gait_feet: ['Пяточная вальгусная', 'Пронация'],
      gait_comment: 'Асимметричная походка с опорой на левую сторону. Требуется коррекция.',
      media_refs: 'VID_005, VID_006',
      course_goal: 'Улучшение симметрии походки, коррекция установки конечностей',
      course_duration_weeks: 10,
      sessions_per_week: 3,
      tasks: [
        { task: 'Упражнения для укрепления правой стороны', frequency: 'Ежедневно', duration: '25 мин' },
        { task: 'Растяжка приводящих мышц', frequency: '2 раза в день', duration: '15 мин' },
        { task: 'Упражнения на равновесие', frequency: 'Ежедневно', duration: '20 мин' }
      ],
      plan_author: 'Соколов В.П.',
      plan_date: '2024-02-11'
    },
    fim: {
      type: 'fim',
      fim_patient_ref: 'P004',
      fim_date: '2024-02-10',
      fim_eating_adm: '5', fim_eating_dis: '6',
      fim_grooming_adm: '4', fim_grooming_dis: '5',
      fim_bathing_adm: '3', fim_bathing_dis: '4',
      fim_dress_upper_adm: '4', fim_dress_upper_dis: '5',
      fim_dress_lower_adm: '3', fim_dress_lower_dis: '4',
      fim_toileting_adm: '4', fim_toileting_dis: '5',
      fim_bladder_adm: '6', fim_bladder_dis: '7',
      fim_bowel_adm: '6', fim_bowel_dis: '7',
      fim_bed_transfer_adm: '4', fim_bed_transfer_dis: '5',
      fim_toilet_transfer_adm: '3', fim_toilet_transfer_dis: '4',
      fim_bath_transfer_adm: '3', fim_bath_transfer_dis: '4',
      fim_locomotion_adm: '4', fim_locomotion_dis: '5',
      fim_stairs_adm: '3', fim_stairs_dis: '4',
      fim_comprehension_adm: '6', fim_comprehension_dis: '7',
      fim_expression_adm: '5', fim_expression_dis: '6',
      fim_social_interaction_adm: '6', fim_social_interaction_dis: '7',
      fim_problem_solving_adm: '5', fim_problem_solving_dis: '6',
      fim_memory_adm: '6', fim_memory_dis: '7',
      fim_notes: 'Хорошая динамика. Пациент стал более уверенным в движениях.'
    }
  }
};

// Инициализация данных пациентов
function initPatientsData() {
  if (!localStorage.getItem(PATIENTS_KEY)) {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(demoPatients));
  }
  if (!localStorage.getItem('reki_patient_results')) {
localStorage.setItem('reki_patient_results', JSON.stringify(demoResults));
  }
}

// Загрузка списка пациентов
function loadPatientsList() {
  const patients = JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
  const patientSelect = document.getElementById('patientSelect');
  
  if (!patientSelect) {
    console.error('Patient select element not found');
    return;
  }
  
  // Очищаем список, оставляя только первый элемент
  patientSelect.innerHTML = '<option value="">Выберите пациента...</option>';
  
  patients.forEach(patient => {
    const option = document.createElement('option');
    option.value = patient.id;
    option.textContent = `${patient.name} (${patient.diagnosis})`;
    patientSelect.appendChild(option);
  });
  
  console.log('Loaded patients:', patients.length);
}

// Получение текущего пациента
function getCurrentPatient() {
  return localStorage.getItem(CURRENT_PATIENT_KEY);
}

// Установка текущего пациента
function setCurrentPatient(patientId) {
  localStorage.setItem(CURRENT_PATIENT_KEY, patientId);
}

// Загрузка данных пациента
function loadPatientData(patientId) {
  const results = JSON.parse(localStorage.getItem('reki_patient_results') || '{}');
  return results[patientId] || {};
}

// Сохранение данных пациента
function savePatientData(patientId, data) {
  const results = JSON.parse(localStorage.getItem('reki_patient_results') || '{}');
  results[patientId] = data;
  localStorage.setItem('reki_patient_results', JSON.stringify(results));
}

// Переключение пациента
function switchPatient(patientId) {
  setCurrentPatient(patientId);
  
  if (patientId) {
    const patientData = loadPatientData(patientId);
    
    // Загружаем данные для текущего теста
    if (typeof currentTest !== 'undefined') {
      if (currentTest === 'lfk' && patientData.lfk) {
        applyData(patientData.lfk);
      } else if (currentTest === 'fim' && patientData.fim) {
        applyData(patientData.fim);
        // Обновляем диаграмму FIM
        if (typeof updateFimChart !== 'undefined') {
          setTimeout(() => updateFimChart(), 100);
        }
      }
    }
  } else {
    // Очищаем форму при выборе "Выберите пациента..."
    clearForm();
  }
}

// Очистка формы
function clearForm() {
  const root = getRoot ? getRoot() : document.querySelector('#test-lfk, #test-fim');
  if (!root) return;
  
  const fields = root.querySelectorAll('[data-field]');
  fields.forEach(holder => {
    if (typeof setFieldValue !== 'undefined') {
      setFieldValue(holder, null);
    }
  });
  
  if (typeof clearTasks !== 'undefined') {
    clearTasks();
  }
  if (typeof updateFimChart !== 'undefined') {
    updateFimChart();
  }
}

// Переменные для управления формой пациентов
let currentEditingPatientId = null;

// Загрузка списка пациентов в таблицу
function loadPatientsTable() {
  const patients = JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
  const tableBody = document.getElementById('patientsTableBody');
  
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  patients.forEach(patient => {
    const row = document.createElement('div');
    row.className = 'patient-row';
    row.innerHTML = `
      <div class="patient-name">${patient.name}</div>
      <div class="patient-diagnosis">${patient.diagnosis}</div>
      <div class="patient-status ${patient.status || 'active'}">${getStatusText(patient.status)}</div>
      <div class="patient-actions">
        <button type="button" onclick="editPatient('${patient.id}')">Редактировать</button>
        <button type="button" onclick="deletePatient('${patient.id}')" class="ghost">Удалить</button>
      </div>
    `;
    tableBody.appendChild(row);
  });
}

// Получение текста статуса
function getStatusText(status) {
  const statusMap = {
    'active': 'Активный',
    'completed': 'Завершен',
    'paused': 'Приостановлен',
    'archived': 'Архив'
  };
  return statusMap[status] || 'Активный';
}

// Очистка формы пациента
function clearPatientForm() {
  const form = document.querySelector('.patient-form');
  if (!form) return;
  
  form.querySelector('[data-field="patient_name"] input').value = '';
  form.querySelector('[data-field="patient_contact"] input').value = '';
  form.querySelector('[data-field="patient_diagnosis"] input').value = '';
  form.querySelector('[data-field="patient_status"] select').value = 'active';
  form.querySelector('[data-field="patient_forms_links"] textarea').value = '';
  
  currentEditingPatientId = null;
  document.getElementById('savePatientBtn').textContent = 'Сохранить пациента';
  document.getElementById('deletePatientBtn').style.display = 'none';
}

// Редактирование пациента
function editPatient(patientId) {
  const patients = JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
  const patient = patients.find(p => p.id === patientId);
  
  if (!patient) return;
  
  const form = document.querySelector('.patient-form');
  if (!form) return;
  
  form.querySelector('[data-field="patient_name"] input').value = patient.name || '';
  form.querySelector('[data-field="patient_contact"] input').value = patient.contact || '';
  form.querySelector('[data-field="patient_diagnosis"] input').value = patient.diagnosis || '';
  form.querySelector('[data-field="patient_status"] select').value = patient.status || 'active';
  form.querySelector('[data-field="patient_forms_links"] textarea').value = patient.formsLinks || '';
  
  currentEditingPatientId = patientId;
  document.getElementById('savePatientBtn').textContent = 'Обновить пациента';
  document.getElementById('deletePatientBtn').style.display = 'inline-block';
}

// Сохранение пациента
function savePatient() {
  const form = document.querySelector('.patient-form');
  if (!form) return;
  
  const name = form.querySelector('[data-field="patient_name"] input').value.trim();
  const contact = form.querySelector('[data-field="patient_contact"] input').value.trim();
  const diagnosis = form.querySelector('[data-field="patient_diagnosis"] input').value.trim();
  const status = form.querySelector('[data-field="patient_status"] select').value;
  const formsLinks = form.querySelector('[data-field="patient_forms_links"] textarea').value.trim();
  
  if (!name || !diagnosis) {
    alert('Пожалуйста, заполните обязательные поля (ФИО и диагноз)');
    return;
  }
  
  const patients = JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
  
  if (currentEditingPatientId) {
    // Обновление существующего пациента
    const patientIndex = patients.findIndex(p => p.id === currentEditingPatientId);
    if (patientIndex !== -1) {
      patients[patientIndex] = {
        ...patients[patientIndex],
        name,
        contact,
        diagnosis,
        status,
        formsLinks,
        updatedAt: new Date().toISOString()
      };
    }
  } else {
    // Создание нового пациента
    const newPatient = {
      id: 'patient_' + Date.now(),
      name,
      contact,
      diagnosis,
      status,
      formsLinks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    patients.push(newPatient);
  }
  
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  
  // Обновляем списки
  loadPatientsList();
  loadPatientsTable();
  clearPatientForm();
  
  alert(currentEditingPatientId ? 'Пациент обновлен!' : 'Пациент создан!');
}

// Удаление пациента
function deletePatient(patientId) {
  if (!confirm('Вы уверены, что хотите удалить этого пациента? Это действие нельзя отменить.')) {
    return;
  }
  
  const patients = JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
  const filteredPatients = patients.filter(p => p.id !== patientId);
  
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(filteredPatients));
  
  // Также удаляем результаты тестов пациента
  const results = JSON.parse(localStorage.getItem('reki_patient_results') || '{}');
  delete results[patientId];
  localStorage.setItem('reki_patient_results', JSON.stringify(results));
  
  // Обновляем списки
  loadPatientsList();
  loadPatientsTable();
  
  if (currentEditingPatientId === patientId) {
    clearPatientForm();
  }
  
  alert('Пациент удален!');
}

// Глобальные функции для управления пациентами
window.editPatient = editPatient;
window.deletePatient = deletePatient;
window.savePatient = savePatient;
window.clearPatientForm = clearPatientForm;
window.loadPatientsTable = loadPatientsTable;

// Инициализация системы пациентов
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing patient system...');
  initPatientsData();
  loadPatientsList();
  loadPatientsTable();
  
  // Обработчик изменения пациента
  const patientSelect = document.getElementById('patientSelect');
  if (patientSelect) {
    patientSelect.addEventListener('change', e => {
      console.log('Patient changed to:', e.target.value);
      switchPatient(e.target.value);
    });
  }
  
  // Обработчики кнопок формы пациентов
  const savePatientBtn = document.getElementById('savePatientBtn');
  if (savePatientBtn) {
    savePatientBtn.addEventListener('click', savePatient);
  }
  
  const clearPatientFormBtn = document.getElementById('clearPatientFormBtn');
  if (clearPatientFormBtn) {
    clearPatientFormBtn.addEventListener('click', clearPatientForm);
  }
  
  const deletePatientBtn = document.getElementById('deletePatientBtn');
  if (deletePatientBtn) {
    deletePatientBtn.addEventListener('click', () => {
      if (currentEditingPatientId) {
        deletePatient(currentEditingPatientId);
      }
    });
  }
});
