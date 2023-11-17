'use client'

import React, { useState } from 'react';
import { Poll } from './Poll';

export function SpecificPoll() {

    const [index, setIndex] = useState('');

    const handleIndexChange = (e) => {
        setIndex(e.target.value);
    };

    return (
        <div className="text-center">
            <label>
                Enter Poll Number:
                <input type="number" value={index} onChange={handleIndexChange} />
            </label>
            <div className="w-full flex flex-wrap justify-center">
                {index ? (
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                        <Poll index={Number(index) - 1} />
                    </div>
                ) : null}
            </div>
        </div>
    );
};

