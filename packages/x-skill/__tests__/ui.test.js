const { SkillInstaller } = require('../bin/index.js');

describe('UI and Progress Methods Tests', () => {
  let installer;
  let mockStdoutWrite;
  let mockConsoleLog;

  beforeEach(() => {
    installer = new SkillInstaller();

    // Mock stdout.write and console.log
    mockStdoutWrite = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    mockStdoutWrite.mockRestore();
    mockConsoleLog.mockRestore();

    // Clean up any intervals
    if (installer.spinnerInterval) {
      clearInterval(installer.spinnerInterval);
    }
  });

  describe('printProgressBar method', () => {
    test('should display 0% progress correctly', () => {
      installer.printProgressBar(0, 100, 'Starting');

      expect(mockStdoutWrite).toHaveBeenCalled();
      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output).toContain('0%');
      expect(output).toContain('Starting');
    });

    test('should display 50% progress correctly', () => {
      installer.printProgressBar(50, 100, 'Halfway');

      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output).toContain('50%');
      expect(output).toContain('Halfway');
      expect(output).toContain('█');
      expect(output).toContain('░');
    });

    test('should display 100% progress correctly', () => {
      installer.printProgressBar(100, 100, 'Complete');

      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output).toContain('100%');
      expect(output).toContain('Complete');
      expect(output).toContain('█');
      expect(output).toContain('██████████████████████████████');
    });

    test('should handle single item progress', () => {
      installer.printProgressBar(1, 1, 'Single');

      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output).toContain('100%');
      expect(output).toContain('Single');
    });

    test('should handle zero total items', () => {
      installer.printProgressBar(0, 0, 'Empty');

      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output).toContain('0%');
      expect(output).toContain('Empty');
    });

    test('should handle fractional progress', () => {
      installer.printProgressBar(33, 100, 'One third');

      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output).toContain('33%');
      expect(output).toContain('One third');
    });
  });

  describe('updateSingleProgressBar method', () => {
    test('should update progress bar with carriage return', () => {
      installer.updateSingleProgressBar(75, 100, 'Processing');

      expect(mockStdoutWrite).toHaveBeenCalled();
      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output.startsWith('\r')).toBe(true);
      expect(output).toContain('75%');
      expect(output).toContain('Processing');
    });

    test('should pad output to 80 characters', () => {
      installer.updateSingleProgressBar(100, 100, 'Done');

      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output.length).toBeGreaterThanOrEqual(80);
      expect(output).toContain('100%');
    });

    test('should handle long text gracefully', () => {
      const longText = 'This is a very long processing message that might exceed normal length';
      installer.updateSingleProgressBar(50, 100, longText);

      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output).toContain('50%');
      expect(output).toContain(longText);
    });
  });

  describe('printHeader method', () => {
    test('should print header with correct formatting', () => {
      installer.printHeader();

      expect(mockConsoleLog).toHaveBeenCalled();
      const calls = mockConsoleLog.mock.calls.map((call) => call[0]);

      // Check for header components
      const headerText = calls.join('\n');
      expect(headerText).toContain('X-Skill 安装器');
      expect(headerText).toContain('让开发变得更简单、更有趣！');
      expect(headerText).toContain('╔══════════════════════════════════╗');
    });

    test('should use color codes in header', () => {
      installer.printHeader();

      const calls = mockConsoleLog.mock.calls.map((call) => call[0]);
      const headerText = calls.join('\n');

      expect(headerText).toContain('\x1b[36m'); // cyan
      expect(headerText).toContain('\x1b[1m'); // bright
      expect(headerText).toContain('\x1b[0m'); // reset
    });
  });

  describe('printSeparator method', () => {
    test('should print separator line', () => {
      installer.printSeparator();

      expect(mockConsoleLog).toHaveBeenCalled();
      const output = mockConsoleLog.mock.calls[0][0];
      expect(output).toContain('──────────────────────────────────────────────────');
      expect(output).toContain('\x1b[2m'); // dim color
    });
  });

  describe('spinner methods', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
      if (installer.spinnerInterval) {
        clearInterval(installer.spinnerInterval);
      }
    });

    test('should start spinner and set interval', () => {
      installer.startSpinner('Loading...');

      expect(installer.spinnerInterval).toBeDefined();
      expect(typeof installer.spinnerInterval).toBe('object');
    });

    test('should stop spinner and clear interval', () => {
      installer.startSpinner('Loading...');
      const _intervalId = installer.spinnerInterval;

      installer.stopSpinner();

      expect(installer.spinnerInterval).toBeNull();
    });

    test('should handle stop without start', () => {
      expect(() => {
        installer.stopSpinner();
      }).not.toThrow();

      expect(installer.spinnerInterval).toBeUndefined();
    });

    test('should handle multiple stops', () => {
      installer.startSpinner('Loading...');

      installer.stopSpinner();
      installer.stopSpinner(); // Second stop

      expect(installer.spinnerInterval).toBeNull();
    });

    test('should display spinner frames', () => {
      installer.startSpinner('Test message');

      // Advance timers to trigger interval
      jest.advanceTimersByTime(1000);

      expect(mockStdoutWrite).toHaveBeenCalled();
      const calls = mockStdoutWrite.mock.calls.map((call) => call[0]);

      // Check that spinner frames are being displayed
      const spinnerOutput = calls.join('');
      expect(spinnerOutput).toContain('\r');
      expect(spinnerOutput).toContain('Test message');
    });
  });

  describe('Integration tests', () => {
    test('should combine UI elements correctly', () => {
      // Test that all UI methods can be called in sequence
      expect(() => {
        installer.printHeader();
        installer.printSeparator();
        installer.printProgressBar(0, 100, 'Starting');
        installer.updateSingleProgressBar(50, 100, 'Halfway');
        installer.printProgressBar(100, 100, 'Complete');
      }).not.toThrow();
    });

    test('should handle rapid progress updates', () => {
      expect(() => {
        for (let i = 0; i <= 100; i += 10) {
          installer.updateSingleProgressBar(i, 100, `Step ${i}`);
        }
      }).not.toThrow();
    });
  });

  describe('Color and formatting consistency', () => {
    test('should maintain consistent color formatting', () => {
      const redText = installer.colorize('test', 'red');
      const greenText = installer.colorize('test', 'green');

      expect(redText).toContain('\u001b[31m');
      expect(redText).toContain('\u001b[0m');
      expect(redText.startsWith('\u001b[31m')).toBe(true);
      expect(redText.endsWith('\u001b[0m')).toBe(true);

      expect(greenText).toContain('\u001b[32m');
      expect(greenText).toContain('\u001b[0m');
      expect(greenText.startsWith('\u001b[32m')).toBe(true);
      expect(greenText.endsWith('\u001b[0m')).toBe(true);
    });

    test('should reset colors after each use', () => {
      const text = installer.colorize('test', 'red');
      expect(text.endsWith('\x1b[0m')).toBe(true);
    });
  });
});
