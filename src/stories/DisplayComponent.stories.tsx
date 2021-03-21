import React from 'react';

import DisplayComponent from '../DisplayComponent';
import { weatherMachineContext } from '../machines/WeatherMachine';
import { Story, Meta } from '@storybook/react/types-6-0';

// 👇 This default export determines where your story goes in the story list
export default {
  title: 'Display Component',
  component: DisplayComponent,
} as Meta;

const multipleCities: weatherMachineContext = {
  cities: [
    {
      coords: { lat: 0, lng: 0 },
      name: 'texas',
      data: {
        deg: 170,
        humidity: 76,
        icon: '02n',
        name: 'Texas',
        temprature: 15,
        wind: 4.12,
      },
    },
    {
      coords: { lat: 0, lng: 0 },
      name: 'cairo',
      data: {
        deg: 320,
        humidity: 37,
        icon: '50d',
        name: 'Cairo',
        temprature: 30,
        wind: 2,
      },
    },
    {
      coords: { lat: 0, lng: 0 },
      name: 'berlin',
      data: {
        deg: 310,
        humidity: 62,
        icon: '04n',
        name: 'Berlin',
        temprature: 2,
        wind: 16,
      },
    },
    {
      coords: { lat: 0, lng: 0 },
      name: 'tokyo',
      data: {
        deg: 200,
        humidity: 94,
        icon: '50n',
        name: 'Tokyo',
        temprature: 22,
        wind: 7,
      },
    },
    {
      coords: { lat: 0, lng: 0 },
      name: 'dubai',
      data: {
        deg: 280,
        humidity: 34,
        icon: '01d',
        name: 'Dubai',
        temprature: 45,
        wind: 5,
      },
    },
  ],
  currentCityIndex: 1,
};

const singleCity: weatherMachineContext = {
  cities: [
    {
      coords: { lat: 0, lng: 0 },
      name: 'tokyo',
      data: {
        deg: 200,
        humidity: 94,
        icon: '50n',
        name: 'Tokyo',
        temprature: 7.35,
        wind: 4.12,
      },
    },
  ],
  currentCityIndex: 0,
};

type DisplayProps = {
  context: weatherMachineContext;
  city?: string;
};
const Template: Story<DisplayProps> = (args) => {
  if (args.city) {
    const cityIndex = args.context.cities.findIndex((city) => {
      if (city.name == args.city) return true;
      return false;
    });
    args.context.currentCityIndex = cityIndex;
  }
  return <DisplayComponent context={args.context} />;
};

export const SingleCity = Template.bind({});
SingleCity.args = { context: singleCity };

export const MutlipleCities = Template.bind({});
MutlipleCities.args = { context: multipleCities };
MutlipleCities.argTypes = {
  city: {
    control: {
      type: 'select',
      options: ['cairo', 'tokyo', 'texas', 'berlin', 'dubai'],
    },
  },
};
