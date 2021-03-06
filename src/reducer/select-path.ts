import { AppState, defaultAppState } from "@/state";

import { ACTION_SELECT_PATH, SelectPathAction } from "@/actions/select-path";

export default function selectPathReducer(
  state: AppState = defaultAppState,
  action: SelectPathAction
): AppState {
  if (action.type !== ACTION_SELECT_PATH) {
    return state;
  }

  return {
    ...state,
    selectedPath: action.payload
  };
}
