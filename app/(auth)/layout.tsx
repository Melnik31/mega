export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-zinc-900">Goalie Development</h1>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
