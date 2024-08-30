import React from 'react';
import { ConfigProvider } from 'antd';
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
        <ConfigProvider theme={themeOptions}>
          <Component />
        </ConfigProvider>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
};

export default themeTest;
