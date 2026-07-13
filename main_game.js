// (Chỉ cập nhật đoạn đầu của hàm initZombieGame và đầu GameLoop, các hàm vẽ cây/nhà giữ nguyên)
window.initZombieGame = function() {
    Game.canvas = document.getElementById('battleCanvas'); Game.ctx = Game.canvas.getContext('2d');
    Game.canvas.style.cursor = 'crosshair';

    // FIX PC: Đổi window thành document
    document.addEventListener('keydown', e => { 
        if(e.key==='w'||e.key==='W') Game.keys.w=true; if(e.key==='a'||e.key==='A') Game.keys.a=true; 
        if(e.key==='s'||e.key==='S') Game.keys.s=true; if(e.key==='d'||e.key==='D') Game.keys.d=true; 
        if(e.code==='Space') Game.keys.space=true; if(e.key==='r'||e.key==='R') Game.keys.r=true; if(e.key==='g'||e.key==='G') Game.keys.g=true;
    });
    document.addEventListener('keyup', e => { 
        if(e.key==='w'||e.key==='W') Game.keys.w=false; if(e.key==='a'||e.key==='A') Game.keys.a=false; 
        if(e.key==='s'||e.key==='S') Game.keys.s=false; if(e.key==='d'||e.key==='D') Game.keys.d=false; 
        if(e.code==='Space') Game.keys.space=false; if(e.key==='r'||e.key==='R') Game.keys.r=false; if(e.key==='g'||e.key==='G') Game.keys.g=false;
    });
    Game.canvas.addEventListener('mousemove', e => { let r = Game.canvas.getBoundingClientRect(); Game.mouse.x = e.clientX-r.left; Game.mouse.y = e.clientY-r.top; });
    Game.canvas.addEventListener('mousedown', () => { Game.mouse.isDown = true; Game.mouse.justClicked = true; }); Game.canvas.addEventListener('mouseup', () => Game.mouse.isDown = false);

// ... (Giữ nguyên các đoạn rải tường, zombie, đồ đạc ở giữa) ...

function gameLoop() {
    // ... (Giữ nguyên đoạn đầu vẽ bản đồ) ...
    
    // CẬP NHẬT: Cho phép Mobile bắn súng khi cần gạt được kéo
    let isMobileShooting = Game.mobile && Game.mobile.isShooting;
    if ((Game.mouse.isDown || isMobileShooting) && Game.localPlayer) { 
        WeaponSystem.shoot(Game.localPlayer); 
        UpdateHUD(Game.localPlayer); 
    }
    
    // ... (Giữ nguyên toàn bộ phần dưới của GameLoop) ...
