import React, { PropsWithChildren } from 'react';
import { cx, css } from '@emotion/css';

interface BaseProps {
    className: string;
    [key: string]: unknown;
}
// type OrNull<T> = T | null;

export const Toolbar = React.forwardRef(
    (
        { className, ...props }: PropsWithChildren<BaseProps>, // ref: Ref<OrNull<HTMLDivElement>>
    ) => (
        <Menu
            {...props}
            // ref={ref}
            className={cx(
                className,
                css`
                    position: relative;
                    padding: 10px 18px;
                    margin: 0 0;
                    border-bottom: 1px solid black;
                    margin-bottom: 20px;
                `,
            )}
        />
    ),
);

export const Menu = React.forwardRef(
    (
        { className, ...props }: PropsWithChildren<BaseProps>, // ref: Ref<OrNull<HTMLDivElement>>
    ) => (
        <div
            {...props}
            // ref={ref}
            className={cx(
                className,
                css`
                    & > div {
                        margin-left: 15px;
                    }
                    & > div > * {
                        display: inline-block;
                    }
                    & > div > * + * {
                        margin-left: 15px;
                    }
                `,
            )}
        />
    ),
);
