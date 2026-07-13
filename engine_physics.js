window.Physics = {
    getDistance: function(x1, y1, x2, y2) { return Math.sqrt((x2-x1)**2 + (y2-y1)**2); },
    getAngle: function(x1, y1, x2, y2) { return Math.atan2(y2 - y1, x2 - x1); },
    checkCircleCollision: function(c1, c2) { return this.getDistance(c1.x, c1.y, c2.x, c2.y) < (c1.radius + c2.radius); },
    checkCircleRectCollision: function(circle, rect) {
        let testX = circle.x, testY = circle.y;
        if (circle.x < rect.x) testX = rect.x; else if (circle.x > rect.x + rect.w) testX = rect.x + rect.w;
        if (circle.y < rect.y) testY = rect.y; else if (circle.y > rect.y + rect.h) testY = rect.y + rect.h;
        let distX = circle.x - testX, distY = circle.y - testY;
        return (distX*distX + distY*distY) <= (circle.radius * circle.radius);
    },
    resolveCircleRectCollision: function(circle, rect) {
        let testX = circle.x, testY = circle.y;
        if (circle.x < rect.x) testX = rect.x; else if (circle.x > rect.x + rect.w) testX = rect.x + rect.w;
        if (circle.y < rect.y) testY = rect.y; else if (circle.y > rect.y + rect.h) testY = rect.y + rect.h;
        let distX = circle.x - testX, distY = circle.y - testY; let distance = Math.sqrt(distX*distX + distY*distY);
        if (distance < circle.radius && distance > 0) {
            let overlap = circle.radius - distance;
            circle.x += (distX / distance) * overlap; circle.y += (distY / distance) * overlap;
        }
    }
};
