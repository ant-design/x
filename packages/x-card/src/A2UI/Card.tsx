import React, { useEffect } from 'react';
import BoxContext from './Context';
import transformToReactTree from './format/components';

export interface CardProps {
  id: string;
}
const Card: React.FC<CardProps> = ({ id }) => {
  const { commands } = React.useContext(BoxContext);

  useEffect(() => {
    if (commands && 'updateComponents' in commands && commands.updateComponents.surfaceId === id) {
      const version = 'version' in commands ? commands.version : 'v0.8';
      console.log(
        transformToReactTree(commands.updateComponents.components, version as 'v0.8' | 'v0.9'),
      );
    }
  }, [commands]);

  return <div>hi</div>;
};
export default Card;
