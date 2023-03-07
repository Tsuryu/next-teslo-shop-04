import { UIState } from './interfaces';

export type UIActionType = {
  type: 'UI - ToggleMenu';
};

export const UIReducer = (state: UIState, action: UIActionType): UIState => {
  switch (action.type) {
    case 'UI - ToggleMenu':
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen
      };
    default:
      return state;
  }
};
