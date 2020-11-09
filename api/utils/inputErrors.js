const validator = require('validator');

module.exports = async (input,properties)=>{
    
    // const { isLength ,isEmpty, isMatch, isAlphabets} = properties
    //const isLengthError;
    const { inputName, validation} = properties
    let results 
    validation.forEach(prop => {
        const { isLength ,isEmpty, isMatch, isAlphabets, isBoolean, isImage} = prop
        if(isLength){
            let min = isLength.min?isLength.min:undefined;
            let max = isLength.max?isLength.max:undefined; 
            if(!validator.isLength(input,{min:min,max:max})){
                if(min&&max){
                    return results=({[inputName]:`${inputName} value length must be between ${min} and ${max} characters`});
                } 
                if(min){
                    return results=({[inputName]:`${inputName} value length must be at least ${min===1? min+' character.': min+'characters'}`});
                }
                if(max){
                    return results=({[inputName]:`${inputName} value max length is ${min===1? min+' character.': min+'characters'}`});
                }
        
            }
        }
    
        if(!isEmpty){
            if(validator.isEmpty(input)){
                return results = ({
                    [inputName]: `${inputName} input field is required !`,
                })
            }
        }
    
        if(isMatch){
            const match = isMatch.regex
            if(input.match(match)){
                return results = ({
                    [inputName]: `${inputName} input does not allow special characters!`,
                })
            }
        }
    
        if(isAlphabets){
            const regex = /^[A-Za]+$/
            if(regex.test(input)){
                return results =({
                  [inputName]: `${inputName} input takes only alphabets!`,
                })
            }
        }
        if(isImage){
            if(!input){
                return results = ({
                    [inputName]: 'No image provided!',
                })
            }
        }
        if(isBoolean){
            if(typeof input !=='boolean'){
                return results = ({
                    [inputName]: `${inputName} input takes only boolean value!`,
                })
            }
        }

    });

    if(results){
        return results
    }else{
        return true
    }
    
}