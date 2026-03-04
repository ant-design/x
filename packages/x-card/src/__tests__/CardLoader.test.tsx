import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CardLoader } from '../components/CardLoader';
import { useCardLoader } from '../hooks/useCardLoader';

describe('CardLoader', () => {
  it('renders empty state when no cards provided', () => {
    render(<CardLoader cards={[]} />);
    expect(screen.getByText('No cards to display')).toBeInTheDocument();
  });

  it('renders cards correctly', () => {
    const cards = [{ id: '1', title: 'Test Card', content: 'Test Content' }];

    render(<CardLoader cards={cards} />);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('handles card removal', async () => {
    const cards = [{ id: '1', title: 'Test Card', content: 'Test Content', closable: true }];

    const { container } = render(<CardLoader cards={cards} />);
    const closeButton = container.querySelector('.anticon-close');

    if (closeButton) {
      fireEvent.click(closeButton);
      await waitFor(() => {
        expect(screen.queryByText('Test Card')).not.toBeInTheDocument();
      });
    }
  });
});

describe('useCardLoader', () => {
  it('adds cards correctly', () => {
    const TestComponent = () => {
      const { state, actions } = useCardLoader();

      React.useEffect(() => {
        actions.addCard({ id: '1', title: 'Test Card' });
      }, [actions]);

      return <div>{state.cards.length}</div>;
    };

    const { container } = render(<TestComponent />);
    expect(container.textContent).toBe('1');
  });

  it('removes cards correctly', () => {
    const TestComponent = () => {
      const { state, actions } = useCardLoader({
        initialCards: [{ id: '1', title: 'Test Card' }],
      });

      React.useEffect(() => {
        actions.removeCard('1');
      }, [actions]);

      return <div>{state.cards.length}</div>;
    };

    const { container } = render(<TestComponent />);
    expect(container.textContent).toBe('0');
  });
});
