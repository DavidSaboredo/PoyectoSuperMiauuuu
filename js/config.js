// Configuración compartida del motor. Debe cargarse antes de game.js.
const WORLD_HEIGHT = 450;
const LEVEL_WIDTH = 5400;
const GRAVITY = 0.60;
const FIXED_TIME_STEP = 1000 / 60;
const MAX_FRAME_DELTA = 100;
const MAX_UPDATES_PER_FRAME = 6;

const LAND_MOVEMENT = {
    1: { maxSpeed: 4.75, groundAccel: 0.52, airAccel: 0.31, groundDecel: 0.62, airDecel: 0.08, jumpStrength: -12.15 },
    2: { maxSpeed: 4.48, groundAccel: 0.48, airAccel: 0.29, groundDecel: 0.62, airDecel: 0.08, jumpStrength: -11.6 },
    3: { maxSpeed: 4.56, groundAccel: 0.5, airAccel: 0.3, groundDecel: 0.64, airDecel: 0.08, jumpStrength: -12.05 },
    5: { maxSpeed: 4.22, groundAccel: 0.46, airAccel: 0.27, groundDecel: 0.66, airDecel: 0.09, jumpStrength: -11.78 },
    6: { maxSpeed: 4.38, groundAccel: 0.47, airAccel: 0.28, groundDecel: 0.64, airDecel: 0.08, jumpStrength: -11.6 },
    7: { maxSpeed: 4.24, groundAccel: 0.46, airAccel: 0.27, groundDecel: 0.66, airDecel: 0.09, jumpStrength: -11.78 }
};

const WATER_ACCEL = 0.38;
const WATER_DECEL = 0.20;
const WATER_VERTICAL_ACCEL = 0.36;
const WATER_VERTICAL_DECEL = 0.16;
const WATER_GRAVITY = 0.025;
const WATER_MAX_SPEED = 3.85;
const WATER_MAX_VERTICAL_SPEED = 3.45;
const AIR_BUBBLE_RESPAWN_TICKS = 300;

const STREET_CROSSINGS = [
    { x: 420, offset: 0 },
    { x: 1450, offset: 72 },
    { x: 2820, offset: 144 },
    { x: 4180, offset: 216 }
];
const STREET_SIGNAL_CYCLE = 300;
const STREET_RED_TICKS = 178;
const STREET_CAR_STOP_OFFSET = 148;
const STREET_BIRD_TRIGGER_X = 2050;
const STREET_ROAD_TOP = 312;
const STREET_CURB_Y = 376;
// La línea central se dibuja dentro del bloque de calle (y=380..450),
// medida desde su borde superior.
const STREET_LANE_MARK_OFFSET_Y = 35;

const DEFAULT_COYOTE_FRAMES = 11;
const DEFAULT_JUMP_BUFFER_FRAMES = 12;
const DEFAULT_JUMP_HOLD_FRAMES = 11;
const SHORT_HOP_CUTOFF_SPEED = -3.8;
const SHORT_HOP_DAMPING = 0.6;
