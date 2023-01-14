function vecteur(scene,A,B,CoulHexa,longCone,RayonCone){
  var vecAB = new THREE.Vector3( B.x-A.x, B.y-A.y, B.z-A.z );
  vecAB.normalize(); //vecteur unitaire
  scene.add( new THREE.ArrowHelper( vecAB, A, B.distanceTo(A),
  CoulHexa,longCone,RayonCone ));
  }


let o=new THREE.Vector3 (0,0,0);
let i=new THREE.Vector3 (1,0,0);
let j=new THREE.Vector3 (0,1,0);
let k=new THREE.Vector3 (0,0,1);

let a = 0;//prompt("abscisse : ");
let b = 1;//prompt("ordonne : ");
let c = 1;//prompt("cote : ");

let pts = new THREE.Vector3(0,0,0);

let N =new THREE.Vector3(a,b,c);

let e1 = new THREE.Vector3(-c,-c,a+b);


var e2 = new THREE.Vector3(0,0,0);


function repere(scene){
  vecteur(scene,o,i,0xFF0400, 0.1,0.1);
  vecteur(scene,o,j,0x00FF27, 0.1,0.1);
  vecteur(scene,o,k,0x0049FF, 0.1,0.1);
  vecteur(scene,pts,N,0xFF33FF, 0.1,0.1);
  vecteur(scene,pts,e1,0x000000, 0.1,0.1);
  vecteur(scene,pts,e2,0xCCFF00, 0.1,0.1);
}

function PTSCourbePara(R,R2,nb,vecN,e1){
  alert("Courbe Para en photo(courbe dans le plan) le 09/01/23 \n");

 }

function init(){
 var stats = initStats();
    // creation de rendu et de la taille
 let rendu = new THREE.WebGLRenderer({ antialias: true });
 rendu.shadowMap.enabled = true;
 let scene = new THREE.Scene();
 let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
 rendu.shadowMap.enabled = true;
 rendu.setClearColor(new THREE.Color(0xFFFFFF));
 rendu.setSize(window.innerWidth*.9, window.innerHeight*.9);
 cameraLumiere(scene,camera);
 lumiere(scene);

 N.normalize();
 e1.normalize();
 e2.crossVectors(N,e1);
 repere(scene);
 
 document.getElementById("webgl").appendChild(rendu.domElement);

  // affichage de la scene
 rendu.render(scene, camera);


 function reAffichage() {
  setTimeout(function () {
   if (PlanPhong) scene.remove(PlanPhong);
   if (courbePara) scene.remove(courbePara);
   posCamera();//PlanPhong.parameters.radius = 2;//
   scene.add(PlanPhong);
   scene.add(courbePara);
  }, 200);// fin setTimeout(function ()
    // render using requestAnimationFrame
  rendu.render(scene, camera);
 }// fin fonction reAffichage()



 //********************************************************
 //
 //  P A R T I E     G E O M E T R I Q U E
 //
 //********************************************************

let sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
scene.add(sphere);

//Créer la sphère cible
let targetSphere = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
scene.add(targetSphere);

//Créer les points de contrôle de la courbe de Bézier
let controlPoints = [
    new THREE.Vector3(-5, 3, 0),
    new THREE.Vector3(0, 7, 0),
    new THREE.Vector3(5, 3, 0)
    //new THREE.Vector3(5, 0, 0)
];

//Décaler les points de contrôle par rapport à la position de la sphère
controlPoints.forEach(point => {
  let direction = point.clone().sub(sphere.position).normalize();
  point.add(direction.multiplyScalar(sphere.geometry.parameters.radius));
});


//Créer la courbe de Bézier à partir des points de contrôle
let curve = new THREE.CubicBezierCurve3(controlPoints[0], controlPoints[1], controlPoints[2]);

//Créer l'objet de géométrie pour afficher la courbe
let curveGeometry = new THREE.Geometry();
curveGeometry.vertices = curve.getPoints(50);
let curveObject = new THREE.Line(curveGeometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
scene.add(curveObject);


//Initialiser la variable pour stocker le temps écoulé
let elapsedTime = 0;

//Créer une fonction d'animation
function animate() {
  requestAnimationFrame(animate);

  //Mettre à jour la position de la sphère en fonction de la courbe de Bézier
  let point = curve.getPoint(elapsedTime);
  sphere.position.copy(point);

  //Mettre à jour le temps écoulé
  elapsedTime += 0.01;
  if (elapsedTime > 1) {
      elapsedTime = 0;
  }

  renderer.render(scene, camera);
}


 //********************************************************
 //
 // F I N      P A R T I E     G E O M E T R I Q U E
 //
 //********************************************************
 
 //********************************************************
 //
 //  D E B U T     M E N U     G U I
 //
 //********************************************************
  let gui =new dat.GUI();
  let menuGUI=new function(){
      this.cameraxPos=camera.position.x;
      this.camerayPos=camera.position.y;
      this.camerazPos=camera.position.z;
      this.cameraZoom=1;
      this.cameraxDir=0;
      this.camerayDir=0;
      this.camerazDir=0;
 
      this.actualisation = function(){
        posCamera();
        reAffichage();
      }

      this.choixCbe=1;
      this.NbrePts=100;
      this.Epaisseur=3;
      this.CouleurCourbe="rgb(255,0,0)";
     
  }

 
 
 
  let guiCamera = gui.addFolder("Camera");
 
  guiCamera.add(menuGUI,"cameraxPos",-8,8).onChange(function () {
    camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom), menuGUI.camerayPos*testZero(menuGUI.cameraZoom), menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
    // ecriture des proprietes de la camera dans html
    actuaPosCameraHTML(menuGUI.cameraxPos, menuGUI.camerayPos, menuGUI.camerazPos,menuGUI.cameraxDir,menuGUI.camerayDir, menuGUI.camerazDir);
    //document.forms["controle"].PosX.value=testZero(menuGUI.cameraxPos);
    camera.lookAt(testZero(menuGUI.cameraxDir), testZero(menuGUI.camerayDir), testZero(menuGUI.camerazDir));
  });
 
  guiCamera.add(menuGUI,"camerayPos",-8,8).onChange(function () {
    camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom), menuGUI.camerayPos*testZero(menuGUI.cameraZoom), menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
    // ecriture des proprietes de la camera dans html
    actuaPosCameraHTML(menuGUI.cameraxPos, menuGUI.camerayPos, menuGUI.camerazPos,menuGUI.cameraxDir,menuGUI.camerayDir, menuGUI.camerazDir);
    camera.lookAt(testZero(menuGUI.cameraxDir), testZero(menuGUI.camerayDir), testZero(menuGUI.camerazDir));
  });
     
  guiCamera.add(menuGUI,"camerazPos",-8,8).onChange(function () {
    camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom), menuGUI.camerayPos*testZero(menuGUI.cameraZoom), menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
    // ecriture des proprietes de la camera dans html
    actuaPosCameraHTML(menuGUI.cameraxPos, menuGUI.camerayPos, menuGUI.camerazPos,menuGUI.cameraxDir,menuGUI.camerayDir, menuGUI.camerazDir);
    // document.forms["controle"].PosX.value=testZero(menuGUI.cameraxPos);
    camera.lookAt(testZero(menuGUI.cameraxDir), testZero(menuGUI.camerayDir), testZero(menuGUI.camerazDir));
  });
 
  guiCamera.add(menuGUI,"cameraZoom",0,4).onChange(function () {
    camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom), menuGUI.camerayPos*testZero(menuGUI.cameraZoom), menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
    camera.lookAt(testZero(menuGUI.cameraxDir), testZero(menuGUI.camerayDir), testZero(menuGUI.camerazDir))
  });
 
  // abscisse de la direction de la camera dans le menu
 
  guiCamera.add(menuGUI,"cameraxDir",-8,8).onChange(function () {
    camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom), menuGUI.camerayPos*testZero(menuGUI.cameraZoom), menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
    // ecriture des proprietes de la camera dans html
    actuaPosCameraHTML(menuGUI.cameraxPos, menuGUI.camerayPos, menuGUI.camerazPos,menuGUI.cameraxDir,menuGUI.camerayDir, menuGUI.camerazDir);
    camera.lookAt(testZero(menuGUI.cameraxDir), testZero(menuGUI.camerayDir), testZero(menuGUI.camerazDir))
  });
 
  guiCamera.add(menuGUI,"camerayDir",-8,8).onChange(function () {
    camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom), menuGUI.camerayPos*testZero(menuGUI.cameraZoom), menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
    // ecriture des proprietes de la camera dans html
    actuaPosCameraHTML(menuGUI.cameraxPos, menuGUI.camerayPos, menuGUI.camerazPos,menuGUI.cameraxDir,menuGUI.camerayDir, menuGUI.camerazDir);
    camera.lookAt(testZero(menuGUI.cameraxDir), testZero(menuGUI.camerayDir), testZero(menuGUI.camerazDir))
  });
 
  guiCamera.add(menuGUI,"camerazDir",-8,8).onChange(function () {
    camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom), menuGUI.camerayPos*testZero(menuGUI.cameraZoom), menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
    // ecriture des proprietes de la camera dans html
    actuaPosCameraHTML(menuGUI.cameraxPos, menuGUI.camerayPos, menuGUI.camerazPos,menuGUI.cameraxDir,menuGUI.camerayDir, menuGUI.camerazDir);
    camera.lookAt(testZero(menuGUI.cameraxDir), testZero(menuGUI.camerayDir), testZero(menuGUI.camerazDir))
  });
 
  let guiCourbes = gui.addFolder("Propriétés des courbes");
 
  let points=new Array();
    for(let k=0; k<=this.NbrePts; k++){
      let t=k/this.NbrePts;
      let result=new THREE.Vector3();
      let t0=0;
      let t1=2*Math.PI;
      t=t0+t*(t1-t0);
      let x=R*Math.cos(t)
      let y=R*Math.sin(t)
      let z=0
      result.set(x,y,z);
      points[k]=result;
    }
    let PtsTab=new THREE.BufferGeometry().setFromPoints(points);
    let ProprieteCbe = new THREE.LineBasicMaterial( {
      color: this.CouleurCourbe,
      linewidth: this.Epaisseur,
    });
     
  let courbePara = new THREE.Line( PtsTab, ProprieteCbe );
  //scene.add(this.courbePara);
 
  let cbeEqua=function(t){
    let result=new THREE.Vector3();
    let t0=0;
    let t1=2*Math.PI;
    t=t0+t*(t1-t0);
    let x=R*Math.cos(t)
    let y=R*Math.sin(t)
    let z=0
    return result.set(x,y,z);
  }
 

  let cbeMeri=function(t){
    let result=new THREE.Vector3();
    let t0=0;
    let t1=2*Math.PI;
    t=t0+t*(t1-t0);
    let x=0
    let y=R*Math.sin(t)
    let z=R*Math.cos(t)
    return result.set(x,y,z);
  }

  let cbeTennis=function(t){
    let a=(3/4)*R;
    let b=R-a;
    let t0=0;
    let t1=2*Math.PI;
    t=t0+t*(t1-t0);
    let result=new THREE.Vector3();
    let x=a*Math.cos(t)+b*Math.cos(3*t);
    let y=a*Math.sin(t)-b*Math.sin(3*t);
    let z=2*Math.sqrt(a*b)*Math.sin(2*t);
    return result.set(x,y,z);
  }
 
  let cbeClelie=function(t){
    let n=2;  
    let t0=-n*(Math.PI/2);
    let t1=n*(Math.PI/2);
    t=t0+t*(t1-t0);
    let result=new THREE.Vector3();
    let x=R*Math.cos(t/n)*Math.cos(t);
    let y=R*Math.cos(t/n)*Math.sin(t);
    let z=R*Math.sin(t/n);
    return result.set(x,y,z);
  }


  function changeCourbe(){
    scene.remove(courbePara);
    let c=menuGUI.choixCbe;
    let nb=menuGUI.NbrePts
    if(c==1) {
      for(let k=0; k<=nb; k++){
        t=k/nb;
        points[k]=cbeEqua(t);
      }
    }

    if(c==2) {
      for(let k=0; k<=nb; k++){
        t=k/nb;
        points[k]=cbeMeri(t);
      }
    }
    if(c==3) {
      for(let k=0; k<=nb; k++){
        t=k/nb;
        points[k]=cbeTennis(t);
      }
    }
    if(c==4){
      for(let k=0; k<=nb; k++){
        t=k/nb;
        points[k]=cbeClelie(t);
      }
    }

    let PtsTab=new THREE.BufferGeometry().setFromPoints(points);
    ProprieteCbe = new THREE.LineBasicMaterial( {
      color: menuGUI.CouleurCourbe,
      linewidth: menuGUI.Epaisseur
    });
    courbePara = new THREE.Line( PtsTab, ProprieteCbe );
    scene.add(courbePara);
  } // fin change courbe

  guiCourbes.add(menuGUI,"choixCbe",[1,2,3,4]).onChange(function(){
    changeCourbe();
  });

  guiCourbes.add(menuGUI,"NbrePts",1,1000).onChange(function(){
    changeCourbe();
  });

  guiCourbes.add(menuGUI,"Epaisseur",3,10).onChange(function () {
    menuGUI.Epaisseur= Math.ceil(menuGUI.Epaisseur);
    ProprieteCbe.linewidth = Math.ceil(menuGUI.Epaisseur);
  });

  guiCourbes.addColor(menuGUI,"CouleurCourbe").onChange(function(){
    changeCourbe();
  });
 
  gui.add(menuGUI,"actualisation");
  menuGUI.actualisation();
 
 
 //********************************************************
 //
 //  F I N     M E N U     G U I
 //
 //********************************************************
  renduAnim();
 
  function posCamera(){
    camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom),menuGUI.camerayPos*testZero(menuGUI.cameraZoom),menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
    camera.lookAt(menuGUI.cameraxDir,menuGUI.camerayDir,menuGUI.camerazDir);
    actuaPosCameraHTML();
  }  

  function actuaPosCameraHTML(){
    document.forms["controle"].PosX.value=testZero(menuGUI.cameraxPos);
    document.forms["controle"].PosY.value=testZero(menuGUI.camerayPos);
    document.forms["controle"].PosZ.value=testZero(menuGUI.camerazPos);
    document.forms["controle"].DirX.value=testZero(menuGUI.cameraxDir);
    document.forms["controle"].DirY.value=testZero(menuGUI.camerayDir);
    document.forms["controle"].DirZ.value=testZero(menuGUI.camerazDir);
  }
  // ajoute le rendu dans l'element HTML
  document.getElementById("webgl").appendChild(rendu.domElement);
   
  // affichage de la scene
  rendu.render(scene, camera);
 
 
  function reAffichage() {
    setTimeout(function () {
      //scene.remove(spherePhong);
      if (courbePara) scene.remove(courbePara);
      posCamera();
      //scene.add(spherePhong);
      courbePara = new THREE.Line( PtsTab, ProprieteCbe );
      scene.add(courbePara);
    }, 200);// fin setTimeout(function ()
    // render avec requestAnimationFrame
    rendu.render(scene, camera);
  }// fin fonction reAffichage()
 
 
  function renduAnim() {
    stats.update();
    // render avec requestAnimationFrame
    requestAnimationFrame(renduAnim);
    // ajoute le rendu dans l'element HTML
    rendu.render(scene, camera);
  }


  //animate();
} // fin fonction init()


const PrecisionArrondi=50;
var epsilon = 0.00000001;

function testZero(x){
  var val=parseFloat(Number(x).toPrecision(PrecisionArrondi));
  if (parseFloat(Math.abs(x).toPrecision(PrecisionArrondi))<epsilon) val=0;
  return val;
}