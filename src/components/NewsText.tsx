import type { ReactNode } from "react";

const urlPattern = /https?:\/\/[^\s|]+/g;


function renderLinkedText(text: string) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(urlPattern)) {
    const rawUrl = match[0];
    const start = match.index ?? 0;
    const trailing = rawUrl.match(/[.,;:!?)]*$/)?.[0] ?? "";
    const url = rawUrl.slice(0, rawUrl.length - trailing.length);

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    parts.push(
      <a key={`${url}-${start}`} href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    );

    if (trailing) {
      parts.push(trailing);
    }

    lastIndex = start + rawUrl.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function renderNewsText(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const numberedHeading = block.match(/^(\d+)\.\s+(.+)$/);
      if (numberedHeading) {
        return (
          <h3 key={index} className="news-entry-heading">
            <span className="news-entry-heading__number">{numberedHeading[1]}</span>
            {numberedHeading[2]}
          </h3>
        );
      }

      const labelledBlock = block.match(/^([^:\n]+):\s*([\s\S]*)$/);
      if (labelledBlock) {
        const [, label, body] = labelledBlock;
        return (
          <p key={index} className={`news-entry-block news-entry-block--${label.toLowerCase().replace(/\s+/g, "-")}`}>
            <strong>{label}:</strong>
            {body ? <> {renderLinkedText(body)}</> : null}
          </p>
        );
      }

      return (
        <p key={index} className="news-entry-block">
          {renderLinkedText(block)}
        </p>
      );
    });
}

export default function NewsText({ text }: { text: string }) {
  return <>{renderNewsText(text)}</>;
}
