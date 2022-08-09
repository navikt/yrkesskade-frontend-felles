import React, { useState } from 'react';
import { Timeline } from './src';

export default {
    title: 'Komponenter/Timeline',
    component: Timeline,
};

export const YrkesskadeTimeline: React.FC = () => {
    return (
        <div>
            <Timeline>
                <Timeline.Entry header="Innslag 1" date={new Date()} />
                <Timeline.Entry header="Innslag 2" date={new Date()} />
                <Timeline.Entry header="Final 2" date={new Date()} selected />
            </Timeline>
        </div>
    );
};
