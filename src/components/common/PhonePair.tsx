import styles from "./PhonePair.module.css";

type Phone = {
  display: string;
  href: string;
};

type PhonePairProps = {
  primary: Phone;
  secondary: Phone;
  linkClassName?: string;
  className?: string;
};

export function PhonePair({
  primary,
  secondary,
  linkClassName,
  className,
}: PhonePairProps) {
  return (
    <div className={`${styles.phonePair} ${className ?? ""}`.trim()}>
      <a href={primary.href} className={linkClassName}>
        {primary.display}
      </a>
      <a href={secondary.href} className={linkClassName}>
        {secondary.display}
      </a>
    </div>
  );
}
