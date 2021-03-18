import React from 'react';
import {render} from 'enzyme';
import Home from '../src/Home';
import WeatherMachine from '../src/machines/WeatherMachine';
import { interpret } from 'xstate';


it('should transition from start to display after running getLocation service', (done)=>{

  interpret(WeatherMachine).onTransition((state) => {

    if (state.matches('display')) {
      expect(true).toBe(true);
      done();
    }else{
      done(false);
    }

  }).start();
});

it("should use navigator to get current location", (done)=>{

  const expected = { coords: {latitude: 30.1531136, longitude: 31.185305599999996}};

  global.navigator.geolocation.getCurrentPosition((position)=>{
    expect(position).toStrictEqual(expected);
    done();
  }, (error)=>{
    console.log(error);
    done(error);
  });

});

it.todo('should detect if a location is cached and valid');
it.todo('should not ask the user if cached location is valid');
it.todo('should ask the user for location if cache older than 5 minutes');