import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-3">
          <Image src="/logo.png" alt="MEGA Goaltending" width={44} height={43} className="h-11 w-auto" />
          <h1 className="font-heading text-lg font-semibold uppercase tracking-wider text-black">
            Goalie Development
          </h1>
        </div>
        <div className="border border-black/10 bg-white p-6">{children}</div>
      </div>
    </div>
  );
}
