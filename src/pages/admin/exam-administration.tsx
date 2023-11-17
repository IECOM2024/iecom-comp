import { Text } from "@chakra-ui/react";
import { Loading } from "~/components/common/Loading";
import { AdminRoleLayout } from "~/components/layout/AdminRoleLayout";
import { api } from "~/utils/api";

const ExamAdministrationPageComponent = () => {
  const adminGetAllExamQuery = api.exam.admin.getAllExam.useQuery();

  const examList = adminGetAllExamQuery.data;

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

  return;
};

export default function ExamAdministrationPage() {
  return (
    <AdminRoleLayout>
      <ExamAdministrationPageComponent />
    </AdminRoleLayout>
  );
}
