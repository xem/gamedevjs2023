
// Globals
  
// Canvas context 2D
var c = a.getContext("2d");

// Init local storage to 1 if it's not already set
localStorage["chronorobot"] = localStorage["chronorobot"] || 1;

// Current screen (0: main menu / 1: level selection / 2: playing / 3: editor)
var screen = 0;

// Previous screen (when we quit a level, 0: when playing a shared level / 1: when playing a built-in level / 3: whe testing a level in the level eitor)
var last_screen = 0;

// Mouse down (player is clicking)
var mousedown = false;

// Player is right clicking
var rightclick = false;

// Hero's width (not 32px in order to pass easily between two blocks)
var hero_width = 24;

// Gravity (downwards acceleration):
var gravity = 2;

// Max fall speed (for hero and cubes)
var max_fall_speed = 24;

// Jump speed (upwards vy force):
var jump_speed = 20;

// Walk speed (horizontal vx)
var walk_speed = 6;

// Mouse coords (in tiles)
var tile_x = tile_y = 0;

// Mouse coords (in px)
var x = y = 0;

// Current level
var level = 0;

// All the data of the current level
var level_data = {};

// Loop vars
var i,j,k,l,m;

// Other globals (editor)
var pipe_click, current_pipe, balance_click, current_balance, current_editor_tile, mouse_tile_x, mouse_tile_y, pipe_high, pipe_low, end_pipe, end_pole, number, drawn_tile, shared, chose_a_tile;

// Other globals (gameplay)
var win, win_frame, lose_frame, paradox_frame, coins_left, loop, frame, current_hero, solid, yellow_toggle, yellow_toggle_last_frame, pipes_state, balances_state, yellow_toggle_delay, yellow_toggle_on, blue_portal, orange_portal, temp_side, heros, hero, target, current_cube, portals, current_portal, chrono, keyup, keyleft, keyright;

// Built-in levels:
var levels = [
  
{},
  
// 1
{"hash":"00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000033333300000000000000000000000000000000003333330000000000000000000000000000000000333333000000000000000000000000000F000000333333000000000000000000000000000G0000003333330000000000000000000033333333333333333333000000000000000000003333333333333333333300000000000000000000","pipes":[[12,8,3,2,8]],"balances":[],txt:"Move with arrow keys or WASD or ZQSD", record:179},

// 2
{"hash":"000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033333000000000000000000000000000000000003333300000000000000000000000000000000000900000000000000000000000000000000F00000090060000000000000000000000;000000G00000090000000000000000000000003333333333333333333300000000000000000000333333333333333333330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","pipes":[],"balances":[],"txt":"If you get stuck, press R to reset","record":212},

// 3
{"hash":"0000000000000000000000000000000000000000000000000000000000F000000000000000000000000000000000000000G000000000000000000000000003333333333333330000000000000000000033000000000000000000000000000000000000003300000000000000000000000000000000000000333000000000000000600000000000000000000033300000000000000000000000000000000000003333333333333333333300000000000000000000333333333333333333330000000000000000000033333333333333333333","pipes":[[15,4,7,15,2],[10,4,7,10,2],[5,4,7,5,2]],"balances":[],record:759},

// 4
{"hash":"000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000333330000000000000000000000000000000000033333000000000000000000000000000000000003333300000000000000000000000F000000000003333300000000000000000000000G000<000000033333000000000000000000003333333333333333333300000000000000000000333333333333333333330000000000000000000033333333333333333333","pipes":[],"balances":[],"txt":"Press space to hold or drop cubes.","record":240},

// 5
{"hash":"0000000000000000000000000000000000000000000000000000000000060000000000000000000099999333333333::::::00000000000000000000000003333333330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000F000000000000000000000000000000000000000G0000000;00000000000000000000003333333333333333333300000000000000000000333333333333333333330000000000000000000033333333333333333333","pipes":[[1,7,3,15,7]],"balances":[],"txt":"You'll die if you get crushed between two solid objects","record":422},

// 6
{"hash":"00009000000000:000000000000000000000000000009000000000:000000000000000000000000000609000000000:0F0000000000000000000000000009000000000:0G0;00000000000000000000033333::::39999333333000000000000000000003333300003000033333300000000000000000000333330000300003333330000000000000000000033333000030000333333000000000000000000003333300003000033333300000000000000000000333333333333333333330000000000000000000033333333333333333333","pipes":[],"balances":[],"txt":"Altering the past can cause a paradox!","record":249},

// 7
{"hash":"00000000000000000600000000000000000000000000000000000000333300000000000000000000000000000000000033330000000000000000000000000000000000000003000000000000000000000F000000000000000003000000000000000000000G00000???00???0000300000000000000000000333000000000000000030000000000000000000033300000000000000003000000000000000000003333333333333333333300000000000000000000333333333333333333330000000000000000000033333333333333333333","pipes":[],"balances":[[7,5,13,5]], txt:"Weigh station","record":258},

// 8: bonus 1
{"hash":"0000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000F000000000000000000000000000000000000000G0000000000<<0000000000000000000000333333333333333333330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","pipes":[],"balances":[],"record":269},

// 9: 8
{"hash":"0000000000000000000000000000000000000000000000000000000F000000000000000000000000000000000000000G00000000000000000000000000000000000000333333000000000000000000000000000000000033333300000000000000000000000000000000009::::0000000000000000000000000000000000090000000000000000000000000000000000000009000600000000000000000000000;000000000009000000000000000000000000033333333333333333333000000000000000000003333333333333333333300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","pipes":[[12,8,3,18,2]],"balances":[], record:623},

// skip 9
// skip 10
// skip 11

// 10: 12
{"hash":"6000000000000000000000000000000000000000000000000000000000;0000000000000000000000000000000000000003300000000000000000000::::0000000000000033000000000000000000000000000???000000000000000000000000000000000000000000???000000000000000000000000000000000000000000000000000000000000000000F000330003300033000000000000000000000000G0033300033000333000000000000000000000033333330003300033333000000000000000000003333333333333333333300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","pipes":[],"balances":[[8,5,13,5]],"record":777, txt:"two robots weigh more than one"},

// Skip 13

// 11: 14
{"hash":"0000900000000000000000000000000000000000000090000000000000000000000000000000000000009000000000000F000000000000000000000000<09000000000000G0;0000000000000000000033333:::::339999333300000000000000000000333330000033000:333300000000000000000000333330000333000:333300000000000000000000333330000333000:333300000000000000000000333330003333000:333300000000000000000000333330<03333<0603333000000000000000000003333333333333333333300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","pipes":[],"balances":[],"record":540},

// 12: 15
{"hash":";6000000000000000<000000000000000000000033000000000000009999000000000000000000003300000000000000000:000000000000000000000000000000000000000:00000000000000000000000000000F000000000:00000000000000000000000000000G00000000000000000000000000000000000003333300000000000000000000000000000000003333330000000000000000000000000000000003333333000000000000000000000000000033333333333333333333000000000000000000003333333333333333333300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","pipes":[[2,8,1,16,8]],"balances":[],"txt":"The past can be altered without causing a paradox","record":329},

// 13: 17
{"hash":"000000000000000006000000000000000000000033330033333300333333000000000000000000003000000003000000000300000000000000000000300000000300000000030000000000000000000030000000030000000003000000000000000000003330033333333330033300000000000000000000300000000000000000030000000000000000000030000000000000000003000000000000000000003F000000000000000003000000000000000000003G000000000000000003000000000000000000003333333333333333333300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","pipes":[[3,9,5,12,9],[15,9,5,7,9],[12,4,1,7,4]],"balances":[],"record":535},

// Skip 18, 19, 20, 21 (laser, bomb)

// 14: 22
{"hash":"00003333333333333333000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000333333333333333300000000000000000000::00000000000000000000000000000000000000::00000000000000000000000000000000000000:::0F00000000000000000000000000000000000:::0G0000000000000;00000000000000000000033333333333333333333000000000000000000003333333333333333333300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","pipes":[[9,5,8,7,8],[15,5,8,13,8],[9,0,3,7,3],[15,0,3,13,3]],"balances":[],"record":1443},

// 15: 24
{"hash":"0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000F000000000000000000000000000000000000000G00000000000000000000000000000000000000333333333333333000000000000000000000000030000000000000000033000000000000000000003000000000000000003300000000000000000000306000000000000003330000000000000000000030000000000000000333000000000000000000003333333333333333333300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","pipes":[[4,6,9,8,4],[7,6,9,14,4],[10,6,9,5,4],[13,6,9,11,4]],"balances":[],"record":1037},

// 16: 29
{"hash":"600330000000030<03000000000000000000000000030000000003000300000000000000000000000003;000F000039993000000000000000000000000033000G00000000000000000000000000000000000000333300000000000000000000000000000000000033330000000000000000000000000000000000033333:00000000000000000000000000000000003333300000000000000000000000000000003333333330000000000000000000000000000033333333333333000333000000000000000000003333333333333300033300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","pipes":[[0,8,2,18,8]],"balances":[],"record":437},

// 17 tmp
{"hash":"0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000900000000000000000000000000000000000000090000===000000000000000000000030F000000090000=63000000000000000000000030G000;00090000=0300000000000000000000003333333333333333330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","pipes":[],"balances":[],"txt":"Ice walls only allow the first robot to pass through",record:329},

// 18
{"hash":"0000000000000F000003000000000000000000003300033330000G000;03000000000000000000003330003333333333333300000000000000000000333000000999000000030000000000000000000033330000099900000003000000000000000000003333000009990000000300000000000000000000333333333333333000330000000000000000000030000=000:::000000330000000000000000000030600=000:::000003330000000000000000000030030=000:::00000333000000000000000000003333333333333333333300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","pipes":[],"balances":[],"record":949},

// 19
{"hash":"333000000000333333330000000000000000000000=003300000:09000030000000000000000000060=003300000:09000030000000000000000000000=033300000:09000030000000000000000000000=033300000:0900003000000000000000000003333333333333333000300000000000000000000000000000000000000030000000000000000000000000000000000000003000000000000000000000F0000000000???00003000000000000000000000G0000;0000000000003000000000000000000003333333333333333333300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","pipes":[[17,9,1,3,9]],"balances":[[9,4,13,8]],"record":1251},

// 19
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000203000000000000\
0000000000000000000000000003000000000000\
0000000000000000000000003333000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000030F00000000000000000000000000000\
0000000030G000<00<00<0000000000000000000\
0000000033333333333333330000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[],"balances":[],"record":596},

// 20
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000<00000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000200000000000000\
000000000F000000000000000000000000000000\
000000000G000000000000000000000000000000\
0000000333330000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000<00033330000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
000000000000000000<0<0000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000333333000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[],"balances":[[14,4,19,16]],"txt":"Heros and cubes have the same weight.","record":995},

// 21
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000003444300000344430000000009000000000\
0000003000300000300030000000009000000000\
0000000000300000000000000000009000000000\
0000000000300000000000000000009000000000\
0000000000300;00000000000000009000000000\
0033300000333330000000000000009000000000\
0000000000000000000000000000009000000000\
0000000000000000000000000000009000000000\
0000000000000000000000000000009000000000\
0000000000000000000000000000009000000000\
0000000000000000000000000000009020000000\
0000000000000000000000000000009000000000\
00F0000000000000000000000000009000000000\
00G0000000000000000000000000009000000000\
0444444444444444444444444444444444400000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[[24,3,16,3,7]],"balances":[[8,12,18,12]],"txt":"Only two portals can exist at the same time.","record":1545},

// 22
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000=00000000000000000000\
0000000006060606060=00000000000000000000\
0000000000000000000=00000000000000000000\
0000000000033333333333330000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000200000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000400000000000000000000000000\
000000000000444000000F000000000000000000\
000000300004444400000G000000003000000000\
0000003333333333333333333333333000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[[24,16,6,19,16]],"balances":[[]],"txt":"Clouds will block all your future selves!","record":579},

// 23
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000006000000000000002000\
000F000000000000000060600000000000000000\
000G00;000000000000000000000000000000000\
003333339990:::09990:::09990:::333333300\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[],"balances":[],"txt":"Count in your head: 1-2-3-switch! 1-2-3-switch! I know, this one's terrible.","record":497},

// 24
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000200000\
0000000000000000000000033333333300000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
000000000000000000<000000000000000000000\
0000000000000000099900000000000000000000\
0000000000000000000000000000000000000000\
0000000000000=00000000000000000000000000\
0000000000000=00000000030000000000000000\
00000003000F0=00000000030000000000000000\
00000003300G0=00000000030000000000000000\
0300000333333333333333330000000003330000\
0330;00000000000000000000000000000000000\
0333333000000000000000000333000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[[21,14,5,26,16]],"balances":[],"txt":"You can grab and throw cubes even if they're not here yet...","record":609},

// 25
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000044440000000000000000\
0000000000000000000040000000000000000000\
0000000000000000000040000000000000000000\
0000000000000000000040000000000000000000\
0000000000000000000040000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000200\
000000009=000000000000000000000000000000\
000000009=000006000000040000000000000000\
00000F009=000000000000040000000000000000\
00000G009=000007000000040000000000000000\
0000333333333333333344440000000000000000\
0000300000000000000000000000000000000000\
00;0300000000000000000000000000000008880\
0333300000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[],"balances":[],"txt":"You can aim and shoot portals even if you're not here yet...","record":611},

// 26
{"hash":"000F000000000000000000000000000000000000\
000G000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000700700000000707000000000000000000000\
0040404440<00400444000000000000000000000\
0047404000400400404000000000000000000000\
0044404400400400404000000000000000000000\
0040404000470470404000000000000000000000\
0040404440440440444000000000000000000000\
0000000000000000000000000000000000020000\
0000000000000000000666066006006606000000\
0000000000000000000888088068008808000000\
0000000000000000000080080088000808000000\
00===========000006080088008008808680000\
0000000000000000008080008008000808800000\
0000000000000000008880088088808808080000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
","pipes":[],"balances":[[33,5,24,5],[27,5,30,5]],"record":507},

// 27
{"hash":"00000000000000000=0000000000000000000000\
00000000000000000=0F00003000000000000000\
00003333333330000=0G0;003000000000000000\
0000300000009000033333333000000000000000\
0000300000009000030000000000000000000000\
0000300000009000330000000000000000000000\
0000300033333333330000000000000000000000\
0000300000000000333333333333333333333330\
0000300000000000300000000090000000000030\
0000300000000000302000000090000000000030\
0333333333333300300000000090000000000030\
030000000:000000300000000070000000000030\
030000000:000000333444444444444444400030\
030000000:000000300000000000000000000030\
0300333333333333300600000000000000000030\
0300000000000000000000000000000000000030\
03000000000000000000004000000040<0000030\
0338888888888888888334400000004433333330\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[[36,16,8,34,16]],"balances":[],"record":1777},

// 28
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
00000000000000=0000000009000000000000000\
00000000000000=0020F00099000000000000000\
00000000000000=0000G00999000:00000000000\
0000000000000055555555555000000000000000\
000000000000000000454000000000:000000000\
0000000000000000004540000000000000000000\
0000000000000000004540000000:00000000000\
0000000000000000004540000000000000000000\
000000000000000000454000000000:000000000\
0000000000000000004540000000000000000000\
0000000000000000004540000000:00000000000\
0000000000000000004540000000000000000000\
000000000000000000454000000000:000000000\
0000000000000006004540060000000000000000\
0000000000000000004540000000:00000000000\
0000000<000000000045400;0000000000000000\
0000005555555599955555555555555550000000\
0000000000000000000000000000000000000000","pipes":[[12,17,5,15,17]],"balances":[],"record":715},

// 29
{"hash":"0000000000000000000300000000000000000000\
0000000000000000000300000000000000000000\
0000000000000000000300000000000000000000\
0000000000000000000300000000000000000000\
0000000000000000000300000000000000000000\
0000000000000000000300000000000000000000\
0000000000000000000300000000000000000000\
0000000000000000000300000000000000000000\
0000000000000000000300000000000000000000\
0000000000000000000300000000000000000000\
0000000000000000000300000000000000000000\
0000000000000000000300000200000000000000\
0000000000000000000300000000000000000000\
0000000000000000000300000000000000000000\
0000000000000000000300000000000000000000\
00000000000<0<0<0<0300000000000000000000\
000000000F000000000300000000000000000000\
000000000G000000000300000000000000000000\
0000000033333333333333333333300000000000\
0000000000000000000000000000000000000000","pipes":[],"balances":[],"txt":"By the way, did you notice that           cubes can glitch through walls?  ","record":632},

// 30
{"hash":"0033333000000000000000000000000000000<00\
0030F03000000000<<0000000000000000000000\
0030G0300000<<00000000<<0000<00000040000\
00300030000000<<0000<<000000000002000000\
0030003000000000<<0000<<0000000000000000\
003000300000<<0000<<00000000000000000000\
00300030000000<<0000<<000000000004000000\
003000300000<<00000000<<0000000000000000\
00300030000000<<000000000000000000000000\
003000300000<<00000000<<0000000000000000\
00300030000000<<0000<<000000000000000000\
003000300000<<00000000000000000000000000\
0030003000000000000000<<0000000000000000\
00000000000000<<0000<<000000000000000000\
000000000000<<00000000<<0000000000000000\
0000000000000000000000000000000000000000\
0000000000007777000077770000000000000000\
0008888888888888888888888888888888800000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[[16,16,8,19,7],[18,16,8,16,7],[33,11,16,28,5]],"balances":[[4,3,36,1],[4,4,37,6],[4,5,37,11],[4,6,37,16],[4,7,9,16],[4,8,-1,16],[4,9,1,-1],[28,4,28,6]],"txt":"Thanks for playing! Please create and share levels now!","record":735}

];
