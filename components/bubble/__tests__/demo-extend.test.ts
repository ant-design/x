import { extendTest } from '../../../tests/shared/demoTest';

extendTest('bubble', {
  // Ignore gpt-vis demo, need browser env not jsdom
  skip: ['gpt-vis'],
});
