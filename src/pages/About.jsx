import { Helmet } from "react-helmet";
import InfoPageLayout from "./InfoPageLayout";

function About() {
  return (
    <InfoPageLayout
      eyebrow="Company"
      title="About NotURL"
      description="Learn about NotURL, a fast and secure URL shortener with analytics for modern link management."
    >
      <Helmet>
        <title>About NotURL</title>
        <meta
          name="description"
          content="Learn about NotURL, a fast and secure URL shortener with analytics for creating, managing, and tracking links."
        />
      </Helmet>

      <p>
        NotURL is a fast URL shortener built to help individuals, creators, students, and teams
        turn long links into clean, shareable URLs. The platform focuses on simple link creation,
        dependable redirects, and useful analytics so you can understand how your links perform
        after they are shared. With NotURL, you can shorten links quickly, organize your URLs in one
        dashboard, and track clicks without dealing with complicated tools. Whether you are sharing a
        portfolio, campaign, product page, event form, or social media link, NotURL gives you a
        professional way to create fast links and measure engagement. Our goal is to make URL
        shortening simple, secure, and accessible while giving every user the insights they need to
        improve link performance.
      </p>
    </InfoPageLayout>
  );
}

export default About;
