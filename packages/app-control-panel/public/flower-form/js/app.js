/** Мини‑движок: сбор/установка значения по атрибуту data-field */
// ====== Helpers ======
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const escapeHtml = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m]));
const sum = arr => arr.reduce((a,b)=>a+(Number(b)||0),0);

// ====== FIM Items ======
const fimItems = [
  // 1-6 Self-care
  ['Приём пищи', 'eating'],
  ['Личная гигиена', 'grooming'],
  ['Принятие ванны/душа', 'bathing'],
  ['Одевание верхней части', 'dress_upper'],
  ['Одевание нижней части', 'dress_lower'],
  ['Туалет', 'toileting'],
  // 7-8 Sphincter control
  ['Мочевой пузырь', 'bladder'],
  ['Кишечник', 'bowel'],
  // 9-11 Transfers
  ['Пересаживание: кровать/стул/кресло', 'bed_transfer'],
  ['Пересаживание: туалет', 'toilet_transfer'],
  ['Пересаживание: ванна/душ', 'bath_transfer'],
  // 12-13 Locomotion
  ['Передвижение / коляска', 'locomotion'],
  ['Подъём по лестнице', 'stairs'],
  // 14-15 Communication
  ['Понимание (восприятие)', 'comprehension'],
  ['Выражение (экспрессия)', 'expression'],
  // 16-18 Social cognition
  ['Социальное взаимодействие', 'social_interaction'],
  ['Решение проблем', 'problem_solving'],
  ['Память', 'memory']
];

// ====== Test switcher ======
const TEST_KEY = 'reki_current_test_type';
let currentTest = localStorage.getItem(TEST_KEY) || 'lfk';
const testTypeSelect = $('#testTypeSelect');
testTypeSelect.value = currentTest;
let fimChart = null; // Глобальная переменная для хранения экземпляра диаграммы

function showTest(type){
  currentTest = type;
  localStorage.setItem(TEST_KEY, currentTest);
  $('#test-lfk').hidden = currentTest !== 'lfk';
  $('#test-fim').hidden = currentTest !== 'fim';
  $('#test-patients').hidden = currentTest !== 'patients';
  
  // Update tab visibility for LFK
  if (currentTest === 'lfk') {
    $$('.tab', $('#test-lfk')).forEach((t, i) => t.classList.toggle('active', i===0));
    $('#panel-exam').hidden = false; 
    $('#panel-gait').hidden = true; 
    $('#panel-plan').hidden = true;
  } else if (currentTest === 'fim') {
    updateFimChart();
  } else if (currentTest === 'patients') {
    // Обновляем таблицу пациентов при переключении на вкладку управления
    if (typeof loadPatientsTable === 'function') {
      loadPatientsTable();
    }
  }
  
  // Загружаем данные текущего пациента для нового теста
  const currentPatient = getCurrentPatient();
  if (currentPatient) {
    const patientData = loadPatientData(currentPatient);
    if (currentTest === 'lfk' && patientData.lfk) {
      applyData(patientData.lfk);
    } else if (currentTest === 'fim' && patientData.fim) {
      applyData(patientData.fim);
      setTimeout(() => updateFimChart(), 100);
    }
  }
  
  // Rebind persistence to the current test
  updateTotals();
}

testTypeSelect.addEventListener('change', e => showTest(e.target.value));
showTest(currentTest);

// ====== LFK form logic ======
function switchTab(tabName) {
  console.log('Switching to tab:', tabName);
  
  // Убираем активный класс со всех вкладок
  document.querySelectorAll('#test-lfk .tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Добавляем активный класс к выбранной вкладке
  const activeTab = document.querySelector(`#test-lfk .tab[data-tab="${tabName}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  
  // Скрываем все панели
  document.querySelectorAll('#test-lfk .panel').forEach(panel => {
    panel.hidden = true;
  });
  
  // Показываем нужную панель
  const targetPanel = document.querySelector(`#test-lfk #panel-${tabName}`);
  if (targetPanel) {
    targetPanel.hidden = false;
  }
  
  console.log('Tab switch completed');
}

// Добавляем обработчики кликов для вкладок
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, setting up tab handlers');
  
  const tabs = document.querySelectorAll('#test-lfk .tab');
  console.log('Found tabs:', tabs.length);
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      console.log('Tab clicked:', tabName);
      switchTab(tabName);
    });
  });
  
  // Инициализируем первую вкладку
  switchTab('exam');
});

// Highlight chips on change + persist
document.addEventListener('change', e => {
  if (e.target.matches('.chip input[type="checkbox"]')){
    const chip = e.target.closest('.chip');
    chip.classList.toggle('active', e.target.checked);
    saveToLocal();
  }
  if (e.target.matches('input, textarea, select')) {
    saveToLocal();
    // Если это FIM поля - обновляем диаграмму
    if (currentTest === 'fim' && e.target.closest('[data-field^="fim_"]')) {
      updateTotals();
      updateFimChart();
    }
  }
});

// ====== Persistence (per-test) ======
function getRoot(){ return currentTest === 'lfk' ? $('#test-lfk') : $('#test-fim'); }
function getLSKey(){ return `reki_test_${currentTest}_v1`; }

function fieldToValue(holder){
  const chips = holder.querySelector('[data-type="checkbox-group"]');
  if (chips){
    return $$('input[type="checkbox"]', chips).filter(i => i.checked).map(i => i.value);
  }
  const input = holder.querySelector('input, textarea, select');
  return input?.value ?? null;
}

function setFieldValue(holder, value){
  const chips = holder.querySelector('[data-type="checkbox-group"]');
  if (chips && Array.isArray(value)){
    $$('input[type="checkbox"]', chips).forEach(i => i.checked = value.includes(i.value));
    return;
  }
  const input = holder.querySelector('input, textarea, select');
  if (input) input.value = value ?? '';
}

function collectData(){
  const root = getRoot();
  const data = { type: currentTest };
  $$('[data-field]', root).forEach(holder => {
    const key = holder.getAttribute('data-field');
    data[key] = fieldToValue(holder);
  });
  if (currentTest === 'lfk') data.tasks = collectTasks();
  if (currentTest === 'fim') computeFimTotals(data);
  return data;
}

function applyData(data){
  if (!data) return;
  const root = getRoot();
  $$('[data-field]', root).forEach(holder => {
    const key = holder.getAttribute('data-field');
    if (key in data) setFieldValue(holder, data[key]);
  });
  if (currentTest === 'lfk' && Array.isArray(data.tasks)) { clearTasks(); data.tasks.forEach(addTask); }
  updateTotals();
  if (currentTest === 'fim') updateFimChart();
}

function saveToLocal(){ 
  const currentPatient = getCurrentPatient();
  if (currentPatient) {
    const patientData = loadPatientData(currentPatient);
    patientData[currentTest] = collectData();
    savePatientData(currentPatient, patientData);
  } else {
    // Fallback для случая без выбранного пациента
    localStorage.setItem(getLSKey(), JSON.stringify(collectData())); 
  }
}

function loadFromLocal(){ 
  const currentPatient = getCurrentPatient();
  if (currentPatient) {
    const patientData = loadPatientData(currentPatient);
    return patientData[currentTest] || null;
  } else {
    // Fallback для случая без выбранного пациента
    const raw = localStorage.getItem(getLSKey()); 
    if (!raw) return null; 
    try { return JSON.parse(raw); } catch { return null; } 
  }
}

// Buttons
$('#saveJsonBtn').addEventListener('click', () => {
  const data = collectData();
  saveToLocal();
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `reki_${currentTest}.json`; a.click(); URL.revokeObjectURL(url);
});
$('#loadJsonBtn').addEventListener('click', () => $('#jsonFile').click());
$('#jsonFile').addEventListener('change', e => {
  const file = e.target.files?.[0]; if (!file) return;
  const rd = new FileReader();
  rd.onload = () => { try { const data = JSON.parse(rd.result); applyData(data); saveToLocal(); } catch { alert('Не удалось прочитать JSON'); } };
  rd.readAsText(file);
  e.target.value = '';
});
$('#printBtn').addEventListener('click', () => window.print());
$('#resetBtn').addEventListener('click', () => { if (confirm('Очистить текущий тест?')) { localStorage.removeItem(getLSKey()); location.reload(); } });

// ====== Tasks (LFK plan) ======
const tasksRoot = $('#tasks');
function taskRowTemplate(task={ title:'', metric:'', target:'', notes:'' }){
  const row = document.createElement('div');
  row.className = 'row';
  row.style.margin = '8px 0';
  row.innerHTML = `
    <div class="field" data-col="title"><span class="muted">Задача</span><input type="text" value="${escapeHtml(task.title)}" placeholder="Например: улучшить переход в положение сидя"/></div>
    <div class="field" style="width:220px" data-col="metric"><span class="muted">Метрика</span><input type="text" value="${escapeHtml(task.metric)}" placeholder="напр. пройти 10 м"/></div>
    <div class="field" style="width:220px" data-col="target"><span class="muted">Цель</span><input type="text" value="${escapeHtml(task.target)}" placeholder="напр. без опоры"/></div>
    <div class="field" style="flex:1" data-col="notes"><span class="muted">Примечание</span><input type="text" value="${escapeHtml(task.notes)}" placeholder="…"/></div>
    <button type="button" class="btn" data-action="del">Удалить</button>
  `;
  row.querySelector('[data-action="del"]').addEventListener('click', () => { row.remove(); saveToLocal(); });
  $$('input', row).forEach(inp => inp.addEventListener('input', saveToLocal));
  return row;
}
function addTask(task){ tasksRoot?.appendChild(taskRowTemplate(task)); }
function clearTasks(){ if (tasksRoot) tasksRoot.innerHTML = ''; }
function collectTasks(){
  if (!tasksRoot) return [];
  return Array.from(tasksRoot.children).map(row => ({
    title: row.querySelector('[data-col="title"] input').value,
    metric: row.querySelector('[data-col="metric"] input').value,
    target: row.querySelector('[data-col="target"] input').value,
    notes: row.querySelector('[data-col="notes"] input').value,
  }));
}
$('#addTaskBtn')?.addEventListener('click', () => { addTask({}); saveToLocal(); });

// ====== FIM totals ======
function updateTotals(){
  const data = collectData();
  if (currentTest !== 'fim') return; // for FIM only
  setField('#test-fim [data-field="fim_motor_adm"] input', data._fim_motor_adm);
  setField('#test-fim [data-field="fim_motor_dis"] input', data._fim_motor_dis);
  setField('#test-fim [data-field="fim_cog_adm"] input', data._fim_cog_adm);
  setField('#test-fim [data-field="fim_cog_dis"] input', data._fim_cog_dis);
  setField('#test-fim [data-field="fim_total_adm"] input', data._fim_total_adm);
  setField('#test-fim [data-field="fim_total_dis"] input', data._fim_total_dis);
}

function computeFimTotals(dst){
  // Sum 1..13 and 14..18 separately for both columns
  const admVals = []; const disVals = [];
  fimItems.forEach(([,key], idx) => {
    const a = Number(dst[`fim_${key}_adm`] || 0); const d = Number(dst[`fim_${key}_dis`] || 0);
    admVals.push(a); disVals.push(d);
  });
  const motorIdx = 13; // first 13
  dst._fim_motor_adm = sum(admVals.slice(0, motorIdx));
  dst._fim_motor_dis = sum(disVals.slice(0, motorIdx));
  dst._fim_cog_adm   = sum(admVals.slice(motorIdx));
  dst._fim_cog_dis   = sum(disVals.slice(motorIdx));
  dst._fim_total_adm = dst._fim_motor_adm + dst._fim_cog_adm;
  dst._fim_total_dis = dst._fim_motor_dis + dst._fim_cog_dis;
}
function setField(sel, val){ const el = $(sel); if (el) el.value = val || ''; }

// ====== FIM Chart ======
function updateFimChart() {
  const data = collectData();
  if (currentTest !== 'fim') return;
  
  // Преобразуем данные для диаграммы
  const labels = fimItems.map(item => item[0]);
  const admissionData = fimItems.map(([, key]) => Number(data[`fim_${key}_adm`] || 0));
  const dischargeData = fimItems.map(([, key]) => Number(data[`fim_${key}_dis`] || 0));
  
  const ctx = $('#fimChart')?.getContext('2d');
  if (!ctx) return;
  
  // Если диаграмма существует - обновляем, иначе создаем новую
  if (fimChart) {
    fimChart.data.datasets[0].data = admissionData;
    fimChart.data.datasets[1].data = dischargeData;
    fimChart.update();
  } else {
    fimChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Поступление',
            data: admissionData,
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 0.8)',
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
          },
          {
            label: 'Выписка',
            data: dischargeData,
            fill: true,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 0.8)',
            pointBackgroundColor: 'rgba(153, 102, 255, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(153, 102, 255, 1)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            borderWidth: 2
          }
        },
        scales: {
          r: {
            angleLines: {
              color: 'rgba(123, 132, 150, 0.2)' // var(--muted)
            },
            grid: {
              color: 'rgba(123, 132, 150, 0.2)'
            },
            pointLabels: {
              color: '#e7ecf4', // var(--text)
              font: {
                size: 10
              }
            },
            ticks: {
              color: '#7b8496', // var(--muted)
              backdropColor: 'transparent',
              stepSize: 1,
              max: 7,
              min: 0
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#121620',
            titleColor: '#e7ecf4',
            bodyColor: '#e7ecf4',
            borderColor: '#1f2430',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true
          }
        }
      }
    });
  }
}

// Адаптивное изменение размера диаграммы
function resizeChart() {
  if (fimChart) {
    fimChart.resize();
  }
}

// Переключение полноэкранного режима диаграммы
function toggleChartFullscreen() {
  const chartContainer = document.querySelector('.chart-container');
  const fullscreenIcon = document.querySelector('.fullscreen-icon');
  const exitFullscreenIcon = document.querySelector('.exit-fullscreen-icon');
  
  if (chartContainer.classList.contains('fullscreen')) {
    // Выход из полноэкранного режима
    chartContainer.classList.remove('fullscreen');
    fullscreenIcon.style.display = 'inline';
    exitFullscreenIcon.style.display = 'none';
    document.body.style.overflow = '';
  } else {
    // Вход в полноэкранный режим
    chartContainer.classList.add('fullscreen');
    fullscreenIcon.style.display = 'none';
    exitFullscreenIcon.style.display = 'inline';
    document.body.style.overflow = 'hidden';
  }
  
  // Обновляем размер диаграммы
  setTimeout(() => {
    if (fimChart) {
      fimChart.resize();
    }
  }, 100);
}

// Выход из полноэкранного режима по Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer.classList.contains('fullscreen')) {
      toggleChartFullscreen();
    }
  }
});

// Обработчик изменения размера окна
window.addEventListener('resize', () => {
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(resizeChart, 250);
});

// ====== Init ======
// Restore current test state from LS
applyData(loadFromLocal());
