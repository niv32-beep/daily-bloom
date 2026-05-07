import { useEffect, useState } from "react";

export function ClientDate({
  iso,
  options,
  className,
}: {
  iso: string;
  options?: Intl.DateTimeFormatOptions;
  className?: string;
}) {
  const [text, setText] = useState("");
  useEffect(() => {
    setText(new Date(iso).toLocaleString(undefined, options));
  }, [iso, options]);
  return <span className={className} suppressHydrationWarning>{text}</span>;
}
