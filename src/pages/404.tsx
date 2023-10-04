import { Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { PublicLayout } from "~/components/layout/PublicLayout";

export default function Page404() {
    const router = useRouter();

    return (
        <PublicLayout>
            <Text mt="1em" textAlign="center" fontSize="2xl" w="100%" mb="1em">Page Not Found</Text>
            <Button onClick={() => router.push('/')} m="auto" >Home</Button>
        </PublicLayout>
    );
}