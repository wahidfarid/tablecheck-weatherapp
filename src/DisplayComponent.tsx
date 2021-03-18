/** @jsx jsx */
// eslint-disable-next-line no-use-before-define
import React from 'react';
import { css, jsx } from '@emotion/react';

const containerStyle = css({
  padding: '20px',
  height: '100%',
  display: 'flex',
  background: 'Red',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const wrapperStyle = css({
  maxWidth: '700px',
  margin: '0 auto',
  display: 'flex',
});

const DisplayComponent = () => (
  <div css={containerStyle}>
    <div css={wrapperStyle}>
      <i className="wi wi-day-sunny"></i>
    </div>
  </div>
);

export default DisplayComponent;
