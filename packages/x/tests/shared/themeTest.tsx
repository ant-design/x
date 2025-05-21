import React from 'react';
import { XProvider } from '../../components';

import { render } from '../utils';

import type { ThemeConfig } from 'antd';

const themeOptions: ThemeConfig = {
  components: {
    Button: {
      fontWeight: 600,
    },
  },
};

const themeTest = (Component: React.ComponentType) => {
  describe('test theme', () => {
    it('component should be rendered correctly when configuring the theme.components', () => {
      const { container } = render(
        <XProvider theme={themeOptions}>
          <Component />
        </XProvider>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
};

export default themeTest;
