import { assign, Machine as machine } from 'xstate';
import Axios from 'axios';

export interface weatherMachineContext {
  cities: {
    coords: { lat: number; lng: number };
    name?: string;
    data: {
      name?: string;
      temprature?: number;
      humidity?: number;
      wind?: number;
      icon?: string;
    };
  }[];
  currentCityIndex: number;
}

export const WeatherMachine = machine<weatherMachineContext>(
  {
    id: 'weather',
    initial: 'start',
    context: {
      cities: [],
      currentCityIndex: 0,
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
            actions: assign((context, event) => event.data),
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
            actions: assign({ cities: (context, event) => event.data }),
          },
        },
      },
      display: {
        invoke: [
          {
            src: 'startTimer',
          },
          {
            src: 'cycleCities',
          },
        ],
        on: {
          TICK: 'query',
          CYCLE: {
            internal: true,
            actions: assign((context, _event) => {
              context.currentCityIndex++;
              context.currentCityIndex =
                context.currentCityIndex % context.cities.length;
              return context;
            }),
          },
        },
      },
    },
  },
  {
    services: {
      getLocation: (context, event) =>
        new Promise((resolve) => {
          global.navigator.geolocation.getCurrentPosition(
            (position) => {
              const newCity = {
                coords: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
                data: {},
              };

              const newContext = context;
              newContext.cities = [newCity];
              resolve(newContext);
            },
            (error) => {
              console.error(error);
            },
            {
              enableHighAccuracy: false,
              maximumAge: 50000,
            }
          );
        }),

      getData: (context, event) =>
        new Promise((resolve) => {
          let url = '';

          const listOfWeatherPromises = context.cities.map((city) => {
            if (!city.name)
              url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=${process.env.RAZZLE_WEATHER_API_KEY}&units=metric`;
            else {
              url = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${process.env.RAZZLE_WEATHER_API_KEY}&units=metric`;
            }

            return Axios.get(url);
          });

          const weatherResponses = Promise.all(listOfWeatherPromises);

          weatherResponses.then((response) => {
            const updatedCities = context.cities.map((city, index) => {
              const data = {
                temprature: response[index].data.main.temp,
                humidity: response[index].data.main.humidity,
                name: response[index].data.name,
                wind: response[index].data.wind.speed,
                icon: response[index].data.weather[0].icon,
              };
              return { ...city, data };
            });

            resolve(updatedCities);
          });
        }),
      startTimer: (context, event) => (cb) => {
        const interval = setInterval(() => {
          cb('TICK');
        }, 1000 * 60 * 5);
        return () => {
          clearInterval(interval);
        };
      },
      cycleCities: (context, event) => (cb) => {
        const interval = setInterval(() => {
          cb('CYCLE');
        }, 5000);
        return () => {
          clearInterval(interval);
        };
      },
    },
  }
);

export default WeatherMachine;
