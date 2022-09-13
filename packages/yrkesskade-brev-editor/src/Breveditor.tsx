import React, { useCallback, useMemo } from 'react';
import { ReactEditor, Slate, withReact, Editable, useSlate, RenderLeafProps, RenderElementProps } from 'slate-react';
import {
    BaseEditor,
    createEditor,
    Transforms,
    Element as SlateElement,
    Editor,
    Text,
} from 'slate';
import { withHistory, HistoryEditor } from 'slate-history';
import isHotkey from 'is-hotkey';
import { Button } from './components/Button';
import { Ikon } from './components/Icon';
import { Toolbar } from './components/Toolbar';
import './Breveditor.less';

import { Heading, BodyLong } from '@navikt/ds-react';

export type CustomElement = { [key: string]: any, type: 'paragraph'; align?: string; children: CustomText[] };
export type CustomHeading = { [key: string]: any, type: 'heading'; align?: string; children: CustomText[] };
export type CustomQuote = { [key: string]: any, type: 'block-quote'; align?: string; children: CustomText[] };
export type CustomList = { [key: string]: any, type: 'list-item'; align?: string; children: CustomText[]};
export type CustomText = {
    key: string;
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    light?: boolean;
    change?: boolean;
    clear?: boolean
};

type ElementTypes = 'paragraph' | 'heading' | 'block-quote' | 'list-item' | undefined;

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor;
        Element: CustomElement | CustomHeading | CustomQuote | CustomList;
        Text: CustomText;
    }
}

interface Props {
    mal: [];
    onBrevChanged: any;
}

const HOTKEYS: { [key: string]: string } = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+l': 'light',
    'mod+c': 'change',
    'mod+k': 'clear',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'right'];

export const Breveditor = ({ onBrevChanged, mal }: Props) => {
    const renderElement = useCallback(
        (props: JSX.IntrinsicAttributes & RenderElementProps) => (
            <Element {...props} />
        ),
        [],
    );
    const renderLeaf = useCallback(
        (props: JSX.IntrinsicAttributes & RenderLeafProps) => (
            <Leaf {...props} />
        ),
        [],
    );
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    return (
        <div className="breveditor">
            <Slate editor={editor} value={mal} onChange={onBrevChanged}>
                <Toolbar>
                    <div>
                        <MarkButton format="bold" icon="format_bold" />
                        <MarkButton format="italic" icon="format_italic" />
                        <MarkButton format="underline" icon="format_underlined" />
                        <BlockButton format="block-quote" icon="format_quote" />
                        <MarkButton format="light" icon="format_color_reset" />
                        <MarkButton format="clear" icon="format_clear" />
                    </div>
                    <div>
                        <BlockButton format="heading-one" icon="looks_one" />
                        <BlockButton format="heading-two" icon="looks_two" />
                    </div>
                    <div>
                        <BlockButton format="numbered-list" icon="format_list_numbered" />
                        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
                        <BlockButton format="left" icon="format_align_left" />
                        <BlockButton format="right" icon="format_align_right" />
                    </div>
                </Toolbar>
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Skriv et brev"
                    spellCheck
                    // autoFocus
                    onKeyDown={event => {
                        for (const hotkey in HOTKEYS) {
                            if (isHotkey(hotkey, event as any)) {
                                event.preventDefault();
                                const mark = HOTKEYS[hotkey];
                                toggleMark(editor, mark);
                            }
                        }
                    }}
                />
            </Slate>
        </div>
    );
};

const toggleBlock = (editor: Editor, format: string) => {
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
    );
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type) &&
            !TEXT_ALIGN_TYPES.includes(format),
        split: true,
    });
    let newProperties: Partial<SlateElement>;
    if (TEXT_ALIGN_TYPES.includes(format)) {
        newProperties = {
            align: isActive ? undefined : format,
        };
    } else {
        const type = isActive ? 'paragraph' : isList ? 'list-item' : format;
        newProperties = {
            type: type as ElementTypes
        };
    }
    Transforms.setNodes<SlateElement>(editor, newProperties);

    if (!isActive && isList) {
        const block: any = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
};

const toggleMark = (editor: Editor, format: string) => {
    const isActive = isMarkActive(editor, format);
    if (format === 'clear') {
        // remove all styles
        Transforms.setNodes(
            editor,
            { bold: false, italic: false, underline: false, change: false, light: false },
            { match: Text.isText },
        );
        // make it a paragrah
        Transforms.setNodes(editor, { type: 'paragraph', align: 'left' });
    } else if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isBlockActive = (editor: Editor, format: string, blockType: string = 'type') => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
        }),
    );

    return !!match;
};

const isMarkActive = (editor: Editor, format: string) => {
    const marks: any = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }: any) => {
    const style = { textAlign: element.align };
    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote style={style} {...attributes}>
                    {children}
                </blockquote>
            );
        case 'bulleted-list':
            return (
                <ul style={style} {...attributes}>
                    {children}
                </ul>
            );
        case 'heading-one':
            return (
                <Heading level="1" size="xlarge" style={style} {...attributes}>
                    {children}
                </Heading>
            );
        case 'heading-two':
            return (
                <Heading level="2" size="large" style={style} {...attributes}>
                    {children}
                </Heading>
            );
        case 'list-item':
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            );
        case 'numbered-list':
            return (
                <ol style={style} {...attributes}>
                    {children}
                </ol>
            );
        default:
            return (
                <BodyLong style={style} {...attributes}>
                    {children}
                </BodyLong>
            );
    }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }

    if (leaf.italic) {
        children = <em>{children}</em>;
    }

    if (leaf.underline) {
        children = <u>{children}</u>;
    }
    if (leaf.change) {
        children = <span className="red">{children}</span>;
    }
    if (leaf.light) {
        children = <span className="light">{children}</span>;
    }
    if (leaf.clear) {
        <BodyLong {...attributes}>{children}</BodyLong>;
    }

    return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }: { format: string; icon: string }) => {
    const editor = useSlate();
    return (
        <Button
            active={isBlockActive(
                editor,
                format,
                TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
            )}
            onMouseDown={(event: { preventDefault: () => void }) => {
                event.preventDefault();
                toggleBlock(editor, format);
            }}
        >
            <Ikon className={icon} />
        </Button>
    );
};

const MarkButton = ({ format, icon }: { format: string; icon: string }) => {
    const editor = useSlate();
    return (
        <Button
            active={isMarkActive(editor, format)}
            onMouseDown={(event: { preventDefault: () => void }) => {
                event.preventDefault();
                toggleMark(editor, format);
            }}
        >
            <Ikon className={icon} />
        </Button>
    );
};
