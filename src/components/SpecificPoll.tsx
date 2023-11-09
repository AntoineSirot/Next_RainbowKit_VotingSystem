'use client'

import React, { useState } from 'react';
import { Poll } from './Poll';

export function SpecificPoll() {

    const [index, setIndex] = useState(''); // State to store the user-entered index

    const handleIndexChange = (e) => {
        setIndex(e.target.value);
    };



    return (
        <div>
            <label>
                Enter Pool Number:
                <input type="number" value={index} onChange={handleIndexChange} />
            </label>
            {index ? (<Poll index={Number(index) - 1} />) : null}
        </div>
    );
};

