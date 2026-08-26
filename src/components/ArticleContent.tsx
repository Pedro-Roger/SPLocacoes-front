import Link from 'next/link';

const LINK_PART_RE = /^(https?:\/\/[^\s]+|\/?atualizacoes\/[a-z0-9-]+)$/i;
const LINK_SPLIT_RE = /(https?:\/\/[^\s]+|\/?atualizacoes\/[a-z0-9-]+)/gi;

export default function ArticleContent({ content }: { content: string }) {
  const paragraphs = content.split(/\n{2,}/).filter((paragraph) => paragraph.trim());

  return (
    <div className="article-content">
      {paragraphs.map((paragraph, index) => (
        <p key={`${paragraph.slice(0, 24)}-${index}`}>{renderText(paragraph)}</p>
      ))}
    </div>
  );
}

function renderText(text: string) {
  return text.split(LINK_SPLIT_RE).map((part, index) => {
    if (!LINK_PART_RE.test(part)) {
      return renderLineBreaks(part, index);
    }

    if (/^https?:\/\//i.test(part)) {
      return (
        <a key={`${part}-${index}`} href={part} target="_blank" rel="noreferrer">
          {part}
        </a>
      );
    }

    const href = part.startsWith('/') ? part : `/${part}`;
    return (
      <Link key={`${href}-${index}`} href={href}>
        {part}
      </Link>
    );
  });
}

function renderLineBreaks(text: string, baseIndex: number) {
  const lines = text.split('\n');
  if (lines.length === 1) return text;

  return lines.map((line, index) => (
    <span key={`${baseIndex}-${index}`}>
      {index > 0 ? <br /> : null}
      {line}
    </span>
  ));
}
