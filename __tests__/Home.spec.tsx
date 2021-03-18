import React from 'react';
import {render} from 'enzyme';
import { interpret } from 'xstate';

import Home from '../src/Home';
import WeatherMachine, {weatherMachineContext} from '../src/machines/WeatherMachine';


const expectedCoordinates = { coords: {latitude: 30.1531136, longitude: 31.185305599999996}};

it("should use navigator to get current location", (done)=>{

  global.navigator.geolocation.getCurrentPosition((position)=>{
    expect(position).toStrictEqual(expectedCoordinates);
    done();
  }, (error)=>{
    console.log(error);
    done(error);
  });

});

it('should transition from `start` to `query` after running getLocation service', (done)=>{

  interpret(WeatherMachine).onTransition((state) => {

    if(state.matches('query')) {
      expect(true).toBe(true);
      done();
    }

  }).start();
});

it('should request weather information successfully and transition to `display`', (done)=>{

  const customContext = {...expectedCoordinates, data:{}};
  const machine = WeatherMachine.withContext(customContext as weatherMachineContext);  
  interpret(machine).onTransition((state) =>{
    if(state.matches('display')){
      done();
    }
  }).start();
})

it.todo('should detect if a location is cached and valid');
it.todo('should not ask the user if cached location is valid');
it.todo('should ask the user for location if cache older than 5 minutes');