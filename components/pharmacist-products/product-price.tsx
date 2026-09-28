

type PriceCodeProps = React.HTMLAttributes<HTMLSpanElement>;

export function PriceCode({ className}: PriceCodeProps) {
    return (
        <span className={className ?? "text-xs"} >
            ل.س
        </span>
    );
}
