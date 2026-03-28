/** Props for FeaturesSection. */
interface FeaturesSectionProps {
  /** SCSS module styles from the parent page. */
  styles: Record<string, string>;
}

/** Single feature card data. */
interface FeatureItem {
  /** Icon emoji for display. */
  icon: string;
  /** Feature title. */
  title: string;
  /** Feature description text. */
  description: string;
}

const FEATURES: readonly FeatureItem[] = [
  {
    icon: '\uD83D\uDD12',
    title: 'Secure by Design',
    description:
      'Content-addressed storage with SHA256'
      + ' verification on every upload',
  },
  {
    icon: '\u26A1',
    title: 'Lightning Fast',
    description:
      'Built-in caching and intelligent indexing'
      + ' for rapid package retrieval',
  },
  {
    icon: '\uD83D\uDCCB',
    title: 'Schema-Driven',
    description:
      'Declarative repository configuration'
      + ' with automatic validation',
  },
];

/**
 * Features grid showing key product capabilities.
 * @param props - Component props.
 * @returns The features section JSX.
 */
export default function FeaturesSection(
  { styles }: FeaturesSectionProps,
) {
  return (
    <section
      className={styles.features}
      data-testid="features-section"
    >
      {FEATURES.map((f) => (
        <div key={f.title} className={styles.feature}>
          <div className={styles.feature__icon}>
            {f.icon}
          </div>
          <h3 className={styles.feature__title}>
            {f.title}
          </h3>
          <p className={styles.feature__description}>
            {f.description}
          </p>
        </div>
      ))}
    </section>
  );
}
