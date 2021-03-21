import { interpret } from 'xstate';

import BackgroundMachine from '../../src/machines/BackgroundMachine';

describe('Video Machine', () => {
  it('should find an appropriate video for current city/weather', () => {
    const backgroundService = interpret(BackgroundMachine);
    backgroundService.start();
    fail();
  });

  it.todo(
    'should refuse videos not satisfying strict keywords and default to icon background'
  );

  it.todo(
    'should successfully search for videos again every 5 minutes based on updated Weather Machine data'
  );
});
