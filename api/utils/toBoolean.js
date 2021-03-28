module.exports = (value) =>{
    if(value === 'true' || value===true){
        return true;
    }else if(value ==='false'||value===false){
        return false;
    }
}