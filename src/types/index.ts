import { Node, Edge } from 'reactflow';

export interface Section {
  id: string;
  name: string;
}

export interface PageNodeData {
  label: string;
  icon?: string;
  sections: Section[];
  setSections: (sections: Section[]) => void;
  onAddPage?: (name: string) => void;
  onDeletePage?: () => void;
  onDeleteSection?: (sectionId: string) => void;
}

export interface EnrichedNode extends Node {
  data: PageNodeData;
}

export interface HierarchyData {
  nodes: Node[];
  edges: Edge[];
  sectionsMap?: { [id: string]: Section[] };
}
