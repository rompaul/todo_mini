Component({
  properties: {
    selectedDate: {
      type: String,
      value: new Date().toISOString().split('T')[0]
    }
  },

  data: {
    year: 0,
    month: 0,
    days: [],
    weekdays: ['日', '一', '二', '三', '四', '五', '六']
  },

  lifetimes: {
    attached() {
      this.setData({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      })
      this.generateCalendar()
    }
  },

  methods: {
    generateCalendar() {
      const days = []
      const date = new Date(this.data.year, this.data.month - 1, 1)
      const lastDay = new Date(this.data.year, this.data.month, 0).getDate()
      const firstDayWeekday = date.getDay()

      for (let i = 0; i < firstDayWeekday; i++) {
        days.push({ day: '' })
      }

      for (let i = 1; i <= lastDay; i++) {
        const currentDate = `${this.data.year}-${String(this.data.month).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        days.push({
          day: i,
          date: currentDate,
          current: currentDate === this.properties.selectedDate,
          selected: currentDate === this.properties.selectedDate
        })
      }

      this.setData({ days })
    },

    prevMonth() {
      let { year, month } = this.data
      if (month === 1) {
        year--
        month = 12
      } else {
        month--
      }
      this.setData({ year, month })
      this.generateCalendar()
    },

    nextMonth() {
      let { year, month } = this.data
      if (month === 12) {
        year++
        month = 1
      } else {
        month++
      }
      this.setData({ year, month })
      this.generateCalendar()
    },

    selectDate(e) {
      const { date } = e.currentTarget.dataset
      this.setData({
        ['days']: this.data.days.map(day => ({
          ...day,
          selected: day.date === date
        }))
      })
      this.triggerEvent('dateChange', { date })
    }
  }
})
