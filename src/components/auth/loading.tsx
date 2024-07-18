import Image from "next/image";

const Loading = () => (
  <main className="min-h-screen w-full flex flex-col items-center justify-center p-24">
    <Image
      alt="lancelot logo"
      src={"/logo.svg"}
      width={96}
      height={96}
      className="animate-pulse duration-500"
    ></Image>
  </main>
);

export { Loading };
