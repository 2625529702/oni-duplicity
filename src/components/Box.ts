import {
  AlignSelfProps,
  JustifySelfProps,
  WidthProps,
  HeightProps,
  SpaceProps,
  alignSelf,
  justifySelf,
  width,
  height,
  space
} from "styled-system";

import styled, {
  BorderProps,
  IntentBorderProps,
  intentBorder,
  IntentProps,
  border,
  intent
} from "@/style";

export type BoxProps = AlignSelfProps &
  JustifySelfProps &
  WidthProps &
  HeightProps &
  SpaceProps &
  BorderProps &
  IntentBorderProps &
  IntentProps;

const Box = styled<BoxProps, "div">("div")`
  ${alignSelf};
  ${justifySelf};
  ${width};
  ${height};
  ${space};
  ${border};
  /* ${intentBorder}; */
  ${intent};
  box-sizing: border-box;
`;
Box.displayName = "Box";
Box.defaultProps = {
  intentIsBg: false
};
export default Box;
