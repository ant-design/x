const { SkillInstaller } = require('../bin/index.js');

describe('Direct JavaScript Coverage Test', () => {
  let installer;

  beforeEach(() => {
    installer = new SkillInstaller();
  });

  test('should create instance correctly', () => {
    expect(installer).toBeInstanceOf(SkillInstaller);
    expect(installer.skills).toBeDefined();
    expect(installer.language).toBe('zh');
  });

  test('should load config correctly', () => {
    expect(installer.skillConfig).toBeDefined();
    expect(installer.skillConfig.targets).toBeDefined();
  });

  test('should load skills correctly', () => {
    expect(Array.isArray(installer.skills)).toBe(true);
    expect(installer.skills.length).toBeGreaterThan(0);
  });

  test('should have correct messages', () => {
    expect(installer.messages.zh.selectLanguage).toBe('请选择语言 (Select language):');
    expect(installer.messages.en.selectLanguage).toBe('Select language:');
  });

  test('should get correct message', () => {
    installer.language = 'zh';
    expect(installer.getMessage('selectLanguage')).toBe('请选择语言 (Select language):');

    installer.language = 'en';
    expect(installer.getMessage('selectLanguage')).toBe('Select language:');
  });

  test('should handle config loading', () => {
    const config = installer.loadConfig();
    expect(config).toBeDefined();
    expect(typeof config).toBe('object');
  });

  test('should handle skills loading', () => {
    expect(installer.skills.length).toBeGreaterThan(0);
    installer.skills.forEach((skill) => {
      expect(skill).toHaveProperty('name');
      expect(skill).toHaveProperty('path');
      expect(skill).toHaveProperty('description');
    });
  });
});
