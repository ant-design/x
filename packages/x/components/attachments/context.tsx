import React from 'react';

export interface AttachmentContextProps {
  disabled?: boolean;
}

export const AttachmentContext = React.createContext<AttachmentContextProps>(null!);
