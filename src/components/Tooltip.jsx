import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle } from 'lucide-react';

export default function Tooltip({ children, text, title, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const targetRef = useRef(null);

  const updatePosition = () => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const tooltipWidth = 320; // Max width of tooltip box (w-80 = 320px)
      const padding = 16; // 16px safety padding from viewport edges

      let top = 0;
      let left = rect.left + rect.width / 2;

      // Smart vertical positioning: flip if too close to viewport top/bottom
      let effectivePosition = position;
      if (position === 'top' && rect.top < 130) {
        effectivePosition = 'bottom';
      } else if (position === 'bottom' && viewportHeight - rect.bottom < 130) {
        effectivePosition = 'top';
      }

      if (effectivePosition === 'top') {
        top = rect.top - 10;
      } else {
        top = rect.bottom + 10;
      }

      // Clamp left coordinate so popover never bleeds off left or right screen edge
      const halfWidth = tooltipWidth / 2;
      if (left - halfWidth < padding) {
        left = padding + halfWidth;
      } else if (left + halfWidth > viewportWidth - padding) {
        left = viewportWidth - padding - halfWidth;
      }

      setCoords({ top, left, effectivePosition });
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const getTransform = () => {
    if (coords.effectivePosition === 'top') return 'translate(-50%, -100%)';
    return 'translate(-50%, 0)';
  };

  return (
    <>
      <div 
        ref={targetRef}
        className="inline-flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {isVisible && text && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            transform: getTransform(),
            zIndex: 999999,
            pointerEvents: 'none'
          }}
          className="animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="w-72 sm:w-80 p-3.5 rounded-xl bg-slate-950/98 border border-cyan-500/60 shadow-2xl backdrop-blur-2xl text-slate-100 ring-1 ring-white/10 glow-cyan">
            {title && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 pb-1.5 mb-1.5 border-b border-slate-800">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                {title}
              </div>
            )}
            <p className="text-[11px] text-slate-200 font-medium leading-relaxed wrap-break-word">
              {text}
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
