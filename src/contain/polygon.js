
import windingLine from './windingLine'

let EPSILON = 1e-8;

function isAroundEqual(a, b) {
  return Math.abs(a - b) < EPSILON;
}

export default function (points, x, y) {
    var w = 0;
    var p = points[0];

    if (!p) {
        return false;
    }

    for (var i = 1; i < points.length; i++) {
        var p2 = points[i];
        w += windingLine(p.x, p.y, p2.x, p2.y, x, y);
        p = p2;
    }

    // Close polygon
    var p0 = points[0];
    if (!isAroundEqual(p.x, p0.x) || !isAroundEqual(p.y, p0.y)) {
        w += windingLine(p.x, p.y, p0.x, p0.y, x, y);
    }

    return w !== 0;
}
