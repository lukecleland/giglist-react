import { ReactNode } from 'react';

type Option = {value: string; label: string};
export const ShuffleControl = ({label, value, options, onChange, disabled = false, children}: {
    label: string; value: string; options: Option[]; onChange: (value: string) => void;
    disabled?: boolean; children: ReactNode;
}) => {
    const step = (direction: number) => {
        const current = options.findIndex(option => option.value === value);
        const index = current < 0 ? (direction > 0 ? 0 : options.length - 1) : (current + direction + options.length) % options.length;
        if (options[index]) onChange(options[index].value);
    };
    return <div className="poster-shuffle-control">
        <label className="poster-theme-label">{label}
            <select aria-label={label} value={value} disabled={disabled} onChange={event => onChange(event.target.value)}>
                {!options.some(option => option.value === value) && <option value={value} disabled>Custom combination</option>}
                {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
        </label>
        <div className="poster-shuffle-row">
            <button type="button" aria-label={`Previous ${label.toLowerCase()}`} disabled={disabled || options.length < 2} onClick={() => step(-1)}><svg aria-hidden="true" viewBox="0 0 16 16"><path d="M10 3 5 8l5 5" /></svg></button>
            {children}
            <button type="button" aria-label={`Next ${label.toLowerCase()}`} disabled={disabled || options.length < 2} onClick={() => step(1)}><svg aria-hidden="true" viewBox="0 0 16 16"><path d="m6 3 5 5-5 5" /></svg></button>
        </div>
    </div>;
};
