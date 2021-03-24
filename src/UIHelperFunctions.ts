type singleDirectionEnum = {
  [key: string]: [number, number];
};

export const calculateBackgroundColorBasedOntemperature = (temp: number = 0) => {
  // Define color stop-points
  const tenPercentDeepBlue = [4, 6, 14]; // 10c
  const tenPercentLightBlue = [5, 15, 21]; // 20c
  const tenPercentYellow = [25, 20, 0]; // 30c
  const tenPercentRed = [19, 6, 4]; // 40c

  // for a range of +-10c around temperature, create new color varation by building
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

export const calculateWindDirectionBasedOnDegree = (deg: number = 0) => {
  const directionEnum: singleDirectionEnum = {
    0: [0, -1],
    1: [1, -1],
    2: [1, 0],
    3: [1, 1],
    4: [0, 1],
    5: [-1, 1],
    6: [-1, 0],
    7: [-1, -1],
  };

  const enumKey = Math.floor(Math.max(deg - 22.5, 0) / 45);
  return {
    xAxis: directionEnum[enumKey][0] * 5,
    yAxis: directionEnum[enumKey][1] * 5,
  };
};
