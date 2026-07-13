import Link from "next/link";
import { MaterialIcon } from "@/components/admin/MaterialIcon";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-white to-primary/10 px-4">
      <div className="w-full max-w-lg rounded-[16px] bg-white p-10 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-white">
          <MaterialIcon name="gavel" className="text-4xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Barangay EasyReport</h1>
        <p className="mt-2 text-gray-500">
          Online Complaint Management System for Barangay
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/admin"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <MaterialIcon name="dashboard" className="text-lg" />
            Go to Admin Dashboard
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Republic of the Philippines &middot; Barangay San Jose
        </p>
      </div>
    </div>
  );
}
