
var container;
var camera, scene, renderer, controls;
var axesWorld;
var axesObjects = new Array();

init();
animate();

function init() {
    container = $("#js-content");
    w = container.width();
    h = container.height();
    console.log(w, h);
    
    $("#button-add").click(function () {
        addObjects();
    });
    
    $("#button-clr").click(function () {
        clearObjects();
    });
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );
    
    camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );
    camera.position.set( 10, 10, 10 );
    scene.add( camera );
    
    controls = new THREE.OrbitControls( camera, container.get( 0 ) );
    controls.update();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( w, h );
    container.append( renderer.domElement );

    scene.add( new THREE.AmbientLight( 0xf0f0f0 ) );

    var grid = new THREE.GridHelper( 20, 20 );
    grid.material.opacity = 0.08;
    grid.material.transparent = true;
    scene.add( grid );
    
    var grid = new THREE.GridHelper( 20, 20 );
    grid.rotateX( - Math.PI / 2 );
    grid.material.opacity = 0.08;
    grid.material.transparent = true;
    scene.add( grid );
    
    var grid = new THREE.GridHelper( 20, 20 );
    grid.rotateZ( - Math.PI / 2 );
    grid.material.opacity = 0.08;
    grid.material.transparent = true;
    scene.add( grid );
    
    axesWorld = new THREE.AxesHelper( 10 );
    scene.add( axesWorld );
}

function animate() {
    requestAnimationFrame( animate );
    
	controls.update();
    
    renderer.render( scene, camera );
}

function addObjects() {

//    axesObject.position.set( 0, 0, 0 );
//    axesObject.rotation.set( 0, 0, 0 );
//    axesObject.scale.set( 1, 1, 1 );
//    axesObject.updateMatrix();
    
    var temp = new Array();
    var rows = $("#textfield").val().split("\n").filter(function(e){ return e === 0 || e });
    for (i in rows) {
        row = rows[i].trim().split("\t");
        for (j in row) {
            val = parseFloat(row[j], 10);
            temp.push( val );
        }
    }
    
    for (i = 0; i < temp.length / 16; i++) {
        axesObject = new THREE.AxesHelper( 1 );
        
        var m = new THREE.Matrix4();
        m.fromArray( temp.slice(i * 16, (i + 1) * 16) );
        m.transpose();
        
//        console.log( m.elements );
        axesObject.applyMatrix( m );
        
        axesObjects.push( axesObject );
        scene.add( axesObject );
    }
}

function clearObjects() {
    for(i in axesObjects) {
        scene.remove(axesObjects[i]);
    }
    axesObjects = [];
}