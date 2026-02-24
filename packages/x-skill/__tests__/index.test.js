const { SkillInstaller } = require('../bin/index.js');

describe('Direct JavaScript Coverage Test', () => {
  let installer;

  beforeEach(() => {
    installer = new SkillInstaller();
  });

  afterEach(() => {
    // 清理 readline 接口
    if (installer.rl) {
      installer.rl.close();
    }
  });

  test('should create instance correctly', () => {
    expect(installer).toBeInstanceOf(SkillInstaller);
    expect(installer.skills).toBeDefined();
    expect(installer.language).toBe('zh');
  });

  test('should load config correctly', () => {
    const config = installer.loadConfig();
    expect(config).toBeDefined();
    expect(config.targets).toBeDefined();
    expect(typeof config).toBe('object');
  });

  test('should load skills correctly', () => {
    expect(Array.isArray(installer.skills)).toBe(true);
    expect(installer.skills.length).toBeGreaterThan(0);
  });

  test('should load skills from correct directory based on language', () => {
    // Test Chinese skills loading
    const zhInstaller = new SkillInstaller();
    zhInstaller.language = 'zh';
    zhInstaller.loadSkills();
    expect(Array.isArray(zhInstaller.skills)).toBe(true);

    // Test English skills loading
    const enInstaller = new SkillInstaller();
    enInstaller.language = 'en';
    enInstaller.loadSkills();
    expect(Array.isArray(enInstaller.skills)).toBe(true);
  });

  test('should have correct messages', () => {
    expect(installer.messages.zh.selectLanguage).toBe('🌍 请选择语言 / Please select language:');
    expect(installer.messages.en.selectLanguage).toBe('🌍 Select language / 请选择语言:');
  });

  test('should get correct message with replacements', () => {
    const message = installer.getMessage('welcome', { name: 'Test' });
    expect(message).toBeDefined();
  });

  test('should get correct message in different languages', () => {
    const zhMessage = installer.getMessage('selectLanguage', {}, 'zh');
    const enMessage = installer.getMessage('selectLanguage', {}, 'en');

    expect(zhMessage).toBe('🌍 请选择语言 / Please select language:');
    expect(enMessage).toBe('🌍 Select language / 请选择语言:');
  });

  test('should handle missing message key', () => {
    const message = installer.getMessage('nonexistentKey');
    expect(message).toBe('nonexistentKey');
  });

  test('should handle skills loading with proper structure', () => {
    expect(installer.skills.length).toBeGreaterThan(0);
    installer.skills.forEach((skill) => {
      expect(skill).toHaveProperty('name');
      expect(skill).toHaveProperty('path');
      expect(skill).toHaveProperty('description');
      expect(typeof skill.name).toBe('string');
      expect(typeof skill.path).toBe('string');
      expect(typeof skill.description).toBe('string');
    });
  });

  test('should test colorize method with invalid color', () => {
    const result = installer.colorize('test text', 'invalidcolor');
    expect(result).toBe('test text');
  });

  test('should test colorize method with valid colors', () => {
    const colors = [
      'red',
      'green',
      'yellow',
      'blue',
      'magenta',
      'cyan',
      'white',
      'bright',
      'dim',
      'reset',
    ];

    colors.forEach((color) => {
      const result = installer.colorize('test', color);
      expect(result).toContain('test');
    });
  });

  test('should test printHeader method', () => {
    const mockLog = jest.spyOn(console, 'log').mockImplementation(() => {});

    installer.printHeader();

    expect(mockLog).toHaveBeenCalled();
    expect(mockLog.mock.calls[0][0]).toContain('X-Skill');

    mockLog.mockRestore();
  });

  test('should test spinner methods', () => {
    const mockStdout = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});

    installer.startSpinner('Loading...');
    expect(installer.spinnerInterval).toBeDefined();

    installer.stopSpinner();
    expect(installer.spinnerInterval).toBeNull();

    mockStdout.mockRestore();
  });

  test('should test printProgressBar edge cases', () => {
    const mockStdout = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});

    installer.printProgressBar(0, 0, 'Empty');
    installer.printProgressBar(5, 10, 'Half');
    installer.printProgressBar(10, 10, 'Complete');

    expect(mockStdout).toHaveBeenCalledTimes(3);

    mockStdout.mockRestore();
  });

  test('should test locale message loading fallback', () => {
    // Test that messages are loaded correctly
    expect(installer.messages.zh).toBeDefined();
    expect(installer.messages.en).toBeDefined();
    expect(installer.getMessage('welcome')).toBeDefined();
  });

  test('should test skill path construction', () => {
    installer.skills.forEach((skill) => {
      expect(skill.path).toContain('skills');
      expect(skill.path).toContain(skill.name);
    });
  });
});
