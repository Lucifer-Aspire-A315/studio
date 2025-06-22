
"use client";

import React, { useState, useCallback, useRef } from 'react';
import Image from 'next/image';

const loanSchemes = [
    'Pradhan Mantri Mudra Yojana (PMMY)',
    'Stand-Up India Scheme',
    'Prime Minister’s Employment Generation Programme (PMEGP)',
    'PM SVANidhi Scheme',
    'PM Vishwakarma Scheme',
];

const TRAIN_IMAGE_URL = "https://i.imgur.com/vHqB02A.png";

type AnimationState = {
  type: 'train' | 'banner';
  key: number;
  text?: string;
};

export function LoanTrainAnimation() {
    const [animationState, setAnimationState] = useState<AnimationState>({ type: 'train', key: 0 });
    const schemeIndexRef = useRef(0);

    const handleAnimationEnd = useCallback(() => {
        if (animationState.type === 'train') {
            // After train, show the first banner
            setAnimationState({
                type: 'banner',
                key: animationState.key + 1,
                text: loanSchemes[schemeIndexRef.current]
            });
        } else {
            // After a banner, show the next one, or loop to the train
            const nextSchemeIndex = (schemeIndexRef.current + 1);
            if (nextSchemeIndex < loanSchemes.length) {
                // Show next banner
                schemeIndexRef.current = nextSchemeIndex;
                setAnimationState({
                    type: 'banner',
                    key: animationState.key + 1,
                    text: loanSchemes[nextSchemeIndex]
                });
            } else {
                // Loop back to train
                schemeIndexRef.current = 0;
                setAnimationState({
                    type: 'train',
                    key: animationState.key + 1
                });
            }
        }
    }, [animationState.key, animationState.type]);

    return (
        <div className="animation-viewport">
            {animationState.type === 'train' && (
                <Image
                    key={animationState.key}
                    src={TRAIN_IMAGE_URL}
                    alt="Loan Scheme Train"
                    className="moving-item is-animating"
                    width={300}
                    height={120}
                    style={{ objectFit: 'contain' }}
                    onAnimationEnd={handleAnimationEnd}
                    unoptimized // This is needed for external images like from imgur
                />
            )}
            {animationState.type === 'banner' && (
                <div
                    key={animationState.key}
                    className="moving-item scheme-banner is-animating"
                    onAnimationEnd={handleAnimationEnd}
                >
                    {animationState.text}
                </div>
            )}
        </div>
    );
}
