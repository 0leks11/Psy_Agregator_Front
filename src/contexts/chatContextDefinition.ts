import { createContext } from "react";
import { ChatContextType } from "../hooks/useChat";

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);
