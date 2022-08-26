import styled from 'styled-components';

interface BeholderProps {
    width: number;
}

export const Container = styled.section<BeholderProps>`
    display: flex;
    flex-direction: column;
    min-width: ${props => props.width}px;
    margin: 4px 8px;
    background: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    height: 100%;
    scroll-snap-align: start;
`;

export const StyledDocumentTitle = styled.h1`
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: normal;
    margin: 0;
    padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 100%;
    white-space: nowrap;
`;

export const StyledHeaderButton = styled.button`
    display: flex;
    align-items: center;
    height: 100%;
    border: none;
    background-color: transparent;
    padding: 0;
    margin: 0;
    cursor: pointer;
    :disabled {
        cursor: not-allowed;
    }
`;

export const StyledHeaderLink = styled.a`
    display: flex;
    align-items: center;
    height: 100%;
    border: none;
    background-color: transparent;
    padding: 0;
    margin: 0;
    cursor: pointer;
`;

export const PDF = styled.object`
    width: 100%;
    flex-grow: 1;
`;

export const Header = styled.div`
    background: #cde7d8;
    display: flex;
    position: relative;
    padding-left: 8px;
    padding-right: 8px;
    height: 32px;
    z-index: 1;
    justify-content: space-between;
`;

export const HeaderSubContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 16px;
`;
/*
const iconStyle = css`
    & {
        color: black;
        transform: scale(1);
        transition: transform 0.15s ease-in-out;
        width: 16px;
        height: 16px;
        :hover {
            transform: scale(1.25);
        }
    }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
*/
