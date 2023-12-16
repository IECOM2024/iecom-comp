import { Button, Flex, Text } from "@chakra-ui/react";
import { ExamAttendanceStatus } from "@prisma/client";
import { useRouter } from "next/router";
import { AuthorizedRoleLayout } from "~/components/layout/AuthorizedRoleLayout";
import { api } from "~/utils/api";
import { RouterOutputs } from "~/utils/api";

export const DasboardPageComponent = () => {
  const examListQuery = api.exam.participant.getAllExam.useQuery();

  const examList = examListQuery.data;

  if (examListQuery.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!examList) {
    return <Text>You have not enrolled on any exam yet.</Text>;
  }

  return (
    <Flex flexDir="column">
      <Text
        w="100%"
        textAlign="center"
        fontSize="3xl"
        color="blue"
        fontWeight="bold"
      >
        DASHBOARD
      </Text>
      <Flex flexWrap="wrap" p="2em" gap="2em">
        {examList.map((exam, i) => (
          <DasboardItem exam={exam} key={i} />
        ))}
      </Flex>
    </Flex>
  );
};

const DasboardItem = ({
  exam,
}: {
  exam: RouterOutputs["exam"]["participant"]["getAllExam"][0];
}) => {
  const router = useRouter();
  return (
    <Flex
      flexDir="column"
      w="min(60%,25em)"
      bg="whiteCream"
      borderRadius="10px"
      border="1px solid black"
      p="1em"
    >
      <Text fontWeight="bold">{exam.name}</Text>
      <Flex justifyContent="space-between">
        <Text>Duration</Text>
        <Text>{`${exam.duration / 60000} min`}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>Start Time</Text>
        <Text>{exam.startTime.toLocaleDateString()}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>End Time</Text>
        <Text>{exam.endTime.toLocaleDateString()}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>Status</Text>
        <Text>{exam.attendance.status}</Text>
      </Flex>
      {exam.attendance.status === ExamAttendanceStatus.FINISHED ? (
        <Text>You have finished your exam</Text>
      ) : (
        <Button mx={"auto"} onClick={() => router.push(`exam/${exam.id}`)}>
          {exam.attendance.status === ExamAttendanceStatus.ABSENT
            ? "Start Exam"
            : "Continue"}
        </Button>
      )}
    </Flex>
  );
};

export default function DashboardPage() {
  return (
    <AuthorizedRoleLayout>
      <DasboardPageComponent />
    </AuthorizedRoleLayout>
  );
}
