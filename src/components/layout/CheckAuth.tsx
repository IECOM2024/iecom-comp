import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Loading } from "../common/Loading";

interface CheckAuthProps {
    children: React.ReactNode;
    }

export const CheckAuth = ({children} : CheckAuthProps) => {
    const router = useRouter()
    const {data: session, status} = useSession({
        required: true,
        onUnauthenticated() {
            signIn();
        }
    });

    if (status === "loading") {
        return <Loading/>
    }
    return <>
        {children}
    </>
}