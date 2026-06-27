import Link from "next/link";

type Props = {
  index: string;
  title: string;
  href?: string;
  linkLabel?: string;
};

/** 得遇文化式编辑型区块标题：大序号 + 衬线标题 + 金线 */
export function SectionHeader({ index, title, href, linkLabel }: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-end gap-5">
        <span className="section-index">{index}</span>
        <div>
          <div className="editorial-rule mb-3 max-w-[120px]" />
          <h2 className="section-title">{title}</h2>
        </div>
      </div>
      {href && linkLabel && (
        <Link href={href} className="link-editorial shrink-0 pb-1">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
