import React from 'react';
import { XConfigProvider } from '../../components';

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
        <XConfigProvider theme={themeOptions}>
          <Component />
        </XConfigProvider>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
};

export default themeTest;
