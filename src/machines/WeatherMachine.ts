import { assign, Machine as machine } from 'xstate';
import Axios from 'axios';

export interface weatherMachineContext {
  coords: { lat?: number; lng?: number };
  data: {
    name?: string;
    temprature?: number;
    humidity?: number;
    wind?: number;
  };
}

export const WeatherMachine = machine<weatherMachineContext>(
  {
    id: 'weather',
    initial: 'start',
    context: {
      coords: {},
      data: {},
    },
    states: {
      start: {
        invoke: {
          src: 'getLocation',
          onDone: {
            target: 'query',
            actions: assign({ coords: (context, event) => event.data }),
          },
          onError: {
            target: 'start',
            actions: (context, event) => alert(event.data),
          },
        },
      },
      query: {
        invoke: {
          src: 'getData',
          onDone: {
            target: 'display',
            actions: assign((context, event) => event.data),
          },
        },
      },
      display: {},
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
        new Promise((resolve) =>
          Axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${context.coords.lat}&lon=${context.coords.lng}&appid=${process.env.RAZZLE_WEATHER_API_KEY}&units=metric`
          ).then(
            (response) => {
              const data = {
                temprature: response.data.main.temp,
                humidity: response.data.main.humidity,
                name: response.data.name,
                wind: response.data.wind.speed,
              };
              resolve({ data });
            },
            (error) => {
              console.log('Axios error', error);
            }
          )
        ),
    },
  }
);

export default WeatherMachine;
