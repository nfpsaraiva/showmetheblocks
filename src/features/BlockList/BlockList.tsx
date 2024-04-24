import { FC } from "react";
import { Anchor, Center, Loader, ScrollArea, Stack, Text, Timeline } from "@mantine/core";
import Block from "../Block/Block";
import useStore from "../../state/store";
import { useShallow } from "zustand/react/shallow";
import { useBlocksQuery, useLastBlockNumber } from "../../api/BlockApi";
import { IconCube, IconDots } from "@tabler/icons-react";
import { useHover } from "@mantine/hooks";

const BlockList: FC = () => {

  const [searchTerm] = useStore(useShallow(state => [state.searchTerm]));

  const { data: lastBlockNumber } = useLastBlockNumber();

  const {
    data: blocks,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    isFetching
  } = useBlocksQuery(lastBlockNumber || 0, Number(searchTerm));

  const bulletSize = 45;
  const iconSize = 30;

  return (
    <ScrollArea h={"60vh"} mx={"auto"}>
      {
        isLoading && <Center><Loader /></Center>
      }
      {
        isError && <Center><Text>Nothing found</Text></Center>
      }
      {
        blocks &&
        <Stack gap={"xl"}>
          <Timeline style={{textAlign: "center"}} miw={300} bulletSize={bulletSize} active={isFetching ? 0 : -1} lineWidth={2}>
            {
              isFetching &&
              <Timeline.Item key={0} bullet={<IconCube size={iconSize} />} title="Fetching">
                <Text c={"dimmed"} size="xs">Right now</Text>
              </Timeline.Item>
            }
            {
              blocks.pages.map(page => {
                return page.map(block => {
                  return (
                    <Timeline.Item key={block.number} bullet={<IconCube size={iconSize} />}>
                      <Block block={block} />
                    </Timeline.Item>
                  )
                })
              })
            }
            {
              isFetchingNextPage
                ? <Timeline.Item bullet={<IconDots size={iconSize} />} title="Fetching" styles={{ item: { cursor: "pointer" } }}>
                  <Anchor size="xs" c={"dimmed"}>
                    Scroll to top
                  </Anchor>
                </Timeline.Item>
                : <Timeline.Item onClick={() => fetchNextPage()} bullet={<IconDots size={iconSize} />} title="Load more" styles={{ item: { cursor: "pointer" } }}>
                  <Anchor size="xs" c={"dimmed"}>
                    Scroll to top
                  </Anchor>
                </Timeline.Item>
            }
          </Timeline>
        </Stack>
      }
    </ScrollArea>
  )
}

export default BlockList;