import knex from 'knex';

// Шаблоны форм - только ЛФК и ФИМ
const formTemplates = [
  {
    id: '1652b729-e2ec-4cd4-9489-d9ab38e16db8',
    title: 'Осмотр инструктора-методиста ЛФК',
    type: 'lfk',
    description: 'Форма для осмотра пациента инструктором-методистом ЛФК',
    schema: {
      sections: [
        {
          title: 'Общая информация',
          fields: [
            {
              name: 'therapistName',
              type: 'text',
              label: 'ФИО специалиста',
              required: true,
              readOnly: false
            },
            {
              name: 'examinationDate',
              type: 'date',
              label: 'Дата осмотра',
              required: true,
              readOnly: false
            },
            {
              name: 'patientName',
              type: 'text',
              label: 'ФИО пациента',
              required: true,
              readOnly: false
            }
          ]
        },
        {
          title: 'Двигательные навыки',
          fields: [
            {
              name: 'headHolding',
              type: 'checkbox-group',
              label: 'Удержание головы',
              required: false,
              readOnly: false,
              options: [
                'Удерживает',
                'Не удерживает',
                'Удерживает несколько минут',
                'С наклоном вправо',
                'С наклоном влево'
              ]
            },
            {
              name: 'turns',
              type: 'checkbox-group',
              label: 'Перевороты',
              required: false,
              readOnly: false,
              options: [
                'Со спины на живот',
                'С живота на спину',
                'Блоком',
                'Вправо',
                'Влево'
              ]
            },
            {
              name: 'lyingOnStomach',
              type: 'checkbox-group',
              label: 'Лежа на животе',
              required: false,
              readOnly: false,
              options: [
                'Опоры на руки нет',
                'Опирается на предплечья',
                'Опирается на выпрямленные руки',
                'Кисти сжаты в кулак',
                'D',
                'S'
              ]
            },
            {
              name: 'sittingOnHeels',
              type: 'checkbox-group',
              label: 'Переход в позу сидя на пятках',
              required: false,
              readOnly: false,
              options: [
                'Отсутствует',
                'С помощью взрослого',
                'Сидит не долго',
                'С опорой на предплечья',
                'С опорой на выпрямленные руки',
                'Кисти сжаты в кулак',
                'D',
                'S'
              ]
            },
            {
              name: 'crawling',
              type: 'checkbox-group',
              label: 'Ползанье по-пластунски',
              required: false,
              readOnly: false,
              options: [
                'Отсутствуют',
                'Согласованно',
                'Подтягиваясь на предплечьях',
                'Отталкиваясь ногами',
                'Реципрокно'
              ]
            },
            {
              name: 'standingOnAllFours',
              type: 'checkbox-group',
              label: 'Стояние на четвереньках',
              required: false,
              readOnly: false,
              options: [
                'Отсутствует',
                'Прыжками',
                'Реципрокно'
              ]
            },
            {
              name: 'kneelingTransition',
              type: 'checkbox-group',
              label: 'Переход в позу стоя на коленях',
              required: false,
              readOnly: false,
              options: [
                'Отсутствует',
                'У опоры',
                'Самостоятельно',
                'Передвигается у опоры',
                'Передвигается самостоятельно'
              ]
            },
            {
              name: 'sittingTransition',
              type: 'checkbox-group',
              label: 'Переход в положение сидя',
              required: false,
              readOnly: false,
              options: [
                'С опорой на правую руку',
                'С опорой на левую руку',
                'При фиксации ног',
                'С поворотом на бок',
                'D',
                'S',
                'С поворотом на живот'
              ]
            },
            {
              name: 'sitting',
              type: 'checkbox-group',
              label: 'Сидит',
              required: false,
              readOnly: false,
              options: [
                'Не сидит',
                'По-турецки',
                'С прямыми ногами',
                'С опущенными ногами',
                'С опорой на руки',
                'D',
                'S',
                'Самостоятельно',
                'С помощью взрослого'
              ]
            },
            {
              name: 'standing',
              type: 'checkbox-group',
              label: 'Стоит',
              required: false,
              readOnly: false,
              options: [
                'Не стоит',
                'У опоры',
                'С поддержкой за 1 руку',
                'Несколько секунд',
                'Несколько минут',
                'Долго'
              ]
            },
            {
              name: 'walking',
              type: 'checkbox-group',
              label: 'Ходит',
              required: false,
              readOnly: false,
              options: [
                'Не ходит',
                'Ходит',
                'С поддержкой со стороны спины',
                'С поддержкой за 1 руку',
                'D',
                'S',
                'Самостоятельно',
                'Устойчиво',
                'Неустойчиво',
                'Стремительно',
                'С ортопедической обувью',
                'Без обуви',
                'Передвигается в ходунках',
                'С колесами спереди',
                'С поддержкой типа трусики',
                'С поддержкой сбоку и сзади',
                'С четырехопорной тростью',
                'С тростью',
                'С канадскими палочками',
                'Передвигается на расстояние 5 метров',
                '10 метров',
                '25 метров',
                '50 метров',
                'Более 50 метров'
              ]
            }
          ]
        },
        {
          title: 'Походка',
          fields: [
            {
              name: 'spine',
              type: 'checkbox-group',
              label: 'Спина',
              required: false,
              readOnly: false,
              options: [
                'Гиперкифоз',
                'Гиперлордоз',
                'Круглая спина',
                'Кругло-вогнутая спина',
                'С-образное искривление позвоночника',
                'Вправо',
                'Влево',
                'S-образное искривление позвоночника',
                'Нарушение осанки',
                'Ослаблены мышцы туловища в шейном отделе позвоночника',
                'D',
                'S',
                'Ослаблены мышцы туловища в грудном отделе позвоночника',
                'D',
                'S',
                'Ослаблены мышцы туловища в поясничном отделе позвоночника',
                'D',
                'S',
                'Ослаблены мышцы брюшного пресса',
                'D',
                'S',
                'Ослаблены ягодичные мышцы',
                'D',
                'S',
                'Фронтальные колебания туловища',
                'Сагиттальные колебания туловища',
                'Фронтальные колебания таза',
                'Руки в сгибательно-пронаторном положении',
                'D',
                'S',
                'Кисти сжаты в кулак',
                'D',
                'S',
                'Ротация бедер внутрь',
                'D',
                'S',
                'Разгибание в коленном суставе затруднено',
                'D',
                'S',
                'Отсутствует',
                'D',
                'S',
                'Перекрест на уровне бедер',
                'Перекрест на уровне колен',
                'Перекрест на уровне нижней трети голени',
                'Перекрест на уровне стоп'
              ]
            },
            {
              name: 'lowerLimbAlignment',
              type: 'checkbox-group',
              label: 'Установка нижних конечностей',
              required: false,
              readOnly: false,
              options: [
                'Х-образная',
                'О-образная',
                'Рекурвация в коленных суставах',
                'D',
                'S'
              ]
            },
            {
              name: 'footAlignment',
              type: 'checkbox-group',
              label: 'Установка стоп',
              required: false,
              readOnly: false,
              options: [
                'Плоско',
                'Вальгус',
                'Варус',
                'D',
                'S',
                'Эквино',
                'Вальгус',
                'Варус',
                'D',
                'S',
                'Высокий эквинус',
                'D',
                'S',
                'Загребает передним отделом стоп',
                'D',
                'S'
              ]
            }
          ]
        },
        {
          title: 'Заключение',
          fields: [
            {
              name: 'conclusion',
              type: 'textarea',
              label: 'Заключение',
              required: true,
              readOnly: false
            },
            {
              name: 'recommendations',
              type: 'textarea',
              label: 'Рекомендации',
              required: true,
              readOnly: false
            }
          ]
        }
      ]
    },
    isActive: true,
    clinicId: null,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '36541e76-d3cf-4618-93f2-b63f36f28660',
    title: 'FIM — мера функциональной независимости',
    type: 'fim',
    description: 'Форма для оценки функциональной независимости пациента',
    schema: {
      sections: [
        {
          title: 'Информация о тесте',
          fields: [
            {
              name: 'therapistName',
              type: 'text',
              label: 'ФИО специалиста',
              required: true,
              readOnly: false
            },
            {
              name: 'examinationDate',
              type: 'date',
              label: 'Дата проведения',
              required: true,
              readOnly: false
            },
            {
              name: 'patientName',
              type: 'text',
              label: 'ФИО пациента',
              required: true,
              readOnly: false
            }
          ]
        },
        {
          title: 'Самообслуживание (ADL)',
          fields: [
            {
              name: 'eatingScoreBefore',
              type: 'rating',
              label: 'Прием пищи (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'eatingScoreAfter',
              type: 'rating',
              label: 'Прием пищи (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'swallowingScoreBefore',
              type: 'rating',
              label: 'Глотание (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'swallowingScoreAfter',
              type: 'rating',
              label: 'Глотание (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'groomingScoreBefore',
              type: 'rating',
              label: 'Уход за собой (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'groomingScoreAfter',
              type: 'rating',
              label: 'Уход за собой (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'bathingScoreBefore',
              type: 'rating',
              label: 'Купание (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'bathingScoreAfter',
              type: 'rating',
              label: 'Купание (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'dressUpperScoreBefore',
              type: 'rating',
              label: 'Одевание верхней части (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'dressUpperScoreAfter',
              type: 'rating',
              label: 'Одевание верхней части (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'dressLowerScoreBefore',
              type: 'rating',
              label: 'Одевание нижней части (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'dressLowerScoreAfter',
              type: 'rating',
              label: 'Одевание нижней части (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'toiletingScoreBefore',
              type: 'rating',
              label: 'Туалет (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'toiletingScoreAfter',
              type: 'rating',
              label: 'Туалет (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'bladderScoreBefore',
              type: 'rating',
              label: 'Контроль мочеиспускания (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'bladderScoreAfter',
              type: 'rating',
              label: 'Контроль мочеиспускания (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'bowelScoreBefore',
              type: 'rating',
              label: 'Контроль дефекации (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'bowelScoreAfter',
              type: 'rating',
              label: 'Контроль дефекации (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            }
          ]
        },
        {
          title: 'Перемещения и мобильность',
          fields: [
            {
              name: 'bedTransferScoreBefore',
              type: 'rating',
              label: 'Перемещение кровать/стул/коляска (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'bedTransferScoreAfter',
              type: 'rating',
              label: 'Перемещение кровать/стул/коляска (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'toiletTransferScoreBefore',
              type: 'rating',
              label: 'Перемещение туалет (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'toiletTransferScoreAfter',
              type: 'rating',
              label: 'Перемещение туалет (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'bathTransferScoreBefore',
              type: 'rating',
              label: 'Перемещение ванна/душ (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'bathTransferScoreAfter',
              type: 'rating',
              label: 'Перемещение ванна/душ (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'walkingScoreBefore',
              type: 'rating',
              label: 'Ходьба/Коляска (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'walkingScoreAfter',
              type: 'rating',
              label: 'Ходьба/Коляска (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'stairsScoreBefore',
              type: 'rating',
              label: 'Подъем по лестнице (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'stairsScoreAfter',
              type: 'rating',
              label: 'Подъем по лестнице (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            }
          ]
        },
        {
          title: 'Коммуникация',
          fields: [
            {
              name: 'comprehensionScoreBefore',
              type: 'rating',
              label: 'Понимание (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'comprehensionScoreAfter',
              type: 'rating',
              label: 'Понимание (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'expressionScoreBefore',
              type: 'rating',
              label: 'Выражение (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'expressionScoreAfter',
              type: 'rating',
              label: 'Выражение (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'socialInteractionScoreBefore',
              type: 'rating',
              label: 'Социальное взаимодействие (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'socialInteractionScoreAfter',
              type: 'rating',
              label: 'Социальное взаимодействие (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'problemSolvingScoreBefore',
              type: 'rating',
              label: 'Решение проблем (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'problemSolvingScoreAfter',
              type: 'rating',
              label: 'Решение проблем (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'memoryScoreBefore',
              type: 'rating',
              label: 'Память (До)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            },
            {
              name: 'memoryScoreAfter',
              type: 'rating',
              label: 'Память (После)',
              required: false,
              readOnly: false,
              min: 1,
              max: 7
            }
          ]
        },
        {
          title: 'Заключение',
          fields: [
            {
              name: 'totalScore',
              type: 'number',
              label: 'Общий балл',
              required: false,
              readOnly: true
            },
            {
              name: 'conclusion',
              type: 'textarea',
              label: 'Заключение',
              required: true,
              readOnly: false
            },
            {
              name: 'recommendations',
              type: 'textarea',
              label: 'Рекомендации',
              required: true,
              readOnly: false
            }
          ]
        }
      ]
    },
    isActive: true,
    clinicId: null,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  }
];

// Заполненные формы - только ЛФК и ФИМ
const formEntries = [
  // ЛФК формы
  {
    id: '550e8400-e29b-41d4-a716-446655440207',
    clientId: '550e8400-e29b-41d4-a716-446655440001', // Иванов Иван
    formTemplateId: '1652b729-e2ec-4cd4-9489-d9ab38e16db8', // ЛФК форма
    data: {
      therapistName: 'Сидоров Петр Александрович',
      examinationDate: '2025-01-30',
      patientName: 'Иванов Иван Иванович',
      headHolding: ['Удерживает', 'С наклоном вправо'],
      turns: ['Со спины на живот', 'С живота на спину'],
      lyingOnStomach: ['Опирается на предплечья', 'D'],
      sittingOnHeels: ['С помощью взрослого', 'Сидит не долго'],
      crawling: ['Согласованно', 'Реципрокно'],
      standingOnAllFours: ['Прыжками'],
      kneelingTransition: ['У опоры', 'Передвигается у опоры'],
      sittingTransition: ['С опорой на правую руку', 'D'],
      sitting: ['С опорой на руки', 'D', 'С помощью взрослого'],
      standing: ['У опоры', 'С поддержкой за 1 руку'],
      walking: ['Ходит', 'С поддержкой за 1 руку', 'D', 'Неустойчиво', 'Передвигается на расстояние 10 метров'],
      spine: ['Гиперкифоз', 'Ослаблены мышцы туловища в грудном отделе позвоночника', 'D', 'S'],
      lowerLimbAlignment: ['Х-образная'],
      footAlignment: ['Плоско', 'D', 'S'],
      conclusion: 'Пациент демонстрирует значительные улучшения в двигательных навыках после курса ЛФК. Отмечается прогресс в удержании головы, переворотах и начальных этапах ползания.',
      recommendations: 'Индивидуальная программа ЛФК, тренировка равновесия, укрепление мышц туловища, работа над координацией движений.'
    },
    status: 'completed',
    createdBy: null,
    completedBy: null,
    completedAt: '2025-01-30T16:00:00.000Z',
    createdAt: '2025-01-30T14:00:00.000Z',
    updatedAt: '2025-01-30T16:00:00.000Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440208',
    clientId: '550e8400-e29b-41d4-a716-446655440002', // Петрова Анна
    formTemplateId: '1652b729-e2ec-4cd4-9489-d9ab38e16db8', // ЛФК форма
    data: {
      therapistName: 'Козлова Мария Сергеевна',
      examinationDate: '2025-02-28',
      patientName: 'Петрова Анна Сергеевна',
      headHolding: ['Удерживает'],
      turns: ['Со спины на живот', 'С живота на спину', 'Вправо'],
      lyingOnStomach: ['Опирается на выпрямленные руки'],
      sittingOnHeels: ['Самостоятельно'],
      crawling: ['Согласованно', 'Реципрокно'],
      standingOnAllFours: ['Реципрокно'],
      kneelingTransition: ['Самостоятельно', 'Передвигается самостоятельно'],
      sittingTransition: ['С опорой на левую руку', 'S'],
      sitting: ['Самостоятельно', 'С прямыми ногами'],
      standing: ['Самостоятельно', 'Долго'],
      walking: ['Ходит', 'Самостоятельно', 'Устойчиво', 'Передвигается на расстояние 50 метров'],
      spine: ['Нарушение осанки', 'Ослаблены мышцы брюшного пресса', 'D', 'S'],
      lowerLimbAlignment: ['О-образная'],
      footAlignment: ['Вальгус', 'D', 'S'],
      conclusion: 'Пациентка демонстрирует хорошие двигательные навыки. Отмечается нарушение осанки и слабость мышц брюшного пресса.',
      recommendations: 'Коррекция осанки, укрепление мышц брюшного пресса, упражнения на равновесие, индивидуальная программа ЛФК.'
    },
    status: 'completed',
    createdBy: null,
    completedBy: null,
    completedAt: '2025-02-28T15:30:00.000Z',
    createdAt: '2025-02-28T13:00:00.000Z',
    updatedAt: '2025-02-28T15:30:00.000Z'
  },
  // FIM формы
  {
    id: '550e8400-e29b-41d4-a716-446655440209',
    clientId: '550e8400-e29b-41d4-a716-446655440001', // Иванов Иван
    formTemplateId: '36541e76-d3cf-4618-93f2-b63f36f28660', // FIM форма
    data: {
      therapistName: 'Иванова Елена Владимировна',
      examinationDate: '2025-02-05',
      patientName: 'Иванов Иван Иванович',
      eatingScoreBefore: 3,
      eatingScoreAfter: 5,
      swallowingScoreBefore: 4,
      swallowingScoreAfter: 6,
      groomingScoreBefore: 2,
      groomingScoreAfter: 4,
      bathingScoreBefore: 1,
      bathingScoreAfter: 3,
      dressUpperScoreBefore: 2,
      dressUpperScoreAfter: 4,
      dressLowerScoreBefore: 1,
      dressLowerScoreAfter: 3,
      toiletingScoreBefore: 2,
      toiletingScoreAfter: 4,
      bladderScoreBefore: 4,
      bladderScoreAfter: 6,
      bowelScoreBefore: 5,
      bowelScoreAfter: 7,
      bedTransferScoreBefore: 2,
      bedTransferScoreAfter: 4,
      toiletTransferScoreBefore: 1,
      toiletTransferScoreAfter: 3,
      bathTransferScoreBefore: 1,
      bathTransferScoreAfter: 3,
      walkingScoreBefore: 2,
      walkingScoreAfter: 4,
      stairsScoreBefore: 1,
      stairsScoreAfter: 3,
      comprehensionScoreBefore: 5,
      comprehensionScoreAfter: 6,
      expressionScoreBefore: 4,
      expressionScoreAfter: 5,
      socialInteractionScoreBefore: 4,
      socialInteractionScoreAfter: 5,
      problemSolvingScoreBefore: 3,
      problemSolvingScoreAfter: 4,
      memoryScoreBefore: 4,
      memoryScoreAfter: 5,
      totalScore: 126,
      conclusion: 'Пациент демонстрирует значительные улучшения в функциональной независимости. Общий балл увеличился с 78 до 126, что указывает на хороший прогресс в реабилитации.',
      recommendations: 'Продолжить курс реабилитации, уделить внимание тренировке навыков самообслуживания, работе над координацией движений и когнитивными функциями.'
    },
    status: 'completed',
    createdBy: null,
    completedBy: null,
    completedAt: '2025-02-05T17:00:00.000Z',
    createdAt: '2025-02-05T14:00:00.000Z',
    updatedAt: '2025-02-05T17:00:00.000Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440210',
    clientId: '550e8400-e29b-41d4-a716-446655440002', // Петрова Анна
    formTemplateId: '36541e76-d3cf-4618-93f2-b63f36f28660', // FIM форма
    data: {
      therapistName: 'Петров Дмитрий Алексеевич',
      examinationDate: '2025-03-05',
      patientName: 'Петрова Анна Сергеевна',
      eatingScoreBefore: 6,
      eatingScoreAfter: 7,
      swallowingScoreBefore: 7,
      swallowingScoreAfter: 7,
      groomingScoreBefore: 5,
      groomingScoreAfter: 6,
      bathingScoreBefore: 4,
      bathingScoreAfter: 5,
      dressUpperScoreBefore: 5,
      dressUpperScoreAfter: 6,
      dressLowerScoreBefore: 4,
      dressLowerScoreAfter: 5,
      toiletingScoreBefore: 5,
      toiletingScoreAfter: 6,
      bladderScoreBefore: 6,
      bladderScoreAfter: 7,
      bowelScoreBefore: 6,
      bowelScoreAfter: 7,
      bedTransferScoreBefore: 5,
      bedTransferScoreAfter: 6,
      toiletTransferScoreBefore: 4,
      toiletTransferScoreAfter: 5,
      bathTransferScoreBefore: 3,
      bathTransferScoreAfter: 4,
      walkingScoreBefore: 5,
      walkingScoreAfter: 6,
      stairsScoreBefore: 4,
      stairsScoreAfter: 5,
      comprehensionScoreBefore: 7,
      comprehensionScoreAfter: 7,
      expressionScoreBefore: 6,
      expressionScoreAfter: 7,
      socialInteractionScoreBefore: 6,
      socialInteractionScoreAfter: 7,
      problemSolvingScoreBefore: 5,
      problemSolvingScoreAfter: 6,
      memoryScoreBefore: 6,
      memoryScoreAfter: 7,
      totalScore: 168,
      conclusion: 'Пациентка демонстрирует высокий уровень функциональной независимости. Общий балл увеличился с 142 до 168, что указывает на отличный прогресс в реабилитации.',
      recommendations: 'Поддерживающая программа упражнений, профилактика рецидивов, рекомендации по физической активности в повседневной жизни.'
    },
    status: 'completed',
    createdBy: null,
    completedBy: null,
    completedAt: '2025-03-05T16:30:00.000Z',
    createdAt: '2025-03-05T13:00:00.000Z',
    updatedAt: '2025-03-05T16:30:00.000Z'
  }
];

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'reki',
    password: 'reki',
    database: 'reki',
  },
});

async function seedForms() {
  try {
    console.log('Starting forms seeding...');
    
    // Сначала заполняем шаблоны форм
    console.log('Inserting form templates...');
    for (const template of formTemplates) {
      await db('form_templates').insert({
        id: template.id,
        title: template.title,
        type: template.type,
        description: template.description,
        schema: template.schema,
        is_active: template.isActive,
        clinic_id: template.clinicId,
        created_at: template.createdAt,
        updated_at: template.updatedAt,
      });
      console.log(`Inserted form template: ${template.title}`);
    }
    
    // Затем заполняем записи форм
    console.log('Inserting form entries...');
    for (const entry of formEntries) {
      await db('form_entries').insert({
        id: entry.id,
        client_id: entry.clientId,
        form_template_id: entry.formTemplateId,
        data: entry.data,
        status: entry.status,
        created_by: entry.createdBy,
        completed_by: entry.completedBy,
        completed_at: entry.completedAt,
        created_at: entry.createdAt,
        updated_at: entry.updatedAt,
      });
      console.log(`Inserted form entry: ${entry.id}`);
    }
    
    console.log('Forms seeding completed successfully!');
  } catch (error) {
    console.error('Forms seeding failed:', error);
  } finally {
    await db.destroy();
  }
}

seedForms();
