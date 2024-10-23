/* eslint-disable react/jsx-no-constructed-context-values */
import path from 'path';
import { StyleProvider, createCache } from '@ant-design/cssinjs';
import { XProvider } from '@ant-design/x';
import { globSync } from 'glob';
import kebabCase from 'lodash/kebabCase';
import * as React from 'react';
import { renderToString } from 'react-dom/server';

import { resetWarned } from '../../components/_util/warning';
import { render } from '../utils';
import { TriggerMockContext } from './demoTestContext';
import { excludeWarning, isSafeWarning } from './excludeWarning';
import rootPropsTest from './rootPropsTest';

export { rootPropsTest };

require('isomorphic-fetch');

export type Options = {
  skip?: boolean | string[];
  testingLib?: boolean;
  testRootProps?: false | object;
  /**
   * Not check component `displayName`, check path only
   */
  nameCheckPathOnly?: boolean;
};

export function baseText(doInject: boolean, component: string, options: Options = {}) {
  const files = globSync(`./components/${component}/demo/*.tsx`).filter(
    (file) => !file.includes('_semantic'),
  );
  files.forEach((file) => {
    // to compatible windows path
    const mergedFile = file.split(path.sep).join('/');
    const testMethod =
      options.skip === true ||
      (Array.isArray(options.skip) && options.skip.some((c) => mergedFile.includes(c)))
        ? test.skip
        : test;

    // function doTest(name: string, openTrigger = false) {
    testMethod(
      doInject
        ? `renders ${mergedFile} extend context correctly`
        : `renders ${mergedFile} correctly`,
      () => {
        resetWarned();

        const errSpy = excludeWarning();

        Date.now = jest.fn(() => new Date('2016-11-22').getTime());
        jest.useFakeTimers().setSystemTime(new Date('2016-11-22'));

        let Demo = require(`../../${mergedFile}`).default; // eslint-disable-line global-require
        // Inject Trigger status unless skipped
        Demo = typeof Demo === 'function' ? <Demo /> : Demo;
        if (doInject) {
          Demo = (
            <TriggerMockContext.Provider value={{ popupVisible: true }}>
              {Demo}
            </TriggerMockContext.Provider>
          );
        }

        // Inject cssinjs cache to avoid create <style /> element
        Demo = (
          <XProvider theme={{ hashed: false }}>
            <StyleProvider cache={createCache()}>{Demo}</StyleProvider>
          </XProvider>
        );

        // Demo Test also include `dist` test which is already uglified.
        // We need test this as SSR instead.
        if (doInject) {
          const { container } = render(Demo);
          expect({ type: 'demo', html: container.innerHTML }).toMatchSnapshot();
        } else {
          const html = renderToString(Demo);
          expect({ type: 'demo', html }).toMatchSnapshot();
        }

        jest.clearAllTimers();

        // Snapshot of warning info
        if (doInject) {
          const errorMessageSet = new Set(errSpy.mock.calls.map((args) => args[0]));
          const errorMessages = Array.from(errorMessageSet)
            .filter((msg) => !isSafeWarning(msg, true))
            .sort();

          expect(errorMessages).toMatchSnapshot();
        }

        errSpy.mockRestore();
      },
    );
    jest.useRealTimers();
  });
}

/**
 * Inject Trigger to force open in test snapshots
 */
export function extendTest(component: string, options: Options = {}) {
  baseText(true, component, options);
}

/**
 * Test all the demo snapshots
 */
export default function demoTest(component: string, options: Options = {}) {
  baseText(false, component, options);

  // Test component name is match the kebab-case
  const testName = test;

  if (!component.startsWith('use')) {
    testName('component name is match the kebab-case', () => {
      const kebabName = kebabCase(component);

      // Path should exist
      // eslint-disable-next-line global-require
      const { default: Component } = require(`../../components/${kebabName}`);

      if (options.nameCheckPathOnly !== true) {
        expect(kebabCase(Component.displayName || '')).toEqual(kebabName);
      }
    });

    if (options?.testRootProps !== false) {
      rootPropsTest(component, null!, {
        props: options?.testRootProps,
      });
    }
  }
}
