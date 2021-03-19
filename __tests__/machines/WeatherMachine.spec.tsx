import { useLocation } from 'react-router-dom';
import { interpret } from 'xstate';

import WeatherMachine, {
  weatherMachineContext,
} from '../../src/machines/WeatherMachine';

const expectedCoordinates = {
  coords: { latitude: 30.1531136, longitude: 31.185305599999996 },
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

    const searchParams = new URLSearchParams(window.URL.toString()).get('city');
    if (!searchParams) service.send('GEOLOCATION');
    else service.send('QUERY', { cities: searchParams.split(',') });
  });
});

describe('Geolocation State', () => {
  it('should request weather information by location successfully and transition to `display`', (done) => {
    const customContext = { ...expectedCoordinates, data: {}, cities: [] };
    const machine = WeatherMachine.withContext(
      customContext as weatherMachineContext
    );

    interpret(machine)
      .onTransition((state) => {
        if (state.matches('display')) {
          done();
        }
      })
      .start()
      .send('GEOLOCATION');
  });

  it('should request weather information by querystring successfully and transition to `display`', (done) => {
    const service = interpret(WeatherMachine)
      .onTransition((state) => {
        if (state.matches('display')) {
          expect(state.context.data.name).toBe('Cairo');
          done();
        }
      })
      .start();

    const searchParams = new URLSearchParams(window.URL.toString()).get('city');
    service.send('QUERY', { cities: searchParams.split(',') });
  });

  it('should iterate through list of cities in querystrings and call each one consecutively', () => {
    fail();
  });
});

describe('Display State', () => {
  it('should update weather information periodically', (done) => {
    const customContext = { ...expectedCoordinates, data: {}, cities: [] };
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

it.todo('should detect if a location is cached and valid');
it.todo('should not ask the user if cached location is valid');
it.todo('should ask the user for location if cache older than 5 minutes');
