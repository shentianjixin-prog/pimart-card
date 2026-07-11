import { getOpcSetSpec } from "@/lib/opc-set-specs";
import type { Lang } from "@/lib/translations";

type Props = {
  series: string | null;
  boxType: string;
  lang: Lang;
  T: (key: string) => string;
};

function formatReleaseDate(iso: string, lang: Lang) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  if (lang === "en") {
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  }
  return `${y}年${m}月${d}日`;
}

function displayTitle(code: string, title: string, lang: Lang) {
  if (lang === "en") return `Booster Pack ${title} [${code}]`;
  if (lang === "ja") return `ブースターパック ${title}【${code}】`;
  return `补充包 ${title}【${code}】`;
}

export function OpcProductSpecs({ series, boxType, lang, T }: Props) {
  const matched = getOpcSetSpec(series);
  if (!matched) return null;

  const { code, spec } = matched;
  const title =
    lang === "en" && spec.titleEn
      ? spec.titleEn
      : lang === "ja" && spec.titleJa
        ? spec.titleJa
        : spec.titleZh;

  const typesSuffix = spec.totalTypes
    ? T("opc_types_suffix").replace("{types}", spec.totalTypes)
    : "";

  const contentLines: string[] = [];
  if (boxType === "散包") {
    contentLines.push(
      T("opc_content_pack")
        .replace("{n}", String(spec.cardsPerPack))
        .replace("{types}", typesSuffix)
    );
  } else if (boxType === "原箱") {
    contentLines.push(
      T("opc_content_case").replace("{n}", String(spec.boxesPerCase))
    );
    contentLines.push(
      T("opc_content_box").replace("{n}", String(spec.packsPerBox))
    );
    contentLines.push(
      T("opc_content_pack")
        .replace("{n}", String(spec.cardsPerPack))
        .replace("{types}", typesSuffix)
    );
  } else {
    contentLines.push(
      T("opc_content_box").replace("{n}", String(spec.packsPerBox))
    );
    contentLines.push(
      T("opc_content_pack")
        .replace("{n}", String(spec.cardsPerPack))
        .replace("{types}", typesSuffix)
    );
  }

  return (
    <section className="opc-specs" aria-labelledby="opc-specs-heading">
      <h2 id="opc-specs-heading" className="opc-specs-heading">
        {T("opc_specs_title")}
      </h2>

      <p className="opc-specs-product-name">{displayTitle(code, title, lang)}</p>

      <dl className="opc-specs-list">
        {spec.releaseDate ? (
          <div className="opc-specs-row">
            <dt>{T("opc_release_date")}</dt>
            <dd>{formatReleaseDate(spec.releaseDate, lang)}</dd>
          </div>
        ) : null}

        <div className="opc-specs-row opc-specs-row-block">
          <dt>{T("opc_contents")}</dt>
          <dd>
            <ul className="opc-specs-contents">
              {contentLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </dd>
        </div>

        {spec.rarities && spec.rarities.length > 0 ? (
          <div className="opc-specs-row opc-specs-row-block">
            <dt>{T("opc_rarity")}</dt>
            <dd>
              <ul className="opc-specs-rarities">
                {spec.rarities.map((row) => (
                  <li key={row.labelKey}>
                    <span>{T(row.labelKey)}</span>
                    <span>
                      {row.count}
                      {T("opc_rarity_unit")}
                    </span>
                  </li>
                ))}
              </ul>
              {spec.totalTypes ? (
                <p className="opc-specs-rarity-note">
                  {T("opc_rarity_total_note").replace("{types}", spec.totalTypes)}
                </p>
              ) : null}
              {spec.parallelTypes ? (
                <p className="opc-specs-rarity-note">
                  {T("opc_parallel_note").replace("{n}", spec.parallelTypes)}
                </p>
              ) : null}
            </dd>
          </div>
        ) : null}
      </dl>

      <ul className="opc-specs-footnotes">
        <li>
          {T("opc_note_pack")
            .replace("{n}", String(spec.cardsPerPack))
            .replace("{types}", spec.totalTypes || T("opc_note_types_fallback"))}
        </li>
        <li>{T("opc_note_image")}</li>
        <li>{T("opc_note_process")}</li>
      </ul>
    </section>
  );
}
