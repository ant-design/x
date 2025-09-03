import { MappingAlgorithm, OverrideToken } from './theme/interface';

type PluginsConfig = {
  [key in keyof OverrideToken]?: OverrideToken[key] & {
    algorithm?: boolean | MappingAlgorithm | MappingAlgorithm[];
  };
};

export default PluginsConfig;
