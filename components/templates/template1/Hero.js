import { Container } from "./Container";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  SocialLink,
  TwitterIcon,
} from "./SocialIcons";

export const Hero = ({ page }) => {
  console.log(page);
  return (
    <Container className="mt-9">
      <div className="max-w-2xl">
        {page.profile_image ? (
          <img
            src={page.profile_image}
            className="h-28 w-28 overflow-hidden rounded-full bg-gray-100 object-cover my-12"
          />
        ) : (
          ""
        )}

        {page.name ? (
          <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-2xl">
            My name is {page.name}
          </h2>
        ) : (
          ""
        )}

        {page.headline ? (
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            {page.headline}
          </h1>
        ) : (
          ""
        )}

        <p className="my-6 text-base text-zinc-600 dark:text-zinc-400">
          {page.long_description}
        </p>

        {page.work.available_to_hire ? (
          <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
            <svg
              className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
              fill="currentColor"
              viewBox="0 0 8 8"
            >
              <circle cx={4} cy={4} r={3} />
            </svg>
            I'm available for new opportunities!
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
            <svg
              className="-ml-0.5 mr-1.5 h-2 w-2 text-red-400"
              fill="currentColor"
              viewBox="0 0 8 8"
            >
              <circle cx={4} cy={4} r={3} />
            </svg>
            I'm busy right now, but feel free to reach out!
          </span>
        )}

        <div className="mt-6 flex gap-6">
          <SocialLink
            href="https://twitter.com"
            aria-label="Follow on Twitter"
            icon={TwitterIcon}
          />
          <SocialLink
            href="https://instagram.com"
            aria-label="Follow on Instagram"
            icon={InstagramIcon}
          />
          <SocialLink
            href="https://github.com"
            aria-label="Follow on GitHub"
            icon={GitHubIcon}
          />
          <SocialLink
            href="https://linkedin.com"
            aria-label="Follow on LinkedIn"
            icon={LinkedInIcon}
          />
        </div>
      </div>
    </Container>
  );
};
