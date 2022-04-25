import { TextFieldProps } from '@navikt/ds-react';

export interface DagvelgerProps extends TextFieldProps, Omit<TextFieldProps, 'type'> {
    onDatoChange: (dato: Date | undefined) => void;
    format?: string;
}
