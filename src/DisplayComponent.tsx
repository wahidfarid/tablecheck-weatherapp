/** @jsx jsx */
// eslint-disable-next-line no-use-before-define
import React from 'react';
import { css, jsx } from '@emotion/react';

const containerStyle = css`
  padding: 3rem;
  height: 100%;
  display: flex;
  background: rgba(255, 205, 0, 1);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05) inset;
`;

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

const DisplayComponent = () => (
  <div css={containerStyle}>
    <div css={wrapperStyle}>
      <h2 css={AreaTitleStyle}>London</h2>
      <i className="wi wi-day-sunny" css={IconStyle}></i>
      <div css={DividerStyle}></div>
      <h3 css={TempratureStyle}>29°</h3>
      <div>
        <h4
          css={css`
            font-size: 4rem;
            margin: 0;
            /* text-align: right; */
          `}
        >
          <i css={minorIconStyles} className="wi wi-raindrop"></i>15 %
        </h4>
        <h4
          css={css`
            font-size: 4rem;
            margin: 0;
            /* text-align: right; */
          `}
        >
          <i css={minorIconStyles} className="wi wi-strong-wind"></i>40 <span css={css`font-size: 2rem;`}>km/h</span>
        </h4>
      </div>
    </div>
  </div>
);

export default DisplayComponent;
