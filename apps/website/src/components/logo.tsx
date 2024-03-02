import { Avatar, Flex, Text } from '@radix-ui/themes';
import { FC } from 'react';

export const Logo: FC = () => {
  return (
    <Flex direction="row" gap="2" align="center" justify="center">
      <Avatar src="/images/Vespera.png" fallback="V" />
      <Text>Vespera</Text>
    </Flex>
  );
};
