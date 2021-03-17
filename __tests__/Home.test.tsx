import React from 'react';
import {render} from 'enzyme';
import Home from '../src/Home';
import WeatherMachine from '../src/machines/WeatherMachine';


it('should ask the user for location', () => {
  const component = render(<Home/>)
  expect(component.html()).toMatch(/Please enable location services/i);
})

it('should detect if a location is cached and valid',()=>{
  const stateDefinition = JSON.parse(localStorage.getItem('app-state')) || WeatherMachine.initialState;
  expect(stateDefinition.matches('data')).toBeTruthy();
});
it('should not ask the user if cached location is valid',()=>{

});
it('should ask the user for location if cache older than 5 minutes',()=>{
  
});