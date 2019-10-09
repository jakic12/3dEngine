const gid = x => document.getElementById(x)

if(!math){
  console.log("Make sure that math.js is included above the script!");
}

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
 * A 2d local point on a image
 * @typedef {Array<Number>} 2dPoint
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

function Camera(cameraOut, x = 0, y = 0, z = 0, w = 0, fi = 0, k = 0){
  this.w = w;
  this.fi = fi;
  this.k = k;

  this.x = x;
  this.y = y;
  this.z = z;

  this.Hp = [0,0];
  this.m = 1;

  this.getRot = () => [this.w, this.fi, this.k]
  this.getOrigin = () => [this.x,this.y,this.z]
  this.getCameraRotationMatrix = () => getRotationMatrix(this.w, this.fi, this.k)

  /**
   * convert a local point in the global system
   * @param {2dPoint} xp a point on the image
   * @param {Number} m global scaling factor
   */
  this.localToGlobal = (xp) => 
    toGlobal(this.getOrigin(), this.m, this.getCameraRotationMatrix(), xp)

  /**
   * !!not tested, probably doesn't work
   * 
   * @param {Point} O Origin of the custom system
   * @param {Angle} w Angle of the custom system
   * @param {Angle} fi Angle of the custom system
   * @param {Angle} k Angle of the custom system
   */
  this.convertToCustomGlobal = (O, w, fi, k, xp) =>{
    return toGlobal(
      math.subtract(this.getOrigin(),O),
      this.m,
      getRotationMatrix(this.w - w, this.fi - fi, this.k - k),
      xp
    )
  }

  this.convertToCameraLocal = (X) => 
    toLocal(this.getOrigin(), this.m, this.getCameraRotationMatrix(), X, this.Hp)

  this.drawPoint = X => {
    const xp = this.convertToCameraLocal(X)
    const ctx = cameraOut;
    ctx.strokeColor = "black"
    ctx.beginPath();
    ctx.arc(xp.get([0])-10, xp.get([1])-10, 10, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

const canvas = gid("canvas");
const ctx = canvas.getContext('2d');
const camera1 = new Camera(ctx);


const cube = [
  [0,0,0],
  [0,0,300],
  [0,300,0],
  [0,300,300],
  [300,0,0],
  [300,0,300],
  [300,300,0],
  [300,300,300]
]

let i = 0;
setInterval(() => {
  for(const point of cube){
    camera1.drawPoint(math.add(point, [500,300,300]))
  }
  i++;
  if(i >= Math.PI*200){
    i = 0
  }
})

window.addEventListener("keydown", e => {
  switch(e.key){
    case "ArrowUp":
      camera1.w -= 0.1
      break;
    case "ArrowDown":
      camera1.w += 0.1
      break;
    case "ArrowLeft":
      camera1.fi += 0.1
      break;
    case "ArrowRight":
      camera1.fi -= 0.1
      break;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
})