//hign performance class extend function that that just invoke superType constructor once
function inheritePrototype(subType, superType){
	var prototype = Object(superType.prototype);
	prototype.constructor = subType;
	subType.prototype = prototype;
}