/**
 * Simple class to return stable IDs for objects.
 */
export class IDAllocator<T extends object> {

  private map = new WeakMap<T, string>();

  private ctr: number = 0;

  public getId(val: T) {
    if (!this.map.has(val)) {
      this.map.set(val, `${this.ctr++}`);
    }
    return this.map.get(val);
  }

}
