import { Song } from '../types';

interface AudioBadgeProps {
    song?: Song | null;
    variant?: 'minimal' | 'full'; // minimal for player bar (just text/icon), full for album detail
}

export const AudioBadge = ({ song, variant = 'minimal' }: AudioBadgeProps) => {
    if (!song) return null;

    const { suffix, bitRate, bitDepth, sampleRate } = song;
    if (!suffix) return null;

    const format = suffix.toUpperCase();
    const isLossless = ['FLAC', 'ALAC', 'WAV', 'AIFF'].includes(format);
    
    // Determine Hi-Res status
    // 1. Explicit metadata: > 16bit OR > 48kHz
    // 2. Fallback heuristic: High bitrate (> 1500kbps usually implies > 16/44.1)
    const isHiRes = (bitDepth && bitDepth > 16) || (sampleRate && sampleRate > 48000) || (isLossless && bitRate && bitRate > 1500);

    let badgeText = format;
    let badgeColor = "bg-neutral-700 text-neutral-300";
    let title = `${format}`;
    let detailText = "";

    // Build Detail Text
    const details = [];
    if (bitDepth) details.push(`${bitDepth}bit`);
    if (sampleRate) details.push(`${sampleRate / 1000}kHz`);
    if (bitRate) details.push(`${bitRate}kbps`);
    
    detailText = details.join(' / ');
    title += ` ${detailText}`;

    if (isHiRes) {
        badgeText = "HI-RES";
        badgeColor = "bg-yellow-600/20 text-yellow-500 border border-yellow-500/30";
    } else if (isLossless) {
        badgeText = "LOSSLESS";
        badgeColor = "bg-neutral-600/30 text-neutral-300 border border-neutral-500/30";
    } else if (bitRate && bitRate >= 320) {
        badgeText = "HQ"; // High Quality Lossy
        badgeColor = "bg-neutral-700 text-neutral-300";
    } else {
        badgeText = format;
    }

    if (variant === 'full') {
        return (
            <div className={`flex flex-col items-start gap-1`}>
                <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${badgeColor}`} title={title}>
                    {badgeText}
                </div>
                {detailText && (
                    <span className="text-[10px] text-neutral-500 font-medium uppercase">
                        {detailText} • {format}
                    </span>
                )}
            </div>
        );
    }

    // Minimal: Used in Player Bar
    // If we have detailed info, maybe show "24/96" instead of just "HI-RES"? 
    // Or keep "HI-RES" badge but add text next to it.
    return (
        <div className="flex items-center gap-2">
            <div 
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider cursor-help ${badgeColor}`} 
                title={title}
            >
                {badgeText === 'HQ' ? format : badgeText}
            </div>
            {/* Show technical details if available, otherwise bitrate */}
            <span className="text-[9px] text-neutral-500 font-medium tabular-nums">
                {(bitDepth && sampleRate) 
                    ? `${bitDepth}bit/${sampleRate/1000}kHz` 
                    : (bitRate ? `${bitRate}kbps` : '')}
            </span>
        </div>
    );
};