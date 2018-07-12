import * as React from "react";

import SelectInput, { SelectInputProps } from "@/components/SelectInput";

import connectEditorField, {
  EditorFieldProps,
  InjectedProps
} from "./connect-field";

export type SelectFieldProps = EditorFieldProps &
  Omit<SelectInputProps, "value" | "onCommit">;

type Props = SelectFieldProps & InjectedProps;
class SelectField extends React.Component<Props> {
  render() {
    const { value, onCommit, options } = this.props;
    return <SelectInput value={value} options={options} onCommit={onCommit} />;
  }
}

export default connectEditorField()(SelectField);