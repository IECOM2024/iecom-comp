import {
  Box,
  Center,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { BiUserCircle } from 'react-icons/bi';
import { useState } from 'react';

export default function ExamPage() {
  const [pNumber, setPNumber] = useState(1);
  const [currentQ, setCurrentQ] = useState(1);
  const [answer, setAnswer] = useState('' as string);
  const router = useRouter();
  const { examId } = router.query;

  const prelimInfo = api.prelim.site.participant.getPrelimInfo.useQuery({
    examId: examId as string,
  });
  const problemData = api.prelim.site.participant.getPrelimQue.useQuery({
    examId: examId as string,
    questionNumber: pNumber,
  });

  const krem = '#FBEDD1';

  return (
    <Box
      height='100vh'
      overflow='hidden'
    >
      <Flex
        height='9rem'
        justifyContent='space-between'
        alignItems='center'
        padding='1.6rem 2rem'
        borderBottom='2px solid black'
      >
        <Image
          src='/main-icon.webp'
          alt=''
          height='100%'
        />
        <Heading
          fontSize='2rem'
          color='blue'
          fontFamily='Arial'
        >
          IECOM - Preliminary
        </Heading>
        <Icon
          as={BiUserCircle}
          fontSize='4rem'
        />
      </Flex>
      <Flex height='100%'>
        <Box
          width='70vw'
          height='100%'
          bgColor={krem}
        >
          {problemData.isLoading ? (
            <Flex
              fontSize='xl'
              padding='4.5rem'
            >
              Loading...
            </Flex>
          ) : (
            <Flex
              direction='column'
              position='relative'
              padding='3rem 1.5rem'
              gap='1.5rem'
              zIndex='2'
              fontSize='1.5rem'
              fontFamily='Arial'
              paddingLeft='3rem'
            >
              <VStack align='flex-start'>
                <Text
                  fontWeight='semibold'
                  mb='2rem'
                >
                  Question {currentQ}
                </Text>
                <Text>{problemData.data?.content.question}</Text>
              </VStack>
              {problemData.data?.type === 'MC' ? (
                <VStack
                  spacing={2}
                  paddingBlock='1rem'
                  align='flex-start'
                  paddingLeft='3rem'
                  zIndex='2'
                >
                  <Text fontSize='1.125rem'>Choose one:</Text>
                  <RadioGroup
                    value={answer}
                    onChange={setAnswer}
                  >
                    <Stack
                      spacing={4}
                      paddingLeft='1rem'
                    >
                      <Radio
                        colorScheme='linkedin'
                        value='A'
                      >
                        {problemData.data.content.answerA}
                      </Radio>
                      <Radio
                        colorScheme='linkedin'
                        value='B'
                      >
                        {problemData.data.content.answerB}
                      </Radio>
                      {problemData.data.content.answerC && (
                        <>
                          <Radio
                            colorScheme='linkedin'
                            value='C'
                          >
                            {problemData.data.content.answerC}
                          </Radio>
                          <Radio
                            colorScheme='linkedin'
                            value='D'
                          >
                            {problemData.data.content.answerD}
                          </Radio>
                          <Radio
                            colorScheme='linkedin'
                            value='E'
                          >
                            {problemData.data.content.answerE}
                          </Radio>
                        </>
                      )}
                    </Stack>
                  </RadioGroup>
                </VStack>
              ) : (
                <Input
                  type='text'
                  variant='unstyled'
                  borderBottom='1px'
                  borderRadius='0'
                  placeholder='Answer'
                  zIndex='2'
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  maxWidth='65ch'
                />
              )}
              <Image
                src='/comp-light.png'
                alt=''
                width='100%'
                position='absolute'
                left='0'
                top='0'
                zIndex={0}
              />
            </Flex>
          )}
        </Box>
        <Flex
          direction='column'
          position='relative'
          width='30vw'
          height='calc(100vh - 9rem)'
          justifyContent='space-between'
          alignItems='center'
        >
          <VStack
            paddingBlock='2rem'
            spacing={8}
          >
            <Box
              padding='.5rem 1rem'
              borderRadius='1rem'
              bgColor='#FBEDD199'
            >
              <Heading
                fontFamily='Arial'
                fontSize='1.5rem'
                color='blue'
              >
                Navigation
              </Heading>
            </Box>
            <Grid
              gridTemplateColumns='repeat(5, 1fr)'
              gap='1rem'
            >
              {prelimInfo.data?.ProblemData.map((problem, index) => (
                <Flex
                  bgColor={currentQ === index + 1 ? 'gray.500' : krem}
                  direction='column'
                  height='4.5rem'
                  width='3.5rem'
                  borderRadius='.75rem'
                  key={problem.id}
                  onClick={() => {
                    setCurrentQ(index + 1);
                    setPNumber(problem.pNumber);
                    setAnswer('');
                  }}
                  cursor='pointer'
                  _hover={
                    currentQ === index + 1
                      ? {}
                      : {
                          bgColor: '#DACCC1',
                        }
                  }
                >
                  <Box
                    height='1.375rem'
                    width='100%'
                    borderRadius='.75rem .75rem 0 0'
                    bgColor='yellow.2'
                  />
                  <Center
                    fontWeight='semibold'
                    fontSize='1.5rem'
                    fontFamily='Arial'
                    color={currentQ === index + 1 ? 'white' : 'blue'}
                    flexGrow={1}
                  >
                    {index + 1}
                  </Center>
                </Flex>
              ))}
            </Grid>
          </VStack>
          <VStack
            spacing={6}
            bgColor='#FBEDD199'
            paddingBlock='1rem'
            width='100%'
          >
            <Heading
              fontFamily='Arial'
              color='blue'
              fontSize='2rem'
            >
              Time Remaining
            </Heading>
            <Heading
              fontFamily='Arial'
              fontSize='2rem'
              color='blue'
            >
              {intToTime(prelimInfo.data?.durationRemaining ?? 0) ?? '--:--'}
            </Heading>
          </VStack>
          <Image
            src='/comp-dark.png'
            alt=''
            width='100%'
            position='absolute'
            left='0'
            zIndex='-1'
          />
        </Flex>
      </Flex>
    </Box>
  );
}

const intToTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${hours}:${minutes}:${seconds}`;
};
