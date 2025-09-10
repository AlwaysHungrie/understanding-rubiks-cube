export const COLORS = {
  white: 0xffffff,
  offwhite: 0xf0f0f0,
  black: 0x000000,
  grey: 0xf2e7dc,
  red: 0xc41e3a,

  light_cool: 0x87ceeb,
  light_warm: 0x404040,

  rubik_white: 0xffffff,
  rubik_red: 0xc41e3a,
  rubik_green: 0x009e60,
  rubik_blue: 0x0051ba,
  rubik_orange: 0xff5800,
  rubik_yellow: 0xffd500,

  rubik_highlightwhite: 0xd1d1d1,
  rubik_highlightred: 0x780116,
  rubik_highlightgreen: 0x15803d,
  rubik_highlightblue: 0x0033a0,
  rubik_highlightorange: 0xb83f00,
  rubik_highlightyellow: 0xff9000,
};

export const SCENE_CLICKABLE_TYPES = ["floorButton"];

export const CUBE_SIZE = 1.5;
export const CUBE_SPACING = 0.05;

export const INITIAL_CUBE_ROTATION = {
  x: 0,
  y: Math.PI / 4,
};

export const DAMPING_FACTOR = 0.8;
export const MAX_VELOCITY = 0.1;
export const ACCELERATION_FACTOR = 0.02;

export const ROTATION_MAX_VELOCITY = 0.4;
export const ROTATION_DAMPING_FACTOR = 0.8;
export const ROTATION_ACCELERATION_FACTOR = 0.1;