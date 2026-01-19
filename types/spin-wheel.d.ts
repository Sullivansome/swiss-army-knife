declare module "spin-wheel" {
  export interface WheelItem {
    label?: string;
    backgroundColor?: string;
    labelColor?: string;
    weight?: number;
    image?: HTMLImageElement;
    imageRadius?: number;
    imageRotation?: number;
    imageScale?: number;
  }

  export interface WheelProps {
    items?: WheelItem[];
    itemLabelRadius?: number;
    itemLabelRadiusMax?: number;
    itemLabelFont?: string;
    itemLabelFontSizeMax?: number;
    itemLabelAlign?: "left" | "center" | "right";
    itemBackgroundColors?: string[];
    rotationSpeedMax?: number;
    rotationResistance?: number;
    radius?: number;
    borderColor?: string;
    borderWidth?: number;
    lineColor?: string;
    lineWidth?: number;
    pointerAngle?: number;
    isInteractive?: boolean;
    onRest?: (event: { currentIndex: number; rotation: number }) => void;
    onSpin?: () => void;
  }

  export class Wheel {
    constructor(container: HTMLElement, props?: WheelProps);
    items: WheelItem[];
    spin(rotationSpeed?: number): void;
    spinTo(
      rotation: number,
      duration?: number,
      spinToCenter?: boolean,
      numberOfRevolutions?: number,
      direction?: number,
      easingFunction?: (t: number) => number,
    ): void;
    spinToItem(
      itemIndex: number,
      duration?: number,
      spinToCenter?: boolean,
      numberOfRevolutions?: number,
      direction?: number,
      easingFunction?: (t: number) => number,
    ): void;
    stop(): void;
    remove(): void;
  }
}
