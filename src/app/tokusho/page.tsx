import { cookies } from "next/headers";
import { fillDeep } from "@/lib/legal/placeholders";
import { TOKUSHO_DOC } from "@/lib/legal/tokusho";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalKeyNotices } from "@/components/legal/LegalKeyNotices";
import { resolveLang } from "@/lib/translations";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  return { title: TOKUSHO_DOC[lang].metaTitle };
}

export default async function TokushoPage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const doc = fillDeep(TOKUSHO_DOC[lang]);
  const toc = doc.rows.map((row, i) => ({
    id: row.id,
    label: `${String(i + 1).padStart(2, "0")} ${row.label}`,
  }));

  return (
    <LegalPageShell
      active="tokusho"
      lang={lang}
      title={doc.title}
      subtitle={doc.subtitle}
      updatedAt={doc.updatedAt}
      sellerLabel={doc.sellerChip}
      toc={toc}
      notices={<LegalKeyNotices heading={doc.noticesHeading} items={doc.notices} />}
    >
      <dl className="legal-dl">
        {doc.rows.map((row) => (
          <div key={row.id} id={row.id} className="legal-dl-row scroll-mt-28">
            <dt className="legal-dl-label">{row.label}</dt>
            <dd className="legal-dl-value">
              {"blocks" in row ? (
                <div className="legal-dl-blocks">
                  {row.blocks.map((block) => (
                    <div key={block.title}>
                      <p className="legal-dl-block-title">{block.title}</p>
                      <p className="legal-dl-block-body whitespace-pre-line">{block.body}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="whitespace-pre-line">{row.value}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </LegalPageShell>
  );
}
