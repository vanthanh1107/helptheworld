window.Game = {
    canvas: null, ctx: null, width: 800, height: 600,
    
    // THÊM: Kích thước bản đồ thực tế
    mapWidth: 3000, 
    mapHeight: 600,
    
    // THÊM: Camera theo dõi người chơi
    camera: { x: 0, y: 0 },
    
    players: [], zombies: [], bullets: [], walls: [], crates: [],
    keys: { w: false, a: false, s: false, d: false },
    mouse: { x: 0, y: 0, isDown: false, justClicked: false },
    
    // THÊM: Tọa độ chuột trên bản đồ thế giới (để nhắm súng chuẩn xác khi map di chuyển)
    worldMouse: { x: 0, y: 0 }, 
    
    score: 0, 
    isGameOver: false, 
    isGameWon: false, // Trạng thái về đích
    frameCount: 0
};
