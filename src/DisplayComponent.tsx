/** @jsx jsx */
// eslint-disable-next-line no-use-before-define
import React from 'react';
import { css, jsx } from '@emotion/react';

import { weatherMachineContext } from './machines/WeatherMachine';
import weatherIconsMap from './weatherIconsMap';

const containerStyle = css({
  padding: '3rem',
  height: '100%',
  display: 'flex',
  background: 'rgb(255, 205, 0)',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  boxDhadow: '0 0 20px rgba(0, 0, 0, 0.05) inset',
  transition: 'all 1s',
});

const wrapperStyle = css({
  maxWidth: '700px',
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const AreaTitleStyle = css`
  font-size: 4rem;
  text-transform: uppercase;
  width: 100%;
  text-align: center;
`;

const IconStyle = css`
  font-size: 14rem;
  width: 100%;
  text-align: center;
`;

const DividerStyle = css`
  border-top: 1px solid #fff;
  width: 100%;
  margin-top: 4rem;
`;

const TempratureStyle = css`
  font-size: 10rem;
  margin: 0;
`;

const minorIconStyles = css`
  font-size: 4rem;
  width: 4rem;
  text-align: right;
  margin: 0 2rem;
`;

const minorTitleStyles = css`
  font-size: 4rem;
  margin: 0;
`;

export const calculateBackgroundColorBasedOnTemprature = (temp: number = 0) => {
  // Define color stop-points
  const tenPercentDeepBlue = [4, 6, 14]; // 10c
  const tenPercentLightBlue = [5, 15, 21]; // 20c
  const tenPercentYellow = [25, 20, 0]; // 30c
  const tenPercentRed = [19, 6, 4]; // 40c

  // for a range of +-10c around temprature, create new color varation by building
  // it ten percent for each degree in the range
  const output = [0, 0, 0];
  new Array(10).fill(0).forEach((_tenPercentDegree, index) => {
    const i = temp - 5 + index;
    let chosenColor = tenPercentDeepBlue;

    if (i >= 15) chosenColor = tenPercentLightBlue;
    if (i >= 25) chosenColor = tenPercentYellow;
    if (i >= 35) chosenColor = tenPercentRed;

    output[0] += chosenColor[0];
    output[1] += chosenColor[1];
    output[2] += chosenColor[2];
  });

  return 'rgb(' + output.join(',') + ');';
};
type DisplayProps = {
  context: weatherMachineContext;
};
const DisplayComponent = ({ context }: DisplayProps) => {
  const currentCity = context.cities[context.currentCityIndex];
  const icon: string = currentCity.data.icon!;

  return (
    <div
      css={css`
        ${containerStyle};
        background-color: ${calculateBackgroundColorBasedOnTemprature(
          currentCity.data.temprature
        )};
      `}
    >
      <div css={wrapperStyle}>
        <h2 css={AreaTitleStyle}>{currentCity.data.name}</h2>
        <i className={`wi ${weatherIconsMap[icon]}`} css={IconStyle}></i>
        <div css={DividerStyle}></div>
        <h3 css={TempratureStyle}>
          {Math.round(currentCity.data.temprature || 0)}°
        </h3>
        <div>
          <h4 css={minorTitleStyles}>
            <i css={minorIconStyles} className="wi wi-raindrop"></i>
            {currentCity.data.humidity} %
          </h4>
          <h4 css={minorTitleStyles}>
            <i css={minorIconStyles} className="wi wi-strong-wind"></i>
            {currentCity.data.wind}{' '}
            <span
              css={css`
                font-size: 2rem;
              `}
            >
              km/h
            </span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default DisplayComponent;
