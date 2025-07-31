import FileCard from './FileCard';
import List from './List';

type FileCardType = typeof FileCard & {
  List: typeof List;
};

(FileCard as FileCardType).List = List;

export type { FileCardProps } from './FileCard';

export default FileCard as FileCardType;
