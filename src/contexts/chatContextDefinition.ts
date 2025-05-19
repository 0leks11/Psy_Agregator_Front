import { createContext } from "react";
import { ChatContextType } from "../hooks/chatHooks";

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);
