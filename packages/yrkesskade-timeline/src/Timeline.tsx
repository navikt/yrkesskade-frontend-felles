import React, { createContext, ReactElement } from 'react';
import TimelineEntry from './TimelineEntry';
import './Timeline.less';

type Props = {
    children: ReactElement[];
    timeformat?: string;
};

interface TimelineContextProps {
    timeformat: string;
}

export const TimelineContext = createContext<TimelineContextProps>({
    timeformat: 'dd.MM.yyyy HH:mm',
});

const Timeline = ({ children, timeformat }: Props) => {
    return (
        <TimelineContext.Provider
            value={{
                timeformat: timeformat ? timeformat : 'dd.MM.yyyy HH:mm',
            }}
        >
            <div className="timeline">{children}</div>
        </TimelineContext.Provider>
    );
};

Timeline.Entry = TimelineEntry;

export default Timeline;
