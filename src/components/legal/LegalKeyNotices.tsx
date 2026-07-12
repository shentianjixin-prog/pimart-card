type Notice = {
  title: string;
  body: string;
};

type LegalKeyNoticesProps = {
  heading?: string;
  items: Notice[];
};

export function LegalKeyNotices({ heading = "购前关键须知", items }: LegalKeyNoticesProps) {
  return (
    <section className="legal-key" aria-labelledby="legal-key-heading">
      <h2 id="legal-key-heading" className="legal-key-heading">
        {heading}
      </h2>
      <ol className="legal-key-grid">
        {items.map((item, i) => (
          <li key={item.title} className="legal-key-item">
            <span className="legal-key-num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="legal-key-title">{item.title}</p>
              <p className="legal-key-body">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
