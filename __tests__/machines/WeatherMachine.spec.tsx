import { interpret } from 'xstate';

import WeatherMachine, {
  weatherMachineContext,
} from '../../src/machines/WeatherMachine';

const expectedCoordinates = {
  coords: { latitude: 30.1531136, longitude: 31.185305599999996 },
};

const getCitiesFromURLQuery = () => {
  const output = new URLSearchParams(window.URL.toString()).get('city') || '';
  return output.split(',').map((name) => {
    return { name };
  });
};

describe('Start State', () => {
  it('should use navigator to get current location', (done) => {
    global.navigator.geolocation.getCurrentPosition(
      (position) => {
        expect(position).toStrictEqual(expectedCoordinates);
        done();
      },
      (error) => {
        done.fail(error);
      }
    );
  });

  it('should transition from `start` to `geolocation` after running getLocation service', (done) => {
    interpret(WeatherMachine)
      .onTransition((state) => {
        if (state.matches('geolocation')) {
          expect(true).toBe(true);
          done();
        }
      })
      .start()
      .send('GEOLOCATION');
  });

  it('should detect query strings and transition to `Query` state accordingly', (done) => {
    const service = interpret(WeatherMachine)
      .onTransition((state) => {
        if (state.matches('query')) done();
      })
      .start();

    const cities = getCitiesFromURLQuery();
    if (cities[0].name == '') service.send('GEOLOCATION');
    else service.send('QUERY', { cities });
  });
});

describe('Geolocation State', () => {
  it('should request weather information by location successfully and transition to `display`', (done) => {
    interpret(WeatherMachine)
      .onTransition((state) => {
        if (state.matches('display')) {
          done();
        }
      })
      .start()
      .send('GEOLOCATION');
  });
});

describe('Query State', () => {
  it('should request weather information by querystring successfully and transition to `display`', (done) => {
    const service = interpret(WeatherMachine)
      .onTransition((state) => {
        if (state.matches('display')) {
          expect(state.context.cities[0].data.name).toBe('Cairo');
          done();
        }
      })
      .start();

    const cities = getCitiesFromURLQuery();
    service.send('QUERY', { cities });
  });

  it('should iterate through list of cities in querystrings and display their weather data consecutively', (done) => {
    const mockMachine = WeatherMachine.withConfig({
      services: {
        cycleCities: (_, event) => (cb) => {
          cb('CYCLE');
          return () => {};
        },
      },
    });

    const service = interpret(mockMachine)
      .onEvent((event) => {
        if (event.type == 'CYCLE') {
          done();
        }
      })
      .start();

    const cities = getCitiesFromURLQuery();
    service.send('QUERY', { cities });
  });
});

describe('Display State', () => {
  it('should update weather information periodically', (done) => {
    const customContext = {
      cities: [
        {
          coords: {
            lat: expectedCoordinates.coords.latitude,
            lng: expectedCoordinates.coords.longitude,
          },
          data: {},
        },
      ],
      currentCityIndex: 0,
    };
    const mockMachine = WeatherMachine.withConfig({
      services: {
        startTimer: (_, event) => (cb) => {
          cb('TICK');
          return () => {};
        },
      },
    }).withContext(customContext as weatherMachineContext);

    interpret(mockMachine)
      .onEvent((event) => {
        if (event.type == 'TICK') done();
      })
      .start()
      .send('GEOLOCATION');
  });
});
