import { Helmet } from "react-helmet";
import InfoPageLayout from "./InfoPageLayout";

const faqs = [
  {
    question: "How do I shorten a URL?",
    answer:
      "Paste your long URL into the NotURL shortener, choose an optional custom alias, and click the shorten button. Your short link will be ready to copy and share.",
  },
  {
    question: "Is NotURL free?",
    answer:
      "Yes. NotURL includes a free URL shortener experience for creating short links and managing them from your dashboard.",
  },
  {
    question: "How do I track clicks?",
    answer:
      "After creating a short link, open your dashboard to view click counts and analytics. This helps you track clicks and performance for each URL.",
  },
  {
    question: "Can I use custom aliases?",
    answer:
      "Yes. When creating a link, you can enter a custom alias if it is available and follows the supported character rules.",
  },
];

function Help() {
  return (
    <InfoPageLayout
      eyebrow="Help"
      title="Help and FAQ"
      description="Find answers about shortening URLs, tracking clicks, analytics, and using NotURL effectively."
    >
      <Helmet>
        <title>Help and FAQ - NotURL</title>
        <meta
          name="description"
          content="Get help with NotURL. Learn how to shorten URLs, track clicks, use analytics, and manage short links."
        />
      </Helmet>

      <div className="divide-y divide-slate-700/70">
        {faqs.map((item) => (
          <article
            key={item.question}
            className="py-6 first:pt-0 last:pb-0"
          >
            <h2 className="text-xl font-bold text-white">{item.question}</h2>
            <p className="mt-3">{item.answer}</p>
          </article>
        ))}
      </div>
    </InfoPageLayout>
  );
}

export default Help;
