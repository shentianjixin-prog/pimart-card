import Image from "next/image";
import { getOpcSetSpec } from "@/lib/opc-set-specs";
import type { Lang } from "@/lib/translations";

type Props = {
  series: string | null;
  lang: Lang;
  T: (key: string) => string;
};

export function OpcTopCards({ series, T }: Props) {
  const matched = getOpcSetSpec(series);
  if (!matched || !matched.spec.topCards || matched.spec.topCards.length === 0) return null;

  return (
    <section className="opc-topcards" aria-labelledby="opc-topcards-heading">
      <h2 id="opc-topcards-heading" className="opc-topcards-heading">
        {T("opc_topcards_title")}
      </h2>

      <div className="opc-topcards-groups">
        {matched.spec.topCards.map((group, gi) => (
          <div className="opc-topcards-group" key={gi}>
            <div className="opc-topcards-images">
              {group.images.map((src) => (
                <div className="opc-topcards-image-wrap" key={src}>
                  <Image src={src} alt={group.title} fill sizes="180px" className="opc-topcards-image" />
                </div>
              ))}
            </div>
            <p className="opc-topcards-group-title">{group.title}</p>
            {group.remark ? <p className="opc-topcards-group-remark">{group.remark}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
