var Follow=pc.createScript("follow");Follow.attributes.add("target",{type:"entity",title:"Target",description:"The Entity to follow"}),Follow.attributes.add("distance",{type:"number",default:4,title:"Distance",description:"How far from the Entity should the follower be"}),Follow.prototype.initialize=function(){this.vec=new pc.Vec3},Follow.prototype.update=function(t){if(this.target){var e=this.target.getPosition();e.x+=.75*this.distance,e.y+=1*this.distance,e.z+=.75*this.distance,this.vec.lerp(this.vec,e,.1),this.entity.setPosition(this.vec)}};var Movement=pc.createScript("movement");Movement.attributes.add("speed",{type:"number",default:.1,min:.05,max:.5,precision:2,description:"Controls the movement speed"}),Movement.prototype.initialize=function(){this.force=new pc.Vec3},Movement.prototype.update=function(e){var t=0,s=0;if(this.app.keyboard.isPressed(pc.KEY_LEFT)&&(t=-this.speed),this.app.keyboard.isPressed(pc.KEY_RIGHT)&&(t+=this.speed),this.app.keyboard.isPressed(pc.KEY_UP)&&(s=-this.speed),this.app.keyboard.isPressed(pc.KEY_DOWN)&&(s+=this.speed),this.force.x=t,this.force.z=s,this.force.length()){var i=Math.cos(.25*-Math.PI),o=Math.sin(.25*-Math.PI);this.force.set(this.force.x*i-this.force.z*o,0,this.force.z*i+this.force.x*o),this.force.length()>this.speed&&this.force.normalize().scale(this.speed)}this.entity.rigidbody.applyImpulse(this.force)};var Teleportable=pc.createScript("teleportable");Teleportable.prototype.initialize=function(){this.lastTeleportFrom=null,this.lastTeleportTo=null,this.lastTeleport=Date.now(),this.startPosition=this.entity.getPosition().clone()},Teleportable.prototype.update=function(t){this.entity.getPosition().y<0&&this.teleport(this.lastTeleportFrom,this.lastTeleportTo)},Teleportable.prototype.teleport=function(t,e){var o;t&&Date.now()-this.lastTeleport<500||(this.lastTeleport=Date.now(),this.lastTeleportFrom=t,this.lastTeleportTo=e,e?(o=e.getPosition()).y+=.5:o=this.startPosition,this.entity.rigidbody.teleport(o),this.entity.rigidbody.linearVelocity=pc.Vec3.ZERO,this.entity.rigidbody.angularVelocity=pc.Vec3.ZERO)};var Teleport=pc.createScript("teleport");Teleport.attributes.add("target",{type:"entity",title:"Target Entity",description:"The target entity where we are going to teleport"}),Teleport.prototype.initialize=function(){this.target&&this.entity.collision.on("triggerenter",this.onTriggerEnter,this)},Teleport.prototype.onTriggerEnter=function(t){t.script.teleportable&&t.script.teleportable.teleport(this.entity,this.target)};var MouseDragRotate=pc.createScript("mouseDragRotate");MouseDragRotate.attributes.add("sensitivity",{type:"number",default:.2}),MouseDragRotate.prototype.initialize=function(){this.isDragging=!1,this.startPosition=new pc.Vec2,this.maxPitch=45,this.maxYaw=90,this.app.mouse.on(pc.EVENT_MOUSEDOWN,this.onMouseDown,this),this.app.mouse.on(pc.EVENT_MOUSEUP,this.onMouseUp,this),this.app.mouse.on(pc.EVENT_MOUSEMOVE,this.onMouseMove,this)},MouseDragRotate.prototype.onMouseDown=function(t){this.isDragging=!0,this.startPosition.set(t.x,t.y)},MouseDragRotate.prototype.onMouseUp=function(t){if(this.isDragging){this.isDragging=!1;var i=t.x-this.startPosition.x,s=t.y-this.startPosition.y,e=this.entity.getLocalEulerAngles().x-s*this.sensitivity;e=pc.math.clamp(e,0,this.maxPitch);var o=this.entity.getLocalEulerAngles().y-i*this.sensitivity;o=pc.math.clamp(o,-this.maxYaw,this.maxYaw),this.rotateTo(e,o)}},MouseDragRotate.prototype.onMouseMove=function(t){if(this.isDragging){var i=t.x-this.startPosition.x,s=t.y-this.startPosition.y,e=this.entity.getLocalEulerAngles().x-s*this.sensitivity;e=pc.math.clamp(e,0,this.maxPitch);var o=this.entity.getLocalEulerAngles().y-i*this.sensitivity;o=pc.math.clamp(o,-this.maxYaw,this.maxYaw),this.entity.setLocalEulerAngles(e,o,0),this.startPosition.set(t.x,t.y)}},MouseDragRotate.prototype.rotateTo=function(t,i){this.entity.getLocalEulerAngles().x,this.entity.getLocalEulerAngles().y;this.entity.tween(this.entity.getLocalEulerAngles()).rotate({x:t,y:i},.5).start()};var Test=pc.createScript("test");Test.prototype.initialize=function(){this.entity.tween(this.entity.getLocalEulerAngles()).rotate(new pc.Vec3(180,0,180),1,pc.Linear).loop(!0).yoyo(!0).start()},Test.prototype.update=function(t){};pc.extend(pc,function(){var TweenManager=function(t){this._app=t,this._tweens=[],this._add=[]};TweenManager.prototype={add:function(t){return this._add.push(t),t},update:function(t){for(var i=0,e=this._tweens.length;i<e;)this._tweens[i].update(t)?i++:(this._tweens.splice(i,1),e--);if(this._add.length){for(let t=0;t<this._add.length;t++)this._tweens.indexOf(this._add[t])>-1||this._tweens.push(this._add[t]);this._add.length=0}}};var Tween=function(t,i,e){pc.events.attach(this),this.manager=i,e&&(this.entity=null),this.time=0,this.complete=!1,this.playing=!1,this.stopped=!0,this.pending=!1,this.target=t,this.duration=0,this._currentDelay=0,this.timeScale=1,this._reverse=!1,this._delay=0,this._yoyo=!1,this._count=0,this._numRepeats=0,this._repeatDelay=0,this._from=!1,this._slerp=!1,this._fromQuat=new pc.Quat,this._toQuat=new pc.Quat,this._quat=new pc.Quat,this.easing=pc.Linear,this._sv={},this._ev={}},_parseProperties=function(t){var i;return t instanceof pc.Vec2?i={x:t.x,y:t.y}:t instanceof pc.Vec3?i={x:t.x,y:t.y,z:t.z}:t instanceof pc.Vec4||t instanceof pc.Quat?i={x:t.x,y:t.y,z:t.z,w:t.w}:t instanceof pc.Color?(i={r:t.r,g:t.g,b:t.b},void 0!==t.a&&(i.a=t.a)):i=t,i};Tween.prototype={to:function(t,i,e,s,n,r){return this._properties=_parseProperties(t),this.duration=i,e&&(this.easing=e),s&&this.delay(s),n&&this.repeat(n),r&&this.yoyo(r),this},from:function(t,i,e,s,n,r){return this._properties=_parseProperties(t),this.duration=i,e&&(this.easing=e),s&&this.delay(s),n&&this.repeat(n),r&&this.yoyo(r),this._from=!0,this},rotate:function(t,i,e,s,n,r){return this._properties=_parseProperties(t),this.duration=i,e&&(this.easing=e),s&&this.delay(s),n&&this.repeat(n),r&&this.yoyo(r),this._slerp=!0,this},start:function(){var t,i,e,s;if(this.playing=!0,this.complete=!1,this.stopped=!1,this._count=0,this.pending=this._delay>0,this._reverse&&!this.pending?this.time=this.duration:this.time=0,this._from){for(t in this._properties)this._properties.hasOwnProperty(t)&&(this._sv[t]=this._properties[t],this._ev[t]=this.target[t]);this._slerp&&(this._toQuat.setFromEulerAngles(this.target.x,this.target.y,this.target.z),i=void 0!==this._properties.x?this._properties.x:this.target.x,e=void 0!==this._properties.y?this._properties.y:this.target.y,s=void 0!==this._properties.z?this._properties.z:this.target.z,this._fromQuat.setFromEulerAngles(i,e,s))}else{for(t in this._properties)this._properties.hasOwnProperty(t)&&(this._sv[t]=this.target[t],this._ev[t]=this._properties[t]);this._slerp&&(i=void 0!==this._properties.x?this._properties.x:this.target.x,e=void 0!==this._properties.y?this._properties.y:this.target.y,s=void 0!==this._properties.z?this._properties.z:this.target.z,void 0!==this._properties.w?(this._fromQuat.copy(this.target),this._toQuat.set(i,e,s,this._properties.w)):(this._fromQuat.setFromEulerAngles(this.target.x,this.target.y,this.target.z),this._toQuat.setFromEulerAngles(i,e,s)))}return this._currentDelay=this._delay,this.manager.add(this),this},pause:function(){this.playing=!1},resume:function(){this.playing=!0},stop:function(){this.playing=!1,this.stopped=!0},delay:function(t){return this._delay=t,this.pending=!0,this},repeat:function(t,i){return this._count=0,this._numRepeats=t,this._repeatDelay=i||0,this},loop:function(t){return t?(this._count=0,this._numRepeats=1/0):this._numRepeats=0,this},yoyo:function(t){return this._yoyo=t,this},reverse:function(){return this._reverse=!this._reverse,this},chain:function(){for(var t=arguments.length;t--;)t>0?arguments[t-1]._chained=arguments[t]:this._chained=arguments[t];return this},update:function(t){if(this.stopped)return!1;if(!this.playing)return!0;if(!this._reverse||this.pending?this.time+=t*this.timeScale:this.time-=t*this.timeScale,this.pending){if(!(this.time>this._currentDelay))return!0;this._reverse?this.time=this.duration-(this.time-this._currentDelay):this.time-=this._currentDelay,this.pending=!1}var i=0;(!this._reverse&&this.time>this.duration||this._reverse&&this.time<0)&&(this._count++,this.complete=!0,this.playing=!1,this._reverse?(i=this.duration-this.time,this.time=0):(i=this.time-this.duration,this.time=this.duration));var e,s,n=0===this.duration?1:this.time/this.duration,r=this.easing(n);for(var h in this._properties)this._properties.hasOwnProperty(h)&&(e=this._sv[h],s=this._ev[h],this.target[h]=e+(s-e)*r);if(this._slerp&&this._quat.slerp(this._fromQuat,this._toQuat,r),this.entity&&(this.entity._dirtifyLocal(),this.element&&this.entity.element&&(this.entity.element[this.element]=this.target),this._slerp&&this.entity.setLocalRotation(this._quat)),this.fire("update",t),this.complete){var a=this._repeat(i);return a?this.fire("loop"):(this.fire("complete",i),this.entity&&this.entity.off("destroy",this.stop,this),this._chained&&this._chained.start()),a}return!0},_repeat:function(t){if(this._count<this._numRepeats){if(this._reverse?this.time=this.duration-t:this.time=t,this.complete=!1,this.playing=!0,this._currentDelay=this._repeatDelay,this.pending=!0,this._yoyo){for(var i in this._properties){var e=this._sv[i];this._sv[i]=this._ev[i],this._ev[i]=e}this._slerp&&(this._quat.copy(this._fromQuat),this._fromQuat.copy(this._toQuat),this._toQuat.copy(this._quat))}return!0}return!1}};var BounceOut=function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},BounceIn=function(t){return 1-BounceOut(1-t)};return{TweenManager:TweenManager,Tween:Tween,Linear:function(t){return t},QuadraticIn:function(t){return t*t},QuadraticOut:function(t){return t*(2-t)},QuadraticInOut:function(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)},CubicIn:function(t){return t*t*t},CubicOut:function(t){return--t*t*t+1},CubicInOut:function(t){return(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2)},QuarticIn:function(t){return t*t*t*t},QuarticOut:function(t){return 1- --t*t*t*t},QuarticInOut:function(t){return(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)},QuinticIn:function(t){return t*t*t*t*t},QuinticOut:function(t){return--t*t*t*t*t+1},QuinticInOut:function(t){return(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)},SineIn:function(t){return 0===t?0:1===t?1:1-Math.cos(t*Math.PI/2)},SineOut:function(t){return 0===t?0:1===t?1:Math.sin(t*Math.PI/2)},SineInOut:function(t){return 0===t?0:1===t?1:.5*(1-Math.cos(Math.PI*t))},ExponentialIn:function(t){return 0===t?0:Math.pow(1024,t-1)},ExponentialOut:function(t){return 1===t?1:1-Math.pow(2,-10*t)},ExponentialInOut:function(t){return 0===t?0:1===t?1:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(2-Math.pow(2,-10*(t-1)))},CircularIn:function(t){return 1-Math.sqrt(1-t*t)},CircularOut:function(t){return Math.sqrt(1- --t*t)},CircularInOut:function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},BackIn:function(t){var i=1.70158;return t*t*((i+1)*t-i)},BackOut:function(t){var i=1.70158;return--t*t*((i+1)*t+i)+1},BackInOut:function(t){var i=2.5949095;return(t*=2)<1?t*t*((i+1)*t-i)*.5:.5*((t-=2)*t*((i+1)*t+i)+2)},BounceIn:BounceIn,BounceOut:BounceOut,BounceInOut:function(t){return t<.5?.5*BounceIn(2*t):.5*BounceOut(2*t-1)+.5},ElasticIn:function(t){var i,e=.1;return 0===t?0:1===t?1:(!e||e<1?(e=1,i=.1):i=.4*Math.asin(1/e)/(2*Math.PI),-e*Math.pow(2,10*(t-=1))*Math.sin((t-i)*(2*Math.PI)/.4))},ElasticOut:function(t){var i,e=.1;return 0===t?0:1===t?1:(!e||e<1?(e=1,i=.1):i=.4*Math.asin(1/e)/(2*Math.PI),e*Math.pow(2,-10*t)*Math.sin((t-i)*(2*Math.PI)/.4)+1)},ElasticInOut:function(t){var i,e=.1,s=.4;return 0===t?0:1===t?1:(!e||e<1?(e=1,i=.1):i=s*Math.asin(1/e)/(2*Math.PI),(t*=2)<1?e*Math.pow(2,10*(t-=1))*Math.sin((t-i)*(2*Math.PI)/s)*-.5:e*Math.pow(2,-10*(t-=1))*Math.sin((t-i)*(2*Math.PI)/s)*.5+1)}}}()),function(){pc.AppBase.prototype.addTweenManager=function(){this._tweenManager=new pc.TweenManager(this),this.on("update",(function(t){this._tweenManager.update(t)}))},pc.AppBase.prototype.tween=function(t){return new pc.Tween(t,this._tweenManager)},pc.Entity.prototype.tween=function(t,i){var e=this._app.tween(t);return e.entity=this,this.once("destroy",e.stop,e),i&&i.element&&(e.element=i.element),e};var t=pc.AppBase.getApplication();t&&t.addTweenManager()}();var TouchInput=pc.createScript("touchInput");TouchInput.attributes.add("orbitSensitivity",{type:"number",default:.4,title:"Orbit Sensitivity",description:"How fast the camera moves around the orbit. Higher is faster"}),TouchInput.attributes.add("distanceSensitivity",{type:"number",default:.2,title:"Distance Sensitivity",description:"How fast the camera moves in and out. Higher is faster"}),TouchInput.prototype.initialize=function(){this.orbitCamera=this.entity.script.orbitCamera,this.lastTouchPoint=new pc.Vec2,this.lastPinchMidPoint=new pc.Vec2,this.lastPinchDistance=0,this.orbitCamera&&this.app.touch&&(this.app.touch.on(pc.EVENT_TOUCHSTART,this.onTouchStartEndCancel,this),this.app.touch.on(pc.EVENT_TOUCHEND,this.onTouchStartEndCancel,this),this.app.touch.on(pc.EVENT_TOUCHCANCEL,this.onTouchStartEndCancel,this),this.app.touch.on(pc.EVENT_TOUCHMOVE,this.onTouchMove,this),this.on("destroy",(function(){this.app.touch.off(pc.EVENT_TOUCHSTART,this.onTouchStartEndCancel,this),this.app.touch.off(pc.EVENT_TOUCHEND,this.onTouchStartEndCancel,this),this.app.touch.off(pc.EVENT_TOUCHCANCEL,this.onTouchStartEndCancel,this),this.app.touch.off(pc.EVENT_TOUCHMOVE,this.onTouchMove,this)})))},TouchInput.prototype.getPinchDistance=function(t,i){var o=t.x-i.x,n=t.y-i.y;return Math.sqrt(o*o+n*n)},TouchInput.prototype.calcMidPoint=function(t,i,o){o.set(i.x-t.x,i.y-t.y),o.scale(.5),o.x+=t.x,o.y+=t.y},TouchInput.prototype.onTouchStartEndCancel=function(t){var i=t.touches;1==i.length?this.lastTouchPoint.set(i[0].x,i[0].y):2==i.length&&(this.lastPinchDistance=this.getPinchDistance(i[0],i[1]),this.calcMidPoint(i[0],i[1],this.lastPinchMidPoint))},TouchInput.fromWorldPoint=new pc.Vec3,TouchInput.toWorldPoint=new pc.Vec3,TouchInput.worldDiff=new pc.Vec3,TouchInput.prototype.pan=function(t){var i=TouchInput.fromWorldPoint,o=TouchInput.toWorldPoint,n=TouchInput.worldDiff,h=this.entity.camera,c=this.orbitCamera.distance;h.screenToWorld(t.x,t.y,c,i),h.screenToWorld(this.lastPinchMidPoint.x,this.lastPinchMidPoint.y,c,o),n.sub2(o,i),this.orbitCamera.pivotPoint.add(n)},TouchInput.pinchMidPoint=new pc.Vec2,TouchInput.prototype.onTouchMove=function(t){var i=TouchInput.pinchMidPoint,o=t.touches;if(1==o.length){var n=o[0];this.orbitCamera.pitch-=(n.y-this.lastTouchPoint.y)*this.orbitSensitivity,this.orbitCamera.yaw-=(n.x-this.lastTouchPoint.x)*this.orbitSensitivity,this.lastTouchPoint.set(n.x,n.y)}else if(2==o.length){var h=this.getPinchDistance(o[0],o[1]),c=h-this.lastPinchDistance;this.lastPinchDistance=h,this.orbitCamera.distance-=c*this.distanceSensitivity*.1*(.1*this.orbitCamera.distance),this.calcMidPoint(o[0],o[1],i),this.pan(i),this.lastPinchMidPoint.copy(i)}};var OrbitCamera=pc.createScript("orbitCamera");OrbitCamera.attributes.add("autoRender",{type:"boolean",default:!0,title:"Auto Render",description:"Disable to only render when camera is moving (saves power when the camera is still)"}),OrbitCamera.attributes.add("distanceMax",{type:"number",default:0,title:"Distance Max",description:"Setting this at 0 will give an infinite distance limit"}),OrbitCamera.attributes.add("distanceMin",{type:"number",default:0,title:"Distance Min"}),OrbitCamera.attributes.add("pitchAngleMax",{type:"number",default:90,title:"Pitch Angle Max (degrees)"}),OrbitCamera.attributes.add("pitchAngleMin",{type:"number",default:-90,title:"Pitch Angle Min (degrees)"}),OrbitCamera.attributes.add("inertiaFactor",{type:"number",default:0,title:"Inertia Factor",description:"Higher value means that the camera will continue moving after the user has stopped dragging. 0 is fully responsive."}),OrbitCamera.attributes.add("focusEntity",{type:"entity",title:"Focus Entity",description:"Entity for the camera to focus on. If blank, then the camera will use the whole scene"}),OrbitCamera.attributes.add("frameOnStart",{type:"boolean",default:!0,title:"Frame on Start",description:'Frames the entity or scene at the start of the application."'}),Object.defineProperty(OrbitCamera.prototype,"distance",{get:function(){return this._targetDistance},set:function(t){this._targetDistance=this._clampDistance(t)}}),Object.defineProperty(OrbitCamera.prototype,"pitch",{get:function(){return this._targetPitch},set:function(t){this._targetPitch=this._clampPitchAngle(t)}}),Object.defineProperty(OrbitCamera.prototype,"yaw",{get:function(){return this._targetYaw},set:function(t){this._targetYaw=t;var i=(this._targetYaw-this._yaw)%360;this._targetYaw=i>180?this._yaw-(360-i):i<-180?this._yaw+(360+i):this._yaw+i}}),Object.defineProperty(OrbitCamera.prototype,"pivotPoint",{get:function(){return this._pivotPoint},set:function(t){this._pivotPoint.copy(t)}}),OrbitCamera.prototype.focus=function(t){this._buildAabb(t,0);var i=this._modelsAabb.halfExtents,e=Math.max(i.x,Math.max(i.y,i.z));e/=Math.tan(.5*this.entity.camera.fov*pc.math.DEG_TO_RAD),e*=2,this.distance=e,this._removeInertia(),this._pivotPoint.copy(this._modelsAabb.center)},OrbitCamera.distanceBetween=new pc.Vec3,OrbitCamera.prototype.resetAndLookAtPoint=function(t,i){this.pivotPoint.copy(i),this.entity.setPosition(t),this.entity.lookAt(i);var e=OrbitCamera.distanceBetween;e.sub2(i,t),this.distance=e.length(),this.pivotPoint.copy(i);var a=this.entity.getRotation();this.yaw=this._calcYaw(a),this.pitch=this._calcPitch(a,this.yaw),this._removeInertia(),this._updatePosition(),this.autoRender||(this.app.renderNextFrame=!0)},OrbitCamera.prototype.resetAndLookAtEntity=function(t,i){this._buildAabb(i,0),this.resetAndLookAtPoint(t,this._modelsAabb.center)},OrbitCamera.prototype.reset=function(t,i,e){this.pitch=i,this.yaw=t,this.distance=e,this._removeInertia(),this.autoRender||(this.app.renderNextFrame=!0)},OrbitCamera.prototype.initialize=function(){this._checkAspectRatio(),this._modelsAabb=new pc.BoundingBox,this._buildAabb(this.focusEntity||this.app.root,0),this.entity.lookAt(this._modelsAabb.center),this._pivotPoint=new pc.Vec3,this._pivotPoint.copy(this._modelsAabb.center),this._lastFramePivotPoint=this._pivotPoint.clone();var t=this.entity.getRotation();if(this._yaw=this._calcYaw(t),this._pitch=this._clampPitchAngle(this._calcPitch(t,this._yaw)),this.entity.setLocalEulerAngles(this._pitch,this._yaw,0),this._distance=0,this._targetYaw=this._yaw,this._targetPitch=this._pitch,this.frameOnStart)this.focus(this.focusEntity||this.app.root);else{var i=new pc.Vec3;i.sub2(this.entity.getPosition(),this._pivotPoint),this._distance=this._clampDistance(i.length())}this._targetDistance=this._distance,this._autoRenderDefault=this.app.autoRender,this.app.autoRender&&(this.app.autoRender=this.autoRender),this.autoRender||(this.app.renderNextFrame=!0),this.on("attr:autoRender",(function(t,i){this.app.autoRender=t,this.autoRender||(this.app.renderNextFrame=!0)}),this),this.on("attr:distanceMin",(function(t,i){this._targetDistance=this._clampDistance(this._distance)}),this),this.on("attr:distanceMax",(function(t,i){this._targetDistance=this._clampDistance(this._distance)}),this),this.on("attr:pitchAngleMin",(function(t,i){this._targetPitch=this._clampPitchAngle(this._pitch)}),this),this.on("attr:pitchAngleMax",(function(t,i){this._targetPitch=this._clampPitchAngle(this._pitch)}),this),this.on("attr:focusEntity",(function(t,i){this.frameOnStart?this.focus(t||this.app.root):this.resetAndLookAtEntity(this.entity.getPosition(),t||this.app.root)}),this),this.on("attr:frameOnStart",(function(t,i){t&&this.focus(this.focusEntity||this.app.root)}),this);var onResizeCanvas=function(){this._checkAspectRatio(),this.autoRender||(this.app.renderNextFrame=!0)};this.app.graphicsDevice.on("resizecanvas",onResizeCanvas,this),this.on("destroy",(function(){this.app.graphicsDevice.off("resizecanvas",onResizeCanvas,this),this.app.autoRender=this._autoRenderDefault}),this)},OrbitCamera.prototype.update=function(t){if(!this.autoRender){var i=Math.abs(this._targetDistance-this._distance),e=Math.abs(this._targetYaw-this._yaw),a=Math.abs(this._targetPitch-this._pitch),s=this._lastFramePivotPoint.distance(this._pivotPoint);this.app.renderNextFrame=this.app.renderNextFrame||i>.01||e>.01||a>.01||s>0}var n=0===this.inertiaFactor?1:Math.min(t/this.inertiaFactor,1);this._distance=pc.math.lerp(this._distance,this._targetDistance,n),this._yaw=pc.math.lerp(this._yaw,this._targetYaw,n),this._pitch=pc.math.lerp(this._pitch,this._targetPitch,n),this._lastFramePivotPoint.copy(this._pivotPoint),this._updatePosition()},OrbitCamera.prototype._updatePosition=function(){this.entity.setLocalPosition(0,0,0),this.entity.setLocalEulerAngles(this._pitch,this._yaw,0);var t=this.entity.getPosition();t.copy(this.entity.forward),t.scale(-this._distance),t.add(this.pivotPoint),this.entity.setPosition(t)},OrbitCamera.prototype._removeInertia=function(){this._yaw=this._targetYaw,this._pitch=this._targetPitch,this._distance=this._targetDistance},OrbitCamera.prototype._checkAspectRatio=function(){var t=this.app.graphicsDevice.height,i=this.app.graphicsDevice.width;this.entity.camera.horizontalFov=t>i},OrbitCamera.prototype._buildAabb=function(t,i){var e,a=0,s=0;if(t instanceof pc.Entity){var n=[],r=t.findComponents("render");for(a=0;a<r.length;++a)if(e=r[a].meshInstances)for(s=0;s<e.length;s++)n.push(e[s]);var h=t.findComponents("model");for(a=0;a<h.length;++a)if(e=h[a].meshInstances)for(s=0;s<e.length;s++)n.push(e[s]);for(a=0;a<n.length;a++)0===i?this._modelsAabb.copy(n[a].aabb):this._modelsAabb.add(n[a].aabb),i+=1}for(a=0;a<t.children.length;++a)i+=this._buildAabb(t.children[a],i);return i},OrbitCamera.prototype._calcYaw=function(t){var i=new pc.Vec3;return t.transformVector(pc.Vec3.FORWARD,i),Math.atan2(-i.x,-i.z)*pc.math.RAD_TO_DEG},OrbitCamera.prototype._clampDistance=function(t){return this.distanceMax>0?pc.math.clamp(t,this.distanceMin,this.distanceMax):Math.max(t,this.distanceMin)},OrbitCamera.prototype._clampPitchAngle=function(t){return pc.math.clamp(t,-this.pitchAngleMax,-this.pitchAngleMin)},OrbitCamera.quatWithoutYaw=new pc.Quat,OrbitCamera.yawOffset=new pc.Quat,OrbitCamera.prototype._calcPitch=function(t,i){var e=OrbitCamera.quatWithoutYaw,a=OrbitCamera.yawOffset;a.setFromEulerAngles(0,-i,0),e.mul2(a,t);var s=new pc.Vec3;return e.transformVector(pc.Vec3.FORWARD,s),Math.atan2(s.y,-s.z)*pc.math.RAD_TO_DEG};var MouseInput=pc.createScript("mouseInput");MouseInput.attributes.add("orbitSensitivity",{type:"number",default:.3,title:"Orbit Sensitivity",description:"How fast the camera moves around the orbit. Higher is faster"}),MouseInput.attributes.add("distanceSensitivity",{type:"number",default:.15,title:"Distance Sensitivity",description:"How fast the camera moves in and out. Higher is faster"}),MouseInput.prototype.initialize=function(){if(this.orbitCamera=this.entity.script.orbitCamera,this.orbitCamera){var t=this,onMouseOut=function(o){t.onMouseOut(o)};this.app.mouse.on(pc.EVENT_MOUSEDOWN,this.onMouseDown,this),this.app.mouse.on(pc.EVENT_MOUSEUP,this.onMouseUp,this),this.app.mouse.on(pc.EVENT_MOUSEMOVE,this.onMouseMove,this),this.app.mouse.on(pc.EVENT_MOUSEWHEEL,this.onMouseWheel,this),window.addEventListener("mouseout",onMouseOut,!1),this.on("destroy",(function(){this.app.mouse.off(pc.EVENT_MOUSEDOWN,this.onMouseDown,this),this.app.mouse.off(pc.EVENT_MOUSEUP,this.onMouseUp,this),this.app.mouse.off(pc.EVENT_MOUSEMOVE,this.onMouseMove,this),this.app.mouse.off(pc.EVENT_MOUSEWHEEL,this.onMouseWheel,this),window.removeEventListener("mouseout",onMouseOut,!1)}))}this.app.mouse.disableContextMenu(),this.lookButtonDown=!1,this.panButtonDown=!1,this.lastPoint=new pc.Vec2},MouseInput.fromWorldPoint=new pc.Vec3,MouseInput.toWorldPoint=new pc.Vec3,MouseInput.worldDiff=new pc.Vec3,MouseInput.prototype.pan=function(t){var o=MouseInput.fromWorldPoint,e=MouseInput.toWorldPoint,i=MouseInput.worldDiff,s=this.entity.camera,n=this.orbitCamera.distance;s.screenToWorld(t.x,t.y,n,o),s.screenToWorld(this.lastPoint.x,this.lastPoint.y,n,e),i.sub2(e,o),this.orbitCamera.pivotPoint.add(i)},MouseInput.prototype.onMouseDown=function(t){switch(t.button){case pc.MOUSEBUTTON_LEFT:this.lookButtonDown=!0;break;case pc.MOUSEBUTTON_MIDDLE:case pc.MOUSEBUTTON_RIGHT:this.panButtonDown=!0}},MouseInput.prototype.onMouseUp=function(t){switch(t.button){case pc.MOUSEBUTTON_LEFT:this.lookButtonDown=!1;break;case pc.MOUSEBUTTON_MIDDLE:case pc.MOUSEBUTTON_RIGHT:this.panButtonDown=!1}},MouseInput.prototype.onMouseMove=function(t){pc.app.mouse;this.lookButtonDown?(this.orbitCamera.pitch-=t.dy*this.orbitSensitivity,this.orbitCamera.yaw-=t.dx*this.orbitSensitivity):this.panButtonDown&&this.pan(t),this.lastPoint.set(t.x,t.y)},MouseInput.prototype.onMouseWheel=function(t){this.orbitCamera.distance-=t.wheel*this.distanceSensitivity*(.1*this.orbitCamera.distance),t.event.preventDefault()},MouseInput.prototype.onMouseOut=function(t){this.lookButtonDown=!1,this.panButtonDown=!1};var PanoramaController=pc.createScript("panoramaController");PanoramaController.attributes.add("panorama",{type:"asset",title:"Panorama Asset"}),PanoramaController.prototype.initialize=function(){var a=new pc.StandardMaterial;a.emissiveMap=this.panorama.resource,a.cubemap=this.panorama.resource,a.cull=pc.CULLFACE_NONE;var e=new pc.Entity;e.addComponent("model",{type:"sphere"}),e.model.material=a,e.setLocalScale(50,50,50),this.entity.addChild(e)};var ClickDetectionScript=pc.createScript("clickDetectionScript");ClickDetectionScript.prototype.initialize=function(){this.mouseDownPosition=new pc.Vec2,this.mouseUpPosition=new pc.Vec2,this.mouseClick=!1,this.app.mouse.on(pc.EVENT_MOUSEDOWN,this.onMouseDown,this),this.app.mouse.on(pc.EVENT_MOUSEMOVE,this.onMouseMove,this),this.app.mouse.on(pc.EVENT_MOUSEUP,this.onMouseUp,this)},ClickDetectionScript.prototype.onMouseDown=function(t){this.mouseDownPosition.set(t.x,t.y)},ClickDetectionScript.prototype.onMouseUp=function(t){if(this.mouseUpPosition.set(t.x,t.y),this.mouseUpPosition.distance(this.mouseDownPosition)<1&&(this.mouseClick=!0),this.mouseClick){var e=new pc.Vec3(t.x,t.y,0);this.entity.camera.screenToWorld(e),this.entity.getPosition();const s=this.entity.camera.screenToWorld(t.x,t.y,this.entity.camera.nearClip),n=this.entity.camera.screenToWorld(t.x,t.y,this.entity.camera.farClip),c=this.app.systems.rigidbody.raycastAll(s,n);if(c.length>0){for(i=0;i<c.length;i++)console.log(c[i].entity.name);const t=c[0].entity.name;if("cj"==t){var o={type:"object_clicked",entityName:t};window.parent.postMessage(o,"/")}}this.mouseClick=!1}};var PanelScript=pc.createScript("panelScript");PanelScript.prototype.initialize=function(){this.panelEntity=this.entity,this.cameraEntity=this.app.root.findByName("Camera"),this.updatePanelContent("Hello, this is a 3D panel!")},PanelScript.prototype.update=function(t){if(this.cameraEntity){var i=this.cameraEntity.getPosition().sub(this.panelEntity.getPosition()).normalize();this.panelEntity.lookAt(this.panelEntity.getPosition().add(i))}},PanelScript.prototype.updatePanelContent=function(t){var i=new pc.Entity;i.addComponent("element",{type:pc.ELEMENTTYPE_TEXT,text:t,fontSize:24}),this.panelEntity.addChild(i)};var Billboard=pc.createScript("billBoard");Billboard.prototype.initialize=function(){this.camera=this.app.root.findByName("Camera")},Billboard.prototype.update=function(t){this.entity.setRotation(this.camera.getRotation())};var MiddlePointScript=pc.createScript("middlePointScript");MiddlePointScript.attributes.add("startEntity",{type:"entity",title:"Start Entity"}),MiddlePointScript.prototype.update=function(t){if(this.entity&&this.startEntity){var i=this.entity.getPosition(),e=this.startEntity.getPosition();this.app.drawLine(i,e,new pc.Color(1/255,83/255,.8,1))}};var BillBoardManager=pc.createScript("billBoardManager");BillBoardManager.attributes.add("billBoardLayers",{type:"entity",array:!0,title:"BillBoardLayers"}),BillBoardManager.prototype.initialize=function(){window.addEventListener("message",this.onMessageReceived.bind(this),!1)},BillBoardManager.prototype.update=function(e){},BillBoardManager.prototype.onMessageReceived=function(e){var a=e.data;if(console.log("Received message:",a),"billboard"===a.msgType){for(i=0;i<this.billBoardLayers.length;i++)this.billBoardLayers[i].enabled=!1;this.billBoardLayers[a.index].enabled=!0}};