/** @jsx jsx */
import React, { useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { useMachine } from '@xstate/react';
import { Machine, State } from 'xstate';

import WeatherMachine from './machines/WeatherMachine';
import StartComponent from './Start';
import DisplayComponent from './DisplayComponent';


const  Home = ({}) => {  

  // Machine hooks
  const [current, send] = useMachine(WeatherMachine);

  let outputComponent = <StartComponent/>;
  if(current.matches("display"))
    outputComponent = <DisplayComponent/>;

  return outputComponent;  

}

export default Home;
