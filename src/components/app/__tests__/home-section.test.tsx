import React from 'react';
import { render, screen } from '@testing-library/react';
import HomeSections from '@/components/app/home-sections';
import type { Section } from '@/types';

// Mock SortableSection component
jest.mock('../sortable-section', () => {
    return {
        __esModule: true,
        SortableSection: ({ name }: { id: string, name: string }) => (
            <div data-testid="sortable-section">{name}</div>
        ),
    };
});

describe('HomeSections', () => {
    const mockSetSections = jest.fn();
    const sections: Section[] = [
        { id: 'hero', name: 'Hero' },
        { id: 'features', name: 'Features' },
        { id: 'cta', name: 'Call to Action' },
    ];

    it('renders all provided sections', () => {
        render(<HomeSections sections={sections} setSections={mockSetSections} />);
        
        const renderedSections = screen.getAllByTestId('sortable-section');
        expect(renderedSections).toHaveLength(3);
        
        expect(screen.getByText('Hero')).toBeInTheDocument();
        expect(screen.getByText('Features')).toBeInTheDocument();
        expect(screen.getByText('Call to Action')).toBeInTheDocument();
    });

    it('renders nothing when no sections are provided', () => {
        render(<HomeSections sections={[]} setSections={mockSetSections} />);
        
        const renderedSections = screen.queryAllByTestId('sortable-section');
        expect(renderedSections).toHaveLength(0);
    });
});
