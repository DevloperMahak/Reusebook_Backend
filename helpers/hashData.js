const bcrypt = require('bcrypt');

const hashData = async(data,saltrounds = 10)=>{
    try{
        const hashedData = await bcrypt.hash(data,saltrounds);
        return hashedData;
    }catch(error){
        throw error;
    }
}

module.exports = hashData;