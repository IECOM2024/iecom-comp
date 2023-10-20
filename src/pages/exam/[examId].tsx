import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';

export default function ExamPage() {
  const router = useRouter();
  const { examId } = router.query;

  const examInfo = api.exam.participant.getExamInfo.useQuery({
    examId: examId as string,
  });

  return <Flex color='black'>{examInfo.data?.id}</Flex>;
}
