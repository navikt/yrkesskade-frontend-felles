import React from 'react';
import {
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    FormatQuote,
    LooksOne,
    LooksTwo,
    FormatListBulleted,
    FormatListNumbered,
    FormatAlignLeft,
    FormatAlignRight,
    FormatClear,
} from '@mui/icons-material';

// format_align_left
// format_align_right

interface BaseProps {
    className: string;
    [key: string]: unknown;
}

export const Ikon = (className, ...props): BaseProps => {
    let dynamicIcon;
    switch (className.children) {
        case 'format_bold':
            dynamicIcon = <FormatBold />;
            break;
        case 'format_italic':
            dynamicIcon = <FormatItalic />;
            break;
        case 'format_underlined':
            dynamicIcon = <FormatUnderlined />;
            break;
        case 'format_quote':
            dynamicIcon = <FormatQuote />;
            break;
        case 'format_clear':
            dynamicIcon = <FormatClear />;
            break;
        case 'looks_one':
            dynamicIcon = <LooksOne />;
            break;
        case 'looks_two':
            dynamicIcon = <LooksTwo />;
            break;
        case 'format_list_numbered':
            dynamicIcon = <FormatListNumbered />;
            break;
        case 'format_list_bulleted':
            dynamicIcon = <FormatListBulleted />;
            break;
        case 'format_align_left':
            dynamicIcon = <FormatAlignLeft />;
            break;
        case 'format_align_right':
            dynamicIcon = <FormatAlignRight />;
            break;
        default:
            dynamicIcon = <LooksOne />;
            break;
    }
    return dynamicIcon;
    // return <Icon>{className.children}</Icon>;
};
