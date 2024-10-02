namespace Geometry {
  export function areaOfCircle(radius: number): number {
    return Math.PI * radius * radius;
  }
  export  function work() {
    return 'working'
  }
}
Geometry.work

const area = Geometry.areaOfCircle(5);

namespace Class {
  export const values = (a:number) => {
    return a*a*a*a
  };
}


console.log(Class.values(50));
