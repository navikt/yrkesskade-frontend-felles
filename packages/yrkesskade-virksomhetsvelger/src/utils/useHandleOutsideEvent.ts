import { RefObject, useEffect } from 'react';

/** Run action if interaction happens outside the given node. */
export const useHandleOutsideEvent = (nodeRef: RefObject<HTMLDivElement>, action: () => void) => {
    const handleOutsideEvent = (e: MouseEvent | KeyboardEvent): void => {
        const node = nodeRef.current;
        if (node && node.contains(e.target as HTMLElement)) {
            return;
        }
        action();
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideEvent, false);
        document.addEventListener('keydown', handleOutsideEvent, false);
        return () => {
            document.removeEventListener('click', handleOutsideEvent, false);
            document.removeEventListener('keydown', handleOutsideEvent, false);
        };
    }, []);
};
