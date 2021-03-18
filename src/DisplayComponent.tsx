/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

const containerStyle = css({
  maxWidth: "700px",
  padding: "20px",
  margin: "0 auto",
  height: "100%",
  display: "flex",
  background: "Red",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
});

const DisplayComponent = ()=>(
  <div css={containerStyle}>
    <i className="wi wi-day-sunny"></i>
    <h1 css={css`font-weight: 400; text-align:center;`}>Please enable location services to get the current weather for your location</h1>
  </div>
)

export default DisplayComponent;