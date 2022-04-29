import React, { ChangeEventHandler, useRef, useState, FocusEvent } from 'react';
import { Button, Label, TextField } from '@navikt/ds-react';
import { DagvelgerProps } from './DagvelgerProps';
import { format, isValid, parse } from 'date-fns';
import FocusTrap from 'focus-trap-react';
import { ClassNames, DayPicker, DayPickerProps } from 'react-day-picker';
import { usePopper } from 'react-popper';
import 'react-day-picker/dist/style.css';
import styles from 'react-day-picker/dist/style.module.css';
import './Dagvelger.less';
import nb from 'date-fns/locale/nb';
import { Calender } from '@navikt/ds-icons';

export const Dagvelger: React.FC<
    React.HTMLAttributes<HTMLInputElement> & DagvelgerProps & DayPickerProps
> = props => {
    const FORMAT = 'dd.MM.yyyy';
    const possibleInputFormat = ['ddMMyy', 'ddMMyyyy', FORMAT];
    const datoformat = props.format || FORMAT;
    const [selected, setSelected] = useState<Date>();
    const [inputValue, setInputValue] = useState<string>('');
    const [isPopperOpen, setIsPopperOpen] = useState(false);

    const popperRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

    const dayPickerClassNames: ClassNames = {
        ...styles,
        root: 'navds-day-picker-overlay',
        // eslint-disable-next-line @typescript-eslint/camelcase
        day_selected: 'navds-day-picker-selected',
    };

    const popper = usePopper(popperRef.current, popperElement, {
        placement: 'bottom-start',
    });

    const closePopper = () => {
        setIsPopperOpen(false);
        buttonRef?.current?.focus();
    };

    const parseInputToDate = (input: string): Date | undefined => {
        for (let i = 0; i < possibleInputFormat.length; i++) {
            const format = possibleInputFormat[i];
            const date = parse(input, format, new Date());

            if (isValid(date)) {
                return date;
            }
        }

        return undefined;
    };

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = e => {
        const value = e.currentTarget.value;
        setInputValue(value);
        if (value.length === 6 || value.length === 8 || value.length === 10) {
            const date = parseInputToDate(value);

            if (isValid(date)) {
                setSelected(date);
                props.onDatoChange(date);
            } else {
                setSelected(undefined);
                props.onDatoChange(undefined);
            }
        }
    };

    const handleClick = () => {
        setIsPopperOpen(true);
    };

    const handleFormatOnBlur = (e: FocusEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        if (value.length === 6 || value.length === 8 || value.length === 10) {
            const date = parseInputToDate(value);

            if (date && isValid(date)) {
                const input = format(date, FORMAT, { locale: props.locale });
                setInputValue(input);
            }
        }
    };

    const handleDaySelect = (date: Date | undefined) => {
        setSelected(date);
        props.onDatoChange(date);
        if (date) {
            setInputValue(format(date, datoformat));
            closePopper();
        } else {
            setInputValue('');
        }
    };

    return (
        <div className="navds-dagvelger">
            <div>
                {!props.hideLabel && <Label>{props.label}</Label>}
                <div
                    ref={popperRef}
                    className={`input-container ${props.hideLabel ? 'no-label' : ''}`}
                >
                    <TextField
                        {...props}
                        hideLabel
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleFormatOnBlur}
                        className="dato-felt"
                    />
                    <Button onClick={handleClick} size="small" variant="secondary">
                        <Calender />
                    </Button>
                </div>
            </div>
            {isPopperOpen && (
                <FocusTrap
                    active
                    focusTrapOptions={{
                        initialFocus: false,
                        allowOutsideClick: true,
                        clickOutsideDeactivates: true,
                        onDeactivate: closePopper,
                    }}
                >
                    <div
                        tabIndex={-1}
                        style={popper.styles.popper}
                        className="dialog-sheet"
                        {...popper.attributes.popper}
                        ref={setPopperElement}
                        role="dialog"
                    >
                        <DayPicker
                            {...props}
                            classNames={dayPickerClassNames}
                            initialFocus={isPopperOpen}
                            mode="single"
                            defaultMonth={selected}
                            selected={selected}
                            onSelect={handleDaySelect}
                            locale={props.locale || nb}
                        />
                    </div>
                </FocusTrap>
            )}
        </div>
    );
};
