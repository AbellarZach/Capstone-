import { PageHeader } from "@/components/admin/PageHeader";
import { MaterialIcon } from "@/components/admin/MaterialIcon";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage system preferences" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          {
            icon: "account_circle",
            title: "Profile Settings",
            desc: "Update administrator profile and credentials",
          },
          {
            icon: "notifications",
            title: "Notifications",
            desc: "Configure email and SMS notification preferences",
          },
          {
            icon: "security",
            title: "Security",
            desc: "Manage passwords and access control",
          },
          {
            icon: "info",
            title: "Barangay Information",
            desc: "Update barangay name, logo, and contact details",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="admin-card flex items-start gap-4 p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <MaterialIcon name={item.icon} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
