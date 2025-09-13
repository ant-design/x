export interface TBoxMessage {
  content: string;
  role: string;
}

export interface TBoxInput {
  message: TBoxMessage;
}

export interface AgentProps {
  setIsOnAgent: (val: boolean) => void;
  isOnAgent: boolean;
}
export interface TBoxOutput {
  text?: string;
}
