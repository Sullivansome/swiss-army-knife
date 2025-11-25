declare module "react-image-magnifiers" {
  import * as React from "react";

  export interface SideBySideMagnifierProps extends React.HTMLAttributes<HTMLDivElement> {
    imageSrc: string | string[];
    largeImageSrc?: string | string[];
    imageAlt?: string;
    overlayOpacity?: number;
    overlayBoxOpacity?: number;
    overlayBackgroundColor?: string;
    overlayBoxColor?: string;
    overlayBoxImage?: string;
    overlayBoxImageSize?: string;
    cursorStyle?: string;
    alwaysInPlace?: boolean;
    transitionSpeed?: number;
    transitionSpeedInPlace?: number;
    renderOverlay?: () => React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onImageLoad?: () => void;
    onLargeImageLoad?: () => void;
    switchSides?: boolean;
    onZoomStart?: () => void;
    onZoomEnd?: () => void;
    fillAvailableSpace?: boolean;
    fillAlignTop?: boolean;
    fillGapLeft?: number;
    fillGapRight?: number;
    fillGapTop?: number;
    fillGapBottom?: number;
    inPlaceMinBreakpoint?: number;
    zoomContainerBorder?: string;
    zoomContainerBoxShadow?: string;
    mouseActivation?: string;
    touchActivation?: string;
  }

  export const SideBySideMagnifier: React.ComponentType<SideBySideMagnifierProps>;
}
