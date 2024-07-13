import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { username, email, password } = await req.json();
        let existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken: " + username,
                },
                {
                    status: 400,
                }
            );
        }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            if(existingUser.isVerified){
                return Response.json(
                    {
                        status: false,
                        message:"User already exist with this email",
                    },
                    {
                        status: 400
                    }
                );
            }
            else{
                const hashedPassword = await bcrypt.hash(password,10);
                existingUser.verifyCode = verifyCode;
                existingUser.password = hashedPassword;
                existingUser.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUser.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryTime = new Date();
            expiryTime.setHours(expiryTime.getHours() + 1);
            const newUser = new UserModel({
                email,
                password: hashedPassword,
                isVerified: false,
                username,
                verifyCodeExpiry: expiryTime,
                verifyCode
            });
            await newUser.save();
            
        }
        let emailResponse = await sendVerificationEmail(email,username,verifyCode);
        if(!emailResponse.success){
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                {
                    status: 500,
                }
            )
        }
        return Response.json(
            {
                status: true,
                message:'User registered successfully. Please verify your email.'
            },
            {
                status: 201
            }
        )
    } catch (error) {
        console.error();
        return Response.json(
            {
                status: false,
                message: "Error registering user",
            },
            {
                status: 500,
            }
        );
    }
}
