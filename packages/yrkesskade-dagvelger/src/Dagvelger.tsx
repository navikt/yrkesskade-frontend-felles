import React, { ChangeEventHandler, useRef, useState, KeyboardEvent, MouseEvent } from 'react';
import { TextField } from '@navikt/ds-react';
import { DagvelgerProps } from './DagvelgerProps';
import { format, isValid, parse } from 'date-fns';
import FocusTrap from 'focus-trap-react';
import { ClassNames, DayPicker, DayPickerProps } from 'react-day-picker';
import { usePopper } from 'react-popper';
import 'react-day-picker/dist/style.css';
import styles from 'react-day-picker/dist/style.module.css';
import './Dagvelger.less';
import nb from 'date-fns/locale/nb';

export const Dagvelger: React.FC<
    React.HTMLAttributes<HTMLInputElement> & DagvelgerProps & DayPickerProps
> = props => {
    const FORMAT = 'dd.MM.yyyy';
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

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = e => {
        setInputValue(e.currentTarget.value);
        const date = parse(e.currentTarget.value, datoformat, new Date());
        if (isValid(date)) {
            setSelected(date);
            props.onDatoChange(date);
        } else {
            setSelected(undefined);
            props.onDatoChange(undefined);
        }
    };

    const handleInputFocus = () => {
        setIsPopperOpen(true);
    };

    const handleEnterKeyIfInFocus = (event: KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        console.log('event: ', event);

        if (event.code === 'Enter' && document.activeElement === event.currentTarget) {
            setIsPopperOpen(true);
        }
    };

    const handleMouseClickedIfInFocus = (event: MouseEvent<HTMLInputElement>) => {
        event.preventDefault();

        if (document.activeElement === event.currentTarget) {
            setIsPopperOpen(true);
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
            <div ref={popperRef}>
                <TextField
                    {...props}
                    onFocus={handleInputFocus}
                    onKeyPress={handleEnterKeyIfInFocus}
                    onClick={handleMouseClickedIfInFocus}
                    value={inputValue}
                    onChange={handleInputChange}
                />
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
