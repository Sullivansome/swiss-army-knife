declare module "@3d-dice/dice-box" {
  export interface DiceBoxConfig {
    assetPath: string;
    id?: string;
    scale?: number;
    theme?: string;
    themeColor?: string;
    preloadThemes?: string[];
    enableShadows?: boolean;
    shadowTransparency?: number;
    lightIntensity?: number;
    throwForce?: number;
    spinForce?: number;
    gravity?: number;
    mass?: number;
    friction?: number;
    restitution?: number;
    linearDamping?: number;
    angularDamping?: number;
    delay?: number;
    offscreen?: boolean;
    suspendSimulation?: boolean;
    origin?: string;
    onBeforeRoll?: (notation: string) => void;
    onDieComplete?: (result: DieResult) => void;
    onRollComplete?: (results: RollResult[]) => void;
    onRemoveComplete?: (die: unknown) => void;
    onThemeConfigLoaded?: (config: unknown) => void;
    onThemeLoaded?: (theme: string) => void;
  }

  export interface DieResult {
    value: number;
    sides: number;
    theme: string;
    themeColor: string;
  }

  export interface RollResult {
    value: number;
    qty: number;
    sides: number;
    modifier: number;
    rolls: DieResult[];
  }

  export default class DiceBox {
    constructor(selector: string, config: DiceBoxConfig);
    onRollComplete: ((results: RollResult[]) => void) | null;
    onDieComplete: ((result: DieResult) => void) | null;
    init(): Promise<void>;
    roll(notation: string): Promise<RollResult[]>;
    add(notation: string): Promise<RollResult[]>;
    clear(): void;
    hide(): void;
    show(): void;
    updateConfig(config: Partial<DiceBoxConfig>): void;
  }
}
