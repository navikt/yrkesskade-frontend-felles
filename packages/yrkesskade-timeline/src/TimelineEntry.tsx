/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import { format } from 'date-fns';
import { TimelineContext } from './Timeline';

type Props = {
    header: string;
    details?: string;
    selected?: boolean;
    date: Date;
};

const TimelineEntry = ({ header, details, date, selected = false }: Props) => {
    const context = useContext(TimelineContext);
    return (
        <div className="timeline-entry">
            <div className="timeline-icons">
                <div className="timeline-entry-circle">
                    <div className={`timeline-entry-circle-outer  ${selected ? 'selected' : ''}`}>
                        <div className="timeline-entry-circle-inner"></div>
                    </div>
                </div>
                <div className="timeline-entry-path"></div>
            </div>

            <div className="timeline-entry-text">
            <div className="header">{header}</div>
            <div className="date">{format(date, context.timeformat)}</div>
            { details && (
                <div className="details">{details}</div>
                )
            }
            </div>
        </div>
    );
};

export default TimelineEntry;
