import { Assistant } from '@petercatai/assistant';
import React from 'react';

const PeterCat: React.FC = () => {
  return (
    <Assistant
      showBubble={true}
      isVisible={false}
      bottom={48}
      token="e3092c32-9ed9-44c2-ad0c-7251e382c2df"
      apiDomain="https://api.petercat.ai"
    />
  );
};

export default PeterCat;
