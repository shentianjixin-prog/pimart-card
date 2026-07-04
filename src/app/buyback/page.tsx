import { cookies } from "next/headers";
import { BuybackForm } from "@/components/BuybackForm";
import { resolveLang } from "@/lib/translations";

export default async function BuybackPage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <BuybackForm lang={lang} />
    </div>
  );
}
