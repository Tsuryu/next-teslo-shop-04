import { FC, PropsWithChildren, Reducer, useReducer } from 'react';

import { UIContext } from './UIContext';
import { UIActionType, UIReducer } from './UIReducer';
import { UIState } from './interfaces';

const UI_INITIAL_STATE: UIState = {
  isMenuOpen: false
};

export const UIProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<UIState, UIActionType>>(UIReducer, UI_INITIAL_STATE);

  const toggleSideMenu = () => {
    dispatch({ type: 'UI - ToggleMenu' });
  };

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return <UIContext.Provider value={{ ...state, toggleSideMenu }}>{children}</UIContext.Provider>;
};
