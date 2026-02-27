interface OtpInputGroupProps {
  idPrefix: string;
  value: string[];
  onChange: (index: number, value: string) => void;
}

export const OtpInputGroup = ({
  idPrefix,
  value,
  onChange,
}: OtpInputGroupProps) => (
  <div className="mb-4 flex items-center justify-center gap-2">
    {value.map((digit, index) => (
      <input
        key={`${idPrefix}-${index}`}
        id={`${idPrefix}-${index}`}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={digit}
        onChange={(event) => onChange(index, event.target.value)}
        className="h-11 w-11 rounded-md border border-neutral-20 text-center text-lg outline-none focus:border-primary"
      />
    ))}
  </div>
);

