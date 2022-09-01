import React, { PropsWithChildren } from 'react';
import { cx, css } from '@emotion/css';

interface BaseProps {
    className: string;
    [key: string]: unknown;
}

export const Button = React.forwardRef(
    ({
        className,
        active,
        reversed,
        ...props
    }: PropsWithChildren<
        {
            active: boolean;
            reversed: boolean;
        } & BaseProps
    >) => (
        <span
            {...props}
            // ref={ref}
            className={cx(
                className,
                css`
                    cursor: pointer;
                    color: ${reversed ? (active ? 'white' : '#aaa') : active ? 'black' : '#ccc'};
                `,
            )}
        />
    ),
);
