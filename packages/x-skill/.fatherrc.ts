import { defineConfig } from 'father';

export default defineConfig({
  plugins: ['@rc-component/father-plugin'],
  cjs: {
    input: 'src',
    output: 'bin',
  },
});
