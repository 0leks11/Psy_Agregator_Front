import { createContext } from "react";
import { UIContextType } from "./UIContext";

export const UIContext = createContext<UIContextType | undefined>(undefined);
