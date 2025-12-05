/**
 * 流式 Markdown 渲染性能测试配置
 * 所有可配置参数集中管理
 */

export const TEXT_CATEGORIES = {
  short: { min: 0, max: 280, name: '短文本' },
  medium: { min: 280, max: 2000, name: '中文本' },
  long: { min: 2000, max: 20000, name: '长文本' },
} as const;

export const BENCHMARK_CONFIG = {
  // 分块渲染配置
  CHUNK_SIZE: 6, // 每次渲染的字符数
  UPDATE_INTERVAL: 50, // 每块之间的间隔时间(ms)
  RUN_COUNT: 5, // 每个测试用例的运行次数

  // 测试文本长度配置
  TEST_TEXT_LENGTHS: {
    short: 250, // 短文本字符数
    medium: 1500, // 中文本字符数
    long: 8000, // 长文本字符数
  },

  // 超时配置
  TIMEOUT: 600_000, // 单个测试用例超时时间(ms)

  // 调试配置
  DEBUG: {
    ENABLE_TRACING: true, // 是否启用性能追踪
    ENABLE_SCREENSHOTS: false, // 是否启用截图
    ENABLE_SNAPSHOTS: false, // 是否启用快照
  },
} as const;

// 支持的渲染器列表
export const RENDERERS = ['react-markdown', 'x-markdown', 'streamdown'] as const;

// 测试文件路径
export const TEST_FILE_PATH = 'test.md';
