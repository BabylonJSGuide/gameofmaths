// All paths 0 <= p <= 1, start and end Vector3s
var linear = (p, start, end) => {
    return start + ((start - end) * p;
}

var quad = (p, start, height, end) => {
    var sDiff = start - height;
    var eDiff = end - height;
    var r = Math.sqrt(sDiff / eDiff);
    var b = r / ( 1 + r);
    var a = -sDiff / (b * b);
    return a * (p - b) * (p - b) + height;
}

// All easing from time = 0 to time = t in seconds over time period dt in milliseconds
var s_easing = (elapsedTime, animationTime, range) => {
    var hr = 0.5 * range;
    return Math.pow(Math.E, hr * ( 0.002 * this.hr * elapsedTime / animationTime - hr));   
}


//Funcs obj {xFunc, yFunc, zFunc}
//start, end, height vec3, 
var FuncsDef = (Funcs, start, end, height) => {
    this.xFunc = Funcs.xFunc;
    this.yFunc = Funcs.yFunc;
    this.zFunc = Funcs.xFunc;
    this.start = start;
    this.end = end;
    this.height = height;
}

var pathAnimation = (mesh, deltaTime, animationTime, easingFunc, pathDef, rotDef) => {
    this.mesh = mesh;
    this.deltaTime = deltaTime;
    this.animationTime = animationTime;
    this.easingFunc = easingFunc;
    this.pathDef = pathDef;
    this.rotDef = rotDef;



    this.update = update;

    var update = () => {
        if(this.elapsedtime <= this.animationTime) {
            var p = this.easing(this.elapsedTime, this.animationTime, 3);
            if (xLfunc !== undefined) {
                var x = this.xLFunc(p, this.start.x, this.end.x, this.height.y);
                this.mesh.position.x = x;
            }
            if (yLfunc !== undefined) {
                var y = this.yLFunc(p, this.start.y, this.end.y, this.height.y);
                this.mesh.position.y = y;
            }
            if (zLfunc !== undefined) {
                var z = this.zLFunc(p, this.start.z, this.end.z, this.height.y);
                this.mesh.position.z = z;
            }
        }
    
        if (this.elapsedTime >= this.animationTime * 1000) {
    
        }
    
        this.elapsedTime += this.deltaTime;
        if (this.elapsedTime > this.animationTime * 1000) {
            this.elapsedtime = this.animationTime * 1000;
        }
    }


}

//EXAMPLE TO DELETE
var discAnimation = (deltaTime, n, cardNb, currentRotation) => {
    var rate = 3;
    var discTime = discAnimationTime * (1 + n / (4 * cardNb));
    var pw = Math.pow(Math.E, rate * ( 0.002 * rate * discElapsedTime / discTime - rate));
    
    if (discElapsedTime <= discTime * 1000) {       
        var pw = Math.pow(Math.E, rate * ( 0.002 * rate * discElapsedTime / discTime - rate));
        discsToPlay[n].position.y = discsStartY  - discDrop * pw / (pw + 1);
        discsToPlay[n].rotation.x = currentRotation * Math.PI * pw / (pw + 1); 
    }

    if (discElapsedTime >= discTime * 1000) {
        if (n === cardNb - 1) {
            discAction = false;
            var prevTotal = cardTotal + rotationValue * cardNb;
            if (Math.sign(prevTotal) !== -Math.sign(rotationValue) && discsOnBoard.length !==0) {
                removeDiscsAction = true;
                removeDiscsElapsedTime = 0;
            }
            else {
                while (discsToPlay.length > 0) {
                    discsOnBoard.push(discsToPlay.shift());
                }
                topCard.setEnabled(true);
            }
        }
    }
    discElapsedTime += deltaTime;
    if (discElapsedTime > discTime * 1000) {
        discElapsedtime = discTime * 1000;
    }
};

