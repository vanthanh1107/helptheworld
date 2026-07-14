// ... (GIỮ NGUYÊN TẤT CẢ PHẦN TRÊN TRONG main_game.js CỦA BẠN CHO ĐẾN HÀM GAMELOOP) ...

function gameLoop() {
    if (Game.isGameOver) { Game.ctx.fillStyle = 'rgba(0,0,0,0.8)'; Game.ctx.fillRect(0,0,Game.width,Game.height); Game.ctx.fillStyle = 'red'; Game.ctx.font = '50px Teko'; Game.ctx.textAlign='center'; Game.ctx.fillText("NHIỆM VỤ THẤT BẠI", Game.width/2, Game.height/2); return; }
    if (Game.isGameWon) { Game.ctx.fillStyle = 'rgba(255,255,255,0.8)'; Game.ctx.fillRect(0,0,Game.width,Game.height); Game.ctx.fillStyle = '#27ae60'; Game.ctx.font = '50px Teko'; Game.ctx.textAlign='center'; Game.ctx.fillText("ĐỘT NHẬP THÀNH CÔNG!", Game.width/2, Game.height/2); return; }

    Game.camera.x = Math.max(0, Math.min(Game.localPlayer.x - Game.width/2, Game.mapWidth - Game.width));
    Game.camera.y = Math.max(0, Math.min(Game.localPlayer.y - Game.height/2, Game.mapHeight - Game.height));
    Game.worldMouse.x = Game.mouse.x + Game.camera.x; Game.worldMouse.y = Game.mouse.y + Game.camera.y;

    if (Assets.floorGrass.complete && Assets.floorGrass.naturalWidth > 0) {
        let pat = Game.ctx.createPattern(Assets.floorGrass, 'repeat'); Game.ctx.fillStyle = pat ? pat : '#3a4a35';
    } else { Game.ctx.fillStyle = '#3a4a35'; }
    Game.ctx.fillRect(0, 0, Game.width, Game.height); 

    Game.ctx.save(); FX.applyShake(Game.ctx); Game.ctx.translate(-Game.camera.x, -Game.camera.y);

    Game.ctx.fillStyle = 'rgba(46, 204, 113, 0.4)'; Game.ctx.fillRect(2800, 0, 200, Game.mapHeight); 
    Game.ctx.fillStyle = 'rgba(192, 57, 43, 0.6)';
    Game.bloodStains.forEach(s => { Game.ctx.beginPath(); Game.ctx.arc(s.x, s.y, s.radius, 0, Math.PI*2); Game.ctx.fill(); });
    Game.ctx.shadowColor = 'rgba(0,0,0,0.7)'; Game.ctx.shadowBlur = 15; Game.ctx.shadowOffsetY = 10; Game.ctx.shadowOffsetX = 10;

    Game.trees.forEach(t => {
        if(Assets.tree.complete && Assets.tree.naturalWidth > 0) { Game.ctx.drawImage(Assets.tree, t.x - t.radius, t.y - t.radius, t.radius*2, t.radius*2); } 
        else { Game.ctx.fillStyle = '#27ae60'; Game.ctx.beginPath(); Game.ctx.arc(t.x, t.y, t.radius, 0, Math.PI*2); Game.ctx.fill(); }
    });

    for (let i = Game.walls.length - 1; i >= 0; i--) {
        let w = Game.walls[i];
        if (w.isGate && Game.localPlayer.hasKey && Physics.getDistance(Game.localPlayer.x, Game.localPlayer.y, w.x, Game.localPlayer.y) < 100) { Game.walls.splice(i, 1); FX.triggerShake(10); AudioSys.play('reload'); continue; }
        
        if (w.isGate) { Game.ctx.fillStyle = '#f39c12'; Game.ctx.fillRect(w.x, w.y, w.w, w.h); } 
        else if (Assets.wallBrick.complete && Assets.wallBrick.naturalWidth > 0) {
            let pat = Game.ctx.createPattern(Assets.wallBrick, 'repeat'); Game.ctx.fillStyle = pat ? pat : '#2c3e50'; Game.ctx.fillRect(w.x, w.y, w.w, w.h);
        } else { Game.ctx.fillStyle = '#2c3e50'; Game.ctx.fillRect(w.x, w.y, w.w, w.h); }
        Game.ctx.strokeStyle = 'rgba(0,0,0,0.5)'; Game.ctx.lineWidth = 4; Game.ctx.strokeRect(w.x, w.y, w.w, w.h);
    }

    let isMobileShooting = Game.mobile && Game.mobile.isShooting;
    if ((Game.mouse.isDown || isMobileShooting) && Game.localPlayer) { WeaponSystem.shoot(Game.localPlayer); }

    Game.ctx.shadowColor = 'transparent';
    for (let i = Game.items.length - 1; i >= 0; i--) {
        let item = Game.items[i]; item.draw(Game.ctx);
        if (Physics.checkCircleCollision({x: item.x, y: item.y, radius: item.radius}, Game.localPlayer)) {
            Game.localPlayer.equipLoot(item.type); Game.items.splice(i, 1); 
        }
    }
    for (let i = Game.grenades.length - 1; i >= 0; i--) { let g = Game.grenades[i]; g.update(); g.draw(Game.ctx); if (g.isDestroyed) Game.grenades.splice(i, 1); }
    for (let i = Game.particles.length - 1; i >= 0; i--) { let p = Game.particles[i]; p.update(); p.draw(Game.ctx); if (p.life <= 0) Game.particles.splice(i, 1); }
    for (let i = Game.bullets.length - 1; i >= 0; i--) {
        let b = Game.bullets[i]; b.update(); b.draw(Game.ctx);
        if (b.x < 0 || b.x > Game.mapWidth || b.y < 0 || b.y > Game.mapHeight) b.isDestroyed = true;
        Game.walls.forEach(w => { if (Physics.checkCircleRectCollision(b, w)) b.isDestroyed = true; });
        if (b.isDestroyed) Game.bullets.splice(i, 1);
    }
    
    Game.ctx.shadowColor = 'rgba(0,0,0,0.7)'; 
    Game.players.forEach(p => {
        p.update(); Game.walls.forEach(w => Physics.resolveCircleRectCollision(p, w)); 
        Game.trees.forEach(t => Physics.resolveCircleRectCollision(p, {x: t.x-t.radius, y: t.y-t.radius, w: t.radius*2, h: t.radius*2})); 
        p.draw(Game.ctx); if (p.x > 2800) Game.isGameWon = true; 
    });

    for (let i = Game.zombies.length - 1; i >= 0; i--) {
        let z = Game.zombies[i]; z.update(); Game.walls.forEach(w => Physics.resolveCircleRectCollision(z, w)); z.draw(Game.ctx);
        if (Physics.checkCircleCollision(z, Game.localPlayer) && z.hp > 0) {
            Game.localPlayer.hp -= 1; UpdateHUD(Game.localPlayer); FX.triggerShake(5); FX.bloodSplatter(Game.localPlayer.x, Game.localPlayer.y); 
            if (Game.localPlayer.hp <= 100 && Game.localPlayer.hasArmor) { Game.localPlayer.hasArmor = false; UpdateHUD(Game.localPlayer); }
            if (Game.localPlayer.hp <= 0) Game.isGameOver = true;
        }

        for (let j = Game.bullets.length - 1; j >= 0; j--) {
            let b = Game.bullets[j];
            if (Physics.checkCircleCollision(z, b) && z.hp > 0) {
                let damage = (Game.localPlayer.currentWeapon === 'shotgun') ? 2 : 1; 
                z.hp -= damage; b.isDestroyed = true; z.isAwake = true; 
                FX.bloodSplatter(b.x, b.y); FX.showDamage(z.x, z.y, damage, '#f1c40f'); AudioSys.play('hit', 0.2); 
                if (z.hp <= 0) { Game.score += z.score; UpdateHUD(Game.localPlayer); ItemSystem.dropFromZombie(z.x, z.y); Game.zombies.splice(i, 1); break; }
            }
        }
    }

    // --- SỬA LỖI QUÁ TỐI Ở ĐÂY ---
    Game.ctx.shadowColor = 'transparent'; 
    Game.ctx.fillStyle = 'rgba(5, 7, 12, 0.82)'; // GIẢM ĐỘ TỐI XUỐNG CÒN 82% CHO SÁNG HƠN
    Game.ctx.fillRect(Game.camera.x, Game.camera.y, Game.width, Game.height);
    Game.ctx.globalCompositeOperation = 'destination-out';

    // TĂNG VÒNG SÁNG QUANH NGƯỜI LÊN 220px
    let ambientLight = Game.ctx.createRadialGradient(Game.localPlayer.x, Game.localPlayer.y, 0, Game.localPlayer.x, Game.localPlayer.y, 220);
    ambientLight.addColorStop(0, 'rgba(255, 255, 255, 1)'); ambientLight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    Game.ctx.fillStyle = ambientLight; Game.ctx.beginPath(); Game.ctx.arc(Game.localPlayer.x, Game.localPlayer.y, 220, 0, Math.PI*2); Game.ctx.fill();

    let aimAngle = (Game.mobile && Game.mobile.isShooting) ? Game.mobile.aimAngle : Physics.getAngle(Game.localPlayer.x, Game.localPlayer.y, Game.worldMouse.x, Game.worldMouse.y);
    let beamLight = Game.ctx.createRadialGradient(Game.localPlayer.x, Game.localPlayer.y, 0, Game.localPlayer.x, Game.localPlayer.y, 500);
    beamLight.addColorStop(0, 'rgba(255, 255, 255, 0.8)'); beamLight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    Game.ctx.fillStyle = beamLight; 
    Game.ctx.beginPath(); Game.ctx.moveTo(Game.localPlayer.x, Game.localPlayer.y); Game.ctx.arc(Game.localPlayer.x, Game.localPlayer.y, 500, aimAngle - 0.5, aimAngle + 0.5); Game.ctx.fill();

    if (Game.explosionLight && Game.explosionLight.life > 0) {
        let exLight = Game.ctx.createRadialGradient(Game.explosionLight.x, Game.explosionLight.y, 0, Game.explosionLight.x, Game.explosionLight.y, 450);
        exLight.addColorStop(0, `rgba(255, 255, 255, ${Game.explosionLight.life/10})`); exLight.addColorStop(1, 'rgba(255, 255, 255, 0)');
        Game.ctx.fillStyle = exLight; Game.ctx.beginPath(); Game.ctx.arc(Game.explosionLight.x, Game.explosionLight.y, 450, 0, Math.PI*2); Game.ctx.fill(); Game.explosionLight.life--;
    }
    Game.ctx.globalCompositeOperation = 'source-over';

    for (let i = Game.floatingTexts.length - 1; i >= 0; i--) { let ft = Game.floatingTexts[i]; ft.update(); ft.draw(Game.ctx); if (ft.life <= 0) Game.floatingTexts.splice(i, 1); }
    Game.ctx.restore(); requestAnimationFrame(gameLoop);
}
