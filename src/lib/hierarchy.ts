import type { Edge } from 'reactflow';

export const getAllDescendantIds = (parentId: string, edges: Edge[]): string[] => {
  const directChildren = edges.filter(e => e.source === parentId).map(e => e.target);
  return directChildren.reduce(
    (acc, childId) => [...acc, childId, ...getAllDescendantIds(childId, edges)],
    [] as string[]
  );
};

export const generateNodeId = (name: string): string => {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
};

export const downloadJsonFile = (data: any, filename: string) => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const link = document.createElement('a');
  link.href = jsonString;
  link.download = filename;
  link.click();
};