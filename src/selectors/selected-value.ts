import { createSelector } from "reselect";

import { getSaveItemEditValue } from "@/services/save-structure";

import selectedPath from "./selected-path";
import oniSave from "./oni-save";

const selectedValueSelector = createSelector(
  oniSave,
  selectedPath,
  (saveGame, selectedPath) => {
    if (!saveGame) {
      return null;
    }

    if (selectedPath.length === 0) {
      return saveGame;
    }

    return getSaveItemEditValue(selectedPath, saveGame);
  }
);
export default selectedValueSelector;
