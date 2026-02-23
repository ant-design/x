const { SkillInstaller } = require('../bin/index.js');

describe('Utility Methods Tests', () => {
  let installer;

  beforeEach(() => {
    installer = new SkillInstaller();
    // Mock console.log to avoid output during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    if (installer?.rl) {
      installer.rl.close();
    }
    if (console.log.mockRestore) {
      console.log.mockRestore();
    }
  });

  describe('colorize method', () => {
    test('should colorize text with valid colors', () => {
      const text = 'Hello World';

      expect(installer.colorize(text, 'red')).toBe('\x1b[31mHello World\x1b[0m');
      expect(installer.colorize(text, 'green')).toBe('\x1b[32mHello World\x1b[0m');
      expect(installer.colorize(text, 'yellow')).toBe('\x1b[33mHello World\x1b[0m');
      expect(installer.colorize(text, 'blue')).toBe('\x1b[34mHello World\x1b[0m');
      expect(installer.colorize(text, 'magenta')).toBe('\x1b[35mHello World\x1b[0m');
      expect(installer.colorize(text, 'cyan')).toBe('\x1b[36mHello World\x1b[0m');
      expect(installer.colorize(text, 'white')).toBe('\x1b[37mHello World\x1b[0m');
      expect(installer.colorize(text, 'bright')).toBe('\x1b[1mHello World\x1b[0m');
      expect(installer.colorize(text, 'dim')).toBe('\x1b[2mHello World\x1b[0m');
    });

    test('should handle invalid color', () => {
      const text = 'Hello World';
      expect(installer.colorize(text, 'invalid')).toBe('Hello World');
    });

    test('should handle empty text', () => {
      expect(installer.colorize('', 'red')).toBe('\x1b[31m\x1b[0m');
    });
  });

  describe('getMessage method', () => {
    test('should return message for valid key', () => {
      const message = installer.getMessage('selectLanguage');
      expect(message).toBe('🌍 请选择语言 / Please select language:');
    });

    test('should handle message with replacements', () => {
      const message = installer.getMessage('welcome', { name: 'Test' });
      expect(typeof message).toBe('string');
    });

    test('should return key if message not found', () => {
      const message = installer.getMessage('nonexistentKey');
      expect(message).toBe('nonexistentKey');
    });

    test('should handle different languages', () => {
      const zhMessage = installer.getMessage('selectLanguage', {}, 'zh');
      const enMessage = installer.getMessage('selectLanguage', {}, 'en');

      expect(zhMessage).toBe('🌍 请选择语言 / Please select language:');
      expect(enMessage).toBe('🌍 Select language / 请选择语言:');
    });
  });

  describe('printHeader method', () => {
    test('should print header without throwing', () => {
      const mockLog = jest.spyOn(console, 'log').mockImplementation(() => {});

      expect(() => {
        installer.printHeader();
      }).not.toThrow();

      expect(mockLog).toHaveBeenCalled();
      mockLog.mockRestore();
    });
  });

  describe('printSeparator method', () => {
    test('should print separator without throwing', () => {
      const mockLog = jest.spyOn(console, 'log').mockImplementation(() => {});

      expect(() => {
        installer.printSeparator();
      }).not.toThrow();

      expect(mockLog).toHaveBeenCalled();
      mockLog.mockRestore();
    });
  });

  describe('spinner methods', () => {
    test('should start and stop spinner without throwing', () => {
      expect(() => {
        installer.startSpinner('Loading...');
      }).not.toThrow();

      expect(() => {
        installer.stopSpinner();
      }).not.toThrow();
    });

    test('should handle multiple stop calls', () => {
      installer.startSpinner('Loading...');

      expect(() => {
        installer.stopSpinner();
        installer.stopSpinner(); // Second call should be safe
      }).not.toThrow();
    });
  });

  describe('progress bar methods', () => {
    test('should print progress bar without throwing', () => {
      const mockStdoutWrite = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});

      expect(() => {
        installer.printProgressBar(5, 10, 'Halfway');
      }).not.toThrow();

      expect(mockStdoutWrite).toHaveBeenCalled();
      mockStdoutWrite.mockRestore();
    });

    test('should update single progress bar without throwing', () => {
      const mockStdoutWrite = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});

      expect(() => {
        installer.updateSingleProgressBar(5, 10, 'Halfway');
      }).not.toThrow();

      expect(mockStdoutWrite).toHaveBeenCalled();
      mockStdoutWrite.mockRestore();
    });

    test('should handle edge cases for progress', () => {
      const mockStdoutWrite = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});

      // Test 0% progress
      installer.printProgressBar(0, 10, 'Starting');

      // Test 100% progress
      installer.printProgressBar(10, 10, 'Complete');

      // Test single item
      installer.printProgressBar(1, 1, 'Single');

      expect(mockStdoutWrite).toHaveBeenCalledTimes(3);
      mockStdoutWrite.mockRestore();
    });
  });

  describe('loadLocaleMessages method', () => {
    test('should load messages successfully', () => {
      const messages = installer.loadLocaleMessages();
      expect(messages).toBeDefined();
      expect(typeof messages).toBe('object');
    });
  });
});
