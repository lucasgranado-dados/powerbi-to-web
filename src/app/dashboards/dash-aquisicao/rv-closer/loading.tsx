import { LoadingState } from "@/components/dashboard/LoadingState";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <LoadingState showTable />
    </main>
  );
}
