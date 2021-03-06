import * as React from "react";
import { connect } from "react-redux";

import { Intent, FontSize } from "@/style";

import { formatPosition, formatSimHash, formatDisease } from "@/format";

import mapStateToProps, { StateProps } from "./derived-state";

import Toolbar from "@/components/Toolbar";
import Text from "@/components/Text";

import GameObjectHeaderContainer from "./components/GameObjectHeaderContainer";

type Props = StateProps;
class GameObjectHeader extends React.Component<Props> {
  render() {
    const { position, primaryElement } = this.props;
    return (
      <GameObjectHeaderContainer>
        <Toolbar>
          <Toolbar.Label>{this.props.children}</Toolbar.Label>

          <Toolbar.Group align="center" alignContent="center">
            <Text
              intent={Intent.Secondary}
              mr={1}
              whiteSpace="nowrap"
              fontSize={FontSize.Default}
            >
              {position ? formatPosition(position) : "(no object selected)"}
            </Text>
          </Toolbar.Group>

          <Toolbar.Group align="right" alignContent="center">
            {primaryElement && (
              <Text
                intent={Intent.Secondary}
                mr={1}
                fontSize={FontSize.Default}
              >
                {formatSimHash(primaryElement)}
              </Text>
            )}
          </Toolbar.Group>
        </Toolbar>
      </GameObjectHeaderContainer>
    );
  }
}
export default connect(mapStateToProps)(GameObjectHeader);
