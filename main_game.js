window.initZombieGame = function() {
    Game.canvas = document.getElementById('battleCanvas');
    Game.ctx = Game.canvas.getContext('2d');
    
    window.addEventListener('keydown', e => {
        if (e.key === 'w' || e.key === 'W') Game.keys.w = true;
        if (e.key === 'a' || e.key === 'A') Game.keys.a = true;
        if (e.key === 's' || e.key === 'S') Game.keys.s = true;
        if (e.key === 'd' || e.key === 'D') Game.keys.d = true;
    });
    window.addEventListener('keyup', e => {
        if (e.key === 'w' || e.key === 'W') Game.keys.w = false;
        if (e.key === 'a' || e.key === 'A') Game.keys.a = false;
        if (e.key === 's' || e.key === 'S') Game.keys.s = false;
        if (e.key === 'd' || e.key === 'D') Game.keys.d = false;
    });

    Game.canvas.addEventListener('mousemove', e => {
        let rect = Game.canvas.getBoundingClientRect();
        Game.mouse.x = e.clientX - rect.left;
        Game.mouse.y = e.clientY - rect.top;
    });
    Game.canvas.addEventListener('mousedown', () => { Game.mouse.isDown = true; Game.mouse.justClicked = true; });
    Game.canvas.addEventListener('mouseup', () => Game.mouse.isDown = false);

    NetworkManager.initLocalPlayer();
    
    // Đặt người chơi ở vạch xuất phát (bên trái map)
    Game.localPlayer.x = 100;
    Game.localPlayer.y = 300;

    // THIẾT KẾ MÀN CHƠI DÀI 3000px
    Game.walls = [
        // Chướng ngại vật khu 1
        {x: 400, y: 0, w: 100, h: 250}, {x: 400, y: 350, w: 100, h: 250}, 
        // Trạm gác khu 2 (có thùng đồ)
        {x: 1000, y: 200, w: 200, h: 200}, 
        // Mê cung khu 3
        {x: 1600, y: 0, w: 50, h: 400}, {x: 1800, y: 200, w: 50, h: 400},
        {x: 2200, y: 100, w: 300, h: 100}, {x: 2200, y: 400, w: 300, h: 100}
    ];

    // Đặt thùng đồ vào các nhà
    Game.crates.push(new LootCrate(1100, 300)); // Trong trạm gác
    Game.crates.push(new LootCrate(1700, 100)); // Góc kẹt mê cung
    Game.crates.push(new LootCrate(2350, 300)); // Trước khi về đích

    // Đặt sẵn 25 Zombie trên dọc đường (Càng về sau càng đông)
    for(let i = 0; i < 25; i++) {
        let zx = 600 + Math.random() * 2000; // Xếp zombie từ tọa độ 600 đến 2600
        let zy = Math.random() * Game.mapHeight;
        Game.zombies.push(new ZombieWalker(zx, zy));
    }

    gameLoop();
};

function gameLoop() {
    // 1. Kiểm tra trạng thái trò chơi
    if (Game.isGameOver) {
        Game.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; Game.ctx.fillRect(0, 0, Game.width, Game.height);
        Game.ctx.fillStyle = 'red'; Game.ctx.font = '40px Arial'; Game.ctx.fillText("BẠN ĐÃ CHẾT!", Game.width/2 - 120, Game.height/2);
        return; 
    }
    if (Game.isGameWon) {
        Game.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; Game.ctx.fillRect(0, 0, Game.width, Game.height);
        Game.ctx.fillStyle = '#27ae60'; Game.ctx.font = '40px Arial'; Game.ctx.fillText("VỀ ĐÍCH THÀNH CÔNG!", Game.width/2 - 200, Game.height/2);
        return; 
    }

    // 2. CẬP NHẬT CAMERA THEO NHÂN VẬT
    Game.camera.x = Game.localPlayer.x - Game.width / 2;
    Game.camera.y = Game.localPlayer.y - Game.height / 2;
    // Khóa camera không cho trượt ra ngoài rìa bản đồ
    Game.camera.x = Math.max(0, Math.min(Game.camera.x, Game.mapWidth - Game.width));
    Game.camera.y = Math.max(0, Math.min(Game.camera.y, Game.mapHeight - Game.height));

    // Đồng bộ tọa độ chuột thế giới
    Game.worldMouse.x = Game.mouse.x + Game.camera.x;
    Game.worldMouse.y = Game.mouse.y + Game.camera.y;

    // 3. VẼ ĐỒ HỌA VỚI CAMERA
    Game.ctx.clearRect(0, 0, Game.width, Game.height);
    Game.ctx.save();
    Game.ctx.translate(-Game.camera.x, -Game.camera.y); // Dịch chuyển thế giới ngược chiều camera

    // Vẽ Vạch đích (Safe Zone)
    Game.ctx.fillStyle = 'rgba(46, 204, 113, 0.3)';
    Game.ctx.fillRect(2800, 0, 200, Game.mapHeight);
    Game.ctx.fillStyle = '#2ecc71'; Game.ctx.font = '30px Arial'; Game.ctx.fillText("KHU VỰC AN TOÀN", 2810, 300);

    // VẼ CÁC NGÔI NHÀ
    Game.ctx.fillStyle = '#444';
    Game.walls.forEach(w => {
        Game.ctx.fillRect(w.x, w.y, w.w, w.h);
        Game.ctx.strokeStyle = '#222'; Game.ctx.lineWidth = 4;
        Game.ctx.strokeRect(w.x, w.y, w.w, w.h);
    });

    if (Game.mouse.isDown && Game.localPlayer) { WeaponSystem.shoot(Game.localPlayer); }

    // Xử lý Thùng đồ
    for (let i = Game.crates.length - 1; i >= 0; i--) {
        let c = Game.crates[i]; c.draw(Game.ctx);
        if (Physics.checkCircleCollision(c, Game.localPlayer)) {
            Game.localPlayer.equipLoot(c.type); Game.crates.splice(i, 1); 
        }
    }

    // Xử lý Đạn
    for (let i = Game.bullets.length - 1; i >= 0; i--) {
        let b = Game.bullets[i]; b.update(); b.draw(Game.ctx);
        if (b.x < 0 || b.x > Game.mapWidth || b.y < 0 || b.y > Game.mapHeight) b.isDestroyed = true;
        Game.walls.forEach(w => { if (Physics.checkCircleRectCollision(b, w)) b.isDestroyed = true; });
        if (b.isDestroyed) Game.bullets.splice(i, 1);
    }

    // Xử lý Người chơi
    Game.players.forEach(p => {
        p.update();
        Game.walls.forEach(w => Physics.resolveCircleRectCollision(p, w)); 
        p.draw(Game.ctx);
        
        // KIỂM TRA ĐIỀU KIỆN CHIẾN THẮNG
        if (p.x > 2800) Game.isGameWon = true; 
    });

    // Xử lý Zombie
    for (let i = Game.zombies.length - 1; i >= 0; i--) {
        let z = Game.zombies[i]; z.update();
        Game.walls.forEach(w => Physics.resolveCircleRectCollision(z, w));
        z.draw(Game.ctx);

        if (Physics.checkCircleCollision(z, Game.localPlayer)) {
            Game.localPlayer.hp -= 1; document.getElementById('hp-display').innerText = "❤️ HP: " + Game.localPlayer.hp;
            if (Game.localPlayer.hp <= 100 && Game.localPlayer.hasArmor) {
                Game.localPlayer.hasArmor = false; document.getElementById('armor-display').style.display = 'none';
            }
            if (Game.localPlayer.hp <= 0) Game.isGameOver = true;
        }

        for (let j = Game.bullets.length - 1; j >= 0; j--) {
            let b = Game.bullets[j];
            if (Physics.checkCircleCollision(z, b)) {
                z.hp -= 1; b.isDestroyed = true; z.isAwake = true; 
                if (z.hp <= 0) {
                    Game.score += 10; document.getElementById('score-display').innerText = "ĐIỂM: " + Game.score;
                    Game.zombies.splice(i, 1); break; 
                }
            }
        }
    }
    
    // Kết thúc việc vẽ Camera
    Game.ctx.restore(); 
    requestAnimationFrame(gameLoop);
}
