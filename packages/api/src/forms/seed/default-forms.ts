import { FormType, FormStatus, type Form } from '@reki/domain';

export const defaultForms: Form[] = [
  {
    id: '085c59c7-4345-4aae-85fb-6a2d14f13acd',
    title: 'Осмотр инструктора-методиста ЛФК',
    type: FormType.LFK,
    status: FormStatus.ACTIVE,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    schema: {
      sections: [
        {
          title: 'Общая информация',
          fields: [
            {
              name: 'therapistName',
              type: 'text',
              label: 'ФИО специалиста',
              required: true
            },
            {
              name: 'examinationDate',
              type: 'date',
              label: 'Дата осмотра',
              required: true
            },
            {
              name: 'patientName',
              type: 'text',
              label: 'ФИО пациента',
              required: true
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
                'S',
                'С приведением переднего отдела стопы внутрь',
                'D',
                'S',
                'С отведением переднего отдела стопы наружу',
                'D',
                'S'
              ]
            }
          ]
        },
        {
          title: 'Наличие контрактур в суставах',
          fields: [
            {
              name: 'wristContractures',
              type: 'checkbox-group',
              label: 'Лучезапястном',
              options: [
                'Сгибательная',
                'D',
                'S',
                'Разгибательная',
                'D',
                'S',
                'Динамическая',
                'Фиксированная'
              ]
            },
            {
              name: 'elbowContractures',
              type: 'checkbox-group',
              label: 'Локтевом',
              options: [
                'Сгибательная',
                'D',
                'S',
                'Пронаторная',
                'D',
                'S',
                'Динамическая',
                'Фиксированная'
              ]
            },
            {
              name: 'shoulderContractures',
              type: 'checkbox-group',
              label: 'Плечевом',
              options: [
                'Сгибательная',
                'D',
                'S',
                'Разгибательная',
                'D',
                'S',
                'Пронаторная',
                'D',
                'S',
                'Динамическая',
                'Фиксированная'
              ]
            },
            {
              name: 'ankleContractures',
              type: 'checkbox-group',
              label: 'Голеностопном',
              options: [
                'Сгибательная',
                'D',
                'S',
                'Разгибательная',
                'D',
                'S',
                'Динамическая',
                'Фиксированная'
              ]
            },
            {
              name: 'kneeContractures',
              type: 'checkbox-group',
              label: 'Коленном',
              options: [
                'Сгибательная',
                'D',
                'S',
                'Динамическая',
                'Фиксированная'
              ]
            },
            {
              name: 'hipContractures',
              type: 'checkbox-group',
              label: 'Тазобедренном',
              options: [
                'Сгибательная',
                'D',
                'S',
                'Приводящая',
                'D',
                'S',
                'Отводящая',
                'D',
                'S',
                'Динамическая',
                'Фиксированная'
              ]
            }
          ]
        },
        {
          title: 'Наличие нестабильности в суставах',
          fields: [
            {
              name: 'jointInstability',
              type: 'checkbox-group',
              label: 'Наличие нестабильности в суставах',
              options: [
                'Лучезапястном',
                'D',
                'S',
                'Локтевом',
                'D',
                'S',
                'Плечевом',
                'D',
                'S',
                'Голеностопном',
                'D',
                'S',
                'Коленном',
                'D',
                'S',
                'Тазобедренном',
                'D',
                'S'
              ]
            }
          ]
        },
        {
          title: 'Наличие патологических рефлексов новорожденных',
          fields: [
            {
              name: 'pathologicalReflexes',
              type: 'checkbox-group',
              label: 'Наличие патологических рефлексов новорожденных',
              options: [
                'ААСШТР',
                'СШТР',
                'ЛТР'
              ]
            }
          ]
        },
        {
          title: 'Измерение объема движений по суставам нижних конечностей',
          fields: [
            {
              name: 'rectusMeasurement',
              type: 'number',
              label: 'Ректус (градусы)',
              min: 0,
              max: 180
            },
            {
              name: 'externalHipRotation',
              type: 'number',
              label: 'Наружная ротация бедра (градусы)',
              min: 0,
              max: 90
            },
            {
              name: 'hamstringMeasurement',
              type: 'number',
              label: 'Хамстринг (градусы)',
              min: 0,
              max: 180
            },
            {
              name: 'hipFlexion',
              type: 'number',
              label: 'Тазобедренный сустав - сгибание (градусы)',
              min: 0,
              max: 120
            },
            {
              name: 'hipExtension',
              type: 'number',
              label: 'Тазобедренный сустав - разгибание (градусы)',
              min: 0,
              max: 30
            },
            {
              name: 'hipAbduction',
              type: 'number',
              label: 'Тазобедренный сустав - отведение (градусы)',
              min: 0,
              max: 45
            },
            {
              name: 'kneeFlexion',
              type: 'number',
              label: 'Коленный сустав - сгибание (градусы)',
              min: 0,
              max: 135
            },
            {
              name: 'kneeExtension',
              type: 'number',
              label: 'Коленный сустав - разгибание (градусы)',
              min: 0,
              max: 10
            },
            {
              name: 'ankleDorsiflexion',
              type: 'number',
              label: 'Голеностопный сустав - тыльное сгибание (градусы)',
              min: 0,
              max: 20
            },
            {
              name: 'anklePlantarflexion',
              type: 'number',
              label: 'Голеностопный сустав - разгибание (градусы)',
              min: 0,
              max: 50
            }
          ]
        },
        {
          title: 'Лечебная гимнастика направлена на',
          fields: [
            {
              name: 'therapeuticGoals',
              type: 'checkbox-group',
              label: 'Лечебная гимнастика направлена на:',
              options: [
                'Глазодвигательное стимулирование',
                'Лечение положением',
                'Диагональная гимнастика',
                'Занятия в вертикализаторе',
                'Упражнения для верхних конечностей по методике Мишель ля Матье',
                'Развитие отведения пальца кисти',
                'Экстензии кисти',
                'Супинации предплечий',
                'Разгибания в локтевых суставах',
                'Отведения в плечевых суставах',
                'Стабилизация лопаток',
                'Гимнастика по методике «Баланс»',
                'Упражнения на координацию и равновесие',
                'Формирование правильного кинематического шага: Сгибание',
                'Вынос бедра',
                'Разгибание голени',
                'Тыльное сгибание стопы',
                'Постановка стопы на пятку',
                'Перекат с пятки на носок',
                'Передний толчок'
              ]
            }
          ]
        },
        {
          title: 'Коррекция двигательных навыков',
          fields: [
            {
              name: 'headHoldingCorrection',
              type: 'checkbox-group',
              label: 'Удержание головы',
              options: ['Развитие', 'Улучшение']
            },
            {
              name: 'forearmSupportCorrection',
              type: 'checkbox-group',
              label: 'Опора на предплечья',
              options: ['Развитие', 'Улучшение']
            },
            {
              name: 'straightArmSupportCorrection',
              type: 'checkbox-group',
              label: 'Опора на выпрямленные руки',
              options: ['Развитие', 'Улучшение']
            },
            {
              name: 'backToStomachTurnCorrection',
              type: 'checkbox-group',
              label: 'Переворот со спины на живот',
              options: ['Развитие', 'Улучшение']
            },
            {
              name: 'stomachToBackTurnCorrection',
              type: 'checkbox-group',
              label: 'Переворот с живота на спину',
              options: ['Развитие', 'Улучшение']
            },
            {
              name: 'sittingTransitionCorrection',
              type: 'checkbox-group',
              label: 'Переход в положение сидя',
              options: [
                'Через правую руку',
                'Через левую руку',
                'Без помощи рук'
              ]
            },
            {
              name: 'crawlingCorrection',
              type: 'checkbox-group',
              label: 'Ползание по-пластунски',
              options: ['Развитие', 'Улучшение']
            },
            {
              name: 'allFoursCrawlingCorrection',
              type: 'checkbox-group',
              label: 'Ползание на четвереньках',
              options: ['Развитие', 'Улучшение']
            },
            {
              name: 'kneelingMovementCorrection',
              type: 'checkbox-group',
              label: 'Передвижение стоя на коленях',
              options: ['Развитие', 'Улучшение']
            },
            {
              name: 'kneelingStandingCorrection',
              type: 'checkbox-group',
              label: 'Вставание с колен',
              options: ['Развитие', 'Улучшение']
            },
            {
              name: 'walkerWalkingCorrection',
              type: 'checkbox-group',
              label: 'Ходьба с ходунками',
              options: ['Развитие', 'Улучшение']
            },
            {
              name: 'crutchWalkingCorrection',
              type: 'checkbox-group',
              label: 'Ходьба с канадскими палочками',
              options: ['Развитие', 'Улучшение']
            },
            {
              name: 'caneWalkingCorrection',
              type: 'checkbox-group',
              label: 'Ходьба с тростью',
              options: ['Развитие', 'Улучшение']
            },
            {
              name: 'wheelchairTraining',
              type: 'checkbox',
              label: 'Обучение передвижению на коляске'
            }
          ]
        },
        {
          title: 'Укрепление мышц',
          fields: [
            {
              name: 'muscleStrengthening',
              type: 'checkbox-group',
              label: 'Укрепление мышц',
              options: [
                'Спины',
                'Брюшного пресса',
                'Косых мышц живота',
                'D',
                'S',
                'Ягодичных',
                'Разгибателей предплечий',
                'Супинаторов предплечий',
                'D',
                'S',
                'Экстензоров кисти',
                'D',
                'S',
                'Отводящих бедер',
                'D',
                'S',
                'Разгибателей голени',
                'D',
                'S',
                'Тыльного сгибания стопы',
                'D',
                'S',
                'Икроножных мышц',
                'D',
                'S'
              ]
            }
          ]
        },
        {
          title: 'Расслабление, растягивание мышц',
          fields: [
            {
              name: 'muscleRelaxation',
              type: 'checkbox-group',
              label: 'Расслабление, растягивание мышц',
              options: [
                'Больших грудных мышц',
                'D',
                'S',
                'Косых мышц живота',
                'D',
                'S',
                'Сгибателей предплечий',
                'D',
                'S',
                'Пронаторов предплечий',
                'D',
                'S',
                'Флексирующих кисть',
                'D',
                'S',
                'Сгибателей бедра',
                'D',
                'S',
                'Сгибателей голени',
                'D',
                'S',
                'Икроножных мышц',
                'D',
                'S',
                'Ахиллова сухожилия',
                'D',
                'S'
              ]
            }
          ]
        },
        {
          title: 'Коррекция установок, контрактур и деформаций',
          fields: [
            {
              name: 'postureCorrection',
              type: 'checkbox-group',
              label: 'Коррекция установок, контрактур и деформаций',
              options: [
                'Х-образной установки нижних конечностей',
                'О-образной установки нижних конечностей',
                'Рекурвации',
                'Плоско-вальгусной установки стоп',
                'Плоско-варусной установки стоп',
                'Эквино-варусной установки стоп',
                'Эквинуса'
              ]
            },
            {
              name: 'orthopedicDevices',
              type: 'checkbox-group',
              label: 'Ортопедические устройства',
              options: [
                'Вертикализация на всю ногу на две ноги с полукорсетом',
                'Стоять, ходить в туторах на коленные суставы+аппараты на голеностопные суставы (ортопедическая обувь)+реклинирующая система',
                'Использование динамического корригирующего устройства'
              ]
            }
          ]
        },
        {
          title: 'Дополнительные упражнения',
          fields: [
            {
              name: 'passiveRangeIncrease',
              type: 'checkbox',
              label: 'Увеличение пассивного объема движений в суставах'
            },
            {
              name: 'generalExercises',
              type: 'checkbox',
              label: 'Общеразвивающие упражнения'
            },
            {
              name: 'jumpingDevelopment',
              type: 'checkbox-group',
              label: 'Развитие прыжков',
              options: [
                'На правой ноге',
                'На левой ноге',
                'На двух ногах'
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
              required: true
            },
            {
              name: 'recommendations',
              type: 'textarea',
              label: 'Рекомендации',
              required: true
            }
          ]
        }
      ]
    }
  },
  {
    id: 'b5340efc-e968-4112-a847-c84735ec32ef',
    title: 'FIM — мера функциональной независимости',
    type: FormType.FIM,
    status: FormStatus.ACTIVE,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    schema: {
      sections: [
        {
          title: 'Информация о тесте',
          fields: [
            {
              name: 'therapistName',
              type: 'text',
              label: 'ФИО специалиста',
              required: true
            },
            {
              name: 'examinationDate',
              type: 'date',
              label: 'Дата проведения',
              required: true
            },
            {
              name: 'patientName',
              type: 'text',
              label: 'ФИО пациента',
              required: true
            }
          ]
        },
        {
          title: 'Самообслуживание (ADL)',
          fields: [
            {
              name: 'eating',
              type: 'checkbox-group',
              label: 'Прием пищи',
              options: ['До', 'После']
            },
            {
              name: 'eatingScore',
              type: 'rating',
              label: 'Оценка приема пищи',
              min: 1,
              max: 7
            },
            {
              name: 'swallowing',
              type: 'checkbox-group',
              label: 'Глотание',
              options: ['До', 'После']
            },
            {
              name: 'swallowingScore',
              type: 'rating',
              label: 'Оценка глотания',
              min: 1,
              max: 7
            },
            {
              name: 'grooming',
              type: 'checkbox-group',
              label: 'Уход за собой',
              options: ['До', 'После']
            },
            {
              name: 'groomingScore',
              type: 'rating',
              label: 'Оценка ухода за собой',
              min: 1,
              max: 7
            },
            {
              name: 'bathing',
              type: 'checkbox-group',
              label: 'Купание',
              options: ['До', 'После']
            },
            {
              name: 'bathingScore',
              type: 'rating',
              label: 'Оценка купания',
              min: 1,
              max: 7
            },
            {
              name: 'dressUpper',
              type: 'checkbox-group',
              label: 'Одевание (верхняя часть тела)',
              options: ['До', 'После']
            },
            {
              name: 'dressUpperScore',
              type: 'rating',
              label: 'Оценка одевания (верхняя часть)',
              min: 1,
              max: 7
            },
            {
              name: 'dressLower',
              type: 'checkbox-group',
              label: 'Одевание (нижняя часть тела)',
              options: ['До', 'После']
            },
            {
              name: 'dressLowerScore',
              type: 'rating',
              label: 'Оценка одевания (нижняя часть)',
              min: 1,
              max: 7
            },
            {
              name: 'toileting',
              type: 'checkbox-group',
              label: 'Туалет',
              options: ['До', 'После']
            },
            {
              name: 'toiletingScore',
              type: 'rating',
              label: 'Оценка туалета',
              min: 1,
              max: 7
            },
            {
              name: 'bladder',
              type: 'checkbox-group',
              label: 'Контроль мочеиспускания',
              options: ['До', 'После']
            },
            {
              name: 'bladderScore',
              type: 'rating',
              label: 'Оценка контроля мочеиспускания',
              min: 1,
              max: 7
            },
            {
              name: 'bowel',
              type: 'checkbox-group',
              label: 'Контроль дефекации',
              options: ['До', 'После']
            },
            {
              name: 'bowelScore',
              type: 'rating',
              label: 'Оценка контроля дефекации',
              min: 1,
              max: 7
            }
          ]
        },
        {
          title: 'Перемещения и мобильность',
          fields: [
            {
              name: 'bedTransfer',
              type: 'checkbox-group',
              label: 'Перемещение: кровать/стул/коляска',
              options: ['До', 'После']
            },
            {
              name: 'bedTransferScore',
              type: 'rating',
              label: 'Оценка перемещения кровать/стул/коляска',
              min: 1,
              max: 7
            },
            {
              name: 'toiletTransfer',
              type: 'checkbox-group',
              label: 'Перемещение: туалет',
              options: ['До', 'После']
            },
            {
              name: 'toiletTransferScore',
              type: 'rating',
              label: 'Оценка перемещения туалет',
              min: 1,
              max: 7
            },
            {
              name: 'bathTransfer',
              type: 'checkbox-group',
              label: 'Перемещение: ванна/душ',
              options: ['До', 'После']
            },
            {
              name: 'bathTransferScore',
              type: 'rating',
              label: 'Оценка перемещения ванна/душ',
              min: 1,
              max: 7
            },
            {
              name: 'carTransfer',
              type: 'checkbox-group',
              label: 'Перемещение: автомобиль',
              options: ['До', 'После']
            },
            {
              name: 'carTransferScore',
              type: 'rating',
              label: 'Оценка перемещения автомобиль',
              min: 1,
              max: 7
            },
            {
              name: 'locomotion',
              type: 'checkbox-group',
              label: 'Передвижение',
              options: ['До', 'После']
            },
            {
              name: 'locomotionScore',
              type: 'rating',
              label: 'Оценка передвижения',
              min: 1,
              max: 7
            },
            {
              name: 'stairs',
              type: 'checkbox-group',
              label: 'Подъем по лестнице',
              options: ['До', 'После']
            },
            {
              name: 'stairsScore',
              type: 'rating',
              label: 'Оценка подъема по лестнице',
              min: 1,
              max: 7
            },
            {
              name: 'mobility',
              type: 'checkbox-group',
              label: 'Мобильность',
              options: ['До', 'После']
            },
            {
              name: 'mobilityScore',
              type: 'rating',
              label: 'Оценка мобильности',
              min: 1,
              max: 7
            }
          ]
        },
        {
          title: 'Коммуникация и когнитивные/социальные навыки',
          fields: [
            {
              name: 'comprehension',
              type: 'checkbox-group',
              label: 'Понимание',
              options: ['До', 'После']
            },
            {
              name: 'comprehensionScore',
              type: 'rating',
              label: 'Оценка понимания',
              min: 1,
              max: 7
            },
            {
              name: 'expression',
              type: 'checkbox-group',
              label: 'Выражение',
              options: ['До', 'После']
            },
            {
              name: 'expressionScore',
              type: 'rating',
              label: 'Оценка выражения',
              min: 1,
              max: 7
            },
            {
              name: 'reading',
              type: 'checkbox-group',
              label: 'Чтение',
              options: ['До', 'После']
            },
            {
              name: 'readingScore',
              type: 'rating',
              label: 'Оценка чтения',
              min: 1,
              max: 7
            },
            {
              name: 'writing',
              type: 'checkbox-group',
              label: 'Письмо',
              options: ['До', 'После']
            },
            {
              name: 'writingScore',
              type: 'rating',
              label: 'Оценка письма',
              min: 1,
              max: 7
            },
            {
              name: 'speech',
              type: 'checkbox-group',
              label: 'Речь',
              options: ['До', 'После']
            },
            {
              name: 'speechScore',
              type: 'rating',
              label: 'Оценка речи',
              min: 1,
              max: 7
            },
            {
              name: 'socialInteraction',
              type: 'checkbox-group',
              label: 'Социальное взаимодействие',
              options: ['До', 'После']
            },
            {
              name: 'socialInteractionScore',
              type: 'rating',
              label: 'Оценка социального взаимодействия',
              min: 1,
              max: 7
            },
            {
              name: 'emotionalStatus',
              type: 'checkbox-group',
              label: 'Эмоциональное состояние',
              options: ['До', 'После']
            },
            {
              name: 'emotionalStatusScore',
              type: 'rating',
              label: 'Оценка эмоционального состояния',
              min: 1,
              max: 7
            },
            {
              name: 'adjustment',
              type: 'checkbox-group',
              label: 'Адаптация',
              options: ['До', 'После']
            },
            {
              name: 'adjustmentScore',
              type: 'rating',
              label: 'Оценка адаптации',
              min: 1,
              max: 7
            },
            {
              name: 'leisureActivities',
              type: 'checkbox-group',
              label: 'Досуговые занятия',
              options: ['До', 'После']
            },
            {
              name: 'leisureActivitiesScore',
              type: 'rating',
              label: 'Оценка досуговых занятий',
              min: 1,
              max: 7
            },
            {
              name: 'problemSolving',
              type: 'checkbox-group',
              label: 'Решение проблем',
              options: ['До', 'После']
            },
            {
              name: 'problemSolvingScore',
              type: 'rating',
              label: 'Оценка решения проблем',
              min: 1,
              max: 7
            },
            {
              name: 'memory',
              type: 'checkbox-group',
              label: 'Память',
              options: ['До', 'После']
            },
            {
              name: 'memoryScore',
              type: 'rating',
              label: 'Оценка памяти',
              min: 1,
              max: 7
            },
            {
              name: 'orientation',
              type: 'checkbox-group',
              label: 'Ориентация',
              options: ['До', 'После']
            },
            {
              name: 'orientationScore',
              type: 'rating',
              label: 'Оценка ориентации',
              min: 1,
              max: 7
            },
            {
              name: 'concentration',
              type: 'checkbox-group',
              label: 'Концентрация',
              options: ['До', 'После']
            },
            {
              name: 'concentrationScore',
              type: 'rating',
              label: 'Оценка концентрации',
              min: 1,
              max: 7
            },
            {
              name: 'safetyAwareness',
              type: 'checkbox-group',
              label: 'Осведомленность о безопасности',
              options: ['До', 'После']
            },
            {
              name: 'safetyAwarenessScore',
              type: 'rating',
              label: 'Оценка осведомленности о безопасности',
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
              readOnly: true
            },
            {
              name: 'conclusion',
              type: 'textarea',
              label: 'Заключение',
              required: true
            },
            {
              name: 'recommendations',
              type: 'textarea',
              label: 'Рекомендации',
              required: true
            }
          ]
        }
      ]
    }
  }
];
