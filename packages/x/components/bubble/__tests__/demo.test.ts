import demoTest from '../../../tests/shared/demoTest';

demoTest('bubble', {
  // Ignore gpt-vis demo, need browser env not jsdom
  skip: ['gpt-vis'],
});
