const { SkillInstaller } = require('../bin/index.js');
const fs = require('fs');
const path = require('path');

// Mock fs module
jest.mock('fs');
jest.mock('path');

describe('Error Handling Tests', () => {
  let installer;
  let mockExit;
  let mockConsoleError;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock process.exit
    mockExit = jest.fn();
    process.exit = mockExit;

    // Mock console.error
    mockConsoleError = jest.fn();
    console.error = mockConsoleError;

    // Reset mocks
    fs.readFileSync.mockReset();
    fs.readdirSync.mockReset();
    fs.existsSync.mockReset();
    fs.mkdirSync.mockReset();
    fs.copyFileSync.mockReset();
    fs.rmSync.mockReset();

    path.join.mockImplementation((...args) => args.join('/'));
  });

  afterEach(() => {
    if (installer?.rl) {
      installer.rl.close();
    }
  });

  test('should handle config loading error', () => {
    // Mock fs.readFileSync to throw error for config file
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('.skill.json')) {
        throw new Error('Config file not found');
      }
      return '{}';
    });

    // Since process.exit is mocked, the function won't actually throw
    new SkillInstaller();

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Failed to load skill config:',
      expect.any(Error),
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test('should handle invalid JSON in config', () => {
    // Mock fs.readFileSync to return invalid JSON
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('.skill.json')) {
        return 'invalid json {';
      }
      return '{}';
    });

    new SkillInstaller();

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Failed to load skill config:',
      expect.any(Error),
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });
  test('should handle skills directory read error', () => {
    // Mock successful config loading but failed skills directory read
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('.skill.json')) {
        return JSON.stringify({
          targets: {
            vscode: {
              enabled: true,
              paths: { global: '.vscode', project: '.vscode' },
            },
          },
        });
      }
      return '{}';
    });

    fs.readdirSync.mockImplementation((dir) => {
      if (dir.includes('skills')) {
        throw new Error('Skills directory not found');
      }
      return [];
    });

    new SkillInstaller();

    expect(mockConsoleError).toHaveBeenCalledWith('Failed to load skills:', expect.any(Error));
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test('should handle SKILL.md read error gracefully', () => {
    // Mock successful config and skills directory
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('.skill.json')) {
        return JSON.stringify({
          targets: {
            vscode: {
              enabled: true,
              paths: { global: '.vscode', project: '.vscode' },
            },
          },
        });
      }
      return '{}';
    });

    fs.readdirSync.mockImplementation((dir) => {
      if (dir.includes('skills')) {
        return [{ name: 'test-skill', isDirectory: () => true }];
      }
      return [];
    });

    fs.existsSync.mockImplementation((filePath) => {
      return filePath.includes('SKILL.md');
    });

    // Mock readFileSync to throw error for SKILL.md
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('SKILL.md')) {
        throw new Error('SKILL.md not found');
      }
      if (filePath.includes('.skill.json')) {
        return JSON.stringify({
          targets: {
            vscode: {
              enabled: true,
              paths: { global: '.vscode', project: '.vscode' },
            },
          },
        });
      }
      return '{}';
    });

    // Should not throw, should handle gracefully
    expect(() => {
      new SkillInstaller();
    }).not.toThrow();

    const installer = new SkillInstaller();
    expect(installer.skills).toHaveLength(1);
    expect(installer.skills[0].description).toBe('test-skill');
  });

  test('should handle empty SKILL.md description', () => {
    // Mock successful config and skills directory
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('.skill.json')) {
        return JSON.stringify({
          targets: {
            vscode: {
              enabled: true,
              paths: { global: '.vscode', project: '.vscode' },
            },
          },
        });
      }
      if (filePath.includes('SKILL.md')) {
        return '# \n'; // Empty description
      }
      return '{}';
    });

    fs.readdirSync.mockImplementation((dir) => {
      if (dir.includes('skills')) {
        return [{ name: 'test-skill', isDirectory: () => true }];
      }
      return [];
    });

    fs.existsSync.mockReturnValue(true);

    const installer = new SkillInstaller();
    expect(installer.skills).toHaveLength(1);
    expect(installer.skills[0].description).toBe('test-skill');
  });

  test('should handle SKILL.md with dashes only', () => {
    // Mock successful config and skills directory
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('.skill.json')) {
        return JSON.stringify({
          targets: {
            vscode: {
              enabled: true,
              paths: { global: '.vscode', project: '.vscode' },
            },
          },
        });
      }
      if (filePath.includes('SKILL.md')) {
        return '# ---'; // Dashes only
      }
      return '{}';
    });

    fs.readdirSync.mockImplementation((dir) => {
      if (dir.includes('skills')) {
        return [{ name: 'test-skill', isDirectory: () => true }];
      }
      return [];
    });

    fs.existsSync.mockReturnValue(true);

    const installer = new SkillInstaller();
    expect(installer.skills).toHaveLength(1);
    expect(installer.skills[0].description).toBe('test-skill');
  });
});
