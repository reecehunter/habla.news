import { useMemo } from "react";
import {
  useDisclosure,
  Flex,
  Stack,
  Box,
  Heading,
  Text,
  Image,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import User from "./nostr/User";

import { ZAP, HIGHLIGHT, REACTION } from "@habla/const";
import { getMetadata } from "@habla/nip23";
import Blockquote from "@habla/components/Blockquote";
import Markdown from "@habla/markdown/Markdown";
import Hashtags from "@habla/components/Hashtags";
import { formatDay } from "@habla/format";
import HighlightList from "@habla/components/nostr/Highlights";
import Zaps from "./Zaps";
import Highlights from "@habla/components/reactions/Highlights";
import Comments from "./Comments";

export default function LongFormNote({
  event,
  isDraft,
  zaps = [],
  notes = [],
  highlights = [],
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { title, summary, image, hashtags, publishedAt } = useMemo(
    () => getMetadata(event),
    [event]
  );

  function onHighlightClick(content: string) {
    onOpen();
  }

  const reactions = isDraft ? null : (
    <Flex alignItems="center" gap={6}>
      <Zaps event={event} zaps={zaps} />
      <Highlights event={event} highlights={highlights} />
      <Comments event={event} comments={notes} />
    </Flex>
  );
  return (
    <>
      <Box sx={{ wordBreak: "break-word" }}>
        <Stack gap={2} mb={6}>
          {image?.length > 0 && (
            <Image src={image} alt={title} width="100%" maxHeight="520px" />
          )}
          <Heading as="h1">{title}</Heading>
          {summary?.length > 0 && (
            <Blockquote fontSize="lg">{summary}</Blockquote>
          )}
          <Hashtags hashtags={hashtags} />
          {reactions}
          <Flex align="center" gap={3} fontFamily="Inter">
            {event.pubkey && <User pubkey={event.pubkey} />}
            <Text color="secondary" fontSize="sm">
              {formatDay(publishedAt)}
            </Text>
          </Flex>
        </Stack>
        <Prose>
          <Markdown
            content={event.content}
            tags={event.tags}
            highlights={highlights}
            onHighlightClick={onHighlightClick}
          />
        </Prose>
      </Box>

      <Box mt={4}>{reactions}</Box>
      <Box mt="120px">
        <Text color="secondary" textAlign="center">
          𐡷
        </Text>
      </Box>
      <Drawer
        size="md"
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        //        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading>Highlights</Heading>
          </DrawerHeader>
          <DrawerBody>
            <Stack>
              <HighlightList highlights={highlights} />
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
