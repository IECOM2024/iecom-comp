import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SignUp () {
  const router = useRouter()

  useEffect(() => {
    router.push("/signin")
  })
  return <></>
}