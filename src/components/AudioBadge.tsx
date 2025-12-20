import { Song } from '../types';
import { Activity, Waves } from 'lucide-react';

interface AudioBadgeProps {
    song?: Song | null;
    variant?: 'minimal' | 'album-header'; 
}

export const AudioBadge = ({ song, variant = 'minimal' }: AudioBadgeProps) => {
    if (!song) return null;

    const { suffix, bitRate, bitDepth, sampleRate } = song;
    if (!suffix) return null;

    const format = suffix.toUpperCase();
    const isLossless = ['FLAC', 'ALAC', 'WAV', 'AIFF'].includes(format);
    
    // Heuristic for Hi-Res: > 16bit OR > 48kHz OR > 1500kbps
    const isHiRes = (bitDepth && bitDepth > 16) || (sampleRate && sampleRate > 48000) || (isLossless && bitRate && bitRate > 1500);

    // Minimal: Used in Player Bar
    // Keep it small and functional
    if (variant === 'minimal') {
        let miniColor = "text-neutral-500 bg-neutral-800";
        let miniText = format;
        
        if (isHiRes) {
            miniColor = "text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20"; // Champagne Gold
            miniText = "HI-RES";
        } else if (isLossless) {
            miniColor = "text-neutral-300 bg-white/10 border border-white/10";
            miniText = "LOSSLESS";
        } else if (bitRate && bitRate >= 320) {
            miniText = "HQ";
        }

        const details = [];
        if (bitDepth && sampleRate) details.push(`${bitDepth}bit/${sampleRate/1000}kHz`);
        else if (bitRate) details.push(`${bitRate}kbps`);

        return (
            <div className="flex flex-col items-start gap-1 translate-y-[1px]">
                <div className={`px-1 rounded-[3px] text-[8px] font-bold tracking-wider leading-none py-[2px] ${miniColor} self-start`}>
                    {miniText}
                </div>
                {/* Show technical details stacked below */}
                {details.length > 0 && (
                    <span className="text-[8px] text-neutral-500 font-medium tabular-nums leading-none opacity-80 pl-[1px]">
                        {details.join(' ')}
                    </span>
                )}
            </div>
        );
    }

    // --- Album Header Variant (Apple Music Style) ---
    // Elegant, bordered, centered content
    if (variant === 'album-header') {
        const details = [];
        if (bitDepth) details.push(`${bitDepth}-bit`);
        if (sampleRate) details.push(`${sampleRate / 1000} kHz`);
        if (!bitDepth && !sampleRate && bitRate) details.push(`${bitRate} kbps`);

        const detailString = details.join(' / ');
        
        if (isHiRes) {
            return (
                <div className="flex items-center gap-2 text-[#F2C94C] select-none" title="High-Resolution Lossless Audio">
                    <Activity size={16} className="text-[#F2C94C]" />
                    <div className="flex flex-col leading-none">
                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-90">Hi-Res Lossless</span>
                        {detailString && <span className="text-[9px] font-medium tracking-wide opacity-70 mt-0.5">{detailString} • {format}</span>}
                    </div>
                </div>
            );
        }

        if (isLossless) {
            return (
                <div className="flex items-center gap-2 text-neutral-300 select-none" title="Lossless Audio">
                    <Waves size={16} className="text-neutral-400" />
                    <div className="flex flex-col leading-none">
                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-90">Lossless</span>
                        {detailString && <span className="text-[9px] font-medium tracking-wide opacity-60 mt-0.5">{detailString} • {format}</span>}
                    </div>
                </div>
            );
        }

        // Standard / HQ
        return (
            <div className="inline-flex items-center px-2 py-0.5 rounded border border-neutral-700 text-neutral-400 text-[10px] font-bold tracking-wider uppercase">
                {format} {bitRate ? `• ${bitRate} kbps` : ''}
            </div>
        );
    }

    return null;
};
