import { assign, Machine as machine } from 'xstate';
import Axios from 'axios';

export interface weatherMachineContext {
  coords: { lat?: number; lng?: number };
  data: {
    name?: string;
    temprature?: number;
    humidity?: number;
    wind?: number;
    icon?: string;
  };
  cities: string[];
}

export const WeatherMachine = machine<weatherMachineContext>(
  {
    id: 'weather',
    initial: 'start',
    context: {
      coords: {},
      data: {},
      cities: [],
    },
    states: {
      start: {
        on: {
          GEOLOCATION: 'geolocation',
          QUERY: {
            target: 'query',
            actions: assign({ cities: (context, event) => event.cities }),
          },
        },
      },
      geolocation: {
        invoke: {
          src: 'getLocation',
          onDone: {
            target: 'query',
            actions: assign({ coords: (context, event) => event.data }),
          },
          onError: {
            target: 'geolocation',
            actions: (context, event) => alert(event.data),
          },
        },
      },
      query: {
        invoke: {
          src: 'getData',
          onDone: {
            target: 'display',
            actions: assign({ data: (context, event) => event.data }),
          },
        },
      },
      display: {
        invoke: {
          src: 'startTimer',
        },
        on: {
          TICK: 'query',
        },
      },
    },
  },
  {
    services: {
      getLocation: (context, event) =>
        new Promise((resolve) => {
          if (context.coords.lat) {
            resolve(context.coords);
          }

          global.navigator.geolocation.getCurrentPosition((position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          });
        }),

      getData: (context, event) =>
        new Promise((resolve) => {
          let url = '';
          if (context.cities.length === 0)
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${context.coords.lat}&lon=${context.coords.lng}&appid=${process.env.RAZZLE_WEATHER_API_KEY}&units=metric`;
          else {
            const cities = context.cities;
            url = `https://api.openweathermap.org/data/2.5/weather?q=${cities[0]}&appid=${process.env.RAZZLE_WEATHER_API_KEY}&units=metric`;
          }

          Axios.get(url).then(
            (response) => {
              const data = {
                temprature: response.data.main.temp,
                humidity: response.data.main.humidity,
                name: response.data.name,
                wind: response.data.wind.speed,
                icon: response.data.weather[0].icon,
              };
              resolve(data);
            },
            (error) => {
              console.error('Axios error:', error);
            }
          );
        }),
      startTimer: (context, event) => (cb) => {
        const interval = setInterval(() => {
          cb('TICK');
        }, 1000 * 60 * 5);
        return () => {
          clearInterval(interval);
        };
      },
    },
  }
);

export default WeatherMachine;
