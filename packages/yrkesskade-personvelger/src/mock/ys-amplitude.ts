/* eslint-disable @typescript-eslint/consistent-type-assertions */
import amplitude from 'amplitude-js';

export default <amplitude.AmplitudeClient>{
    logEvent: (event: string, data?: any) => {
        console.log(`${event}: ${JSON.stringify(data)}`, { event, data });
    },
    setUserProperties: (userProps: object) => {
        console.log(`set userprops: ${JSON.stringify(userProps)}`);
    },
};
