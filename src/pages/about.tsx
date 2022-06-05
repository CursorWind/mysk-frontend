// Modules
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Header,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import ContactIcon from "@components/icons/ContactIcon";
import ProfilePicture from "@components/ProfilePicture";

// Types
import { ContactVia } from "@utils/types/contact";

const DevelopersBanner = (): JSX.Element => (
  <Section>
    <div>
      <div className="container-secondary flex flex-col gap-x-6 overflow-hidden rounded-2xl sm:grid-cols-2 md:grid">
        {/* Text */}
        <div className="m-4 flex flex-col gap-4">
          {/* Title */}
          <section className="flex flex-col gap-2 font-display leading-none">
            <p className="text-lg">The 2022 version of MySK is maintained by</p>
            <p className="text-4xl font-medium">
              Suankularb{" "}
              <span
                className="bg-gradient-to-br from-primary to-tertiary font-extrabold text-tertiary
                  [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
              >
                Tech
              </span>
              nology and{" "}
              <span
                className="bg-gradient-to-br from-tertiary to-primary font-extrabold text-tertiary
                  [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
              >
                Dev
              </span>
              elopment Club
            </p>
          </section>
          {/* Development led by */}
          <section>
            <h3 className="font-display text-xl font-medium leading-snug">
              Development led by
            </h3>
            <ul className="flex flex-col gap-x-6 font-sans sm:grid sm:grid-cols-2">
              <li>Tempoom Leelacharoen</li>
              <li>Sadudee Theparree</li>
              <li>Smart Wattanapornmongkol</li>
              <li>Siravit Phokeed</li>
            </ul>
          </section>
          {/* With advice from */}
          <section>
            <h3 className="font-display text-xl font-medium leading-snug">
              With advice from
            </h3>
            <ul className="flex flex-col gap-x-6 font-sans sm:grid sm:grid-cols-2">
              <li>Supannee Supeerath</li>
              <li>Atipol Sukrisadanon</li>
            </ul>
          </section>
        </div>

        {/* Image */}
        <div className="flex flex-row items-end justify-center sm:justify-end sm:px-6 md:justify-center">
          <Image
            src="/images/core-team.png"
            height={256}
            width={433.5}
            alt="A group photo of the SK Core Team."
          />
        </div>
      </div>
    </div>
  </Section>
);

const ContactDevelopers = (): JSX.Element => (
  <Section>
    <Header
      icon={<MaterialIcon icon="badge" allowCustomSize />}
      text="Contact developers"
    />
    <p>
      Found issues with the website? Contact the developers in the field you are
      having trouble with below. Alternatively, check out{" "}
      <a
        className="link"
        href="https://github.com/suankularb-wittayalai-school"
        target="_blank"
        rel="noreferrer"
      >
        our GitHub organization
      </a>
      .
    </p>
    <PeopleList
      people={[
        {
          name: {
            th: "เต็มภูมิ ลีลาเจริญ",
            "en-US": "Tempoom Leela­charoen",
          },
          profile: "/images/developers/tempoom.png",
          jobDescs: [
            {
              th: "วิศวกรประกันคุณภาพ",
              "en-US": "Quality assurance engineer",
            },
            {
              th: "ผู้พัฒนาฐานข้อมูล",
              "en-US": "Backend developer",
            },
          ],
          contacts: [
            { type: "Email", url: "mailto:tempoom.lee@student.sk.ac.th" },
            {
              type: "GitHub",
              url: "https://github.com/orgs/suankularb-wittayalai-school/people/Temp9699",
            },
          ],
        },
        {
          name: {
            th: "สดุดี เทพอารีย์",
            "en-US": "Sadudee Theparree",
          },
          profile: "/images/developers/sadudee.png",
          jobDescs: [
            {
              th: "ผู้พัฒนาฐานเว็บไซต์",
              "en-US": "Frontend developer",
            },
          ],
          contacts: [
            { type: "Email", url: "mailto:sadudee.the@student.sk.ac.th" },
            {
              type: "GitHub",
              url: "https://github.com/orgs/suankularb-wittayalai-school/people/IHasDiabetes",
            },
            { type: "Website", url: "https://imsad.dev" },
          ],
        },
        {
          name: {
            th: "สมัชญ์ วัฒนพรมงคล",
            "en-US": "Smart Wattana­porn­mongkol",
          },
          profile: "/images/developers/smart.png",
          jobDescs: [
            {
              th: "นักออกแบบสถาปัตยกรรมฐานข้อมูล",
              "en-US": "Database architecture engineer",
            },
            {
              th: "ผู้พัฒนาฐานข้อมูล",
              "en-US": "Backend developer",
            },
          ],
          contacts: [
            { type: "Email", url: "mailto:smart.wat@student.sk.ac.th" },
            {
              type: "GitHub",
              url: "https://github.com/orgs/suankularb-wittayalai-school/people/Jimmy-Tempest",
            },
            { type: "Website", url: "https://smartwatt.me" },
          ],
        },
        {
          name: {
            th: "ศิรวิทย์ โพธิ์ขีด",
            "en-US": "Siravit Phokeed",
          },
          profile: "/images/developers/siravit.png",
          jobDescs: [
            {
              th: "นักออกแบบเว็บไซต์",
              "en-US": "UI/UX designer",
            },
            {
              th: "ผู้พัฒนาฐานเว็บไซต์",
              "en-US": "Frontend developer",
            },
          ],
          contacts: [
            { type: "Email", url: "mailto:siravit.pho@student.sk.ac.th" },
            { type: "Line", url: "https://line.me/ti/p/~siravitphokeed-sk" },
            {
              type: "GitHub",
              url: "https://github.com/orgs/suankularb-wittayalai-school/people/SiravitPhokeed",
            },
            { type: "Website", url: "https://siravit-p.vercel.app" },
          ],
        },
      ]}
    />
  </Section>
);

const ContactAdvisors = (): JSX.Element => (
  <Section>
    <Header
      icon={<MaterialIcon icon="supervised_user_circle" allowCustomSize />}
      text="Contact advisors"
    />
    <p>
      For more sensitive questions and concerns, please contact our advisors
      instead.
    </p>
    <PeopleList
      people={[
        {
          name: {
            th: "สุพรรณี สุพีรัตน์",
            "en-US": "Supannee Supeerath",
          },
          jobDescs: [
            {
              th: "ที่ปรึกษา",
              "en-US": "Advisor",
            },
          ],
          contacts: [{ type: "Email", url: "mailto:supannee@sk.ac.th" }],
        },
        {
          name: {
            th: "อติพล สุกฤษฎานนท์",
            "en-US": "Atipol Sukrisadanon",
          },
          jobDescs: [
            {
              th: "ที่ปรึกษา",
              "en-US": "Advisor",
            },
          ],
          contacts: [
            { type: "Email", url: "mailto:atipol.suk@sk.ac.th" },
            { type: "Line", url: "https://line.me/ti/p/~zsakez" },
            { type: "Phone", url: "tel:+66614166498" },
          ],
        },
      ]}
    />
  </Section>
);

const PeopleList = ({
  people,
}: {
  people: {
    name: { th: string; "en-US"?: string };
    profile?: string;
    jobDescs: { th: string; "en-US"?: string }[];
    contacts: { type: ContactVia; url: string }[];
  }[];
}): JSX.Element => {
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <ul className="layout-grid-cols-3 sm:my-4">
      {people.map((person) => (
        <li key={person.name.th} className="grid grid-cols-4 gap-x-6">
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-xl">
              <ProfilePicture src={person.profile} />
            </div>
          </div>
          <div className="col-span-3">
            <h3 className="font-display text-xl font-bold leading-snug">
              {person.name[locale] || person.name.th}
            </h3>
            <ul>
              {person.jobDescs.map((jobDesc) => (
                <li key={jobDesc.th}>{jobDesc[locale] || jobDesc.th}</li>
              ))}
            </ul>
            <div className="my-2 flex w-fit flex-row gap-1 pr-1">
              {person.contacts.map((contact) => (
                <a
                  key={contact.url}
                  href={contact.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ContactIcon icon={contact.type} />
                </a>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

// Page
const Developers: NextPage = (): JSX.Element => {
  const { t } = useTranslation(["about", "common"]);

  return (
    <>
      <Head>
        <title>About developers - {t("brand.name", { ns: "common" })}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: "About developers" }}
            pageIcon="information"
            backGoesTo="/account/login"
            LinkElement={Link}
          />
        }
      >
        <DevelopersBanner />
        <ContactDevelopers />
        <ContactAdvisors />
      </RegularLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "about"])),
  },
});

export default Developers;
