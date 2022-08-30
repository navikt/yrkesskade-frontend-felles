/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { NoFlickerReloadPdf } from './NoFlickerDocument';
import {
    Container,
    Header,
    HeaderSubContainer,
    StyledDocumentTitle,
    StyledHeaderButton,
    StyledHeaderLink,
} from './styled-components';
import { ZoomIn, ZoomOut, ExternalLink, Close, Print } from '@navikt/ds-icons';
import { b64ToBlobUrl } from './blobUtil';

const MIN_PDF_WIDTH = 400;
const ZOOM_STEP = 150;
const MAX_PDF_WIDTH = MIN_PDF_WIDTH + ZOOM_STEP * 10;

const PDF_WITH_LOCAL_STORAGE_KEY = 'documentWidth';

interface DokumentviserProps extends React.HTMLAttributes<HTMLElement> {
    url: string;
    tittel: string;
    close: () => void;
}

export const Dokumentviser = ({ url, tittel, close, ...props }: DokumentviserProps) => {
    const [pdfWidth, setPdfWidth] = useState<number>(getSavedPdfWidth);
    const increase = () => setPdfWidth(Math.min(pdfWidth + ZOOM_STEP, MAX_PDF_WIDTH));
    const decrease = () => setPdfWidth(Math.max(pdfWidth - ZOOM_STEP, MIN_PDF_WIDTH));
    const [transformedUrl, setTransformedUrl] = useState<string | undefined>();

    useEffect(
        () => localStorage.setItem(PDF_WITH_LOCAL_STORAGE_KEY, pdfWidth.toString()),
        [pdfWidth],
    );

    const [version] = useState<number>(Date.now());
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        let tmpUrl = `${url}`;
        if (url.includes(';base64')) {
            const parts = url.split(',');
            tmpUrl = b64ToBlobUrl(parts[1], 'application/pdf');
        }
        setTransformedUrl(tmpUrl);
    }, [url]);

    const print = () => {
        if (!transformedUrl) {
            console.error('Transformed url ikke satt');
            return;
        }
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = transformedUrl;
        document.body.appendChild(iframe);
        iframe.contentWindow?.print();
    };

    return (
        <Container width={pdfWidth} {...props}>
            <Header>
                <HeaderSubContainer>
                    <StyledHeaderButton onClick={decrease} title="Zoom ut på PDF">
                        <ZoomOut />
                    </StyledHeaderButton>
                    <StyledHeaderButton onClick={increase} title="Zoom inn på PDF">
                        <ZoomIn />
                    </StyledHeaderButton>
                    <StyledDocumentTitle>{tittel}</StyledDocumentTitle>
                </HeaderSubContainer>
                <HeaderSubContainer>
                    <StyledHeaderButton onClick={print} title="Skriv ut">
                        <Print />
                    </StyledHeaderButton>
                    <StyledHeaderLink
                        href={transformedUrl}
                        target="_blank"
                        title="Åpne i ny fane"
                        rel="noreferrer"
                    >
                        <ExternalLink />
                    </StyledHeaderLink>
                    <StyledHeaderButton onClick={close} title="Lukk forhåndsvisning">
                        <Close />
                    </StyledHeaderButton>
                </HeaderSubContainer>
            </Header>
            {transformedUrl && (
                <NoFlickerReloadPdf
                    url={transformedUrl}
                    version={version}
                    name={tittel}
                    onVersionLoaded={() => setIsLoading(false)}
                />
            )}
            {isLoading && <div>Laster</div>}
        </Container>
    );
};

const getSavedPdfWidth = () => {
    const localStorageValue = localStorage.getItem(PDF_WITH_LOCAL_STORAGE_KEY);

    if (localStorageValue === null) {
        return MIN_PDF_WIDTH;
    }

    const parsed = Number.parseInt(localStorageValue, 10);
    return Number.isNaN(parsed) ? MIN_PDF_WIDTH : parsed;
};
