// Khởi tạo không gian lưu trữ cho toàn bộ Game
window.Game = {
    canvas: null,
    ctx: null,
    width: 800,
    height: 600,
    
    // Các mảng chứa thực thể trên map
    players: [],
    zombies: [],
    bullets: [],
    
    // Trạng thái phím bấm và chuột
    keys: { w: false, a: false, s: false, d: false },
    mouse: { x: 0, y: 0, isDown: false },
    
    // Thông số game
    score: 0,
    isGameOver: false,
    frameCount: 0
};
