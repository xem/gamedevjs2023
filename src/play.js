
// Game loop
var play = () => {

  // Reset canvas
  a.width ^= 0;
  
  // Draw exit button
  c.font = "bold 30px courier";
  c.fillStyle = "#000";
  c.fillText("×", 1255, 25);
  
  // First levels: add text
  if(last_screen == 1){
    c.font = "bold 30px courier";
    c.fillStyle = "black";
    c.textAlign = "center";
    c.fillText(level_data.txt || "", 640, level == 6 ? 60:80);
    if(level == 1) c.fillText("Use the red button to move the platform", 640, 120);
    if(level == 1) c.fillText("Press Space to use Overlord's Time Machine", 640, 160);
    if(level == 1) c.fillText("Bring the time crystal back to the Time Machine to win", 640, 200);
  }
  
  // Save keys being pressed (for latest hero only)
  if(current_hero.keyleft){
    current_hero.left[frame] = true;
  }
  if(current_hero.keyright){
    current_hero.right[frame] = true;
  }
  if(current_hero.keyup){
    current_hero.up[frame] = true;
  }
  
  // Pixelize graphics
  c.mozImageSmoothingEnabled = false;
  c.imageSmoothingEnabled = false;
  
  // On first frame:
  // ---------------
  if(frame == 0){
    
    // Init states of pipes, cubes, balances...
    first_frame();
  }
  
  c.scale(2,2);
  
  // Then, at each frame:
  // --------------------
  
  for(i in level_data.balances){
    c.beginPath();
    c.fillStyle = "#000";
    c.fillRect(level_data.balances[i][0] * 32 - 16, balances_state[i].y1 + 40 + 8, 64, 999);
    c.fillRect(level_data.balances[i][2] * 32 - 16, balances_state[i].y2 + 40 + 8, 64, 999);
    c.closePath();
  }
  
  // Draw map
  parse_draw_map();
  
  // Move and draw pipes
  move_draw_pipes();
  // Reset all mechanisms
  reset_mechanisms();
  

  
  // Replay previous heros inputs
  for(hero in heros){
    play_hero(heros[hero], 1);
  }
  
  if(heros.length){
    hero = -1;
  }
  else{
    hero = 0;
  }
  
  // Play current hero
  play_hero(current_hero);
  
  // Move and draw cubes
  move_cubes();
    
  // Draw previous heros
  for(hero in heros){
    draw_hero(heros[hero], 1);
  }
  
  // Draw current hero
  draw_hero(current_hero);
  
  // Draw tiles that have portals, and portals in foreground
  //draw_portals();
  
  // Mechanisms
  // ==========
  
  // Update mechanisms (yellow toggles / balances)
  update_mechanisms();
  
  // Next frame
  frame++;
  
  // Chrono
  if(!win){
    chrono++;
  }
  
  //document.title = frame;
  //document.title = heros[0].pickdrop;
  
  // Victoty animation (if we won) / Game over animation (if we lose)
  victory_or_defeat();
}
