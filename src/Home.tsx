/** @jsx jsx */
// eslint-disable-next-line no-use-before-define
import React from 'react';
import { jsx } from '@emotion/react';
import { useMachine } from '@xstate/react';

import WeatherMachine from './machines/WeatherMachine';
import StartComponent from './Start';
import DisplayComponent from './DisplayComponent';

const Home = () => {
  // Machine hooks
  const [current] = useMachine(WeatherMachine);

  let outputComponent = <StartComponent />;
  if (current.context.data.name) {
    outputComponent = <DisplayComponent />;
  }

  return outputComponent;
};

export default Home;
