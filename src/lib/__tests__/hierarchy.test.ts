import { getAllDescendantIds, generateNodeId, downloadJsonFile } from '../hierarchy';
import type { Edge } from 'reactflow';

describe('getAllDescendantIds', () => {
  const edges: Edge[] = [
    { id: 'e1', source: 'a', target: 'b' },
    { id: 'e2', source: 'a', target: 'c' },
    { id: 'e3', source: 'b', target: 'd' },
    { id: 'e4', source: 'c', target: 'e' },
    { id: 'e5', source: 'e', target: 'f' },
  ];

  it('returns all descendants for a node with children', () => {
    expect(getAllDescendantIds('a', edges).sort()).toEqual(['b', 'c', 'd', 'e', 'f'].sort());
  });

  it('returns all descendants for a node with nested children', () => {
    expect(getAllDescendantIds('c', edges).sort()).toEqual(['e', 'f'].sort());
  });

  it('returns an empty array for a leaf node', () => {
    expect(getAllDescendantIds('f', edges)).toEqual([]);
  });

  it('returns an empty array for a node with no outgoing edges', () => {
    expect(getAllDescendantIds('z', edges)).toEqual([]);
  });
});

describe('generateNodeId', () => {
  it('generates a kebab-case id from a name', () => {
    expect(generateNodeId('My Node Name')).toBe('my-node-name');
  });

  it('trims whitespace and lowercases', () => {
    expect(generateNodeId('  Hello World  ')).toBe('hello-world');
  });

  it('handles single word', () => {
    expect(generateNodeId('Test')).toBe('test');
  });

  it('handles multiple spaces', () => {
    expect(generateNodeId('A   B   C')).toBe('a-b-c');
  });
});

describe('downloadJsonFile', () => {
  beforeEach(() => {
    // @ts-ignore
    global.URL.createObjectURL = jest.fn();
    document.createElement = jest.fn(() => {
      return {
        set href(val: string) {},
        set download(val: string) {},
        click: jest.fn(),
      } as any;
    });
  });

  it('creates a link and triggers click', () => {
    const clickMock = jest.fn();
    (document.createElement as jest.Mock).mockReturnValue({
      set href(val: string) {},
      set download(val: string) {},
      click: clickMock,
    });

    downloadJsonFile({ foo: 'bar' }, 'test.json');
    expect(clickMock).toHaveBeenCalled();
  });
});