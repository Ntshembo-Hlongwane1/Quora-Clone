import formidable from "formidable";
import dotenv from "dotenv";
import Cloudinary from "cloudinary";
import { userModel } from "../../Model/User/Users";
import { userSessions } from "../../Model/UserSessions/UserSessions";
import Bcrypt from "bcrypt";

dotenv.config();

const cloudinary = Cloudinary.v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

class AuthController {
  SignUp(request, response) {
    const form = new formidable.IncomingForm();

    try {
      form.parse(request, async (error, fields, files) => {
        if (error) {
          console.error(error);
          return response
            .status(500)
            .json({ msg: "Network Error: Failed to register try again later" });
        }

        const { username, password } = fields;
        const { image } = files;

        if (!username || !password || !image) {
          return response.status(400).json({ msg: "All fields are required" });
        }

        if (password.length < 6) {
          return response
            .status(400)
            .json({ msg: "Password has to be at least 6 characters" });
        }

        const isUserExisting = await userModel.findOne({ username: username });

        if (isUserExisting) {
          return response
            .status(404)
            .json({ msg: "User with this username already exist" });
        }

        cloudinary.uploader.upload(
          image.path,
          { folder: `/Quoara/ProfileImage/${username}` },
          async (error, results) => {
            if (error) {
              console.error(error);
              return response.status(500).json({
                msg:
                  "Image Upload Error: Failed to upload your profile image verify file type",
              });
            }

            const imgae_url = results.secure_url;
            const salt = await Bcrypt.genSalt(15);
            const hashedPassword = await Bcrypt.hash(password, salt);

            const newUser = new userModel({
              username,
              password: hashedPassword,
              profileImage: imgae_url,
            });

            const savedUser = await newUser.save();

            return response
              .status(201)
              .json({ msg: "New Account has been created" });
          }
        );
      });
    } catch (error) {
      return response
        .status(500)
        .json({ msg: "Server Error: Server currently down try again later" });
    }
  }

  Login(request, response) {
    const form = new formidable.IncomingForm();

    try {
      form.parse(request, async (error, fields, files) => {
        if (error) {
          console.error(error);
          return response
            .status(500)
            .json({ msg: "Network Error: Failed to register try again later" });
        }

        const { username, password } = fields;

        if (!username || !password) {
          return response.status(400).json({ msg: "All fields are required" });
        }

        const isUserExisting = await userModel.findOne({ username: username });

        if (!isUserExisting) {
          return response
            .status(404)
            .json({ msg: "Account with this username does not exist" });
        }
        const hashedPassword = isUserExisting.password;
        const isPasswordValid = await Bcrypt.compare(password, hashedPassword);

        if (!isPasswordValid) {
          return response.status(400).json({ msg: "Invalid Credentials" });
        }

        const isUserSessionAvailable = await userSessions.findOne({
          "session.user.username": username,
        });

        if (isUserSessionAvailable) {
          return response.status(200).json({ msg: "Already signed in" });
        }

        request.session.user = {
          username: isUserExisting.username,
          id: isUserExisting._id,
          profileImage: isUserExisting.profileImage,
        };

        response.status(200).send(request.sessionID);
      });
    } catch (error) {
      return response
        .status(500)
        .json({ msg: "Server Error: Server currently down try again later" });
    }
  }

  isLoggedIn(request, response) {
    const userSession = request.session || false;

    try {
      if (userSession) {
        return response
          .status(200)
          .json({
            auth_status: true,
            profileImage: userSession.user.profileImage,
          });
      }

      return response.status(200).json({ auth_status: false });
    } catch (error) {
      return response.status(500, {
        msg: "Server Error: Server currently down try again later",
      });
    }
  }
}

export default AuthController;
