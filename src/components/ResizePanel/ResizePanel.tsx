import * as React from "react";

import { HeightProps, height } from "styled-system";

import { autobind } from "core-decorators";

import Flex from "@/components/Flex";

import ResizeHandle from "./components/ResizeHandle";
import styled from "@/style";

export interface ResizePanelProps extends HeightProps {
  className?: string;
  defaultWidth?: number;
}
interface State {
  width: number;
}
type Props = ResizePanelProps;
class ResizePanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      width: props.defaultWidth || 300
    };
  }

  render() {
    const { className, children } = this.props;
    const { width } = this.state;
    // TODO: too many wrapping divs.
    //  Provide a way to apply flex to an existing item.
    return (
      <Flex className={className} direction="row">
        <Flex.Item style={{ width }}>{children}</Flex.Item>
        <Flex.Item>
          <ResizeHandle onResize={this._onResize} />
        </Flex.Item>
      </Flex>
    );
  }

  @autobind()
  private _onResize(delta: number) {
    this.setState(s => ({
      width: s.width + delta
    }));
  }
}

export default styled(ResizePanel)`
  ${height};
`;
