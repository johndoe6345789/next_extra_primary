import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import s from './page.module.scss';

/** Props for the about page. */
interface AboutPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Static about page describing the platform.
 *
 * Provides information about ExtraPrimary's
 * mission, features, and team within a
 * readable container layout.
 *
 * @param props - Page props with locale params.
 * @returns About page UI.
 */
export default async function AboutPage({
  params,
}: AboutPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <div
      className={s.root}
      role="main"
      aria-label={t('title')}
    >
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <p>{t('description2')}</p>
      <h2>{t('missionTitle')}</h2>
      <p>{t('mission')}</p>
    </div>
  );
}
