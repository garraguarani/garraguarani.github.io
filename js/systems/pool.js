/* ============================================
   GARRA GUARANÍ — Object Pool System
   Reusable pools to avoid GC spikes
   ============================================ */

class Pool {
    constructor(createFn, maxSize) {
        this.pool = [];
        this.active = [];
        this.createFn = createFn;
        this.maxSize = maxSize;

        // Pre-allocate
        for (let i = 0; i < maxSize; i++) {
            this.pool.push(this.createFn());
        }
    }

    /** Get an object from the pool */
    get() {
        let obj;
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else if (this.active.length < this.maxSize) {
            obj = this.createFn();
        } else {
            return null; // Pool exhausted
        }
        obj.active = true;
        this.active.push(obj);
        return obj;
    }

    /** Return an object to the pool */
    release(obj) {
        obj.active = false;
        const idx = this.active.indexOf(obj);
        if (idx !== -1) {
            this.active.splice(idx, 1);
        }
        this.pool.push(obj);
    }

    /** Release all active objects */
    releaseAll() {
        while (this.active.length > 0) {
            const obj = this.active.pop();
            obj.active = false;
            this.pool.push(obj);
        }
    }

    /** Update all active objects, auto-release dead ones */
    updateAll(dt) {
        for (let i = this.active.length - 1; i >= 0; i--) {
            const obj = this.active[i];
            if (obj.active) {
                obj.update(dt);
            }
            if (!obj.active) {
                this.active.splice(i, 1);
                this.pool.push(obj);
            }
        }
    }

    /** Draw all active objects */
    drawAll(ctx) {
        for (let i = 0; i < this.active.length; i++) {
            if (this.active[i].active) {
                this.active[i].draw(ctx);
            }
        }
    }

    /** Get count of active objects */
    get count() {
        return this.active.length;
    }
}
