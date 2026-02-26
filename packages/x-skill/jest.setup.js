// 全局测试清理
afterAll(() => {
  // 清理所有可能保持打开状态的资源
  // Jest 会自动处理进程退出
});

// 处理未处理的 Promise 拒绝
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
