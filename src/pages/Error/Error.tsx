import * as React from "react";
import { Trans, translate } from "react-i18next";

import Flex from "@/components/Flex";
import Button from "@/components/Button";
import Text from "@/components/Text";
import { Intent } from "@/style";

export interface ErrorProps {
  error: Error;
  onDismiss(): void;
}

const ErrorPage: React.SFC<ErrorProps> = ({ error, onDismiss }) => (
  <Flex direction="column" width="100%" height="100%">
    <Flex.Item grow>
      <Text intent={Intent.Dangerous}>
        <h2>Error</h2>
        <code>{error.stack || error.message || String(error)}</code>
      </Text>
    </Flex.Item>
    <Flex.Item>
      <Button intent={Intent.Primary} onClick={onDismiss}>
        <Trans i18nKey="close-dialog">Close</Trans>
      </Button>
    </Flex.Item>
  </Flex>
);
ErrorPage.displayName = "Error";
export default translate()(ErrorPage);
