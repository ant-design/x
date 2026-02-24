const { SkillInstaller } = require('../bin/index.js');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Mock all required modules
jest.mock('fs');
jest.mock('path');
jest.mock('os');

describe('Installation Tests', () => {
  let installer;
  let mockMkdirSync;
  let mockExistsSync;
  let mockReaddirSync;
  let mockCopyFileSync;
  let mockRmSync;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mocks
    mockMkdirSync = jest.fn();
    mockExistsSync = jest.fn();
    mockReaddirSync = jest.fn();
    mockCopyFileSync = jest.fn();
    mockRmSync = jest.fn();

    fs.mkdirSync = mockMkdirSync;
    fs.existsSync = mockExistsSync;
    fs.readdirSync = mockReaddirSync;
    fs.copyFileSync = mockCopyFileSync;
    fs.rmSync = mockRmSync;

    // Mock path.join to return predictable paths
    path.join.mockImplementation((...args) => args.join('/'));

    // Mock os.homedir
    os.homedir = jest.fn(() => '/home/testuser');

    // Mock process.cwd
    process.cwd = jest.fn(() => '/current/project');

    // Setup basic file system mocks
    fs.readFileSync = jest.fn((filePath) => {
      if (filePath.includes('.skill.json')) {
        return JSON.stringify({
          targets: {
            cursor: {
              enabled: true,
              paths: {
                global: '.cursor/skills',
                project: '.cursor/skills',
              },
            },
            webstorm: {
              enabled: true,
              paths: {
                global: '.webstorm',
                project: '.webstorm',
              },
            },
          },
        });
      }
      return '{}';
    });

    mockReaddirSync.mockImplementation((dir) => {
      if (dir.endsWith('skills') || dir.endsWith('skills-zh')) {
        return [
          { name: 'test-skill-1', isDirectory: () => true },
          { name: 'test-skill-2', isDirectory: () => true },
        ];
      }
      if (dir.endsWith('test-skill-1')) {
        return [
          { name: 'file1.js', isDirectory: () => false },
          { name: 'subdir', isDirectory: () => true },
        ];
      }
      if (dir.endsWith('test-skill-2')) {
        return [{ name: 'file2.js', isDirectory: () => false }];
      }
      if (dir.endsWith('subdir')) {
        return [{ name: 'nested-file.js', isDirectory: () => false }];
      }
      return [];
    });

    mockExistsSync.mockReturnValue(false);

    installer = new SkillInstaller();
  });

  afterEach(() => {
    if (installer?.rl) {
      installer.rl.close();
    }
  });

  describe('installSkills method', () => {
    test('should install skills globally', async () => {
      mockExistsSync.mockImplementation((path) => {
        return path.includes('test-skill-1');
      });

      await installer.installSkills(['test-skill-1'], 'cursor', true);

      expect(mockMkdirSync).toHaveBeenCalledWith('/home/testuser/.cursor/skills', {
        recursive: true,
      });
      // Note: copyFileSync may not be called if no files exist in the mock
    });

    test('should install skills locally', async () => {
      mockExistsSync.mockImplementation((path) => {
        // Return false for the target directory to trigger mkdirSync
        if (path === '/current/project/.cursor/skills') return false;
        return path.includes('test-skill-1');
      });

      await installer.installSkills(['test-skill-1'], 'cursor', false);

      // When directory doesn't exist, mkdirSync should be called
      expect(mockMkdirSync).toHaveBeenCalledWith('/current/project/.cursor/skills', {
        recursive: true,
      });
    });

    test('should handle existing destination directory', async () => {
      mockExistsSync.mockImplementation((path) => {
        return path.includes('test-skill-1');
      });

      await installer.installSkills(['test-skill-1'], 'cursor', true);

      expect(mockRmSync).toHaveBeenCalledWith('/home/testuser/.cursor/skills/test-skill-1', {
        recursive: true,
        force: true,
      });
      expect(mockMkdirSync).toHaveBeenCalled();
    });

    test('should skip non-existent skills', async () => {
      mockExistsSync.mockImplementation((path) => {
        return path.includes('zh') || path.includes('en');
      });

      await installer.installSkills(['non-existent-skill'], 'cursor', true);

      expect(mockMkdirSync).toHaveBeenCalledWith('/home/testuser/.cursor/skills', {
        recursive: true,
      });
      expect(mockCopyFileSync).not.toHaveBeenCalled();
    });

    test('should throw error for invalid software target', async () => {
      await expect(
        installer.installSkills(['test-skill-1'], 'invalid-software', true),
      ).rejects.toThrow('Software invalid-software not found in configuration');
    });

    test('should install multiple skills', async () => {
      mockExistsSync.mockImplementation((path) => {
        return path.includes('test-skill-1') || path.includes('test-skill-2');
      });

      await installer.installSkills(['test-skill-1', 'test-skill-2'], 'cursor', true);

      expect(mockMkdirSync).toHaveBeenCalledWith('/home/testuser/.cursor/skills', {
        recursive: true,
      });
    });
  });

  describe('copyDirectory method', () => {
    test('should copy directory recursively', () => {
      mockExistsSync.mockImplementation((path) => {
        return path.includes('/source/path');
      });

      installer.copyDirectory('/source/path', '/dest/path');

      expect(mockMkdirSync).toHaveBeenCalledWith('/dest/path', { recursive: true });
    });

    test('should handle existing destination directory', () => {
      mockExistsSync.mockImplementation((path) => {
        return path.includes('/source/path') || path.includes('/dest/path');
      });

      installer.copyDirectory('/source/path', '/dest/path');

      expect(mockMkdirSync).not.toHaveBeenCalledWith('/dest/path', { recursive: true });
    });

    test('should handle empty directory', () => {
      mockReaddirSync.mockImplementation((dir) => {
        if (dir.includes('skills')) {
          return [{ name: 'empty-skill', isDirectory: () => true }];
        }
        return [];
      });

      mockExistsSync.mockImplementation((path) => {
        return path.includes('empty-skill') && !path.startsWith('/dest/');
      });

      installer.copyDirectory('/source/empty-skill', '/dest/empty-skill');

      expect(mockMkdirSync).toHaveBeenCalledWith('/dest/empty-skill', { recursive: true });
    });
  });

  describe('Integration tests', () => {
    test('should handle complex directory structure', async () => {
      mockExistsSync.mockImplementation((path) => {
        return path.includes('complex-skill');
      });

      // Setup complex directory structure
      mockReaddirSync.mockImplementation((dir) => {
        if (dir.includes('skills')) {
          return [{ name: 'complex-skill', isDirectory: () => true }];
        }
        if (dir.includes('complex-skill')) {
          return [
            { name: 'file1.js', isDirectory: () => false },
            { name: 'file2.json', isDirectory: () => false },
            { name: 'subdir1', isDirectory: () => true },
            { name: 'subdir2', isDirectory: () => true },
          ];
        }
        if (dir.includes('subdir1')) {
          return [
            { name: 'nested1.js', isDirectory: () => false },
            { name: 'deep', isDirectory: () => true },
          ];
        }
        if (dir.includes('deep')) {
          return [{ name: 'deep-file.js', isDirectory: () => false }];
        }
        return [];
      });

      await installer.installSkills(['complex-skill'], 'cursor', true);

      expect(mockMkdirSync).toHaveBeenCalledWith('/home/testuser/.cursor/skills', {
        recursive: true,
      });
    });
  });
});
