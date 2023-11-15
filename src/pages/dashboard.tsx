import { Flex, Text } from "@chakra-ui/react";
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
      <Text>DashBoard</Text>
      <Flex flexWrap="wrap">
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
  return (
    <Flex flexDir="column" w="min(60%,25em)" bg="whiteCream">
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
    </Flex>
  );
};

const DashboardPage = () => {
  return (
    <AuthorizedRoleLayout>
      <DasboardPageComponent />
    </AuthorizedRoleLayout>
  );
};
