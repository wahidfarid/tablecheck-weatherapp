/** @jsx jsx */
import React, { useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { useMachine } from '@xstate/react';
import { Machine, State } from 'xstate';

import WeatherMachine from './machines/WeatherMachine';
import StartComponent from './Start';


const  Home = ({}) => {  

  // Machine hooks
  const [current, send] = useMachine(WeatherMachine);

  return <StartComponent/>
  
  {/* <i className="wi wi-day-sunny"></i> */}

}

export default Home;
