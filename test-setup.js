// Configure Enzyme
const enzyme = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');

enzyme.configure({ adapter: new Adapter() });

// Mock navigator
const mockGeolocation = {
  getCurrentPosition: jest.fn().mockImplementation((success) =>
    Promise.resolve(
      success({
        coords: {
          latitude: 30.1531136,
          longitude: 31.185305599999996,
        },
      })
    )
  ),
  watchPosition: jest.fn(),
};
global.navigator.geolocation = mockGeolocation;
global.navigator.permissions = {
  query: jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve({ state: 'granted' })),
};
