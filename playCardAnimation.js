var playAnimation= (deltaTime, mesh, n, card, cardName, cardNb, disc) => {
    var c = n;
    if (targetSet) {
        n += 3;
    }
    if (playElapsedTime <= playAnimationTime * 1000) {       
        var dx = playEnd[n].x - playStart.x;
        var dy = Math.sqrt(1 + playStart.y - playEnd[n].y) + 1;
        var dz = playEnd[n].z - playStart.z;
        var rate = 3;
        var yStep = dy * playElapsedTime / (playAnimationTime * 1000) - 1;        
        var incY = 1 + playStart.y - yStep * yStep;
        var xStep = 2 * incY / 3 - 1;
        var incX = - 10 * xStep * xStep;
        var pw = Math.pow(Math.E, rate * ( 0.002 * rate * playElapsedTime / playAnimationTime - rate));
        var pw2 = Math.pow(Math.E, incX);
        mesh.position.x = playStart.x + dx * pw / (pw + 1);
        mesh.position.y = pw2 / (pw2 + 1) + incY;
        mesh.position.z = playStart.z + dz * pw / (pw + 1);

        mesh.rotation.x = Math.PI * pw / (pw + 1); 
    }
    if (playElapsedTime >= playAnimationTime * 1000) {
        playCardAction = false;
        var playedCard = card.clone("playedCard" + n);
        playedCard.material = new BABYLON.StandardMaterial("", scene);
        playedCard.material.diffuseTexture = new BABYLON.Texture("images/" + cardName, scene);
        playedCard.material.diffuseTexture.hasAlpha = true;
        playedCard.position = playEnd[n].clone();
        playedCard.setEnabled(true);
        mesh.setEnabled(false);
        if (c === 0) {
            topCard.setEnabled(true);
        }
        if (c == 1) {
            pc0 = scene.getMeshByName("playedCard0");
            pc1 = scene.getMeshByName("playedCard1");
            var d = 1;
            if (targetSet) {
                pc0 = scene.getMeshByName("playedCard3");
                pc1 = scene.getMeshByName("playedCard4");
                d = -1;
            }
            pc1.parent = pc0;
            pc1.position.x = 1;
            pc1.position.y = 0.01;
            pc1.position.z = 0;
            pc0Position = pc0.position.clone();
            removeFlipZQ = quadParams(pc0Position.z, 0, 0.75, pc0Position.z + d * 6);
            removeFlipYQ = quadParams(pc0Position.y, -6, 0.5, pc0Position.y + 4);
            removeFlipPair = true;
            removeElapsedTime = 0;
            playCount = -1;
        }
        if (c === 2) {
            currentRotation = ( 1 + initialRotation) / 2;
            rotationValue = initialRotation;
            playCount = -1;
            if (targetSet) {
                discsToPlay = [];
                for (var i = 0; i < cardNb; i++) {
                    discsToPlay[i] = disc.clone();
                    discsToPlay[i].position.x = -3.5 + (Math.abs(cardTotal) + i) % 8;
                    discsToPlay[i].position.y = discsStartY;
                    discsToPlay[i].position.z = 3.5 - Math.floor((Math.abs(cardTotal) + i) / 8);
                    discsToPlay[i].rotation.y = 0;
                    discsToPlay[i].rotation.x = 0;
                    removeDiscsPlayX[i] = discsToPlay[i].position.x;
                    removeDiscsPlayZ[i] = discsToPlay[i].position.z;
                }
                nextTotal += -initialRotation * cardNb;
                writeScore(turnNb++, -initialRotation * cardNb, nextTotal);
                discAction = true;
                
            }
            else {
                target = -initialRotation * cardNb;
                writeTotal(target);
                targetSet = true;
                startTarget(cardNb);
                turnNb++;
            }
        }
    }

    playElapsedTime += deltaTime;
    if (playElapsedTime > playAnimationTime * 1000) {
        playElapsedtime = playAnimationTime * 1000;
    }
}

var removeFlipAnimation = (deltaTime, yq, zq) => {
    var rate = 3;
    var pw = Math.pow(Math.E, rate * ( 0.002 * rate * removeElapsedTime / removeAnimationTime - rate));
    var p = pw / (pw + 1);
    if (removeElapsedTime <= removeAnimationTime * 1000) {
        pc0.position.x = pc0Position.x - pc0Position.x * p;        
        pc0.position.y = yq.a * p * p + yq.b * p + yq.c;
        pc0.position.z = zq.a * p * p + zq.b * p + zq.c;  
        pc0.rotation.x = -p * Math.PI / 2;
    }

    if (removeElapsedTime >= removeAnimationTime * 1000) {
        removeFlipPair = false;
        pc1.parent = null;
        pc1.dispose();
        pc0.dispose();
        topCard.setEnabled(true);
    }

    removeElapsedTime += deltaTime;
    if (removeElapsedTime > removeAnimationTime * 1000) {
        removeElapsedtime = removeAnimationTime * 1000;
    }
}

var flipDiscAnimation = (mesh) => {
    var rate = 3;
    var pw = Math.pow(Math.E, rate * ( 0.002 * rate * playElapsedTime / playAnimationTime - rate));
    
    if (playElapsedTime <= playAnimationTime * 1000) {
        mesh.rotation.x = initialRotation * Math.PI / 2 + Math.PI * pw / (pw + 1);;
    }

    if (playElapsedTime >= playAnimationTime * 1000) {
        flipDisc = false;
        initialRotation *= -1;
    }
}

var resetDiscAnimation = (deltaTime, mesh) => {
    resetCyl.rotation.y += 0.01;
    var rate = 3;
    var pw = Math.pow(Math.E, rate * ( 0.002 * rate * resetElapsedTime / resetAnimationTime - rate));
    
    if (resetElapsedTime <= resetAnimationTime * 1000) {
        mesh.rotation.x = Math.PI / 2 + Math.PI * pw / (pw + 1);;
    }

    if (resetElapsedTime >= resetAnimationTime * 1000) {
        resetDisc = false;
        resetCyl.setEnabled(false);
    }
    resetElapsedTime += deltaTime;
    if (resetElapsedTime > resetAnimationTime * 1000) {
        resetElapsedtime = resetAnimationTime * 1000;
    }
}

var discAnimation = (deltaTime, n, cardNb, currentRotation) => {
    var rate = 3;
    var discTime = discAnimationTime + 0.25 * n;
    var pw = Math.pow(Math.E, rate * ( 0.002 * rate * discElapsedTime / discTime - rate));
    
    if (discElapsedTime <= discTime * 1000) {       
        var pw = Math.pow(Math.E, rate * ( 0.002 * rate * discElapsedTime / discTime - rate));
        discsToPlay[n].position.y = discsStartY  - discDrop * pw / (pw + 1);
        discsToPlay[n].rotation.x = currentRotation * Math.PI * pw / (pw + 1); 
    }

    if (discElapsedTime >= discTime * 1000) {
        if (n === cardNb - 1) {
            discAction = false;
            restoreDiscIndicator(cardNb);
            if (Math.sign(cardTotal) !== -Math.sign(rotationValue) && Math.abs(cardTotal) !==0) {
                removeDiscsAction = true;
                removeCardsPlayed(cardNb);
                topCardAfterCardsPlayed = false;
                let discsToRemove = Math.min(Math.abs(cardTotal), cardNb);
                playQuadX = [];
                boardQuadX = [];
                quadY = [];
                var offset = 0.25;
                var xPlayHeight = 0;
                var xBoardHeight = 0;
                var discsPlayStart = 0;
                var discsBoardStart = 0;
                zPlayStart[i] = [];
                zBoardStart[i] = [];
                var d = 1;
                for (var i = 0; i < discsToRemove; i++) {
                    discsPlayStart = discsToPlay[cardNb - 1 - i].position.clone();
                    discsBoardStart = discsOnBoard[Math.abs(cardTotal) - 1 - i].position.clone();
                    zPlayStart[i] = discsPlayStart.z;
                    zBoardStart[i] = discsBoardStart.z;
                    if (discsPlayStart.x > discsBoardStart.x) {
                        d = 1;
                        xPlayHeight = Math.max(discsPlayStart.x + offset, discEnd + offset);
                        xBoardHeight = Math.min(discsBoardStart.x - offset, -(discEnd + offset));
                    }
                    else {
                        d = -1;
                        xPlayHeight = Math.min(discsPlayStart.x - offset, -(discEnd + offset));
                        xBoardHeight = Math.max(discsBoardStart.x + offset, discEnd + offset);
                    }
                    playQuadX[i] = quadParams(discsPlayStart.x, d * discEnd, 0.75, xPlayHeight); 
                    boardQuadX[i] = quadParams(discsBoardStart.x, -d * discEnd, 0.75, xBoardHeight);
                }
                removeDiscsElapsedTime = 0;
            }
            else {
                while (discsToPlay.length > 0) {
                    discsOnBoard.push(discsToPlay.shift());
                }
                removeCardsPlayed(cardNb);
                topCardAfterCardsPlayed = true;
                cardTotal = nextTotal;
                if (cardTotal === target) {
                    ending = "s.";
                    if (turnNb === 2) {
                        ending = ".";
                    }
                    words.text = "Congratulations you have achieved the target in " + (turnNb - 1) + " move"+ ending;
                    blockCard.setEnabled(true);
                    dialogueBox.isVisible = true;
                  }
            }

        }
    }
    discElapsedTime += deltaTime;
    if (discElapsedTime > discTime * 1000) {
        discElapsedtime = discTime * 1000;
    }
};

var removeDiscsAnimation = (n, cardNb) => {
    var rate = 6;
    var startTime = n * 750;
    var endTime = removeDiscsAnimationTime + n * 0.75;
    var pw = Math.pow(Math.E, rate * ( 0.002 * rate * (removeDiscsElapsedTime - startTime) / removeDiscsAnimationTime - rate));
    var p = pw / (1 + pw);
    var q = Math.min(2 * p , 1);
    if (startTime < removeDiscsElapsedTime && removeDiscsElapsedTime <= endTime * 1000) { 
        discsOnBoard[Math.abs(cardTotal) - 1 - n].position.x = boardQuadX[n].a * p * p + boardQuadX[n].b * p + boardQuadX[n].c;
        discsOnBoard[Math.abs(cardTotal) - 1 - n].position.y = yDiscStart - (yDiscStart - (n + 2) * 0.5) * q; 
        discsOnBoard[Math.abs(cardTotal) - 1 - n].position.z = zBoardStart[n] - zBoardStart[n] * p;        
        discsToPlay[cardNb - 1 - n].position.x = playQuadX[n].a * p * p + playQuadX[n].b * p + playQuadX[n].c;
        discsToPlay[cardNb - 1 - n].position.y = yDiscStart - (yDiscStart - (n + 2) * 0.5) * q; 
        discsToPlay[cardNb - 1 - n].position.z = zPlayStart[n] - zPlayStart[n] * p;
    } 
};

var removeDiscsUpAnimation = (n, cardNb) => {
    var rate = 3;
    var pw = Math.pow(Math.E, rate * ( 0.002 * rate * removeDiscsUpElapsedTime/ removeDiscsUpAnimationTime - rate));
    var p = pw / (1 + pw);
    if (removeDiscsUpElapsedTime <= removeDiscsUpAnimationTime * 1000) { 
        discsOnBoard[Math.abs(cardTotal) - 1 - n].position.y += 2 * p
        discsToPlay[cardNb - 1 - n].position.y += 2 * p 
    } 
};

var zeroDiscsAnimation = (n, nbDiscs) => {
    var rate = 3;
    var height = 1;
    var gap, a;
    var startTime = n * 250;
    var endTime = zeroDiscsAnimationTime + n * 0.25;
    var pw = Math.pow(Math.E, rate * ( 0.002 * rate * (zeroDiscsElapsedTime - startTime) / zeroDiscsAnimationTime - rate));
    var p = pw / (pw + 1); 
    if (startTime <= zeroDiscsElapsedTime && zeroDiscsElapsedTime <= endTime * 1000) {       
        discsToPlay[nbDiscs - n].position.x = removeDiscsPlayX[nbDiscs - n]  + (-3.5 + n % 8 - removeDiscsPlayX[nbDiscs - n]) *p;       
        gap = 0.15 - height;
        a = gap / (0.5 * 0.5);
        discsToPlay[nbDiscs - n].position.y =  a * (p - 0.5) * (p - 0.5) + height;
        discsToPlay[nbDiscs - n].position.z = removeDiscsPlayZ[nbDiscs - n]  + (3.5 - Math.floor(n / 8) - removeDiscsPlayZ[nbDiscs - n]) *p;
    }
}

var startTarget = (cardNb) => {
    for (var i = 0; i < cardNb; i++) {
        targetDisc[i].setEnabled(true);
        if (Math.sign(rotationValue) > 0) {
            targetDisc[i].material = blueMat;
        }
        else {
            targetDisc[i].material = redMat;
        }
    }
    for (var i = 8; i > cardNb - 1; i--) {
        targetDisc[i].setEnabled(false)
    }
    showTarget = true;
    restoreDiscIndicator(cardNb);
}

var showTargetAnimation = (deltaTime) => {
    var rate = 3;
    var pw = Math.pow(Math.E, rate * ( 0.002 * rate * showTargetElapsedTime / showTargetAnimationTime - rate));
    var p = pw / (pw + 1); 
    if (showTargetElapsedTime <= showTargetAnimationTime * 1000) {       
        targetBox.position.y = -1.75  + 2.5 * p;       
    }

    if (showTargetElapsedTime >= showTargetAnimationTime * 1000) {
        showTarget = false;
        showTargetElapsedTime = 0;
        topCard.setEnabled(true);
    }

    showTargetElapsedTime += deltaTime;
    if (showTargetElapsedTime > showTargetAnimationTime * 1000) {
        showTargetElapsedtime = showTargetAnimationTime * 1000;
    }
}

var removePlayedAnimation = (deltaTime, yq5, zq5, yq3, zq3) => {
    var rate = 3;
    var pw = Math.pow(Math.E, rate * ( 0.002 * rate * removePlayedElapsedTime / removePlayedAnimationTime - rate));
    var p = pw / (pw + 1);
    if (removePlayedElapsedTime <= removePlayedAnimationTime * 1000) {
        played5.position.x = playPosition5.x - playPosition5.x * p;        
        played5.position.y = yq5.a * p * p + yq5.b * p + yq5.c;
        played5.position.z = zq5.a * p * p + zq5.b * p + zq5.c;  
        played5.rotation.x = -p * Math.PI / 2;
        if (played3) {
            played3.position.x = playPosition3.x - playPosition3.x * p;        
            played3.position.y = yq3.a * p * p + yq3.b * p + yq3.c;
            played3.position.z = zq3.a * p * p + zq3.b * p + zq3.c;  
            played3.rotation.x = -p * Math.PI / 2;
        }  
    }

    if (removePlayedElapsedTime >= removePlayedAnimationTime * 1000) {
        removePlayed = false;
        if (topCardAfterCardsPlayed) {
            topCard.setEnabled(true);
        }

        played5.dispose();
        
        if (played3) {
            played3.dispose();
        }
    }

    removePlayedElapsedTime += deltaTime;
    if (removePlayedElapsedTime > removePlayedAnimationTime * 1000) {
        removePlayedElapsedtime = removePlayedAnimationTime * 1000;
    }
}

var removeCardsPlayed = (cardNb) => {
    restoreDiscIndicator(cardNb);
    removePlayedElapsedTime = 0
    if (scene.getMeshByName("playedCard5")) {
        if (scene.getMeshByName("playedCard3")) {
            played3 = scene.getMeshByName("playedCard3");
            playPosition3 = played3.position.clone();
            playedZQ3 = quadParams(playPosition3.z, 0, 0.75, playPosition3.z - 6);
            playedYQ3 = quadParams(playPosition3.y, -6, 0.5, playPosition3.y + 4);
        }
        played5 = scene.getMeshByName("playedCard5");
        playPosition5 = played5.position.clone();
        playedZQ5 = quadParams(playPosition5.z, 0, 0.75, playPosition5.z - 6);
        playedYQ5 = quadParams(playPosition5.y, -6, 0.5, playPosition5.y + 4);
        removePlayed = true;
    }
}

var restoreDiscIndicator = (cardNb) => {
    if (rotationValue == 1 && !isNaN(cardNb)) {
        resetDisc = true;
        resetCyl.setEnabled(true);
        initialRotation = -1;
        resetElapsedTime = 0;
    } 
}

var quadParams = (start, end, x, y) => {
    var c = start;
    var a = (c + (end * x - y) / (1 - x)) / x;
    var b = end - a - c;
    return {a:a, b:b, c:c};
}
