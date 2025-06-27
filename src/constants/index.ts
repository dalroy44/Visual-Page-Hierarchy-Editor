import type { Node, Edge } from 'reactflow';
import type { Section } from '@/types';

export const STORAGE_KEY = 'visual-hierarchy-data';

export const initialHomeSectionsData: Section[] = [
  { id: 'hero', name: 'Hero' },
  { id: 'features', name: 'Features' },
  { id: 'testimonials', name: 'Testimonials' },
  { id: 'cta', name: 'Call to Action' },
  { id: 'footer', name: 'Footer' },
];

export const initialNodesData: Node[] = [
  { id: 'home', type: 'pageNode', position: { x: 0, y: 0 }, data: { label: 'Home', icon: 'Home' } },
  { id: 'about', type: 'pageNode', position: { x: 0, y: 0 }, data: { label: 'About', icon: 'Users' } },
  { id: 'services', type: 'pageNode', position: { x: 0, y: 0 }, data: { label: 'Services', icon: 'Cog' } },
  { id: 'blog', type: 'pageNode', position: { x: 0, y: 0 }, data: { label: 'Blog', icon: 'Newspaper' } },
  { id: 'contact', type: 'pageNode', position: { x: 0, y: 0 }, data: { label: 'Contact', icon: 'Mail' } },
  { id: 'service-detail-1', type: 'pageNode', position: { x: 0, y: 0 }, data: { label: 'Service Detail 1', icon: 'Info' } },
  { id: 'service-detail-2', type: 'pageNode', position: { x: 0, y: 0 }, data: { label: 'Service Detail 2', icon: 'Info' } },
  { id: 'blog-post-1', type: 'pageNode', position: { x: 0, y: 0 }, data: { label: 'Blog Post 1', icon: 'Default' } },
  { id: 'blog-post-2', type: 'pageNode', position: { x: 0, y: 0 }, data: { label: 'Blog Post 2', icon: 'Default' } },
  { id: 'author-page', type: 'pageNode', position: { x: 0, y: 0 }, data: { label: 'Author Page', icon: 'Default' } },
  { id: 'location-info', type: 'pageNode', position: { x: 0, y: 0 }, data: { label: 'Location Info', icon: 'Default' } },
  { id: 'support-page', type: 'pageNode', position: { x: 0, y: 0 }, data: { label: 'Support Page', icon: 'Default' } },
];

export const initialEdgesData: Edge[] = [
  { id: 'e-home-about', source: 'home', target: 'about', animated: true, style: { strokeWidth: 2 } },
  { id: 'e-home-services', source: 'home', target: 'services', animated: true, style: { strokeWidth: 2 } },
  { id: 'e-home-blog', source: 'home', target: 'blog', animated: true, style: { strokeWidth: 2 } },
  { id: 'e-home-contact', source: 'home', target: 'contact', animated: true, style: { strokeWidth: 2 } },
  { id: 'e-services-detail-1', source: 'services', target: 'service-detail-1', animated: true, style: { strokeWidth: 2 } },
  { id: 'e-services-detail-2', source: 'services', target: 'service-detail-2', animated: true, style: { strokeWidth: 2 } },
  { id: 'e-blog-post-1', source: 'blog', target: 'blog-post-1', animated: true, style: { strokeWidth: 2 } },
  { id: 'e-blog-post-2', source: 'blog', target: 'blog-post-2', animated: true, style: { strokeWidth: 2 } },
  { id: 'e-blog-author-page', source: 'blog', target: 'author-page', animated: true, style: { strokeWidth: 2 } },
  { id: 'e-contact-location-info', source: 'contact', target: 'location-info', animated: true, style: { strokeWidth: 2 } },
  { id: 'e-contact-support-page', source: 'contact', target: 'support-page', animated: true, style: { strokeWidth: 2 } },
];
