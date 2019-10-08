const gid = x => document.getElementById(x)

/**
 * Prepare the canvas
 */

//console.log("test");
cutout = 10000000
while(!window){
  if(cutout-- <= 0){
    console.log("error, window object doesn't initialize");
    break
  }
}

(window.onresize = () => {
  const canvas = gid("canvas")
  canvas.width = document.body.clientWidth
  canvas.height = document.body.clientHeight
})();


/**
 * An Array of numbers
 * @typedef {Array<Number>} Vector
 */

/**
 * A 2d array of numbers
 * @typedef {Array<Array<Number>>} Matrix
 */

/**
 * A 3d point - 3d vector
 * @typedef {Array<Number>} Point
 */

 /**
 * A Number
 * @typedef {Number} Angle
 */

/**
 * Define functions
 * 
 * special symbols
 * w = ω
 * fi = φ
 * k = κ
 * 
 * x' = xp (x prime)
 */

/**
 * gets the rotation matrix from given angles
 * @param {Angle} w 
 * @param {Angle} fi 
 * @param {Angle} k 
 */
const getRotationMatrix = (w, fi, k) =>
  math.matrix([
    [               Math.cos(fi)*Math.cos(k)                       ,            -Math.cos(fi)*Math.sin(k)                        ,         Math.sin(fi)      ],
    [ Math.cos(fi)*Math.sin(k)+Math.sin(w)*Math.sin(fi)*Math.cos(k), Math.cos(w)*Math.cos(k)-Math.sin(w)*Math.sin(fi)*Math.sin(k), -Math.sin(w)*Math.cos(fi) ],
    [ Math.sin(fi)*Math.sin(k)-Math.cos(w)*Math.sin(fi)*Math.cos(k), Math.sin(w)*Math.cos(k)+Math.cos(w)*Math.sin(fi)*Math.sin(k),  Math.cos(w)*Math.cos(fi) ]
  ])

/**
 * convert point x' -> X
 * 
 * @param {Point} X0 origin in the local coordinate system
 * @param {Number} m global scaling factor 
 * @param {Matrix} R rotation matrix
 * @param {Point} xp point in the local coordinate system
 * @returns {Point} X
 */
const toGlobal = (X0, m, R, xp) => 
  math.add(X0, math.multiply(m, math.multiply(R,xp)))

  /**
   * convert point X -> x'
   * H'(x'0, y'0)
   * @param {*} X0 origin in the local coordinate system
   * @param {*} m global scaling factor 
   * @param {*} R rotation matrix
   * @param {*} X point in the global coordinate system
   * @param {*} Hp principal point
   * @returns {Point} x'
   */
const toLocal = (X0, m, R, X, Hp) =>
  math.add(math.multiply(1/m, math.multiply(math.transpose(R), math.subtract(X, X0))), [Hp[0], Hp[1], 0]);

const R1 = getRotationMatrix(2,1,0 /* TODO: figure out why non zero values here, result in errors in the transformation */);
const X0 = [1,1,0];
console.log(toGlobal(X0, 1, R1, toLocal(X0, 1, R1, [2,3,4], [0,0])));