import { IconsProps } from '@/interfaces/icons.types';
import React from 'react';

const Redo: React.FC<IconsProps> = (props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="redo" className={props.className}>
            <path fill={props.color || "currentColor"} d="M21,11a1,1,0,0,0-1,1,8.05,8.05,0,1,1-2.22-5.5h-2.4a1,1,0,0,0,0,2h4.53a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4.77A10,10,0,1,0,22,12,1,1,0,0,0,21,11Z">
            </path>
        </svg>
    );
}

export default Redo;