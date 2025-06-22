
"use client";

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

// List of loan schemes to display in the banner
const loanSchemes = [
    'Pradhan Mantri Mudra Yojana (PMMY)',
    'Stand-Up India Scheme',
    'Prime Minister’s Employment Generation Programme (PMEGP)',
    'PM SVANidhi Scheme',
    'PM Vishwakarma Scheme',
];

export function LoanTrainAnimation() {
    const [bannerText, setBannerText] = useState(loanSchemes[0]);
    const [animationKey, setAnimationKey] = useState(0);
    const schemeIndexRef = React.useRef(0);

    const handleAnimationEnd = useCallback(() => {
        // Move to the next scheme, or loop back to the start
        const nextSchemeIndex = (schemeIndexRef.current + 1) % loanSchemes.length;
        schemeIndexRef.current = nextSchemeIndex;
        
        // Update the banner text for the next animation
        setBannerText(loanSchemes[nextSchemeIndex]);
        
        // Increment the key to force a re-render and restart the animation
        setAnimationKey(prev => prev + 1);
    }, []);

    return (
        <div className="animation-viewport">
            <div
                key={`banner-${animationKey}`}
                className={cn('moving-item scheme-banner is-animating')}
                onAnimationEnd={handleAnimationEnd}
            >
                {bannerText}
            </div>
        </div>
    );
}
