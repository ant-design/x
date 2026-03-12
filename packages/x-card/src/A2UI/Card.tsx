import React from 'react';
import BoxContext from './Context';

export interface CardProps {
  id: string;
}
const Card: React.FC<CardProps> = ({ id }) => {
  const boxContext = React.useContext(BoxContext);
  console.log(boxContext, id, 1111);
  return <div>hi</div>;
};
export default Card;
