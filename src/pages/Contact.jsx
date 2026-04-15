import { Helmet } from "react-helmet";
import InfoPageLayout from "./InfoPageLayout";

function Contact() {
  return (
    <InfoPageLayout
      eyebrow="Support"
      title="Contact NotURL"
      description="For any queries, contact us. We are here to help with accounts, shortened links, analytics, and platform questions."
    >
      <Helmet>
        <title>Contact NotURL</title>
        <meta
          name="description"
          content="Contact NotURL support for questions about URL shortening, link analytics, accounts, and platform help."
        />
      </Helmet>

      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-300">
          Email support
        </p>
        <a
          href="mailto:info.noturl@gmail.com"
          className="block break-all text-3xl font-bold text-white transition hover:text-blue-300 sm:text-4xl"
        >
          info.noturl@gmail.com
        </a>
        <p>
          For any queries, contact us and include the email address connected to your NotURL account
          when possible. This helps us respond faster to questions about shortened URLs, analytics,
          login access, or profile updates.
        </p>
      </section>
    </InfoPageLayout>
  );
}

export default Contact;
