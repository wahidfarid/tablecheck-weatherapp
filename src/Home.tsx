import React from 'react';
import { useMachine } from '@xstate/react';
import { useLocation } from 'react-router-dom';

import WeatherMachine from './machines/WeatherMachine';
import StartComponent from './Start';
import DisplayComponent from './DisplayComponent';

const Home = () => {
  // Machine hooks
  const [current, send] = useMachine(WeatherMachine);

  // Determine if machine should use geolocation or city names
  const searchParams = new URLSearchParams(useLocation().search).get('city');

  if (!searchParams) send('GEOLOCATION');
  else send('QUERY', { cities: searchParams.split(',') });

  let outputComponent = <StartComponent />;
  if (current.context.data.name) {
    outputComponent = <DisplayComponent context={current.context} />;
  }

  return outputComponent;
};

export default Home;
