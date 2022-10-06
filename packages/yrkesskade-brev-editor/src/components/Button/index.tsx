import React, { PropsWithChildren } from 'react';
import { cx, css } from '@emotion/css';

type Props = PropsWithChildren<{ active: boolean; reversed: boolean }>;
interface BaseProps {
    className: string;
    [key: string]: unknown;
}

export type Ref = HTMLSpanElement;

export const Button = React.forwardRef<Ref, Props & BaseProps>(
    ({ className, active, reversed, ...props }: Props & BaseProps, ref) => (
        <span
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
                    cursor: pointer;
                    color: ${reversed ? (active ? 'white' : 'black') : active ? 'white' : 'black'};
                    background-color: ${reversed
                        ? active
                            ? 'black'
                            : 'transparent'
                        : active
                        ? 'black'
                        : 'transparent'};
                    border-radius: 1px;
                    padding: 0.5rem;
                `,
            )}
        />
    ),
);
