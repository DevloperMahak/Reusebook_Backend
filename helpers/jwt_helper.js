const jwt = require('jsonwebtoken')
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

class UserService{
    static async generateToken(tokenData,secretKey,jwt_expire){
        return jwt.sign(tokenData,secretKey,{expiresIn:jwt_expire});
    }

    static async checkToken(req,res,next){
        let token = req.headers["authorization"];
        console.log(token);
        token = token.slice(7,token.length);
        if(token){
            jwt.verify(token,"mahakSuperSecretKey",(err,decoded)=>{
                if(err){
                    return res.json({
                        status:false,
                        message:"token is invalid"
                    })
                }
                else{
                    req.decoded = decoded;
                    next();
                }
            })
        }
        else{
            return res.json({
                status:false,
                message:"token is not provided" 
            })
        }
    }
}

module.exports = UserService;