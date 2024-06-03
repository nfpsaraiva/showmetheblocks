import { FC } from "react";
import { Center, Loader, ScrollArea, Text, Timeline } from "@mantine/core";
import Block from "../Block/Block";
import useStore from "../../state/store";
import { useShallow } from "zustand/react/shallow";
import { useBlocksQuery, useLastBlockNumber } from "../../api/BlockApi";
import { IconCube, IconDots } from "@tabler/icons-react";
import { timeAgo } from "../../utils/dateUtils";

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

  const bulletSize = 36;
  const iconSize = 25;

  const numBlocks = blocks?.pages.reduce((acc, page) => acc += page.length, 0);

  return (
    <ScrollArea offsetScrollbars>
      {
        isLoading && <Center><Loader /></Center>
      }
      {
        isError && <Center><Text>Nothing found</Text></Center>
      }
      {
        blocks &&
        <Timeline style={{ textAlign: "center" }} bulletSize={bulletSize} active={isFetching ? 0 : -1} lineWidth={2}>
          {
            isFetching &&
            <Timeline.Item key={0} bullet={<IconCube size={iconSize} />} title="Fetching">
              <Text c={"dimmed"} size="xs">Right now</Text>
            </Timeline.Item>
          }
          {
            blocks.pages.map(page => {
              return page.map(block => {
                const blockTimeAgo = timeAgo(block.timestamp * 1000);

                return (
                  <Timeline.Item key={block.number} bullet={<IconCube size={iconSize} />}>
                    <Block block={block} blockTimeAgo={blockTimeAgo} />
                  </Timeline.Item>
                )
              })
            })
          }
          {
            isFetchingNextPage
              ? <Timeline.Item bullet={<IconDots size={iconSize} />} title="Fetching" styles={{ item: { cursor: "pointer" } }}>
                <Text size="xs" c={"dimmed"}>
                  Getting new blocks
                </Text>
              </Timeline.Item>
              : <Timeline.Item onClick={() => fetchNextPage()} bullet={<IconDots size={iconSize} />} title="Load more" styles={{ item: { cursor: "pointer" } }}>
                <Text size="xs" c={"dimmed"}>
                  {numBlocks} blocks fetched
                </Text>
              </Timeline.Item>
          }
        </Timeline>
      }
    </ScrollArea>
  )
}

export default BlockList;