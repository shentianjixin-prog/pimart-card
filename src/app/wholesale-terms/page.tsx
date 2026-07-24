import { cookies } from "next/headers";
import { LegalBlocks } from "@/lib/legal/LegalBlocks";
import { fillDeep } from "@/lib/legal/placeholders";
import { WHOLESALE_TERMS_DOC } from "@/lib/legal/wholesale-terms";
import { LegalArticle, LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalKeyNotices } from "@/components/legal/LegalKeyNotices";
import { resolveLang } from "@/lib/translations";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  return { title: WHOLESALE_TERMS_DOC[lang].metaTitle };
}

export default async function WholesaleTermsPage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const doc = fillDeep(WHOLESALE_TERMS_DOC[lang]);

  return (
    <LegalPageShell
      active="wholesale"
      lang={lang}
      title={doc.title}
      subtitle={doc.subtitle}
      updatedAt={doc.updatedAt}
      sellerLabel={doc.sellerChip}
      toc={doc.toc}
      notices={<LegalKeyNotices heading={doc.noticesHeading} items={doc.notices} />}
      hideDocPills
    >
      {doc.articles.map((article) => (
        <LegalArticle key={article.id} id={article.id} index={article.index} title={article.title}>
          <LegalBlocks blocks={article.blocks} />
        </LegalArticle>
      ))}
    </LegalPageShell>
  );
}
