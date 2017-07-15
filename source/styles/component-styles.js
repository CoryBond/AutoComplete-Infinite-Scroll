import styled from 'styled-components';

export const FilterDropDown = styled.div`
    position: relative;
    width: 100px;
    margin: 0;
    padding: 0;
    auto;
`;

export const NameInput = styled.input`
    width: 150px;
`;

export const Options = styled.ul`
    font-size: 0;
    overflow-y: scroll;
    position: absolute;
    height: ${(props) => props.height}px;
    width: 150px;
    border-style: ${(props) => props.height !== 0 ? 'solid' : 'none'};
    background-color: white;
    left: 0px;
    list-style-type: none;
    margin: 0;
    padding:0
`;

export const Option = styled.li`
    font-size: 14px;
    height: ${(props) => props.height}px;
    width: 100%;
    left: 0px;
    text-overflow: ellipsis;   
    overflow: hidden;
    display: inline-block;
    white-space: nowrap;
    background-color: ${(props) => props.isFocused ? props.scrollColor : 'white'};
    margin:0;
    padding:0
`;