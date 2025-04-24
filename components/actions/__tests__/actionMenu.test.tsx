import { findItem } from '../ActionMenu';
import { ItemType } from '../interface';

describe('findItem function', () => {
  const items: ItemType[] = [
    { key: '1', label: 'Action 1' },
    {
      key: '2',
      label: 'Action 2',
      children: [
        { key: '2-1', label: 'Sub Action 1' },
        { key: '2-2', label: 'Sub Action 2' },
      ],
    },
    { key: '3', label: 'Action 3' },
  ];

  it('should return the item if it exists at the root level', () => {
    const result = findItem(['1'], items);
    expect(result).toEqual(items[0]);
  });

  it('should return the item if it exists at a deeper level', () => {
    const result = findItem(['2', '2-1'], items);
    expect(result).toEqual(items[1].children![0]);
  });

  it('should return null if the item does not exist', () => {
    const result = findItem(['4'], items);
    expect(result).toBeNull();
  });

  it('should return null when searching a non-existent sub-item', () => {
    const result = findItem(['2', '2-3'], items);
    expect(result).toBeNull();
  });

  it('should handle an empty keyPath gracefully', () => {
    const result = findItem([], items);
    expect(result).toBeNull();
  });
});
