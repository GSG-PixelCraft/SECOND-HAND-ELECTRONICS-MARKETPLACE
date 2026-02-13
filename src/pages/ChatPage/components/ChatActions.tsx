export default function ChatActions({ text }: { text: string }) {
  return (
    <div className="my-4 flex items-center">
      <div className="bg-border h-px flex-1" />
      <span className="whitespace-nowrap text-label text-muted-foreground">
        {text}
      </span>
      <div className="bg-border h-px flex-1" />
    </div>
  );
}
