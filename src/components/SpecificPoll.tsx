'use client'

import React, { useState, ChangeEvent } from 'react';
import { Poll } from './Poll';

export function SpecificPoll() {

    const [index, setIndex] = useState('');

    const handleIndexChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIndex(e.target.value);
    };

    return (
        <>
            <div className="flex justify-center mt-4">
                <div className="border-2 w-60 text-center border-pink-950 rounded-lg p-4 bg-orange-200">
                    <label className="block mb-2 font-semibold">
                        Enter Poll Number:
                    </label>
                    <input
                        type="number"
                        value={index}
                        onChange={handleIndexChange}
                        className="border-2 border-pink-950 rounded-md p-2 w-full"
                    />
                </div>
            </div>
            <div className="text-center">
                <div className="w-full flex flex-wrap justify-center">
                    {index ? (
                        <div>
                            <Poll index={Number(index) - 1} filter={"all"} />
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
};
