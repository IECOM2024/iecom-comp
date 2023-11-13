import { Box, Flex } from "@chakra-ui/react";
import { TimelineCard } from "./TimelineCard";

interface TimelineProps {
  timelineContent: timelineContent[];
}

export type timelineContent = {
    title: string;
    dateStr: string;
    linkTo?: string;
}

export const Timeline = ({ timelineContent }: TimelineProps) => {
  return (
    <Flex
      height="25em"
      width="100%"
      bg="whiteCream"
      borderRadius="10px"
      p={{base: "1em",md:"2em"}}
    >
      <Flex
        height="100%"
        overflowX="scroll"
        width="100%"
        direction="column"
        justifyContent="end"
        padding="3rem 1rem"
        sx={{
          "&::-webkit-scrollbar": {
            height: "10px",
          },
          "&::-webkit-scrollbar-track": {
            height: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#054E83",
            borderRadius: "1rem",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#054E83",
          },
        }}
      >
        <Flex
          position="relative"
          w={`${timelineContent.length * 20}em`}
          alignItems="center"
        >
          {timelineContent.map((e, index) => (
            <TimelineCard
              key={index}
              title={e.title}
              date={e.dateStr}
              linkTo={e.linkTo}
              bottom="-1rem"
              left={`calc(${index * 20}rem )`}
            />
          ))}
        </Flex>
        <Box
          pos="relative"
          w={`${timelineContent.length * 20}em`}
          color="blue"
          h="20px"
          top={{
            base: "calc(-1rem - 10px)",
            md: "calc(-1.75rem - 10px)",
          }}
          bg="blue"
          borderRadius="full"
        />
      </Flex>
    </Flex>
  );
};
