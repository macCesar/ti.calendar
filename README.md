# Titanium Calendar Widget - ti.calendar

## Introduction
`ti.calendar` is a Titanium widget designed to display a calendar with customizable styling and behavior. It provides an easy way to integrate a calendar into your Titanium mobile applications. This readme will guide you through the usage and customization options of the `ti.calendar` widget.

## Features

- Display a calendar with a month view.
- Customize the appearance of the calendar, including fonts, colors, and more.
- Specify active dates to highlight them on the calendar.
- Define date range limits for the calendar.
- Easily navigate between months.
- Select and trigger events for specific dates.

## Installation

1. Copy the `ti.calendar` widget folder into your Titanium project's `app/widgets` directory.

2. In your Alloy project's `config.json` file, add the widget to your dependencies:

   ```json
   "dependencies": {
     "ti.calendar": "1.0"
   }
   ```

3. In your Alloy XML view file, include the widget:

   ```xml
   <Widget id="calendar" src="ti.calendar" />
   ```

4. In your controller, initialize the widget and configure its properties using `$.args`:

   ```javascript
   $.calendar.init({
     // Configuration options
   });
   ```

## Usage

### Configuration Options

The `ti.calendar` widget can be customized using the `$.args` property. Here are the available configuration options:

- `active_dates`: An array of dates to highlight as active.
- `current_date`: The initial date to display on the calendar.
- `min_date`: The minimum selectable date.
- `max_date`: The maximum selectable date.
- `fontFamily`: The font family for calendar text.
- `dateTextColor`: Text color for regular dates.
- `todayTextColor`: Text color for today's date.
- `activePinColor`: Color for active date indicators.
- `inactivePinColor`: Color for inactive date indicators.
- `backgroundColor`: Background color for the calendar.
- `todayBackgroundColor`: Background color for today's date.
- `dateBackgroundColor`: Background color for regular dates.
- `selectedBackgroundColor`: Background color for selected dates.
- `fillMonth`: Whether to fill the entire month with date cells.
- `enablePastDays`: Allow selection of past dates.
- `allowInactiveSelection`: Allow selection of inactive dates.

## Example

Here's a basic example of how to use the `ti.calendar` widget:

```javascript
// Initialize the calendar
$.calendar.init({
  fontFamily: 'Arial',
  min_date: '2023-09-01',
  max_date: '2023-11-30',
  current_date: '2023-10-01',
  active_dates: ['2023-10-10', '2023-10-15'],
  // Customize other properties as needed
});

// Event listener for date selection
$.calendar.addEventListener('selected', function(e) {
  console.log('Selected Date:', e.date);
  console.log('Active:', e.active);
});
```

## License

This `ti.calendar` widget is open-source and licensed under the MIT License.

## Support and Contribution

If you have any questions or issues with this widget, please feel free to open an issue on the GitHub repository. Contributions and improvements are also welcome.
