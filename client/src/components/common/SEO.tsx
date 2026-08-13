import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  noIndex?: boolean;
}

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  noIndex = false,
}: Props) => {
  const location = useLocation();

  useEffect(() => {
    // TITLE
    if (title) {
      document.title = title;
    }

    // DESCRIPTION
    if (description) {
      let meta = document.querySelector("meta[name='description']") as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta") as HTMLMetaElement;
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }

    // KEYWORDS (optional)
    if (keywords) {
      let meta = document.querySelector("meta[name='keywords']") as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta") as HTMLMetaElement;
        meta.name = "keywords";
        document.head.appendChild(meta);
      }
      meta.content = keywords;
    }

    // CANONICAL
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link") as HTMLLinkElement;
      link.rel = "canonical";
      document.head.appendChild(link);
    }

    link.href =
      canonical ||
      `https://shreebaglamukhi.com${location.pathname}`;

    // ROBOTS
    let robots = document.querySelector("meta[name='robots']") as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement("meta") as HTMLMetaElement;
      robots.name = "robots";
      document.head.appendChild(robots);
    }

    robots.content = noIndex ? "noindex,nofollow" : "index,follow";
  }, [title, description, keywords, canonical, noIndex, location.pathname]);

  return null;
};

export default SEO;