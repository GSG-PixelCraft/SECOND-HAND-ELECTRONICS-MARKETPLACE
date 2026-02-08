export default function Dots() {
  return (
    <span className="flex gap-1">
      <span className="h-1 w-1 animate-bounce rounded-full bg-secondary [animation-delay:-0.2s]" />
      <span className="h-1 w-1 animate-bounce rounded-full bg-secondary [animation-delay:-0.1s]" />
      <span className="h-1 w-1 animate-bounce rounded-full bg-secondary" />
    </span>
  );
}
