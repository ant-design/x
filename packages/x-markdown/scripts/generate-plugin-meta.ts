import fs from 'fs-extra';
import type { DeclarationReflection } from 'typedoc';
import { Application, TSConfigReader, TypeDocReader } from 'typedoc';

function getPluginMeta(list?: DeclarationReflection[]) {
  return (list || []).map((item) => {
    return {
      plugin: item.name,
      desc:
        item.comment?.blockTags
          ?.find((tag) => tag.tag === '@desc')
          ?.content.reduce((result, str) => result.concat(str.text), '') || '',
      descEn:
        item.comment?.blockTags
          ?.find((tag) => tag.tag === '@descEN')
          ?.content.reduce((result, str) => result.concat(str.text), '') || '',
    };
  });
}
const main = async () => {
  const app = await (Application as any).bootstrap(
    {
      // typedoc options here
      entryPoints: ['src/plugins/type.ts'],
      skipErrorChecking: true,
      logLevel: 'Error',
    },
    [new TSConfigReader(), new TypeDocReader()],
  );

  const project = await app.convert();

  let pluginMeta: Record<string, any> = {};
  if (project) {
    // Project may not have converted correctly
    const output = 'src/version/plugin-meta.json';

    // eslint-disable-next-line no-restricted-syntax
    project?.children?.forEach((file: any) => {
      pluginMeta = getPluginMeta(file.children);
    });

    fs.writeJsonSync(output, pluginMeta, 'utf8');
    // eslint-disable-next-line no-console
    console.log(`✅  Plugin Meta has been written to ${output}`);
  }
};

main();
