import { Helmet } from "react-helmet";
import InfoPageLayout from "./InfoPageLayout";

function Terms() {
  return (
    <InfoPageLayout
      eyebrow="Legal"
      title="Terms of Use"
      description="Review the basic rules for using NotURL responsibly and keeping shortened links safe."
    >
      <Helmet>
        <title>Terms of Use - NotURL</title>
        <meta
          name="description"
          content="Read the NotURL terms of use covering responsible link shortening, account responsibility, and prohibited misuse."
        />
      </Helmet>

      <section>
        <h2 className="text-xl font-bold text-white">Usage Rules</h2>
        <p className="mt-2">
          NotURL is provided to help users create and manage shortened links. You agree to use the
          platform responsibly and only shorten URLs that you have the right to share.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">No Misuse</h2>
        <p className="mt-2">
          Do not use NotURL for spam, phishing, malware, illegal content, deceptive links, or any
          activity that harms users, systems, or third-party services.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">Account Responsibility</h2>
        <p className="mt-2">
          You are responsible for activity under your account, including the links you create and
          share. Keep your account secure and contact support if you notice unauthorized activity.
        </p>
      </section>
    </InfoPageLayout>
  );
}

export default Terms;
