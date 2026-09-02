import demoTest from '../../../tests/shared/demoTest';

jest.mock('dumi/dist/client/theme-api', () => ({
  useIntl: () => ({ locale: 'en-US' }),
}));

demoTest('tool-call', {
  testRootProps: {
    item: {
      id: 'root-props',
      name: 'rootPropsTool',
      status: 'pending',
    },
  },
});
