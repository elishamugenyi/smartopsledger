type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const containerClassName = isCenter
    ? "flex w-full flex-col items-center text-center"
    : "text-left";

  return (
    <div className={containerClassName}>
      {eyebrow ? (
        <div
          className={`mb-3 inline-flex rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary ${
            isCenter ? "justify-center" : ""
          }`}
        >
          {eyebrow}
        </div>
      ) : null}
      <h2
        className={`max-w-3xl text-3xl font-black tracking-tight text-foreground md:text-5xl ${
          isCenter ? "mx-auto" : ""
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 max-w-2xl text-base leading-7 text-muted-foreground ${isCenter ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
