import React from 'react';
import BoxContext from './Context';

interface CardProps {
  id: string;
}
const Card: React.FC<CardProps> = () => {
  const boxContext = React.useContext(BoxContext);
  console.log(boxContext);

  return <div>hi</div>;
};
export default Card;
