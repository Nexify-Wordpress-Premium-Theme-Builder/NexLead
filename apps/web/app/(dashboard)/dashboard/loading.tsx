export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-[1520px] animate-pulse">
      <div className="h-10 w-56 rounded-xl bg-[#E2E8F0]" />
      <div className="mt-3 h-5 w-full max-w-xl rounded-lg bg-[#E2E8F0]" />

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-[150px] rounded-[24px] border border-[rgba(15,23,42,0.06)] bg-white" />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <div className="h-[450px] rounded-[26px] border border-[rgba(15,23,42,0.06)] bg-white xl:col-span-8" />
        <div className="flex flex-col gap-4 xl:col-span-4">
          <div className="h-72 rounded-[24px] border border-[rgba(15,23,42,0.06)] bg-white" />
          <div className="h-56 rounded-[24px] border border-[rgba(15,23,42,0.06)] bg-white" />
        </div>
      </div>
    </div>
  );
}
