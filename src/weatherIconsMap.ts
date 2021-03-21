type singleIconMap = {
  [key: string]: string;
};
const weatherIconsMap: singleIconMap = {
  '01d': 'wi-day-sunny',
  '01n': 'wi-night-clear',
  '02d': 'wi-day-cloudy',
  '02n': 'wi-night-cloudy',
  '03d': 'wi-cloud',
  '03n': 'wi-cloud',
  '04d': 'wi-cloudy',
  '04n': 'wi-cloudy',
  '09d': 'wi-rain',
  '09n': 'wi-rain',
  '10d': 'wi-day-rain',
  '10n': 'wi-night-alt-rain',
  '11d': 'wi-thunderstorm',
  '11n': 'wi-thunderstorm',
  '13d': 'wi-snowflake-cold',
  '13n': 'wi-snowflake-cold',
  '50d': 'wi-fog',
  '50n': 'wi-fog',
};
export default weatherIconsMap;