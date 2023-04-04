/*
* VEC2:
* Represents a vector in R^2
* Supports common vector operations
*/
class Vec2
{
    // x and y coordinate
    x;
    y;

    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }



    // Copies the current vector
    copy() { return new Vec2(this.x, this.y); }

    // Vector operations that mutate the invoking vector
    add(v)
    {
        this.x += v.x;
        this.y += v.y;
    }

    sub(v)
    {
        this.x -= v.x;
        this.y -= v.y;
    }

    mul(c)
    {
        this.x *= c;
        this.y *= c;
    }

    div(c)
    {
        this.x /= c;
        this.y /= c;
    }

    normalize()
    {
        this.mul(1 / this.length());
    }

    // Vector operations that return a new result
    addR(v) { return new Vec2(this.x + v.x, this.y + v.y); }
    subR(v) { return new Vec2(this.x - v.x, this.y - v.y); }
    mulR(c) { return new Vec2(this.x * c, this.y * c); }
    divR(c) { return new Vec2(this.x / c, this.y / c); }
    normalizeR() { return this.mulR(1 / this.length()); }

    projectR(v)
    {
        return v.mulR(v.dot(this) / v.lengthSquared());
    }

    rejectR(v)
    {
        return this.subR(this.projectR(v));
    }



    // Dot product with a 2D vector
    dot(v)
    {
        return this.x * v.x + this.y * v.y;
    }

    // Distance to vector v
    dist(v)
    {
        return Math.sqrt(this.distSquared(v));
    }

    // Distance squared from vector v (computationally cheaper)
    distSquared(v)
    {
        const dx = v.x - this.x;
        const dy = v.y - this.y;
        return dx*dx + dy*dy;
    }

    // Magnitude of vector
    length()
    {
        return Math.sqrt(this.lengthSquared());
    }

    // Squared magnitude of vector
    lengthSquared()
    {
        return this.x*this.x + this.y*this.y;
    }

    boundedBy(rect)
    {
        return new Vec2(Math.max(rect.left, Math.min(this.x, rect.right)), Math.max(rect.top, Math.min(this.y, rect.bottom)))
    }
    
    // Display as string
    toString()
    {
        return `<${this.x}, ${this.y}>`;
    }
}


export default Vec2;
