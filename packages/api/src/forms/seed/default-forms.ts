import { FormStatus, FormType } from '@cuis/domain';

export const defaultForms = [
  {
    title: 'Осмотр ЛФК',
    type: FormType.LFK,
    description: 'Форма для осмотра и оценки состояния пациента по методике ЛФК',
    status: FormStatus.ACTIVE,
    schema: {
      sections: [
        {
          title: 'Общая информация',
          fields: [
            { name: 'therapistName', label: 'ФИО специалиста', type: 'text', required: true },
            { name: 'examinationDate', label: 'Дата осмотра', type: 'date', required: true },
          ]
        },
        {
          title: 'Анамнез',
          fields: [
            { name: 'diagnosis', label: 'Диагноз', type: 'text', required: true },
            { name: 'complaints', label: 'Жалобы', type: 'textarea' },
            { name: 'anamnesis', label: 'Анамнез', type: 'textarea' },
          ]
        },
        {
          title: 'Объективный осмотр',
          fields: [
            { name: 'generalCondition', label: 'Общее состояние', type: 'select', options: ['Удовлетворительное', 'Средней тяжести', 'Тяжелое'] },
            { name: 'consciousness', label: 'Сознание', type: 'select', options: ['Ясное', 'Оглушение', 'Сопор', 'Кома'] },
            { name: 'position', label: 'Положение', type: 'select', options: ['Активное', 'Пассивное', 'Вынужденное'] },
            { name: 'mobility', label: 'Мобильность', type: 'select', options: ['Самостоятельно', 'С помощью вспомогательных средств', 'С помощью персонала', 'Не мобилен'] },
          ]
        },
        {
          title: 'Функциональные тесты',
          fields: [
            { name: 'muscleStrength', label: 'Мышечная сила', type: 'rating', min: 0, max: 5 },
            { name: 'jointMobility', label: 'Подвижность суставов', type: 'rating', min: 0, max: 5 },
            { name: 'balance', label: 'Равновесие', type: 'rating', min: 0, max: 5 },
            { name: 'coordination', label: 'Координация', type: 'rating', min: 0, max: 5 },
          ]
        },
        {
          title: 'Заключение',
          fields: [
            { name: 'conclusion', label: 'Заключение', type: 'textarea', required: true },
            { name: 'recommendations', label: 'Рекомендации', type: 'textarea', required: true },
          ]
        }
      ]
    }
  },
  {
    title: 'FIM — мера функциональной независимости',
    type: FormType.FIM,
    description: 'Шкала для оценки функциональной независимости пациента',
    status: FormStatus.ACTIVE,
    schema: {
      sections: [
        {
          title: 'Информация о тесте',
          fields: [
            { name: 'therapistName', label: 'ФИО специалиста', type: 'text', required: true },
            { name: 'examinationDate', label: 'Дата проведения', type: 'date', required: true },
          ]
        },
        {
          title: 'Самообслуживание',
          fields: [
            { name: 'eating', label: 'Прием пищи', type: 'rating', min: 1, max: 7, required: true },
            { name: 'grooming', label: 'Уход за собой', type: 'rating', min: 1, max: 7, required: true },
            { name: 'bathing', label: 'Купание', type: 'rating', min: 1, max: 7, required: true },
            { name: 'dressing_upper', label: 'Одевание (верхняя часть тела)', type: 'rating', min: 1, max: 7, required: true },
            { name: 'dressing_lower', label: 'Одевание (нижняя часть тела)', type: 'rating', min: 1, max: 7, required: true },
            { name: 'toileting', label: 'Туалет', type: 'rating', min: 1, max: 7, required: true },
          ]
        },
        {
          title: 'Контроль сфинктеров',
          fields: [
            { name: 'bladder', label: 'Контроль мочеиспускания', type: 'rating', min: 1, max: 7, required: true },
            { name: 'bowel', label: 'Контроль дефекации', type: 'rating', min: 1, max: 7, required: true },
          ]
        },
        {
          title: 'Мобильность',
          fields: [
            { name: 'transfer_bed', label: 'Перемещение: кровать/стул/коляска', type: 'rating', min: 1, max: 7, required: true },
            { name: 'transfer_toilet', label: 'Перемещение: туалет', type: 'rating', min: 1, max: 7, required: true },
            { name: 'transfer_bath', label: 'Перемещение: ванна/душ', type: 'rating', min: 1, max: 7, required: true },
          ]
        },
        {
          title: 'Передвижение',
          fields: [
            { name: 'locomotion_walk', label: 'Ходьба/Использование коляски', type: 'rating', min: 1, max: 7, required: true },
            { name: 'locomotion_stairs', label: 'Подъем по лестнице', type: 'rating', min: 1, max: 7, required: true },
          ]
        },
        {
          title: 'Общение',
          fields: [
            { name: 'comprehension', label: 'Понимание', type: 'rating', min: 1, max: 7, required: true },
            { name: 'expression', label: 'Выражение', type: 'rating', min: 1, max: 7, required: true },
          ]
        },
        {
          title: 'Социальное познание',
          fields: [
            { name: 'social_interaction', label: 'Социальное взаимодействие', type: 'rating', min: 1, max: 7, required: true },
            { name: 'problem_solving', label: 'Решение проблем', type: 'rating', min: 1, max: 7, required: true },
            { name: 'memory', label: 'Память', type: 'rating', min: 1, max: 7, required: true },
          ]
        },
        {
          title: 'Заключение',
          fields: [
            { name: 'total_score', label: 'Общий балл', type: 'number', readOnly: true },
            { name: 'conclusion', label: 'Заключение', type: 'textarea', required: true },
            { name: 'recommendations', label: 'Рекомендации', type: 'textarea', required: true },
          ]
        }
      ]
    }
  }
];
