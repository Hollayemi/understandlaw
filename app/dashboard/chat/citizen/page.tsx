import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import CitizenConversationsClient from "./CitizenConversationsClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-maroon-500" />
        </div>
      }
    >
      <CitizenConversationsClient />
    </Suspense>
  );
}