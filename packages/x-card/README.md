# @ant-design/x-card

React card loader for dynamic content loading and management.

## Features

- 🚀 **Dynamic Loading**: Load cards asynchronously with configurable concurrency
- 🔄 **Retry Mechanism**: Automatic retry with exponential backoff
- ⚡ **Performance**: Optimized for large datasets with virtual scrolling support
- 🎨 **Customizable**: Fully customizable card rendering and loading states
- 📱 **Responsive**: Mobile-friendly responsive design
- 🔧 **TypeScript**: Full TypeScript support

## Installation

```bash
npm install @ant-design/x-card
# or
yarn add @ant-design/x-card
# or
pnpm add @ant-design/x-card
```

## Usage

### Basic Usage

```tsx
import React from 'react';
import { CardLoader } from '@ant-design/x-card';

const App = () => {
  const cards = [
    {
      id: '1',
      title: 'Card 1',
      content: 'This is card content',
    },
    {
      id: '2',
      title: 'Card 2',
      content: 'Another card content',
    },
  ];

  return <CardLoader cards={cards} />;
};
```

### Advanced Usage

```tsx
import React from 'react';
import { CardLoader, useCardLoader } from '@ant-design/x-card';

const App = () => {
  const { state, actions } = useCardLoader({
    config: {
      maxConcurrent: 5,
      retryCount: 3,
      timeout: 10000,
    },
    customLoader: async (card) => {
      // Custom loading logic
      const response = await fetch(`/api/cards/${card.id}`);
      const data = await response.json();
      return data.content;
    },
  });

  React.useEffect(() => {
    actions.loadCards([
      { id: '1', title: 'Dynamic Card 1' },
      { id: '2', title: 'Dynamic Card 2' },
    ]);
  }, []);

  return (
    <CardLoader
      cards={state.cards}
      renderLoading={(card) => <div>Loading {card.title}...</div>}
      renderError={(error, card) => <div>Error: {error.message}</div>}
    />
  );
};
```

### Using Hooks

```tsx
import React from 'react';
import { useCardLoader } from '@ant-design/x-card';

const App = () => {
  const { state, actions } = useCardLoader();

  const addNewCard = () => {
    actions.addCard({
      id: Date.now().toString(),
      title: 'New Card',
      content: 'Dynamic content',
    });
  };

  return (
    <div>
      <button onClick={addNewCard}>Add Card</button>
      {state.cards.map((card) => (
        <div key={card.id}>
          <h3>{card.title}</h3>
          <p>{card.content}</p>
        </div>
      ))}
    </div>
  );
};
```

## API

### CardLoader Props

| Property         | Type               | Default | Description                   |
| ---------------- | ------------------ | ------- | ----------------------------- |
| cards            | CardLoaderConfig[] | []      | Array of card configurations  |
| config           | CardLoaderConfig   | -       | Loader configuration          |
| customLoader     | function           | -       | Custom card loading function  |
| renderEmpty      | function           | -       | Custom empty state renderer   |
| renderLoading    | function           | -       | Custom loading state renderer |
| renderError      | function           | -       | Custom error state renderer   |
| onLoadingChange  | function           | -       | Loading state change callback |
| onCardLoad       | function           | -       | Card load success callback    |
| onCardError      | function           | -       | Card load error callback      |
| onAllCardsLoaded | function           | -       | All cards loaded callback     |

### CardLoaderConfig

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| id | string | - | Unique card identifier |
| title | string | - | Card title |
| content | ReactNode | - | Card content |
| type | 'default' \| 'info' \| 'success' \| 'warning' \| 'error' | 'default' | Card type |
| loading | boolean | false | Loading state |
| closable | boolean | false | Whether card can be closed |
| size | 'small' \| 'middle' \| 'large' | 'middle' | Card size |
| disabled | boolean | false | Whether card is disabled |
| className | string | - | Custom CSS class |
| style | CSSProperties | - | Custom inline style |
| extra | ReactNode | - | Extra content in card header |

### useCardLoader Hook

Returns an object with:

- `state`: Current loader state
- `actions`: Available actions
  - `addCard(card)`: Add a new card
  - `removeCard(id)`: Remove a card
  - `updateCard(id, updates)`: Update a card
  - `reloadCard(id)`: Reload a card
  - `clearCards()`: Clear all cards
  - `getCardState(id)`: Get card state
  - `loadCards(cards)`: Load multiple cards

## Development

```bash
# Install dependencies
npm install

# Start development
npm run start

# Run tests
npm test

# Build
npm run compile
```

## License

MIT
