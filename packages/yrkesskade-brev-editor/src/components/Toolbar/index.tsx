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
                    margin: 0 0;
                    border-bottom: 1px solid black;
                    display: flex;
                    align-items: center;
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
                        display: inline-flex;
                        border-right: 1px solid black;
                        align-items: center;
                        padding: 10px;
                    }
                    & > div:last-of-type {
                        border-right: 1px solid transparent;
                    }
                    & > div > span {
                        display: inline-flex;
                        line-height: 1;
                        align-items: center;
                    }
                    & > div > span + span {
                        margin-left: 15px;
                    }
                    & > div > span + span:last-of-type {
                        margin-right: 15px;
                    }
                `,
            )}
        />
    ),
);
