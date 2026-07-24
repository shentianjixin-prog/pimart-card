import { LegalCallout } from "@/components/legal/LegalCallout";
import type { LegalBlock } from "@/lib/legal/types";

/** 渲染结构化法律正文块 */
export function LegalBlocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        const key = `${block.type}-${i}`;
        if (block.type === "p") {
          return (
            <p key={key} className="mb-2 last:mb-0">
              {renderInline(block.text)}
            </p>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={key} className="list-decimal space-y-2">
              {block.items.map((item) => (
                <li key={item.slice(0, 48)}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={key} className="list-disc space-y-1">
              {block.items.map((item) => (
                <li key={item.slice(0, 48)}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "callout") {
          return (
            <LegalCallout key={key} tone={block.tone}>
              {renderInline(block.text)}
            </LegalCallout>
          );
        }
        return (
          <div key={key} className="legal-info-card">
            {block.rows.map((row) => (
              <div key={row.label} className="legal-info-row">
                <span className="legal-info-label">{row.label}</span>
                <span className="legal-info-value">{renderInline(row.value)}</span>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

/** 简单 **加粗** 与 mailto:/内部路径文本（纯文本展示，链接由页面另行处理时可用 HTML 扩展） */
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return <span key={idx}>{part}</span>;
  });
}
