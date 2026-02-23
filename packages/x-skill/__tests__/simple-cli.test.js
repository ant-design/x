const { SkillInstaller } = require('../bin/index.js');
const _fs = require('fs');
const _path = require('path');

describe('Simple CLI and Core Functionality Tests', () => {
  let installer;

  beforeEach(() => {
    installer = new SkillInstaller();
  });

  afterEach(() => {
    if (installer?.rl) {
      installer.rl.close();
    }
  });

  describe('Core Methods', () => {
    test('colorize method should work correctly', () => {
      expect(installer.colorize('test', 'red')).toBe('\x1b[31mtest\x1b[0m');
      expect(installer.colorize('test', 'green')).toBe('\x1b[32mtest\x1b[0m');
      expect(installer.colorize('test', 'invalid')).toBe('test');
    });

    test('getMessage method should return correct messages', () => {
      const message = installer.getMessage('selectLanguage');
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });

    test('printSeparator should not throw', () => {
      const originalLog = console.log;
      console.log = jest.fn();

      expect(() => {
        installer.printSeparator();
      }).not.toThrow();

      console.log = originalLog;
    });

    test('printHeader should not throw', () => {
      const originalLog = console.log;
      console.log = jest.fn();

      expect(() => {
        installer.printHeader();
      }).not.toThrow();

      console.log = originalLog;
    });

    test('loadLocaleMessages should return messages', () => {
      const messages = installer.loadLocaleMessages();
      expect(messages).toBeDefined();
      expect(typeof messages).toBe('object');
      expect(messages.zh).toBeDefined();
      expect(messages.en).toBeDefined();
    });
  });

  describe('Utility Methods', () => {
    test('spinner methods should work', () => {
      expect(() => {
        installer.startSpinner('test');
        installer.stopSpinner();
      }).not.toThrow();
    });

    test('progress bar methods should work', () => {
      const originalWrite = process.stdout.write;
      process.stdout.write = jest.fn();

      expect(() => {
        installer.printProgressBar(50, 100, 'test');
        installer.updateSingleProgressBar(75, 100, 'test2');
      }).not.toThrow();

      process.stdout.write = originalWrite;
    });
  });

  describe('Configuration', () => {
    test('should load config correctly', () => {
      const config = installer.loadConfig();
      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
      expect(config.targets).toBeDefined();
    });

    test('should load skills correctly', () => {
      expect(Array.isArray(installer.skills)).toBe(true);
      expect(installer.skills.length).toBeGreaterThan(0);

      installer.skills.forEach((skill) => {
        expect(skill).toHaveProperty('name');
        expect(skill).toHaveProperty('path');
        expect(skill).toHaveProperty('description');
      });
    });
  });
});
