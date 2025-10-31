export default function Avatar({
  src,
  alt = "",
  size = 24,
}: {
  src?: string;
  alt?: string;
  size?: number;
}) {
  if (!src)
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full border border-neutral-300"
      />
    );
  // eslint-disable-next-line jsx-a11y/alt-text
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full object-cover"
    />
  );
}
