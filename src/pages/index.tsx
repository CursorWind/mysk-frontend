// Modules
import { useState } from "react";

import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Button,
  Card,
  CardHeader,
  LinkButton,
  MaterialIcon,
} from "@suankularb-components/react";

// Components
import Layout from "@components/Layout";

// Types
import { NewsItem, NewsList } from "@utils/types/news";

// News
const LandingFeed = ({
  feed,
}: {
  feed: { lastUpdated: Date; content: NewsList };
}): JSX.Element => {
  const [fullscreen, setFullScreen] = useState<boolean>(false);
  const { t } = useTranslation("landing");

  return (
    <section
      aria-label={t("news.title")}
      className="fixed bottom-[6rem] right-2 w-[calc(100vw-1rem)] rounded-xl
        bg-[#fbfcff88] text-on-surface backdrop-blur-xl dark:bg-[#191c1e88]
        sm:bottom-2 sm:w-[22.5rem] md:absolute md:right-4 md:bottom-4 md:h-[calc(100vh-6.5rem)]"
    >
      <Card
        type="stacked"
        appearance="tonal"
        className="h-full !bg-transparent"
      >
        <button
          aria-label={t("news.expand")}
          onClick={() => setFullScreen(!fullscreen)}
          className="has-action relative text-left"
        >
          <CardHeader
            icon="newspaper"
            title={
              <h2 className="font-display text-lg font-medium">
                {t("news.title")}
              </h2>
            }
            label={
              <p className="font-display">
                <Trans i18nKey="news.lastUpdated" ns="landing">
                  {{
                    lastUpdated: feed.lastUpdated.toLocaleDateString(
                      useRouter().locale,
                      { year: "numeric", month: "long", day: "numeric" }
                    ),
                  }}
                </Trans>
              </p>
            }
            end={
              <Button
                type="text"
                iconOnly
                icon={
                  fullscreen ? (
                    <MaterialIcon icon="expand_more" />
                  ) : (
                    <MaterialIcon icon="expand_less" />
                  )
                }
                className="md:!hidden"
              />
            }
          />
        </button>
        <div
          className={`grow overflow-y-auto transition-[height] md:h-full ${
            fullscreen
              ? "h-[calc(100vh-14.5rem)] sm:h-[calc(100vh-16rem)]"
              : "h-0"
          }`}
        >
          <ul className="flex flex-col">
            {feed.content.map((feedItem) => (
              <LandingFeedItem key={feedItem.id} feedItem={feedItem} />
            ))}
          </ul>
        </div>
      </Card>
    </section>
  );
};

const LandingFeedItem = ({ feedItem }: { feedItem: NewsItem }): JSX.Element => {
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <li key={feedItem.id}>
      <Link href={`/news/${feedItem.id}`}>
        <a className="has-action relative flex flex-col">
          <div
            className="surface grid h-48 w-full place-items-center bg-cover text-center"
            style={{
              backgroundImage: feedItem.image
                ? `url('${feedItem.image}')`
                : "none",
            }}
          >
            {!feedItem.image && feedItem.content[locale].title}
          </div>
          <div className="flex flex-col p-4">
            <h3 className="font-display text-lg font-bold">
              {feedItem.content[locale].title}
            </h3>
            <p className="max-lines-2">
              {feedItem.content[locale].supportingText}
            </p>
          </div>
        </a>
      </Link>
    </li>
  );
};

const ChangeLanguageButton = () => {
  const { t } = useTranslation("landing");

  // FIXME: This is broken right now because of bad component library code
  // return (
  //   <Link href="/" locale={useRouter().locale == "en-US" ? "th" : "en-US"}>
  //     <Button
  //       name={t("changeLang")}
  //       type="text"
  //       icon={<MaterialIcon icon="translate" />}
  //       className="!text-tertiary-container dark:!text-tertiary"
  //     />
  //   </Link>
  // );

  // A temporary component is created with CSS rather than React SK Components to avoid this issue
  return (
    <Link href="/" locale={useRouter().locale == "en-US" ? "th" : "en-US"}>
      <a className="btn--text btn--has-icon !text-tertiary-container dark:!text-tertiary">
        <MaterialIcon icon="translate" />
        <span>{t("changeLang")}</span>
      </a>
    </Link>
  );
};

// Banner
const LandingBanner = (): JSX.Element => {
  const { t } = useTranslation(["landing", "common"]);

  return (
    <header className="h-full font-display sm:min-h-[calc(100vh-4.5rem)]">
      {/* Vignette layer */}
      <div
        className="flex h-full flex-col items-center gap-16 bg-gradient-to-b
          from-[#00000033] via-transparent to-[#00000033] px-8 py-16
          dark:from-[#00000099] dark:via-[#00000066] dark:to-[#00000099]
          sm:min-h-[calc(100vh-4.5rem)] sm:items-start sm:bg-gradient-to-r sm:px-16"
      >
        <div className="flex flex-col items-center text-center sm:flex-row sm:gap-8 sm:text-left">
          {/* Logo */}
          <div className="relative h-40 w-40">
            <Image
              alt="โลโก้ดอกไม้สีชมพู มีตัวอักษร MySK อยู่ตรงกลาง"
              layout="fill"
              priority={true}
              src={"/images/branding/logo-white.webp"}
            />
          </div>

          {/* Text */}
          <div className="w-96 font-display leading-tight text-white">
            <h1 className="text-9xl font-bold">
              <Trans i18nKey="brand.nameWithAccent" ns="common">
                My
                <span className="text-secondary-container dark:text-secondary">
                  SK
                </span>
              </Trans>
            </h1>
            <p className="text-4xl font-light">
              {t("brand.school", { ns: "common" })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <div className="flex flex-row flex-wrap items-center gap-4">
            <LinkButton
              label={t("login")}
              type="filled"
              icon={<MaterialIcon icon="login" />}
              url="/account/login"
              LinkElement={Link}
              className="has-action--tertiary !bg-tertiary-container !text-tertiary"
            />
            <LinkButton
              label={t("help")}
              type="outlined"
              url="/help"
              LinkElement={Link}
              className="!bg-transparent !text-tertiary-container !outline-tertiary-container
                hover:!bg-tertiary-translucent-08 focus:!bg-tertiary-translucent-12
                focus-visible:!bg-tertiary dark:!text-tertiary dark:!outline-tertiary"
            />
          </div>
          <ChangeLanguageButton />
        </div>
      </div>
    </header>
  );
};

// Page
export default function Landing() {
  const { t } = useTranslation(["landing", "common"]);

  return (
    <>
      <Head>
        <title>{t("brand.name", { ns: "common" })}</title>
      </Head>
      <div className="h-screen bg-[url('/images/landing.webp')] bg-cover bg-left">
        <LandingBanner />
        <LandingFeed
          feed={{
            lastUpdated: new Date(),
            content: [
              {
                id: 4,
                type: "news",
                postDate: new Date(2021, 8, 16),
                image: "/images/dummybase/certificates-announcement.webp",
                content: {
                  "en-US": {
                    title: "Certificates Announcement",
                    supportingText:
                      "Announcement of the 2020 Suankularb Wittayalai winners of certificates.",
                  },
                  th: {
                    title: "ประกาศเกียรติคุณ",
                    supportingText:
                      "ประกาศเกียรติคุณโรงเรียนสวนกุหลาบวิทยาลัย ประจำปีการศึกษา 2563",
                  },
                },
              },
              {
                id: 1,
                type: "news",
                postDate: new Date(2020, 4, 12),
                image: "/images/dummybase/sk-teaching-practice.webp",
                content: {
                  "en-US": {
                    title: "SK Teaching Practice",
                    supportingText:
                      "The stories we’re about to tell might seem small, but can go a long way in creating an enjoyable \
                  environment for teachers and students alike.",
                  },
                  th: {
                    title: "การบริหารจัดการชั้นเรียน",
                    supportingText:
                      "เรื่องที่พวกเราจะเล่านั้น เป็นเพียงประเด็นเล็กๆ ที่ใช้บริหารจัดการชั้นเรียนได้อยู่หมัด มันดึงความสนใจของเด็กน้อยจากมือถือได้ \
                  แถมมีเสียงหัวเราะเกิดขึ้นในชั้นเรียน นักเรียนได้ค้นคว้าได้ทดลอง ได้ฝึกปฏิบัติ กิจกรรมเหล่านี้ส่งเสริมให้นักเรียนเกิดทักษะการคิดและแลกเปลี่ยนเรียนรู้ร่วมกัน \
                  ทำให้นักเรียนมีความสุขสนุกสนานในการเรียนและเกิดทักษะการรวบรวมข้อมูล คิดอย่างเป็นระบบสร้างเป็นองค์ความรู้ที่ยั่งยืนได้อย่างแท้จริง",
                  },
                },
              },
            ],
          }}
        />
      </div>
    </>
  );
}

Landing.getLayout = (page: NextPage): JSX.Element => (
  <Layout transparentNav>{page}</Layout>
);

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "landing"])),
  },
});
