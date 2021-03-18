/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

const containerStyle = css({
  maxWidth: "700px",
  padding: "20px",
  margin: "0 auto",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
});

const StartComponent = ()=>(
  <div css={containerStyle}>
    <svg css={css`max-width: 200px; width: 50%;`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
    <h1 css={css`font-weight: 400; text-align:center;`}>Please enable location services to get the current weather for your location</h1>
  </div>
)

export default StartComponent;