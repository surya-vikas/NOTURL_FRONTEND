import { Helmet } from "react-helmet";
import InfoPageLayout from "./InfoPageLayout";

function PrivacyPolicy() {
  return (
    <InfoPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      description="A simple overview of how NotURL collects, uses, and protects data for URL shortening and analytics."
    >
      <Helmet>
        <title>Privacy Policy - NotURL</title>
        <meta
          name="description"
          content="Read the NotURL privacy policy to understand how email addresses, links, and analytics data are collected and protected."
        />
      </Helmet>

      <section>
        <h2 className="text-xl font-bold text-white">Data We Collect</h2>
        <p className="mt-2">
          NotURL may collect account information such as your name, email address, phone number, and
          the links you create. We also store basic link analytics such as click counts so you can
          measure link performance.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">How We Use Data</h2>
        <p className="mt-2">
          We use this information to provide URL shortening, account access, OTP verification,
          analytics, link management, abuse prevention, and platform improvements.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">Security Assurance</h2>
        <p className="mt-2">
          We take reasonable steps to protect account and link data from unauthorized access. NotURL
          is designed to keep your dashboard and link management tools secure and reliable.
        </p>
      </section>
    </InfoPageLayout>
  );
}

export default PrivacyPolicy;
