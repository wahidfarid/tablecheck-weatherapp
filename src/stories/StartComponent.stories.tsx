import React from 'react';

import '../stylesheets/global-styles.css';
import StartComponent from '../Start';

// 👇 This default export determines where your story goes in the story list
export default {
  title: 'Start Screen Component',
  component: StartComponent,
};

// 👇 We create a “template” of how args map to rendering
const Template = () => <StartComponent />;

export const InitialScreen = Template.bind({});
