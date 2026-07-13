window.Game = {
    canvas: null, ctx: null, width: 800, height: 600,
    mapWidth: 3000, mapHeight: 600,
    camera: { x: 0, y: 0 },
    
    players: [], zombies: [], bullets: [], walls: [], crates: [], items: [],
    particles: [], bloodStains: [], // Thêm mảng chứa máu
    
    keys: { w: false, a: false, s: false, d: false },
    mouse: { x: 0, y: 0, isDown: false, justClicked: false },
    worldMouse: { x: 0, y: 0 }, 
    
    score: 0, isGameOver: false, isGameWon: false, frameCount: 0
};
