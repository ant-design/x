import type { ThemeConfig } from 'antd';
import React from 'react';
import { XProvider } from '../../components';
import { render } from '../utils';

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
