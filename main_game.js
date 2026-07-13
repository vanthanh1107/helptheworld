Game.trees = []; 

window.initZombieGame = function() {
    Game.canvas = document.getElementById('battleCanvas'); Game.ctx = Game.canvas.getContext('2d');
    
    // Xử lý phím & Chuột (Giữ nguyên như cũ)
    window.addEventListener('keydown', e => { if(e.key==='w'||e.key==='W') Game.keys.w=true; if(e.key==='a'||e.key==='A') Game.keys.a=true; if(e.key==='s'||e.key==='S') Game.keys.s=true; if(e.key==='d'||e.key==='D') Game.keys.d=true; });
    window.addEventListener('keyup', e => { if(e.key==='w'||e.key==='W') Game.keys.w=false; if(e.key==='a'||e.key==='A') Game.keys.a=false; if(e.key==='s'||e.key==='S') Game.keys.s=false; if(e.key==='d'||e.key==='D') Game.keys.d=false; });
    Game.canvas.addEventListener('mousemove', e => { let r = Game.canvas.getBoundingClientRect(); Game.mouse.x = e.clientX-r.left; Game.mouse.y = e.clientY-r.top; });
    Game.canvas.addEventListener('mousedown', () => { Game.mouse.isDown = true; Game.mouse.justClicked = true; }); Game.canvas.addEventListener('mouseup', () => Game.mouse.isDown = false);

    NetworkManager.initLocalPlayer();
    Game.localPlayer.x = 100; Game.localPlayer.y = 300;

    // 1. TẠO RỪNG CÂY (Chướng ngại vật hình tròn xanh lá)
    for(let i=0; i<30; i++) {
        Game.trees.push({x: 300 + Math.random()*500, y: Math.random()*Game.mapHeight, radius: 25});
    }

    // 2. TẠO CÁC TÒA NHÀ & CỔNG KHÓA
    Game.walls = [
        {x: 1000, y: 100, w: 250, h: 400}, // Bệnh viện hoang
        {x: 1800, y: 0, w: 400, h: 200},   // Trại quân sự trên
        {x: 1800, y: 400, w: 400, h: 200}, // Trại quân sự dưới
        // CỔNG SẮT KHÓA (Sẽ mở khi có Key)
        {x: 2600, y: 0, w: 30, h: 600, isGate: true} 
    ];

    // 3. RẢI VẬT PHẨM TRÊN BẢN ĐỒ
    Game.items.push(new GroundItem(1125, 300, 'armor')); // Giáp trong bệnh viện
    Game.items.push(new GroundItem(1400, 500, 'machine_gun')); // Súng rơi dọc đường
    Game.items.push(new GroundItem(2000, 300, 'key')); // CHÌA KHÓA nằm giữa trại quân sự đầy Zombie!

    // 4. RẢI 35 ZOMBIE 
    for(let i = 0; i < 35; i++) {
        // Càng về cuối (gần chìa khóa và cổng), zombie càng đông
        Game.zombies.push(new ZombieWalker(800 + Math.random() * 1800, Math.random() * Game.mapHeight));
    }

    gameLoop();
};

function gameLoop() {
    if (Game.isGameOver) { Game.ctx.fillStyle = 'rgba(0,0,0,0.7)'; Game.ctx.fillRect(0,0,Game.width,Game.height); Game.ctx.fillStyle = 'red'; Game.ctx.font = '40px Arial'; Game.ctx.fillText("BẠN ĐÃ CHẾT!", Game.width/2-120, Game.height/2); return; }
    if (Game.isGameWon) { Game.ctx.fillStyle = 'rgba(255,255,255,0.8)'; Game.ctx.fillRect(0,0,Game.width,Game.height); Game.ctx.fillStyle = '#27ae60'; Game.ctx.font = '40px Arial'; Game.ctx.fillText("VỀ ĐÍCH THÀNH CÔNG!", Game.width/2-200, Game.height/2); return; }

    Game.camera.x = Math.max(0, Math.min(Game.localPlayer.x - Game.width/2, Game.mapWidth - Game.width));
    Game.camera.y = Math.max(0, Math.min(Game.localPlayer.y - Game.height/2, Game.mapHeight - Game.height));
    Game.worldMouse.x = Game.mouse.x + Game.camera.x; Game.worldMouse.y = Game.mouse.y + Game.camera.y;

    // VẼ NỀN ĐẤT
    Game.ctx.fillStyle = '#2c3e50'; Game.ctx.fillRect(0, 0, Game.width, Game.height);
    Game.ctx.save(); Game.ctx.translate(-Game.camera.x, -Game.camera.y);

    // VẼ KHU AN TOÀN
    Game.ctx.fillStyle = 'rgba(46, 204, 113, 0.3)'; Game.ctx.fillRect(2800, 0, 200, Game.mapHeight);
    
    // VẼ CÂY CỐI
    Game.trees.forEach(t => {
        Game.ctx.fillStyle = '#27ae60'; Game.ctx.beginPath(); Game.ctx.arc(t.x, t.y, t.radius, 0, Math.PI*2); Game.ctx.fill();
        Game.ctx.fillStyle = '#2ecc71'; Game.ctx.beginPath(); Game.ctx.arc(t.x-5, t.y-5, t.radius-5, 0, Math.PI*2); Game.ctx.fill();
    });

    // VẼ NHÀ & CỔNG
    for (let i = Game.walls.length - 1; i >= 0; i--) {
        let w = Game.walls[i];
        
        // Nếu là cổng sắt và người chơi có chìa khóa -> Xóa cổng (Mở cửa)
        if (w.isGate && Game.localPlayer.hasKey && Physics.getDistance(Game.localPlayer.x, Game.localPlayer.y, w.x, Game.localPlayer.y) < 100) {
            Game.walls.splice(i, 1); 
            continue; 
        }

        Game.ctx.fillStyle = w.isGate ? '#f39c12' : '#444'; // Cổng màu cam, nhà màu xám
        Game.ctx.fillRect(w.x, w.y, w.w, w.h);
        Game.ctx.strokeStyle = '#222'; Game.ctx.lineWidth = w.isGate ? 8 : 4; Game.ctx.strokeRect(w.x, w.y, w.w, w.h);
        
        if(w.isGate) {
            Game.ctx.fillStyle = '#fff'; Game.ctx.font = '20px Arial'; Game.ctx.fillText(Game.localPlayer.hasKey ? "ĐANG MỞ CỬA..." : "CẦN CHÌA KHÓA!", w.x - 70, Game.mapHeight/2);
        }
    }

    if (Game.mouse.isDown && Game.localPlayer) { WeaponSystem.shoot(Game.localPlayer); }

    // Cập nhật Vật phẩm nhặt được
    for (let i = Game.items.length - 1; i >= 0; i--) {
        let item = Game.items[i]; item.draw(Game.ctx);
        if (Physics.checkCircleCollision({x: item.x, y: item.y, radius: item.radius}, Game.localPlayer)) {
            Game.localPlayer.equipLoot(item.type); Game.items.splice(i, 1); 
        }
    }

    // Cập nhật Đạn
    for (let i = Game.bullets.length - 1; i >= 0; i--) {
        let b = Game.bullets[i]; b.update(); b.draw(Game.ctx);
        if (b.x < 0 || b.x > Game.mapWidth || b.y < 0 || b.y > Game.mapHeight) b.isDestroyed = true;
        Game.walls.forEach(w => { if (Physics.checkCircleRectCollision(b, w)) b.isDestroyed = true; });
        if (b.isDestroyed) Game.bullets.splice(i, 1);
    }

    // Cập nhật Người chơi (Kiểm tra va chạm với Nhà, Cây)
    Game.players.forEach(p => {
        p.update();
        Game.walls.forEach(w => Physics.resolveCircleRectCollision(p, w)); 
        Game.trees.forEach(t => Physics.resolveCircleRectCollision(p, {x: t.x-t.radius, y: t.y-t.radius, w: t.radius*2, h: t.radius*2})); // Dùng tạm hàm box cho cây
        p.draw(Game.ctx);
        if (p.x > 2800) Game.isGameWon = true; 
    });

    // Cập nhật Zombie
    for (let i = Game.zombies.length - 1; i >= 0; i--) {
        let z = Game.zombies[i]; z.update();
        Game.walls.forEach(w => Physics.resolveCircleRectCollision(z, w));
        z.draw(Game.ctx);

        if (Physics.checkCircleCollision(z, Game.localPlayer)) {
            Game.localPlayer.hp -= 1; document.getElementById('hp-display').innerText = "❤️ HP: " + Game.localPlayer.hp;
            if (Game.localPlayer.hp <= 100 && Game.localPlayer.hasArmor) { Game.localPlayer.hasArmor = false; document.getElementById('armor-display').style.display = 'none'; }
            if (Game.localPlayer.hp <= 0) Game.isGameOver = true;
        }

        for (let j = Game.bullets.length - 1; j >= 0; j--) {
            let b = Game.bullets[j];
            if (Physics.checkCircleCollision(z, b)) {
                z.hp -= 1; b.isDestroyed = true; z.isAwake = true; 
                if (z.hp <= 0) {
                    Game.score += 10; document.getElementById('score-display').innerText = "ĐIỂM: " + Game.score;
                    ItemSystem.dropFromZombie(z.x, z.y); // RỚT ĐỒ KHI CHẾT
                    Game.zombies.splice(i, 1); break; 
                }
            }
        }
    }
    Game.ctx.restore(); requestAnimationFrame(gameLoop);
}
