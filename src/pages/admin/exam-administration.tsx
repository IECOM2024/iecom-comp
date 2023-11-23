import { Flex, Select, Text } from "@chakra-ui/react";
import { Loading } from "~/components/common/Loading";
import { AdminRoleLayout } from "~/components/layout/AdminRoleLayout";
import { api } from "~/utils/api";
import { useState } from "react";
import { ExamAdministration } from "~/components/admin/ExamAdministration";

const ExamAdministrationPageComponent = () => {
  const adminGetAllExamQuery = api.exam.admin.getAllExam.useQuery();

  const examList = adminGetAllExamQuery.data;

  const [examId, setExamId] = useState<string>("");

  if (adminGetAllExamQuery.isLoading) {
    return <Loading />;
  }

  if (!examList) {
    return (
      <Text
        mt="1em"
        w="100%"
        textAlign="center"
        color="blue"
        fontSize="2xl"
        fontWeight="bold"
      >
        No Exam Found
      </Text>
    );
  }

  console.log(examId)

  return (
    <Flex flexDir="column" px="1em">
      <Flex alignItems="center" mt="1em">
        <Text ml="1em" fontWeight="bold" color="black" mr="1em">
          {"Select Exam "}
        </Text>
        <Select
          borderRadius="12"
          cursor="pointer"
          borderWidth="2px"
          borderColor="gray.500"
          w="8em"
          _active={{
            bg: "rgba(47, 46, 46, 0.6)",
            shadow: "none",
          }}
          onChange={(e) => setExamId(e.target.value)}
          placeholder="Select Exam"
        >
          {examList.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.name}
            </option>
          ))}
        </Select>
      </Flex>
      <ExamAdministration examId={examId} />
    </Flex>
  );
};

export default function ExamAdministrationPage() {
  return (
    <AdminRoleLayout>
      <ExamAdministrationPageComponent />
    </AdminRoleLayout>
  );
}
