import { assign, Machine as machine } from 'xstate';
import Axios from 'axios';

// import BackgroundMachine from './BackgroundMachine';

const serializeWeatherAPIRequests = (
  cities: weatherMachineCity[]
): Promise<any> => {
  let url = '';
  const listOfWeatherPromises = cities.map((city) => {
    if (!city.name)
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=${process.env.RAZZLE_WEATHER_API_KEY}&units=metric`;
    else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${process.env.RAZZLE_WEATHER_API_KEY}&units=metric`;
    }

    return Axios.get(url);
  });
  return Promise.all(listOfWeatherPromises);
};

export interface weatherMachineCity {
  coords: { lat: number; lng: number };
  name?: string;
  data: {
    name?: string;
    temprature?: number;
    humidity?: number;
    wind?: number;
    icon?: string;
    deg?: number;
  };
}
export interface weatherMachineContext {
  cities: weatherMachineCity[];
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
            actions: [assign((context, event) => event.data)],
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
            target: 'display', // temporarily automatically transition to the next state until the youtube api fix
            actions: assign({ cities: (context, event) => event.data }),
          },
        },
      },
      // checkVideo: {
      //   on: {
      //     '': 'display',
      //   },
      // invoke: {
      //   id: 'background',
      //   src: BackgroundMachine,
      //   data: { cities: (context: weatherMachineContext) => context.cities },
      //   onDone: 'display',
      // },
      // },
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
          // Serialize weather api request promises
          const weatherResponses = serializeWeatherAPIRequests(context.cities);

          // Once all of them are done, iterate on responses and return values to be assigned to context
          weatherResponses
            .then((response) => {
              const updatedCities = context.cities.map((city, index) => {
                const data = {
                  temprature: response[index].data.main.temp,
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
            .catch((error) => {
              console.error(error);
              alert(
                'There was a problem while requesting weather information. Please confirm the name of the city and make sure you have a valid internet connecion'
              );
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
