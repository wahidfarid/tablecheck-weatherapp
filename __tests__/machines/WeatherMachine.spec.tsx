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
        if (state.matches('loading')) {
          expect(true).toBe(true);
          done();
        }
      })
      .start()
      .send('GEOLOCATION');
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
      .send('GET_LOCATION');
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
      .send('GET_LOCATION');
  });
});
