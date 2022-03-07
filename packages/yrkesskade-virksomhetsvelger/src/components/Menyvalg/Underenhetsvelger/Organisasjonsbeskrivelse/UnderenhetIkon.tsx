import React from 'react';

interface Props {
    classname: string;
}

const UnderenhetIkon = ({ classname }: Props) => (
    <div className={classname}>
        <svg
            width="12px"
            height="17px"
            version="1"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
        >
            <title>Bedrift</title>
            <g
                stroke="#000"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M11 16H1V1h10z" />
                <path d="M6 13H3v3h3zM1 3h4M1 5h3M1 7h2" />
            </g>
        </svg>
    </div>
);

export default UnderenhetIkon;
