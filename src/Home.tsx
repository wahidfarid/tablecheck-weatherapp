import React from 'react';
import { useMachine } from '@xstate/react';
import { useLocation } from 'react-router-dom';
import qs from 'query-string';

import { weatherMachine } from './machines/WeatherMachine';
import { RequiresLocation } from './RequiresLocation';
import DisplayComponent from './DisplayComponent';

const Home = () => {
  const { search } = useLocation();
  const { cities: rawCitiesParam = '' } = qs.parse(search);
  const cities = rawCitiesParam
    .split(',')
    .filter((str) => str.length > 0)
    .map((name) => ({ name }));
  const [state] = useMachine(
    weatherMachine.withContext({ cities, currentCityIndex: 0 })
  );

  if (['init', 'loading'].some(state.matches)) {
    return <span>loading...</span>;
  }

  if (state.matches('loaded')) {
    return <DisplayComponent context={state.context} />;
  }

  if (['gettingLocation', 'locationRefused'].some(state.matches)) {
    return <RequiresLocation />;
  }

  if (state.matches('error')) {
    return <span>data error</span>;
  }
};

export default Home;
