const { Telegraf, Markup } = require('telegraf')

const bot = new Telegraf('8633523065:AAGf5bPrQHX7-fec0KRm3T2-gZFS3bGYAqw')

const bookings = []
const userState = {}

const translations = {
  ru: {
    welcome: (name) => `Привет, ${name}! 👋\nДобро пожаловать в барбершоп Armenia Cuts! 💈\n\nЧто хочешь сделать?`,
    chooseService: 'Выбери услугу:',
    chooseTime: 'Выбери время:',
    chooseDate: 'Выбери дату:',
    confirm: (service, date, time) => `Подтверди запись:\n\n💈 ${service}\n📅 ${date} в ${time}`,
    confirmed: (service, date, time) => `🎉 Запись подтверждена!\n\n💈 ${service}\n📅 ${date} в ${time}\n\nДо встречи! 👋`,
    cancelled: 'Запись отменена.',
    noBookings: 'У тебя пока нет записей. Нажми 📅 Записаться!',
    myBookings: 'Твои записи:\n\n',
    timeBooked: '❌ Это время уже занято! Выбери другое время.',
    about: '💈 Барбершоп Armenia Cuts\n\n📍 Ереван, ул. Абовяна 5\n⏰ Пн-Сб: 10:00 - 19:00\n📞 +374 99 123456',
    menu: 'Главное меню:',
    btnBook: '📅 Записаться',
    btnMyBookings: '📋 Мои записи',
    btnAbout: 'ℹ️ О нас',
    btnBack: '🔙 Назад',
    btnConfirm: '✅ Подтвердить',
    btnCancel: '❌ Отмена',
    services: [
      '✂️ Стрижка - 3000 AMD',
      '🪒 Бритьё - 2000 AMD',
      '💈 Стрижка + Бритьё - 4500 AMD',
      '🎨 Окрашивание - 8000 AMD'
    ]
  },
  en: {
    welcome: (name) => `Hello, ${name}! 👋\nWelcome to Armenia Cuts Barbershop! 💈\n\nWhat would you like to do?`,
    chooseService: 'Choose a service:',
    chooseTime: 'Choose a time:',
    chooseDate: 'Choose a date:',
    confirm: (service, date, time) => `Confirm booking:\n\n💈 ${service}\n📅 ${date} at ${time}`,
    confirmed: (service, date, time) => `🎉 Booking confirmed!\n\n💈 ${service}\n📅 ${date} at ${time}\n\nSee you soon! 👋`,
    cancelled: 'Booking cancelled.',
    noBookings: 'You have no bookings yet. Press 📅 Book Now!',
    myBookings: 'Your bookings:\n\n',
    timeBooked: '❌ This time is already taken! Please choose another time.',
    about: '💈 Armenia Cuts Barbershop\n\n📍 Yerevan, Abovyan St. 5\n⏰ Mon-Sat: 10:00 - 19:00\n📞 +374 99 123456',
    menu: 'Main menu:',
    btnBook: '📅 Book Now',
    btnMyBookings: '📋 My Bookings',
    btnAbout: 'ℹ️ About Us',
    btnBack: '🔙 Back',
    btnConfirm: '✅ Confirm',
    btnCancel: '❌ Cancel',
    services: [
      '✂️ Haircut - 3000 AMD',
      '🪒 Shave - 2000 AMD',
      '💈 Haircut + Shave - 4500 AMD',
      '🎨 Coloring - 8000 AMD'
    ]
  },
  hy: {
    welcome: (name) => `Բարև, ${name}! 👋\nԲարի գալուստ Armenia Cuts վարսավիրանոց! 💈\n\nԻնչ կցանկանաք?`,
    chooseService: 'Ընտրեք ծառայությունը:',
    chooseTime: 'Ընտրեք ժամը:',
    chooseDate: 'Ընտրեք ամսաթիվը:',
    confirm: (service, date, time) => `Հաստատե՛ք գրանցումը:\n\n💈 ${service}\n📅 ${date} ժամը ${time}`,
    confirmed: (service, date, time) => `🎉 Գրանցումը հաստատված է!\n\n💈 ${service}\n📅 ${date} ժամը ${time}\n\nՄինչ հանդիպում! 👋`,
    cancelled: 'Գրանցումը չեղարկված է։',
    noBookings: 'Դուք դեռ գրանցում չունեք։ Սեղմեք 📅 Գրանցվել!',
    myBookings: 'Ձեր գրանցումները:\n\n',
    timeBooked: '❌ Այս ժամը արդեն զբաղված է! Ընտրեք այլ ժամ։',
    about: '💈 Armenia Cuts վարսավիրանոց\n\n📍 Երևան, Աբովյան փ. 5\n⏰ Երկ-Շաբ: 10:00 - 19:00\n📞 +374 99 123456',
    menu: 'Գլխավոր մենյու:',
    btnBook: '📅 Գրանցվել',
    btnMyBookings: '📋 Իմ գրանցումները',
    btnAbout: 'ℹ️ Մեր մասին',
    btnBack: '🔙 Հետ',
    btnConfirm: '✅ Հաստատել',
    btnCancel: '❌ Չեղարկել',
    services: [
      '✂️ Կտրվածք - 3000 AMD',
      '🪒 Սափրում - 2000 AMD',
      '💈 Կտրվածք + Սափրում - 4500 AMD',
      '🎨 Ներկում - 8000 AMD'
    ]
  }
}

// Генерация следующих 7 дней
function getNextDays(lang) {
  const days = []
  const locales = { ru: 'ru-RU', en: 'en-US', hy: 'hy-AM' }
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    days.push(date.toLocaleDateString(locales[lang] || 'ru-RU', {
      weekday: 'short', day: 'numeric', month: 'short'
    }))
  }
  return days
}

const timeSlots = [
  '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00'
]

function getLang(userId) {
  return (userState[userId] && userState[userId].lang) || 'ru'
}

function mainMenu(lang) {
  const t = translations[lang]
  return Markup.keyboard([
    [t.btnBook],
    [t.btnMyBookings],
    [t.btnAbout]
  ]).resize()
}

// Старт — выбор языка
bot.start((ctx) => {
  userState[ctx.from.id] = {}
  ctx.reply(
    '🌍 Выберите язык / Choose language / Ընտրեք լեզուն:',
    Markup.keyboard([
      ['🇷🇺 Русский'],
      ['🇬🇧 English'],
      ['🇦🇲 Հայերեն']
    ]).resize()
  )
})

bot.on('text', (ctx) => {
  const text = ctx.message.text
  const userId = ctx.from.id
  const state = userState[userId] || {}
  const lang = getLang(userId)
  const t = translations[lang]

  // Выбор языка
  if (text === '🇷🇺 Русский' || text === '🇬🇧 English' || text === '🇦🇲 Հայերեն') {
    const langMap = { '🇷🇺 Русский': 'ru', '🇬🇧 English': 'en', '🇦🇲 Հայերեն': 'hy' }
    userState[userId] = { lang: langMap[text] }
    const newLang = langMap[text]
    const newT = translations[newLang]
    ctx.reply(newT.welcome(ctx.from.first_name), mainMenu(newLang))
    return
  }

  // Кнопка "Записаться"
  if (text === t.btnBook) {
    userState[userId] = { ...state, step: 'service' }
    ctx.reply(t.chooseService, Markup.keyboard([
      ...t.services.map(s => [s]),
      [t.btnBack]
    ]).resize())
    return
  }

  // Кнопка "О нас"
  if (text === t.btnAbout) {
    ctx.reply(t.about)
    return
  }

  // Кнопка "Мои записи"
  if (text === t.btnMyBookings) {
    const myBookings = bookings.filter(b => b.userId === userId)
    if (myBookings.length === 0) {
      ctx.reply(t.noBookings)
      return
    }
    const result = myBookings.map(b =>
      `✅ ${b.service}\n📅 ${b.date} — ${b.time}`
    ).join('\n\n')
    ctx.reply(t.myBookings + result)
    return
  }

  // Кнопка "Назад"
  if (text === t.btnBack) {
    userState[userId] = { lang }
    ctx.reply(t.menu, mainMenu(lang))
    return
  }

  // Шаг 1 — выбор услуги
  if (state.step === 'service') {
    const found = t.services.find(s => s === text)
    if (found) {
      userState[userId] = { ...state, step: 'date', service: text }
      const days = getNextDays(lang)
      ctx.reply(t.chooseDate, Markup.keyboard([
        ...days.map(d => [d]),
        [t.btnBack]
      ]).resize())
    }
    return
  }

  // Шаг 2 — выбор даты
  if (state.step === 'date') {
    const days = getNextDays(lang)
    const found = days.find(d => d === text)
    if (found) {
      userState[userId] = { ...state, step: 'time', date: text }
      ctx.reply(t.chooseTime, Markup.keyboard([
        ...timeSlots.map(t => [t]),
        [translations[lang].btnBack]
      ]).resize())
    }
    return
  }

  // Шаг 3 — выбор времени
  if (state.step === 'time') {
    const found = timeSlots.find(slot => slot === text)
    if (found) {
      const isBooked = bookings.some(b => b.date === state.date && b.time === text)
      if (isBooked) {
        ctx.reply(t.timeBooked)
        return
      }
      userState[userId] = { ...state, step: 'confirm', time: text }
      ctx.reply(
        t.confirm(state.service, state.date, text),
        Markup.keyboard([
          [t.btnConfirm],
          [t.btnCancel]
        ]).resize()
      )
    }
    return
  }

  // Шаг 4 — подтверждение
  if (state.step === 'confirm') {
    if (text === t.btnConfirm) {
      bookings.push({
        userId,
        name: ctx.from.first_name,
        service: state.service,
        date: state.date,
        time: state.time
      })
      userState[userId] = { lang }
      ctx.reply(t.confirmed(state.service, state.date, state.time), mainMenu(lang))
    } else if (text === t.btnCancel) {
      userState[userId] = { lang }
      ctx.reply(t.cancelled, mainMenu(lang))
    }
    return
  }
})

bot.launch()
console.log('Бот запущен! ✅')