import { Box, Card, Container, Flex, Grid, Heading, Section, Text } from '@radix-ui/themes';
import { DocsLayout } from 'fumadocs-ui/layout';
import { LayoutTemplate } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/logo';
import { create } from '@/components/ui/icon';
import { useVersions } from '@/lib/hooks/versions';

import { docs } from '../../lib/source';

export default function DocsHome() {
  const versions = useVersions();

  return (
    <main>
      <DocsLayout
        tree={docs.pageTree}
        nav={{
          githubUrl: 'https://github.com/vesperadev/vespera',
          title: <Logo />,
          transparentMode: 'always',
        }}
        sidebar={{
          defaultOpenLevel: 0,
          enabled: false,
        }}
        links={[
          {
            text: 'Templates',
            url: '/templates',
            icon: create({ icon: LayoutTemplate }),
          },
        ]}
      >
        <Section className="w-full space-y-20">
          <Flex align="center" justify="center" gap="1" direction="column">
            <Heading mt="9" size="7" weight="bold" align="center">
              Vespera Versions Documentation
            </Heading>

            <Text align="center">Documentation for Vespera</Text>
          </Flex>
          <Container>
            <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="2">
              {versions.map((version) => (
                <Link key={version} href={`/docs/${version}/readme`}>
                  <Card style={{ minWidth: '200px' }}>
                    <Flex gap="3" align="center">
                      <Box>
                        <Text as="div" size="2" weight="bold">
                          {version}
                        </Text>
                        <Text as="div" size="2" color="gray">
                          Documentation for Vespera {version}
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                </Link>
              ))}
            </Grid>
          </Container>
        </Section>
      </DocsLayout>
    </main>
  );
}
