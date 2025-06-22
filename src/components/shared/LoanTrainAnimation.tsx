
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
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
    // This state tracks which item is currently being animated ('train' or 'banner')
    const [animatingItem, setAnimatingItem] = useState<'train' | 'banner'>('train');
    
    // This state holds the text for the banner
    const [bannerText, setBannerText] = useState(loanSchemes[0]);
    
    // This key is used to force React to re-render the animating element,
    // which is necessary to restart the CSS animation.
    const [animationKey, setAnimationKey] = useState(0);

    // We use a ref to keep track of the current scheme index across re-renders
    // without causing a re-render itself.
    const schemeIndexRef = React.useRef(0);

    const handleAnimationEnd = () => {
        if (animatingItem === 'train') {
            // After the train has passed, it's time for the banners.
            // Reset the scheme index and set the text for the first banner.
            schemeIndexRef.current = 0;
            setBannerText(loanSchemes[0]);
            setAnimatingItem('banner'); // Switch to banner mode.
        } else {
            // A banner has just finished. Time to show the next one or the train.
            const nextSchemeIndex = schemeIndexRef.current + 1;
            
            if (nextSchemeIndex < loanSchemes.length) {
                // There are more schemes to show.
                schemeIndexRef.current = nextSchemeIndex;
                setBannerText(loanSchemes[nextSchemeIndex]);
                // We stay in 'banner' mode, but a key change will restart the animation.
            } else {
                // All banners have been shown. It's time for the train again.
                setAnimatingItem('train');
            }
        }
        // Incrementing the key forces the element with this key to be re-mounted,
        // which reliably restarts the CSS animation.
        setAnimationKey(prev => prev + 1);
    };

    return (
        <div className="animation-viewport">
            <Image
                key={`train-${animationKey}`} // The key is crucial for restarting the animation.
                src="https://i.imgur.com/gSoSzs9.png"
                alt="A colorful cartoon train carrying gold coins representing various loans"
                width={300}
                height={200}
                className={cn('moving-item train-image', {
                    'is-animating': animatingItem === 'train'
                })}
                onAnimationEnd={animatingItem === 'train' ? handleAnimationEnd : undefined}
                priority // Preload the train image
            />

            <div
                key={`banner-${animationKey}`} // The key is also crucial here.
                className={cn('moving-item scheme-banner', {
                    'is-animating': animatingItem === 'banner'
                })}
                onAnimationEnd={animatingItem === 'banner' ? handleAnimationEnd : undefined}
            >
                {bannerText}
            </div>
        </div>
    );
}
