const User = require("../models/User");
const authController = require("../controllers/authController");
const ErrorResponse = require("../utils/errorResponse");

jest.mock("../models/User");

describe("Auth Controller", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { id: "mockUserId" },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const mockUser = {
        _id: "mockUserId",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "user",
        phoneNumber: "1234567890",
        getSignedJwtToken: jest.fn().mockReturnValue("mockToken"),
      };

      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
        phoneNumber: "1234567890",
      };

      User.create.mockResolvedValue(mockUser);

      await authController.register(mockReq, mockRes, mockNext);

      expect(User.create).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
        role: "user",
        phoneNumber: "1234567890",
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.cookie).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        token: "mockToken",
        user: {
          id: "mockUserId",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          role: "user",
        },
      });
    });
  });

  describe("login", () => {
    it("should login user successfully with valid credentials", async () => {
      const mockUser = {
        _id: "mockUserId",
        email: "john@example.com",
        matchPassword: jest.fn().mockResolvedValue(true),
        getSignedJwtToken: jest.fn().mockReturnValue("mockToken"),
      };

      mockReq.body = {
        email: "john@example.com",
        password: "password123",
      };

      const mockSelect = jest.fn().mockResolvedValue(mockUser);
      const mockFindOne = jest.fn().mockReturnValue({ select: mockSelect });
      User.findOne = mockFindOne;

      await authController.login(mockReq, mockRes, mockNext);

      expect(mockFindOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(mockSelect).toHaveBeenCalledWith("+password");
      expect(mockUser.matchPassword).toHaveBeenCalledWith("password123");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.cookie).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        token: "mockToken",
        user: {
          id: "mockUserId",
          firstName: undefined,
          lastName: undefined,
          email: "john@example.com",
          role: undefined,
        },
      });
    });

    it("should return error if email or password is missing", async () => {
      mockReq.body = {
        email: "john@example.com",
      };

      await authController.login(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorResponse));
    });

    it("should return error if user not found", async () => {
      mockReq.body = {
        email: "john@example.com",
        password: "password123",
      };

      const mockSelect = jest.fn().mockResolvedValue(null);
      const mockFindOne = jest.fn().mockReturnValue({ select: mockSelect });
      User.findOne = mockFindOne;

      await authController.login(mockReq, mockRes, mockNext);

      expect(mockFindOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(mockSelect).toHaveBeenCalledWith("+password");
      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorResponse));
    });
  });

  describe("logout", () => {
    it("should logout user successfully", async () => {
      await authController.logout(mockReq, mockRes, mockNext);

      expect(mockRes.cookie).toHaveBeenCalledWith("token", "none", {
        expires: expect.any(Date),
        httpOnly: true,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {},
      });
    });
  });
});
