import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/map");
  }, [router]);

  return (
    <div>
      <Head>
        <title>HOME | 낭만몽상가</title>
        <meta name="description" content="낭만 몽상가 홈입니다."></meta>
      </Head>
    </div>
  );
}
