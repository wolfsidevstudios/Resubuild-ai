
import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    layoutKey?: string; // Optional: For in-feed ads
    className?: string;
    style?: React.CSSProperties;
}

export const AdUnit: React.FC<AdUnitProps> = ({ slot, format = 'auto', layoutKey, className = '', style = {} }) => {
    const adRef = useRef<HTMLModElement>(null);
    const isDev = process.env.NODE_ENV === 'development';

    useEffect(() => {
        // Prevent executing AdSense script in development to avoid policy violations/invalid traffic
        if (isDev) return;

        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense push error", e);
        }
    }, [isDev]);

    if (isDev) {
        return (
            <div className={`bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs font-mono p-4 text-center ${className}`} style={{ minHeight: '250px', ...style }}>
                AdSense Placeholder<br/>(Slot: {slot})<br/>Visible in Production
            </div>
        );
    }

    return (
        <div className={`ad-container overflow-hidden ${className}`} style={style}>
            <ins className="adsbygoogle"
                style={{ display: 'block', ...style }}
                data-ad-client="ca-pub-7029279570287128"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
                data-ad-layout-key={layoutKey}
            />
        </div>
    );
};
