import React from 'react';
import styled from '@emotion/styled';

import {
  calculateBackgroundColorBasedOnTemprature,
  calculateWindDirectionBasedOnDegree,
} from './UIHelperFunctions';
import { weatherMachineContext } from './machines/WeatherMachine';
import weatherIconsMap from './weatherIconsMap';

type backgroundIconWrapperProps = {
  windDirection: {
    xAxis: number;
    yAxis: number;
  };
  icon: string;
  speed: number;
};

type StyledContainerProps = {
  backgroundColor: string;
};
const StyledContainer = styled.div((props: StyledContainerProps) => {
  return {
    padding: '3rem',
    height: '100%',
    display: 'flex',
    background: 'rgb(255, 205, 0)',
    backgroundColor: props.backgroundColor,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxDhadow: '0 0 20px rgba(0, 0, 0, 0.05) inset',
    transition: 'all 1s',
  };
});

const BackgroundIconWrapper = styled.div`
  ${(props: backgroundIconWrapperProps) => {
    return `background: url(/weather-icons/${props.icon}.svg);
      animation-duration: 5s; 
      @keyframes bg-slide {
        from {
          transform: translate(0, 0);
        }
        to {
          transform: translate(${
            props.windDirection.xAxis * Math.round(props.speed)
          }rem, 
          ${props.windDirection.yAxis * Math.round(props.speed)}rem);
        }
      }
    `;
  }}

  animation: bg-slide 5s linear infinite;
  background-size: 5rem;
  opacity: 0.03;
  position: absolute;
  width: calc(200%);
  height: calc(200%);
  top: -50%;
  left: -50%;
`;

const StyledWrapper = styled.div({
  maxWidth: '700px',
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
});

const StyledAreaTitle = styled.h2`
  font-size: 4rem;
  text-transform: uppercase;
  width: 100%;
  text-align: center;
  @media (min-width: 768px) {
    position: absolute;
    left: 0;
    bottom: calc(100% - 5rem);
    width: 0;
    margin: 0;
    overflow: visible;
  }
`;

const StyledIcon = styled.i`
  font-size: 14rem;
  width: 100%;
  text-align: center;
  @media (min-width: 768px) {
    width: 33%;
    font-size: 20rem;
  }
`;

const DividerComponent = styled.div`
  border-top: 1px solid #fff;
  width: 100%;
  margin-top: 4rem;
  @media (min-width: 768px) {
    display: none;
  }
`;

const StyledTempratureTitle = styled.h3`
  font-size: 10rem;
  margin: 0;
  @media (min-width: 768px) {
    order: -1;
    align-self: flex-end;
    width: 33%;
    height: 16rem;
    font-size: 16rem;
  }
`;

const StyledMinorWrapper = styled.div`
  @media (min-width: 768px) {
    width: 33%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 5rem 0;
  }
`;

const StyledMinorTitle = styled.h4`
  font-size: 4rem;
  margin: 0;
  @media (min-width: 768px) {
    text-align: right;
  }
`;

const StyledMinorIcon = styled.i`
  font-size: 4rem;
  width: 4rem;
  text-align: right;
  margin: 0 2rem;
`;

type DisplayProps = {
  context: weatherMachineContext;
};

const DisplayComponent = ({ context }: DisplayProps) => {
  const currentCity = context.cities[context.currentCityIndex];
  const icon: string = currentCity.data.icon!;

  return (
    <StyledContainer
      backgroundColor={calculateBackgroundColorBasedOnTemprature(
        currentCity.data.temprature
      )}
    >
      <BackgroundIconWrapper
        icon={weatherIconsMap[icon]}
        windDirection={calculateWindDirectionBasedOnDegree(
          currentCity.data.deg
        )}
        speed={currentCity.data.wind!}
      />
      <StyledWrapper>
        <StyledAreaTitle>{currentCity.data.name}</StyledAreaTitle>
        <StyledIcon className={`wi ${weatherIconsMap[icon]}`}></StyledIcon>
        <DividerComponent />
        <StyledTempratureTitle>
          {Math.round(currentCity.data.temprature || 0)}°
        </StyledTempratureTitle>
        <StyledMinorWrapper>
          <StyledMinorTitle>
            <StyledMinorIcon className="wi wi-raindrop"></StyledMinorIcon>
            {currentCity.data.humidity} %
          </StyledMinorTitle>
          <StyledMinorTitle>
            <StyledMinorIcon className="wi wi-strong-wind"></StyledMinorIcon>
            {currentCity.data.wind}{' '}
            <span style={{ fontSize: '2rem' }}>km/h</span>
          </StyledMinorTitle>
        </StyledMinorWrapper>
      </StyledWrapper>
    </StyledContainer>
  );
};

export default DisplayComponent;
