const Ride = require("../models/Ride");
const User = require("../models/User");
const rideController = require("../controllers/rideController");
const ErrorResponse = require("../utils/errorResponse");

jest.mock("../models/Ride");
jest.mock("../models/User");

describe("Ride Controller", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: { id: "mockUserId", role: "driver" },
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("createRide", () => {
    it("should create a ride successfully when user is a driver with complete profile", async () => {
      const mockUser = {
        _id: "mockUserId",
        isDriverProfileComplete: jest.fn().mockReturnValue(true),
      };

      const mockRide = {
        _id: "mockRideId",
        driver: "mockUserId",
        departure: { city: "Paris" },
        destination: { city: "Lyon" },
        departureTime: new Date(),
        price: 50,
        availableSeats: 3,
      };

      mockReq.body = {
        departure: { city: "Paris" },
        destination: { city: "Lyon" },
        departureTime: new Date(),
        price: 50,
        availableSeats: 3,
      };

      User.findById.mockResolvedValue(mockUser);
      Ride.create.mockResolvedValue(mockRide);
      User.findByIdAndUpdate.mockResolvedValue({});

      await rideController.createRide(mockReq, mockRes);

      expect(User.findById).toHaveBeenCalledWith("mockUserId");
      expect(mockUser.isDriverProfileComplete).toHaveBeenCalled();
      expect(Ride.create).toHaveBeenCalledWith({
        ...mockReq.body,
        driver: "mockUserId",
      });
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith("mockUserId", {
        $inc: { "stats.totalTrips": 1 },
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockRide,
      });
    });

    it("should return error if user is not a driver", async () => {
      mockReq.user.role = "user";

      await rideController.createRide(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Seuls les conducteurs peuvent créer des trajets",
      });
    });

    it("should return error if driver profile is incomplete", async () => {
      const mockUser = {
        _id: "mockUserId",
        isDriverProfileComplete: jest.fn().mockReturnValue(false),
      };

      User.findById.mockResolvedValue(mockUser);

      await rideController.createRide(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String),
      });
    });
  });

  describe("getRides", () => {
    it("should get rides with filters and pagination", async () => {
      const mockRides = [
        {
          _id: "ride1",
          departure: { city: "Paris" },
          destination: { city: "Lyon" },
          departureTime: new Date(),
          price: 50,
          availableSeats: 3,
        },
      ];

      mockReq.query = {
        from: "Paris",
        to: "Lyon",
        date: "2024-03-25",
        maxPrice: "100",
        seats: "2",
        page: "1",
        limit: "10",
      };

      Ride.countDocuments.mockResolvedValue(1);
      Ride.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue(mockRides),
            }),
          }),
        }),
      });

      await rideController.getRides(mockReq, mockRes);

      expect(Ride.countDocuments).toHaveBeenCalled();
      expect(Ride.find).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        count: 1,
        totalPages: 1,
        currentPage: 1,
        pagination: {},
        data: mockRides,
      });
    });
  });

  describe("bookRide", () => {
    it("should book a ride successfully", async () => {
      const mockRide = {
        _id: "mockRideId",
        driver: "differentUserId",
        passengers: [],
        remainingSeats: 3,
        save: jest.fn(),
      };

      mockReq.params.id = "mockRideId";
      mockReq.body.seats = 2;

      Ride.findById.mockResolvedValue(mockRide);

      await rideController.bookRide(mockReq, mockRes, mockNext);

      expect(Ride.findById).toHaveBeenCalledWith("mockRideId");
      expect(mockRide.passengers).toHaveLength(1);
      expect(mockRide.passengers[0]).toEqual({
        user: "mockUserId",
        bookedSeats: 2,
      });
      expect(mockRide.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockRide,
      });
    });

    it("should return error if ride is not found", async () => {
      mockReq.params.id = "nonexistentRideId";
      Ride.findById.mockResolvedValue(null);

      await rideController.bookRide(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorResponse));
    });

    it("should return error if user tries to book their own ride", async () => {
      const mockRide = {
        _id: "mockRideId",
        driver: "mockUserId",
        passengers: [],
        remainingSeats: 3,
      };

      mockReq.params.id = "mockRideId";
      Ride.findById.mockResolvedValue(mockRide);

      await rideController.bookRide(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorResponse));
    });

    it("should return error if not enough seats available", async () => {
      const mockRide = {
        _id: "mockRideId",
        driver: "differentUserId",
        passengers: [],
        remainingSeats: 1,
      };

      mockReq.params.id = "mockRideId";
      mockReq.body.seats = 2;
      Ride.findById.mockResolvedValue(mockRide);

      await rideController.bookRide(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorResponse));
    });
  });
});
