import { adminGetUsersListAction } from "@/app/actions/admin";
import { AdminUsersClient } from "./users-client";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AdminUsersPage({ params }: Props) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  const result = await adminGetUsersListAction();
  const rawUsers = result.data || [];

  return (
    <div className="space-y-6">
      <header className="border-b border-rule pb-4">
        <h1 className="font-heading text-2xl text-text font-normal">
          {isHindi ? "उपयोगकर्ता प्रबंधन" : "User Management & Account Controls"}
        </h1>
        <p className="text-xs text-secondary mt-1">
          {isHindi
            ? "उपयोगकर्ता खोजें, भूमिकाएं देखें, निलंबन अथवा बहाली करें। प्रत्येक कार्रवाई ऑडिट-लॉग में दर्ज होती है।"
            : "Search and filter accounts, review active roles, suspend or reactivate users. All actions are audit-logged."}
        </p>
      </header>

      <AdminUsersClient
        users={rawUsers as any}
        isHindi={isHindi}
      />
    </div>
  );
}
