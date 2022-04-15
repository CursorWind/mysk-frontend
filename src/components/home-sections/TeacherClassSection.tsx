// Modules
import { isThisYear } from "date-fns";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// SK Components
import {
  ChipFilterList,
  Header,
  MaterialIcon,
  Section,
  XScrollContent,
  LinkButton,
  Card,
  CardHeader,
} from "@suankularb-components/react";

// Types
import { StudentForm } from "@utils/types/news";

// Helpers
import { useRouter } from "next/router";

const TeacherClassSection = ({
  studentForms: forms,
}: {
  studentForms: Array<StudentForm>;
}): JSX.Element => {
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
  const { t } = useTranslation(["dashboard", "news"]);
  const [newsFilter, setNewsFilter] = useState<Array<string>>([]);
  const [filteredNews, setFilteredNews] = useState<Array<StudentForm>>(forms);

  useEffect(
    () => {
      // TODO: Filter forms here
    },

    // Adding `forms` as a dependency causes an inifinie loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newsFilter]
  );

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="newspaper" allowCustomSize={true} />}
        text={t("news.title")}
      />
      <ChipFilterList
        choices={[
          { id: "form", name: t("news.filter.forms") },
          { id: "payment", name: t("news.filter.payments") },
          [
            { id: "few-done", name: t("news.filter.amountDone.fewDone") },
            { id: "most-done", name: t("news.filter.amountDone.mostDone") },
            { id: "all-done", name: t("news.filter.amountDone.allDone") },
          ],
        ]}
        onChange={(newFilter: Array<string>) => setNewsFilter(newFilter)}
        scrollable={true}
      />
      {filteredNews.length == 0 ? (
        <ul className="px-4">
          <li className="grid h-[13.75rem] place-content-center rounded-xl bg-surface-1 text-center text-on-surface">
            {t("news.noRelevantNews")}
          </li>
        </ul>
      ) : (
        <XScrollContent>
          {filteredNews.map((newsItem) => (
            <li key={newsItem.id}>
              <Card type="horizontal">
                <CardHeader
                  // Title
                  title={
                    <h3 className="text-lg font-bold">
                      {newsItem.content[locale]?.title ||
                        newsItem.content.th.title}
                    </h3>
                  }
                  // Type and post date
                  label={
                    <div className="flex divide-x divide-outline">
                      <span className="pr-2">
                        {t(`itemType.${newsItem.type}`, { ns: "news" })}
                      </span>
                      <time className="pl-2 text-outline">
                        {newsItem.postDate.toLocaleDateString(locale, {
                          year: isThisYear(newsItem.postDate)
                            ? undefined
                            : "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  }
                  // Completion and link
                  end={
                    <div className="flex flex-row items-center gap-2">
                      <div className="container-tertiary rounded-lg py-2 px-3 font-sans font-bold">
                        {newsItem.percentDone}%
                      </div>
                      <LinkButton
                        name={t("action.seeDetails", { ns: "news" })}
                        type="tonal"
                        iconOnly
                        icon={<MaterialIcon icon="arrow_forward" />}
                        url={`/${newsItem.type}/${newsItem.id}`}
                        LinkElement={Link}
                      />
                    </div>
                  }
                  className="font-display"
                />
              </Card>
            </li>
          ))}
        </XScrollContent>
      )}
      <div className="flex flex-row items-center justify-end gap-2">
        <LinkButton
          label={t("news.action.seeAll")}
          type="filled"
          url="/news"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

export default TeacherClassSection;
