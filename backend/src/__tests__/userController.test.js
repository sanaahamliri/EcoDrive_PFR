const User = require("../models/User");
const userController = require("../controllers/userController");
const ErrorResponse = require("../utils/errorResponse");

jest.mock("../models/User");

describe("User Controller", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: { id: "mockUserId", role: "user" },
      files: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should get user profile successfully with avatar", async () => {
      const mockUser = {
        _id: "mockUserId",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        avatar: {
          data: "base64ImageData",
          contentType: "image/jpeg",
        },
        toObject: jest.fn().mockReturnThis(),
      };

      mockReq.user.id = "mockUserId";
      User.findById.mockResolvedValue(mockUser);

      await userController.getProfile(mockReq, mockRes);

      expect(User.findById).toHaveBeenCalledWith("mockUserId");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          avatarUrl: "data:image/jpeg;base64,base64ImageData",
        }),
      });
    });

    it("should get user profile successfully without avatar", async () => {
      const mockUser = {
        _id: "mockUserId",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        toObject: jest.fn().mockReturnThis(),
      };

      mockReq.user.id = "mockUserId";
      User.findById.mockResolvedValue(mockUser);

      await userController.getProfile(mockReq, mockRes);

      expect(User.findById).toHaveBeenCalledWith("mockUserId");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          avatarUrl: null,
        }),
      });
    });

    it("should handle error when getting profile", async () => {
      mockReq.user.id = "mockUserId";
      User.findById.mockRejectedValue(new Error("Database error"));

      await userController.getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Erreur lors de la récupération du profil",
      });
    });
  });

  describe("updateProfile", () => {
    it("should update user profile successfully", async () => {
      const mockUser = {
        _id: "mockUserId",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phoneNumber: "1234567890",
      };

      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phoneNumber: "1234567890",
      };

      User.findOne.mockResolvedValue(null);
      User.findByIdAndUpdate.mockResolvedValue(mockUser);

      await userController.updateProfile(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({
        email: "john@example.com",
        _id: { $ne: "mockUserId" },
      });
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "mockUserId",
        mockReq.body,
        { new: true, runValidators: true }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
    });

    it("should return error if required fields are missing", async () => {
      mockReq.body = {
        firstName: "John",
      };

      await userController.updateProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Prénom, nom et email sont requis",
      });
    });

    it("should return error if email is already in use", async () => {
      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        email: "existing@example.com",
      };

      User.findOne.mockResolvedValue({ _id: "differentUserId" });

      await userController.updateProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Cet email est déjà utilisé",
      });
    });
  });

  describe("updateDriverProfile", () => {
    it("should update driver profile successfully", async () => {
      const mockUser = {
        _id: "mockUserId",
        role: "driver",
        driverInfo: {
          carModel: "Tesla Model 3",
          carYear: 2020,
          licensePlate: "ABC123",
        },
      };

      mockReq.user = { id: "mockUserId", role: "driver" };
      mockReq.body = {
        carModel: "Tesla Model 3",
        carYear: 2020,
        licensePlate: "ABC123",
      };

      User.findByIdAndUpdate.mockResolvedValue(mockUser);

      await userController.updateDriverProfile(mockReq, mockRes, mockNext);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "mockUserId",
        {
          "driverInfo.carModel": "Tesla Model 3",
          "driverInfo.carYear": 2020,
          "driverInfo.licensePlate": "ABC123",
        },
        { new: true, runValidators: true }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
    });

    it("should return error if user is not a driver", async () => {
      mockReq.user = { id: "mockUserId", role: "user" };

      await userController.updateDriverProfile(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorResponse));
    });

    it("should handle error when updating driver profile", async () => {
      mockReq.user = { id: "mockUserId", role: "driver" };
      mockReq.body = {
        carModel: "Tesla Model 3",
        carYear: 2020,
        licensePlate: "ABC123",
      };

      User.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));

      await userController.updateDriverProfile(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
