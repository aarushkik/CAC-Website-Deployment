import { PageHeader } from "@/components/PageHeader";
import { RecallCheck } from "@/components/RecallCheck";

export const metadata = { title: "Recall check — FixIt" };

export default function RecallsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Recall check"
        intro="Before you repair something, see if the maker has recalled it. A recalled product gets fixed, replaced or refunded for free."
      />
      <div className="[&>section]:mt-0">
        <RecallCheck />
      </div>
    </div>
  );
}
