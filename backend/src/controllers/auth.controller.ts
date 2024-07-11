import * as express from "express";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import Cognito from "../services/cognito.service";
import { UserService } from "../services/user.service";
import cors from "cors";

class AuthController {
  public path = "/auth";
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.use(cors()); // 添加CORS中间件

    this.router.post("/signup", this.validateBody("signUp"), this.signUp);
    this.router.post("/signin", this.validateBody("signIn"), this.signIn);
    this.router.post("/verify", this.validateBody("verify"), this.verify);
    this.router.post(
      "/forgot-password",
      this.validateBody("forgotPassword"),
      this.forgotPassword
    );
    this.router.post(
      "/confirm-password",
      this.validateBody("confirmPassword"),
      this.confirmPassword
    );
    // this.router.post(
    //   "/verify-code",
    //   this.validateBody("verifyCode"),
    //   this.verifyCode
    // );
  }

  // Signup new user
  // Signup new user
  signUp = (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log(result);
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("没有收到任何数据");
      return res.status(400).json({ message: "没有收到任何数据" });
    }

    console.log("Received request body:", req.body);

    const { email, password } = req.body;

    let userAttr = [
      { Name: "email", Value: email },
      { Name: "gender", Value: "" },
      { Name: "birthdate", Value: "" },
      { Name: "name", Value: "" },
      { Name: "family_name", Value: "" },
    ];

    let cognitoService = new Cognito();
    cognitoService
      .signUpUser(email, password, userAttr)
      .then(async (result) => {
        if (result) {
          console.log("User registration successful");

          const userSub = result.UserSub;
          console.log("UserSub:", userSub); // 添加日志确认 userSub 是否正确获取

          try {
            const userService = new UserService();

            // 创建用户
            await userService.createUserIfNotExists(userSub, email);

            res
              .status(200)
              .json({ message: "User registration and storage successful" });
          } catch (err) {
            console.error("Error storing user information:", err);
            res
              .status(500)
              .json({
                message:
                  "User registration successful, but failed to store user information",
              });
          }
        } else {
          console.log("User registration failed");
          res.status(400).end();
        }
      })
      .catch((err) => {
        console.error("Error during user registration:", err);
        console.error("Error code:", err.code); // 输出错误代码
        console.error("Error message:", err.message); // 输出错误信息

        let errorMessage = "Internal server error";
        let statusCode = 500;

      // 根据 AWS Cognito 返回的错误代码确定返回的错误信息
      if (err.code === "UsernameExistsException") {
        errorMessage = "User already exists";
        statusCode = 400;
      } else if (err.code === "InvalidPasswordException" || "InvalidParameterException") {
        errorMessage =
          "Password must be at least 8 characters, with one number, 1 special character, 1 uppercase, and 1 lowercase letter.";
        statusCode = 400;
      } else if (err.code === "NotAuthorizedException") {
        errorMessage = "Not authorized";
        statusCode = 400;
      } else if (err.code === "TooManyRequestsException") {
        errorMessage = "Too many requests, please try again later";
        statusCode = 429;
      } else if (
        err.code === "InvalidLambdaResponseException" ||
        err.code === "InvalidEmailRoleAccessPolicyException"
      ) 

        // 打印即将发送的错误信息
        console.log("Sending error response:", { statusCode, errorMessage });
        res.status(statusCode).json({ message: errorMessage });
      });
  };

  // Use username and password to authenticate user
  // Use username and password to authenticate user
  signIn = (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }
    console.log(req.body);

    const { username, password } = req.body;
    let cognitoService = new Cognito();
    cognitoService
      .signInUser(username, password)
      .then(async (tokens) => {
        if (tokens) {
          // // 从ID Token中获取用户信息
          // const userInfo = cognitoService.getUserInfoFromToken(
          //   tokens.AuthenticationResult.IdToken
          // );
          // const userService = new UserService();
          // // 检查并创建用户
          // await userService.createUserIfNotExists(userInfo.sub, userInfo.email);

          // 将 token 发送给前端
          res.status(200).json(tokens.AuthenticationResult);
        } else {
          // 如果 tokens 为空，抛出一个错误，以便在 catch 块中处理
          throw new Error("InvalidToken");
        }
      })
      .catch((err) => {
        console.error("Error object:", err, "           1111111end"); // 打印错误对象
        // 处理 Cognito 错误信息
        console.error("test 111111111111111111111" + err.code); // 打印详细错误信息
        console.error("test messege111111111111111111111" + err.messege); // 打印详细错误信息

        let errorMessage = "Login failed";
        if (err.code === "UserNotConfirmedException") {
          errorMessage = "User is not confirmed, Please confirm your email";
        } else if (err.code === "NotAuthorizedException") {
          errorMessage = "Incorrect username or password, Please try again";
        } else if (err.code === "UserNotFoundException") {
          errorMessage = "User does not exist";
        } else if (err.message === "InvalidToken") {
          errorMessage = "Login failed. Please try again."; // 这个信息可以自定义或省略
        } else {
          errorMessage = "An unknown error occurred";
        }
        console.error(
          errorMessage,
          "the final decesion made that need send to front end"
        ); // 打印详细错误信息

        console.log(err.code + "check the err code ")

        res.status(400).json({ message: errorMessage });
      });
  };

  // confirm signup account with code sent to email
  verify = (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }
    console.log(req.body);
    const { username, code } = req.body;

    let cognitoService = new Cognito();
    cognitoService.confirmSignUp(username, code).then((success) => {
      success ? res.status(200).end() : res.status(400).end();
    });
  };

  confirmPassword = (req: Request, res: Response) => {
    const result = validationResult(req);
    console.log("Validation Result:", result);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }
    const { username, newPassword, code } = req.body; // 修改此处为 newPassword
    console.log("Received Username:", username);
    console.log("Received New Password:", newPassword);
    console.log("Received Code:", code);

    let cognitoService = new Cognito();
    cognitoService
      .confirmNewPassword(username, newPassword, code) // 修改此处为 newPassword
      .then((success) => {
        if (success) {
          console.log("Password reset successful");
          res.status(200).end();
        } else {
          console.log("Password reset failed");
          res.status(400).end();
        }
      })
      .catch((error) => {
        console.error("Error in confirmPassword:", error);
        res.status(500).json({ message: "Internal server error" });
      });
  };

  forgotPassword = (req: Request, res: Response) => {
    // 记录收到的请求体数据
    console.log("Received request body:", req.body);

    const result = validationResult(req);
    // 记录验证结果
    console.log("Validation result:", result);

    if (!result.isEmpty()) {
      // 记录验证失败时的错误信息
      console.log("Validation failed:", result.array());
      return res.status(422).json({ errors: result.array() });
    }

    const { username } = req.body;
    // 记录提取的用户名
    console.log("Extracted username:", username);

    let cognitoService = new Cognito();
    cognitoService
      .forgotPassword(username)
      .then((success) => {
        if (success) {
          // 记录成功发送验证码
          console.log("Verification code sent successfully");
          res.status(200).end();
        } else {
          // 记录发送验证码失败
          console.log("Failed to send verification code");
          res.status(400).end();
        }
      })
      .catch((error) => {
        // 记录发生的错误
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Internal server error" });
      });
  };

  // 添加 verifyCode 方法
  // 在 auth.controller.ts 中
  // verifyCode = (req: Request, res: Response) => {
  //   const result = validationResult(req);
  //   if (!result.isEmpty()) {
  //     return res.status(422).json({ errors: result.array() });
  //   }
  //   const { username, code } = req.body;

  //   let cognitoService = new Cognito();
  //   cognitoService.verifyCode(username, code)
  //     .then(success => {
  //       if (success) {
  //         res.status(200).end();
  //       } else {
  //         res.status(400).json({ message: 'Invalid or expired code' });
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error in verifyCode:', error);
  //       res.status(500).json({ message: 'Internal server error' });
  //     });
  // };

  private validateBody(type: string) {
    switch (type) {
      case "signUp":
        return [
          body("email")
            .notEmpty()
            .withMessage("Email is required")
            .normalizeEmail()
            .isEmail()
            .withMessage("Invalid email format"),
          body("password")
            .isString()
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),
        ];
      case "signIn":
        return [
          body("username").notEmpty().isLength({ min: 0 }),
          body("password").isString().isLength({ min: 0 }),
        ];
      case "verify":
        return [
          body("username").notEmpty().isLength({ min: 5 }),
          body("code").notEmpty().isString().isLength({ min: 6, max: 6 }),
        ];
      case "forgotPassword":
        return [body("username").notEmpty().isLength({ min: 5 })];
      case "confirmPassword":
        return [
          body("newPassword").exists().isLength({ min: 8 }),
          body("username").notEmpty().isLength({ min: 5 }),
          body("code").notEmpty().isString().isLength({ min: 6, max: 6 }),
        ];
      case "verifyCode":
        return [
          body("username").notEmpty().isLength({ min: 5 }),
          body("code").notEmpty().isString().isLength({ min: 6, max: 6 }),
        ];
    }
  }
}

export default AuthController;
