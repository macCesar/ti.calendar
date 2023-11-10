const ROWS = 6
const COLUMNS = 7
let current_page = 0
const Moment = require('alloy/moment')
Moment.locale(Ti.Locale.currentLanguage)

// Init
$.monthName.font = {
  fontWeight: 'bold',
  fontFamily: $.args.fontFamily
}

$.monthYear.font = {
  fontWeight: 'light',
  fontFamily: $.args.fontFamily
}

_.defaults($.args, {
  // Data
  active_dates: [],
  current_date: Moment(),
  min_date: Moment().subtract(6, 'months'),
  max_date: Moment().add(6, 'months'),

  // Style
  fontFamily: '',

  dateTextColor: '#ffffff',
  todayTextColor: '#000000',

  activePinColor: '#f39911',
  inactivePinColor: 'transparent',

  backgroundColor: 'transparent',
  todayBackgroundColor: '#aaff8800',
  dateBackgroundColor: 'transparent',
  selectedBackgroundColor: '#60f39911',

  // Behaviour
  fillMonth: false,
  enablePastDays: false,
  allowInactiveSelection: false
})

// Methods
function refreshArrows() {
  $.leftBtn.opacity = current_page <= 0 ? 0.4 : 1
  $.rightBtn.opacity = current_page >= $.monthScroll.views.length - 1 ? 0.4 : 1
}

function getDayLabels() {
  let days = Moment.weekdaysMin()
  days.push(days.shift()) // Moment week has Sunday at index 0

  _.each(days, (day, i) => {
    let width = Math.floor($.calendar.rect.width / COLUMNS)

    let $label = $.UI.create('Label', {
      width: width,
      left: i * width,
      text: day.charAt(0),
      classes: ['dayLabel'],
      font: { fontFamily: $.args.fontFamily }
    })

    $.dayLabels.add($label)
  })
}

function isInMomentsList(date, dates) {
  return _.find(dates, day => {
    return date.isSame(day, 'day')
  })
}

function getDayContainer(number) {
  let $this = $.UI.create('View', {
    opacity: 1,
    date: null,
    active: null,
    classes: ['day'],
    backgroundColor: $.args.dateBackgroundColor,
    height: Math.floor($.monthScroll.rect.height / ROWS),
    width: Math.floor($.monthScroll.rect.width / COLUMNS)
  })

  $this.add($.UI.create('Label', {
    text: number,
    color: '#ffffff',
    classes: ['dayNumber'],
    font: { fontFamily: $.args.fontFamily }
  }))

  $this.add($.UI.create('View', {
    classes: ['dayDot'],
    backgroundColor: 'transparent'
  }))

  return $this
}

function setItemDate($item, date) {
  $item.date = date
  $item.children[0].text = date.date()
}

function setItemActive($item, active) {
  $item.active = active
  $item.children[1].backgroundColor = active ? $.args.activePinColor : $.args.inactivePinColor
}

function setItemToday($item, is_today) {
  $item.children[0].color = is_today ? $.args.todayTextColor : $.args.dateTextColor
  $item.backgroundColor = is_today ? $.args.todayBackgroundColor : $.args.dateBackgroundColor
}

function setItemCurrent($item, current) {
  $item.opacity = current ? 1 : 0.5
}

function getMonthView(month, year) {
  // Month skeleton
  let $month_view = $.UI.create('View', {
    classes: ['month'],
    month: month,
    year: year,
    backgroundColor: $.args.backgroundColor,
    ready: false
  })

  // Month activity indicator
  let $loader = Ti.UI.createActivityIndicator({
    style: Ti.UI.ActivityIndicatorStyle.BIG,
    center: { x: '50%', y: '50%' }
  })

  $month_view.add($loader)
  $month_view.__loader = $loader
  $loader.show()

  return $month_view
}

function buildMonth($month_view, dates) {
  if (!$month_view || $month_view.ready) {
    return
  }

  let start_date = Moment().month($month_view.month).year($month_view.year).startOf('month').startOf('week')

  let $days_container = Ti.UI.createView({
    width: Ti.UI.FILL,
    height: Ti.UI.FILL
  })

  // Separators
  for (let i = 0; i < ROWS; i++) {
    $days_container.add($.UI.create('View', {
      classes: ['hr'],
      top: (i + 1) * Math.floor($.monthScroll.rect.height / ROWS)
    }))
  }

  // Add day containers
  for (let d = 0; d < ROWS * COLUMNS; d++) {
    let curday = Moment(start_date).add(d, 'days')

    // If fillMonth is disabled, add only this month's days
    if (curday.month() === $month_view.month || $.args.fillMonth === true) {
      let $curview = getDayContainer(curday.date())
      let row = Math.floor(d / COLUMNS)
      let col = d % COLUMNS

      setItemDate($curview, curday)
      setItemActive($curview, isInMomentsList(curday, dates))
      setItemCurrent($curview, !curday.isBefore(Moment(), 'day') || ($.args.enablePastDays === true && (curday.month() === $month_view.month)))
      setItemToday($curview, curday.isSame(Moment(), 'day'))

      $curview.top = row * ($curview.height)
      $curview.left = col * ($curview.width)

      $days_container.add($curview)
    }
  }

  $month_view.add($days_container)
  $month_view.ready = true
  $month_view.__loader.hide()
}

function buildCalendar() {
  $.main.removeEventListener('postlayout', buildCalendar)

  // Add top labels
  getDayLabels()

  // Create the calendar views
  let i = 0
  let curmonth_index = -1
  for (let m = Moment($.args.min_date); m.diff(Moment($.args.max_date)) <= 0; m.add(1, 'months')) {
    if (m.isSame(Moment(), 'month')) {
      curmonth_index = i
    }

    $.monthScroll.addView(getMonthView(m.month(), m.year()))

    i++
  }

  $.monthScroll.currentPage = current_page = curmonth_index > 0 ? curmonth_index : 0

  refreshCalendarMonth(current_page)

  refreshArrows()
}

function refreshCalendarMonth(m) {
  let month_date = Moment().month($.monthScroll.views[m].month).year($.monthScroll.views[m].year)

  $.monthYear.text = month_date.format('YYYY')
  $.monthName.text = month_date.format('MMMM').toUpperCase()

  buildMonth($.monthScroll.views[m], $.args.active_dates)

  if (current_page - 1 > -1) {
    buildMonth($.monthScroll.views[m - 1], $.args.active_dates)
  }

  if (current_page + 1 < 12) {
    buildMonth($.monthScroll.views[m + 1], $.args.active_dates)
  }
}

// Listeners
function doScroll({ currentPage }) {
  if (currentPage === current_page) {
    return
  }

  current_page = currentPage

  refreshArrows()

  refreshCalendarMonth(current_page)
}

function clickMonthScroll({ source }) {
  if (!source.date || (source.active && $.args.allowInactiveSelection) || ($.args.enablePastDays === false && source.date.isBefore(Moment(), 'day'))) {
    return
  }

  source.animate({ backgroundColor: $.args.selectedBackgroundColor, duration: 75, autoreverse: true }, () => {
    $.trigger('selected', {
      date: source.date,
      active: source.active
    })
  })
}

function movePrevious() {
  $.monthScroll.movePrevious()
}

function moveNext() {
  $.monthScroll.moveNext()
}
