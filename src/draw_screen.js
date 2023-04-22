// Draw current screen (on load, when draw_screen is called, and when the hash changes)
// If no_reset is set, update the level editor without loading the map from the hash
var draw_screen = onload = onhashchange = (no_reset) => {
  
  // Reset canvas
  a.width ^= 0;
  
  // Global text settings
  c.font = "bold 30px courier";
  c.textAlign = "center";
  
  // Pixelize graphics
  c["mozImageSmoothingEnabled"] = false;
  c["imageSmoothingEnabled"] = false;
  
  // Main menu
  // =========

  if(screen == 0){
    
    // Cursor
    a.style.cursor = "pointer";
    
    // Background
    level_data = {"hash":"0","pipes":[],"balances":[]};

    heros = [,];
    first_frame();
    parse_draw_map();
 
    // Show title
    //c.drawImage(tileset, 512, 0, 70, 16, 120, 150, 280, 64);
    //c.drawImage(tileset, 583, 0, 270, 16, 120, 250, 1080, 64);

    // Draw buttons
    c.fillStyle = "#000";
    c.beginPath();
    c.fillRect(500, 400, 100, 80);
    c.fillRect(650, 400, 100, 80);
    c.fillStyle = "#fff";
    c.fillText("MAKE", 700, 450);
    c.fillText("PLAY", 550, 450);
    c.stroke();
    c.closePath();
  }
  
  // Level selection menu
  // ====================
  
  if(screen == 1){
    
    
    
    // Cursor
    a.style.cursor = "pointer";
    
    c.beginPath();
    c.fillStyle = "#000";
    c.font = "bold 50px courier"
    c.fillText("Levels", 600,80);
    c.fillText("Bonus", 300,400);
    c.fillText("Music", 1100,430);
    
    c.font = "bold 25px courier"
    //c.fillRect(590, 520, 100, 80);
    k = 0;
    for(i = 0; i < 10; i++){
      for(j = 0; j < 2; j++){
        l = j * 10 + i + 1;
        c.fillStyle = "#000";
        c.fillRect(i * 120 + 50, j * 100 + 120, 100, 80);
        c.fillStyle = "#fff";
        c.fillText(+localStorage["chronorobot"] >= (l-2) ? l : "?", i * 120 + 100, j * 100 + 170);
        if(localStorage["chronorobot" + l] <= levels[l].record){
          c.fillText("🏅", i * 120 + 135, j * 100 + 145);
        }
        k += (+localStorage["chronorobot" + l] || 0);
      }
    }
    
    totaltime=k;
    
    
    c.fillStyle = (+localStorage["chronorobot"] >= 21 ? "#000" : "#888");
    c.fillRect(50,450,500,100);
    c.fillStyle = (k <= 11730 ? "#000" : "#888");
    c.fillRect(50,570,500,100);
    c.font = "bold 30px courier"
    c.fillStyle = "#fff";
    c.fillText("Level editor",290,490);
    c.font = "bold 25px courier"
    c.fillText("(complete the game to unlock)",290,530);
    
    c.font = "bold 30px courier"
    c.fillStyle = "#fff";
    c.fillText("Web3 Leaderboards / shop",290,610);
    c.font = "bold 25px courier"
    c.fillText("(beat the dev times to unlock)",290,650);
    console.log(k);
    
    
    
    c.fillStyle = "#000";
    
    c.fillRect(1050,450,100,70);
    c.fillStyle = "#FFF";
    c.font = "bold 50px courier";
    c.fillText(musicon ? "ON" : "OFF", 1100, 500);
    //c.fillText("◀", 70, 70);
    //c.fillText("JS13K LEVELS", 640, 70);
    //c.fillText("TWITTER LEVELS", 640, 470);
    //c.fillText("GO", 640, 570);
    if(k){
      c.font = "bold 30px courier";
      c.fillText("Total time: " + ~~((k / 30) / 60) + ":" + ("0" + ((k / 30) % 60).toFixed(2)).slice(-5), 1050, 350);
    }
    c.stroke();
    c.closePath();
    
    c.drawImage(arc, 970, 550, 300, 313);
    c.drawImage(ol, 650, 380, 400, 400);
    c.drawImage(rob, 600, 570, 123, 202);
      
  }
  
  // Playing
  // =======
  
  if(screen == 2){
    
    // Cursor
    a.style.cursor = "pointer";
    
    
    if(loop){
      clearInterval(loop);
    }
    reset_current_level();
    loop = setInterval(play, 33);
    

  }
  
  // Level editor
  // ============
  
  if(screen == 3){
    
    // Cursor
    a.style.cursor = "pointer";
    
    c.strokeStyle = "#777";
    c.lineWidth = 1;
    
    // White BG (all screen)
    c.fillStyle = "#fff";
    c.fillRect(0, 0, 1280, 648);
    
    // Blue BG (tileset, grid)
    c.fillStyle = "#fff";
    c.fillRect(0, 40, 1280, 640);
    
    c.beginPath();
    
    // Tileset
    for(i = 0; i < 16; i++){
      c.fillRect(8 + i * 35, 3, 32, 32);      
      c.rect(8 + i * 35, 3, 32, 32);
      draw_sprite(i, 8 + i * 35, 3);
    }
    
    c.stroke();
    c.closePath();
    
    // Tiles on grid
    if(!no_reset){
      if(level_data.hash){
        level_data.tiles = [];
        for(var j = 0; j < 20; j++){
          level_data.tiles[j] = [];
          for(var i = 0; i < 40; i++){
            level_data.tiles[j][i] = level_data.hash.charCodeAt(j * 40 + i) - 0x30;
          }
        }
      }
    }
  
    for(j = 0; j < level_data.tiles.length; j++){
      for(i = 0; i < level_data.tiles[j].length; i++){
        drawn_tile = level_data.tiles[j][i];
        draw_tile(drawn_tile, i, j);
        
        // Special cases
        
        // Tile #2: draw flag pole
        if(drawn_tile == 2){
          end_pole = false;
          if(j < 20){
            for(k = j + 1; k < 20; k++){
              if(!level_data.tiles[k][i] && !end_pole){
                draw_tile(24, i, k);
              }
              else{
                end_pole = true;
              }
            }
          }
        }
      }
    }
    
    // Pipes
    for(i in level_data.pipes){
      
      pipe_low = level_data.pipes[i][1];
      
      // If the two positions of the pipe were placed
      if(level_data.pipes[i][2]){
        
        // Pipe body between low ang high (we save it in the map to avoid overwrite)
        pipe_high = level_data.pipes[i][1] < level_data.pipes[i][2] ? level_data.pipes[i][1] : level_data.pipes[i][2];
        pipe_low = level_data.pipes[i][1] < level_data.pipes[i][2] ? level_data.pipes[i][2] : level_data.pipes[i][1];
        for(k = pipe_high + 1; k < pipe_low; k++){
          draw_tile(18, level_data.pipes[i][0], k);
          draw_tile(19, level_data.pipes[i][0] + 1, k);
          level_data.tiles[k][level_data.pipes[i][0]] = 18;
          level_data.tiles[k][level_data.pipes[i][0] + 1] = 19;
        }
      }
      
      // If the first position of the pipe was placed
      if(level_data.pipes[i][1]){
        
        // Pipe body below low position (can be overwritten)
        end_pipe = false;
        for(k = pipe_low ; k < 21; k++){
          if(k < 20 && !level_data.tiles[k][level_data.pipes[i][0]] && !level_data.tiles[k][level_data.pipes[i][0] + 1] && !end_pipe){
            draw_tile(18, level_data.pipes[i][0], k);
            draw_tile(19, level_data.pipes[i][0] + 1, k);
          }
          else{
            end_pipe = true;
          }
        }
      }
      
      // Pipe position 1
      if(level_data.pipes[i][1]){
        draw_tile(16, level_data.pipes[i][0], level_data.pipes[i][1]);
        draw_tile(17, level_data.pipes[i][0] + 1, level_data.pipes[i][1]);
        level_data.tiles[level_data.pipes[i][1]][level_data.pipes[i][0]] = 16;
        level_data.tiles[level_data.pipes[i][1]][level_data.pipes[i][0] + 1] = 17;
        
      }
      
      // Pipe position 2
      if(level_data.pipes[i][2]){
        draw_tile(16, level_data.pipes[i][0], level_data.pipes[i][2]);
        draw_tile(17, level_data.pipes[i][0] + 1, level_data.pipes[i][2]);
        level_data.tiles[level_data.pipes[i][2]][level_data.pipes[i][0]] = 16;
        level_data.tiles[level_data.pipes[i][2]][level_data.pipes[i][0] + 1] = 17;
      }
      
      // Switch
      if(level_data.pipes[i][4]){
        draw_tile(20, level_data.pipes[i][3], level_data.pipes[i][4]);
      }
    }
    
    // Balances
    for(i in level_data.balances){
      
      // Draw line and balance 2
      if(level_data.balances[i][3]){
        
        // Draw line
        //c.beginPath();
        //c.strokeStyle = "#000";
        c.fillStyle = "#000";
        //c.lineWidth = 2;
        //c.moveTo(level_data.balances[i][0] * 32 + 16, level_data.balances[i][1] * 32 + 40 + 8);
        //c.lineTo(level_data.balances[i][2] * 32 + 16, level_data.balances[i][3] * 32 + 40 + 8);
        //c.stroke();
        //c.fillRect(100, 100, 100, 999);
        c.fillRect(level_data.balances[i][0] * 32 + 16, level_data.balances[i][1] * 32 + 40 + 8, 32, 999);
        c.fillRect(level_data.balances[i][2] * 32 + 16, level_data.balances[i][3] * 32 + 40 + 8, 32, 999);
        //c.closePath();
      
        // Balance 2
        draw_tile(15, level_data.balances[i][2] - 1, level_data.balances[i][3]);
        draw_tile(15, level_data.balances[i][2], level_data.balances[i][3]);
        draw_tile(15, level_data.balances[i][2] + 1, level_data.balances[i][3]);
        
        level_data.tiles[level_data.balances[i][3]][level_data.balances[i][2] - 1] = 15;
        level_data.tiles[level_data.balances[i][3]][level_data.balances[i][2]] = 15;
        level_data.tiles[level_data.balances[i][3]][level_data.balances[i][2] + 1] = 15;
      }
      
      // Draw balance 1
      if(level_data.balances[i][1]){
        draw_tile(15, level_data.balances[i][0] - 1, level_data.balances[i][1]);
        draw_tile(15, level_data.balances[i][0], level_data.balances[i][1]);
        draw_tile(15, level_data.balances[i][0] + 1, level_data.balances[i][1]);
        
        level_data.tiles[level_data.balances[i][1]][level_data.balances[i][0] - 1] = 15;
        level_data.tiles[level_data.balances[i][1]][level_data.balances[i][0]] = 15;
        level_data.tiles[level_data.balances[i][1]][level_data.balances[i][0] + 1] = 15;
      }
    }
    
    
    // Show the tile being placed:
    if(tile_y >= 0 && !rightclick){
      
      // Special cases:
      // Tile #1: time machine
      if(current_editor_tile == 1){
        if(tile_y > 0){
          draw_tile(22, tile_x, tile_y - 1);
          draw_tile(23, tile_x, tile_y);
        }
      }
      
      // Tile #14: pipe
      else if(current_editor_tile == 14){
        if(pipe_click == 0){
          draw_tile(16, tile_x, tile_y);
          draw_tile(17, tile_x + 1, tile_y);
        }
        if(pipe_click == 1){
          draw_tile(16, level_data.pipes[current_pipe][0], tile_y);
          draw_tile(17, level_data.pipes[current_pipe][0] + 1, tile_y);
        }
        if(pipe_click == 2){
          draw_tile(20, tile_x, tile_y);
        }
      }
      
      // Tile #15: balance
      else if(current_editor_tile == 15){
        draw_tile(15, tile_x - 1, tile_y);
        draw_tile(15, tile_x, tile_y);
        draw_tile(15, tile_x + 1, tile_y);
      }
      
      // Normal case:
      else {
        draw_tile(current_editor_tile, tile_x, tile_y);
      }
    }
    
    // Grid
    c.beginPath();
    c.strokeStyle = "#777";
    c.lineWidth = 1;
    for(i = 0; i < 21; i++){
      c.moveTo(i * 32, 40);
      c.lineTo(i * 32, 648);
    }
    for(j = 0; j < 12; j++){
      c.moveTo(0, 40 + j * 32);
      c.lineTo(1280, 40 + j * 32);
    }
    
    // Buttons
    c.fillStyle = "#000";
    c.fillRect(750, 4, 100, 32);
    c.fillRect(875, 4, 100, 32);
    c.fillRect(1000, 4, 100, 32);
    c.fillRect(1125, 4, 100, 32);
    c.fillStyle = "#fff";
    c.font = "bold 20px courier";
    c.fillText("TEST", 800, 28);
    c.fillText("SHARE", 925, 28);
    c.fillText("CLEAR", 1050, 28);
    c.fillText("EXIT", 1175, 28);
    c.stroke();
    c.closePath();
    
    // Current tile on the tileset
    c.beginPath();
    i = current_editor_tile;
    c.strokeStyle = "red";
    c.lineWidth = 3;
    c.rect(8 + i * 35, 3.5, 32, 32);
    c.stroke();
    c.closePath();
  }
}
