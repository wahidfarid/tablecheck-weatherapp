import { assign, Machine } from 'xstate';

// This machine is completely decoupled from React
export const WeatherMachine = Machine({
  id: 'weather',
  initial: 'start',
  states: {
    start: {
      invoke: {
        id: 'getLocation',
        src: (context, event)=> new Promise((resolve) => navigator.geolocation.getCurrentPosition((position)=>{
          resolve({lat: position.coords.latitude, lng: position.coords.longitude});
        })),
        onDone: {
          target: 'display',
          actions: assign({ coords: (context, event) => event.data })
        },
        onError: {
          target: 'start',
          actions: assign({ error: (context, event) => console.log(event.data)})
        }
      }
    },
    display: {
      entry: 'test'
    }
  }
}, {
  actions:{
    test: (context, event)=>{
      console.log(context, "Hello from test action");
    }
  }
});

export default WeatherMachine;