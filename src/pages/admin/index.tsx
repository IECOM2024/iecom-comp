import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AdminRoleLayout } from "~/components/layout/AdminRoleLayout";

const AdminPageComponent = () => {
  const router = useRouter();

  return (
    <Flex w="100%" alignItems="center" flexDir="column">
      <Text mt="1em" fontSize="3xl" color="blue">
        Admin Page
      </Text>
      <Button
        onClick={() => router.push("/admin/exam-administration")}
        ml="1em"
      >
        Exam Administration
      </Button>
    </Flex>
  );
};

export default function AdminPage() {
  return (
    <AdminRoleLayout>
      <AdminPageComponent />
    </AdminRoleLayout>
  );
}
