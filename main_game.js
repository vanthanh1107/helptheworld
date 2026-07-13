window.initZombieGame = function() {
    Game.canvas = document.getElementById('battleCanvas');
    Game.ctx = Game.canvas.getContext('2d');
    
    // Gắn sự kiện bàn phím
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

    // Sự kiện chuột
    Game.canvas.addEventListener('mousemove', e => {
        let rect = Game.canvas.getBoundingClientRect();
        Game.mouse.x = e.clientX - rect.left;
        Game.mouse.y = e.clientY - rect.top;
    });

    Game.canvas.addEventListener('mousedown', () => Game.mouse.isDown = true);
    Game.canvas.addEventListener('mouseup', () => Game.mouse.isDown = false);

    // Khởi tạo người chơi
    NetworkManager.initLocalPlayer();

    // Bắt đầu vòng lặp game
    gameLoop();
};

function gameLoop() {
    if (Game.isGameOver) {
        Game.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        Game.ctx.fillRect(0, 0, Game.width, Game.height);
        Game.ctx.fillStyle = 'red';
        Game.ctx.font = '40px Arial';
        Game.ctx.fillText("BẠN ĐÃ CHẾT!", Game.width/2 - 120, Game.height/2);
        return; // Dừng game
    }

    // 1. Xóa khung hình cũ để vẽ khung hình mới
    Game.ctx.clearRect(0, 0, Game.width, Game.height);

    // Xử lý bắn súng nếu giữ chuột
    if (Game.mouse.isDown && Game.localPlayer) {
        WeaponSystem.shootPistol(Game.localPlayer);
    }

    // Sinh ra Zombie theo thời gian (càng chơi càng ra nhanh)
    Game.frameCount++;
    if (Game.frameCount % 60 === 0) { // Cứ 1 giây (60 frame) đẻ 1 con
        ZombieSystem.spawnZombie();
    }

    // 2. Cập nhật và Vẽ Đạn
    for (let i = Game.bullets.length - 1; i >= 0; i--) {
        let b = Game.bullets[i];
        b.update();
        b.draw(Game.ctx);
        if (b.isDestroyed) {
            Game.bullets.splice(i, 1);
        }
    }

    // 3. Cập nhật và Vẽ Player
    Game.players.forEach(p => {
        p.update();
        p.draw(Game.ctx);
    });

    // 4. Cập nhật, Vẽ Zombie & Xử lý Va chạm
    for (let i = Game.zombies.length - 1; i >= 0; i--) {
        let z = Game.zombies[i];
        z.update();
        z.draw(Game.ctx);

        // K.Tra: Zombie cắn người
        if (Physics.checkCircleCollision(z, Game.localPlayer)) {
            Game.localPlayer.hp -= 1;
            document.getElementById('hp-display').innerText = "❤️ HP: " + Game.localPlayer.hp;
            if (Game.localPlayer.hp <= 0) Game.isGameOver = true;
        }

        // K.Tra: Đạn bắn trúng Zombie
        for (let j = Game.bullets.length - 1; j >= 0; j--) {
            let b = Game.bullets[j];
            if (Physics.checkCircleCollision(z, b)) {
                z.hp -= 1;
                b.isDestroyed = true; // Xóa đạn
                
                if (z.hp <= 0) {
                    Game.score += 10;
                    document.getElementById('score-display').innerText = "ĐIỂM: " + Game.score;
                    Game.zombies.splice(i, 1); // Xóa zombie
                    break; // Thoát vòng lặp đạn vì zombie đã chết
                }
            }
        }
    }

    // Gọi lại hàm gameLoop cho khung hình tiếp theo (60 FPS)
    requestAnimationFrame(gameLoop);
}
