/** Props for StatsSection. */
interface StatsSectionProps {
  /** SCSS module styles from the parent page. */
  styles: Record<string, string>;
}

/** Single stat display item. */
interface StatItem {
  /** Display value for the stat. */
  value: string;
  /** Label describing the stat. */
  label: string;
}

const STATS: readonly StatItem[] = [
  { value: '100%', label: 'Uptime' },
  { value: '0', label: 'Security Issues' },
  { value: '\u221E', label: 'Scalability' },
];

/**
 * Stats row showing key metrics.
 * @param props - Component props.
 * @returns The stats section JSX.
 */
export default function StatsSection(
  { styles }: StatsSectionProps,
) {
  return (
    <section
      className={styles.stats}
      data-testid="stats-section"
    >
      {STATS.map((s) => (
        <div key={s.label} className={styles.stat}>
          <div className={styles.stat__value}>
            {s.value}
          </div>
          <div className={styles.stat__label}>
            {s.label}
          </div>
        </div>
      ))}
    </section>
  );
}
