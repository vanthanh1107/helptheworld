window.Physics = {
    // Tính khoảng cách giữa 2 điểm (Định lý Pytago)
    getDistance: function(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },
    
    // Tính góc từ điểm 1 sang điểm 2 (để xoay súng)
    getAngle: function(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },
    
    // Kiểm tra va chạm giữa 2 hình tròn
    checkCircleCollision: function(circle1, circle2) {
        let dist = this.getDistance(circle1.x, circle1.y, circle2.x, circle2.y);
        return dist < (circle1.radius + circle2.radius);
    }
};
