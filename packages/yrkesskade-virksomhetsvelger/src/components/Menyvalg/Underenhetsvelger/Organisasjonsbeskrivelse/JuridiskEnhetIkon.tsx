import React from 'react';

interface Props {
    classname: string;
}

const JuridiskEnhetIkon = ({ classname }: Props) => (
    <div className={classname}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="25"
            viewBox="0 0 20 25"
            focusable="false"
        >
            <title>Juridisk enhet</title>
            <g
                fill="none"
                fillRule="evenodd"
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M11 24H1V9h10z" />
                <path d="M11 24V9H9V1h10v23z" />
                <path d="M17 21h-3v3h3zM6 21H3v3h3zM1 11h4M1 13h3M9 5h4M9 3h6M9 7h3M1 15h2" />
            </g>
        </svg>
    </div>
);

export default JuridiskEnhetIkon;
