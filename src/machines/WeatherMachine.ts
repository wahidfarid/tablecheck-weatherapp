import { assign, createMachine } from 'xstate';
import Axios from 'axios';

// import { backgroundMachine } from './BackgroundMachine';

const serializeWeatherAPIRequests = (
  cities: weatherMachineCity[]
): Promise<any> => {
  return Promise.all(
    cities.map(({ coords, name }) => {
      let url = '';
      if (!name)
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${process.env.RAZZLE_WEATHER_API_KEY}&units=metric`;
      else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${process.env.RAZZLE_WEATHER_API_KEY}&units=metric`;
      }

      return Axios.get(url);
    })
  );
};

export interface weatherMachineCity {
  coords?: { latidude: number; longitude: number };
  name?: string;
  temperature?: number;
  humidity?: number;
  wind?: number;
  icon?: string;
  deg?: number;
}

export interface weatherMachineContext {
  cities: weatherMachineCity[];
  currentCityIndex: number;
}

export const weatherMachine = createMachine<weatherMachineContext>(
  {
    id: 'weather',
    initial: 'init',
    context: {
      cities: [],
      currentCityIndex: 0,
    },
    states: {
      init: {
        always: [
          {
            target: 'loading',
            cond: 'hasCities',
          },
          {
            target: 'gettingLocation',
            cond: 'shouldGetLocation',
          },
        ],
      },
      gettingLocation: {
        invoke: {
          src: 'getLocation',
          onDone: {
            target: 'loading',
            actions: assign({
              cities: (_, { data }) => data,
            }),
          },
          onError: 'locationRefused',
        },
      },
      locationRefused: {},
      loading: {
        invoke: {
          src: 'getData',
          onDone: {
            target: 'loaded', // temporarily automatically transition to the next state until the youtube api fix
            actions: assign({ cities: (context, event) => event.data }),
          },
          onError: 'error',
        },
      },
      // checkVideo: {
      //   on: {
      //     '': 'loaded',
      //   },
      // invoke: {
      //   id: 'background',
      //   src: BackgroundMachine,
      //   data: { cities: (context: weatherMachineContext) => context.cities },
      //   onDone: 'loaded',
      // },
      // },
      loaded: {
        invoke: [
          {
            src: 'startDataRefreshTimer',
          },
          {
            src: 'cycleCities',
          },
        ],
        on: {
          REFRESH_DATA: 'loading',
          CYCLE_TO_NEXT_CITY: {
            cond: 'canCycleCities',
            actions: ['incrementCurrentCityIndex'],
          },
        },
      },
      error: {},
    },
  },
  {
    guards: {
      shouldGetLocation: ({ cities }) => cities.length === 0,
      hasCities: ({ cities }) => cities.length > 0,
      canCycleCities: ({ cities }) => cities.length > 1,
    },
    services: {
      getLocation: (context, event) =>
        new Promise((resolve, reject) => {
          global.navigator.geolocation.getCurrentPosition(
            ({ coords }) => resolve([{ coords }]),
            reject,
            {
              enableHighAccuracy: false,
              maximumAge: 50000,
            }
          );
        }),

      getData: ({ cities }, event) =>
        new Promise((resolve, reject) => {
          const weatherResponses = serializeWeatherAPIRequests(cities);

          weatherResponses
            .then((response) => {
              const updatedCities = cities.map((city, index) => {
                const data = {
                  temperature: response[index].data.main.temp,
                  humidity: response[index].data.main.humidity,
                  name: response[index].data.name,
                  wind: response[index].data.wind.speed,
                  icon: response[index].data.weather[0].icon,
                  deg: response[index].data.wind.deg,
                };
                return { ...city, data };
              });

              resolve(updatedCities);
            })
            .catch(reject);
        }),
      startDataRefreshTimer: (context, event) => (cb) => {
        const interval = setInterval(() => {
          cb('REFRESH_DATA');
        }, 1000 * 60 * 5);
        return () => {
          clearInterval(interval);
        };
      },
      cycleCities: (context, event) => (cb) => {
        const interval = setInterval(() => {
          cb('CYCLE_TO_NEXT_CITY');
        }, 5000);
        return () => {
          clearInterval(interval);
        };
      },
    },
    actions: {
      incrementCurrentCityIndex: assign({
        currentCityIndex: ({ cities, currentCityIndex }) => {
          return cities[currentCityIndex + 1] ? currentCityIndex + 1 : 0;
        },
      }),
    },
  }
);
