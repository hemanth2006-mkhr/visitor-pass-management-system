import User from "../models/User.js"
import bcrypt from "bcrypt"
import generateToken from "../utils/generateToken.js"

export const Login = async(req, res) => {
    try {
        const {email, password} = req.body;
        
        if(!email || !password){
            return res.status(401).json({
                success : false,
                message : "All fields are required"
            });
        }

        const user = await User.findOne({
            email : email.toLowerCase()
        }).select("+password").populate("employee");

        if(!user){
            return res.status(400).json({
                success : false,
                message : "Incorrect email or password"
            })
        }
 
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        
        if(!isPasswordMatch){
            return res.status(400).json({
                success : false,
                message : "Incorrect email or password"
            })
        }

        const token = generateToken(user)

        // 💡 SAFELY EXTRACT NAME HERE
        // If employee exists, use user.employee.name; otherwise fallback to "Admin"
        const userName = user.employee?.name || "Admin";

        return res.status(200).json({
            success : true,
            message : "Login Successfully",
            token,
            user : { 
                _id : user._id, 
                name: userName, // Safe from null crashes
                email : user.email, 
                role : user.role 
            }
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}