import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import Notification from "../models/notification.model.js";
import Auction from "../models/auction.model.js";
import Bid from "../models/bid.model.js";

// @desc send notification
// @route POST /api/v1/send-notification
// @access Private

// const sendNotification = asyncHandler(async (req, res) => {
//   const { auctionId, type, newBidAmount } = req.body;

//   //check auctionid , type , ammount
//   if (!auctionId || !type || !newBidAmount) {
//     return res
//       .status(400)
//       .json(
//         new ApiResponse(400, "Auction ID, type and new bid amount are required")
//       );
//   }

//   //find auciton
//   let auction = await Auction.findById(auctionId);
//   if (!auction) {
//     return res.status(404).json(new ApiResponse(404, "Auction not found"));
//   }

//   //check notification type
//   if (type === "BID_PLACED") {
//     var notification = {
//       user: null,
//       message: `${req?.user?.fullName} has placed a ${newBidAmount} bid on ${auction?.name}`,
//       type: "BID_PLACED",
//       auction: auctionId,
//       link: `/single-auction-detail/${auctionId}`,
//     };
//   }

//   try {
//     // Find all bids for the auction
//     const bids = await Bid.find({ auction: auctionId });

//     // Get all unique user IDs from the bids
//     const userIds = new Set(bids.map((bid) => bid.bidder.toString()));

//     // Add the owner of the item to the user IDs
//     userIds.add(auction.seller.toString());

//     // Create a notification for each user ID
//     userIds.forEach(async (id) => {
//       notification.message = `${
//         id === req?.user?._id.toString() ? "you" : req?.user?.fullName
//       } placed a ${newBidAmount} bid on  ${auction?.name}`;

//       await new Notification({ ...notification, user: id }).save();
//     });

//     return res
//       .status(200)
//       .json(new ApiResponse(200, "Notification sent successfully"));
//   } catch (error) {
//     // Handle the error
//     return res
//       .status(500)
//       .json(new ApiResponse(500, error?.message || "Internal server error"));
//   }
// });

// @desc send notification
// @route POST /api/v1/send-notification
// @access Private

const sendNotification = asyncHandler(async (req, res) => {
  const { auctionId, type, newBidAmount } = req.body;

  //check auctionid , type , ammount
  if (!auctionId || !type || !newBidAmount) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, "Auction ID, type and new bid amount are required")
      );
  }

  //find auction
  let auction = await Auction.findById(auctionId);
  if (!auction) {
    return res.status(404).json(new ApiResponse(404, "Auction not found"));
  }

  //check notification type
  if (type === "BID_PLACED") {
    var notification = {
      user: null,
<<<<<<< HEAD
      message: `${req?.user?.fullName} has placed a ${newBidAmount} bid on ${auction?.name}`,
=======
      message: `${req?.user?.fullName} has placed a ${newBidAmount}₹ bid on ${auction?.name}`,
>>>>>>> fa7afd1ece47dda72de1848f6b84f48475595cf5
      type: "BID_PLACED",
      auction: auctionId,
      link: `/single-auction-detail/${auctionId}`,
    };
  }

  if (type === "AUCTION_WON") {
    const winnerBid = await Bid.findById(auction.winner); // Assuming auction.winner contains the winner's bid ID
    const winnerUser = winnerBid ? await winnerBid.populate("bidder") : null;

    // Creating winner notification
    if (winnerUser) {
      notification = {
        user: winnerUser.bidder._id,
        message: `Congratulations! You have won the auction for ${auction?.name} with a bid of ${winnerBid.bidAmount}`,
        type: "AUCTION_WON",
        auction: auctionId,
        link: `/single-auction-detail/${auctionId}`,
      };

      // Send notification to the winner
      await new Notification({ ...notification }).save();
    }

    // Inform other bidders
    const otherBidders = await Bid.find({ auction: auctionId }).populate("bidder");
    otherBidders.forEach(async (bid) => {
      if (bid.bidder._id.toString() !== winnerUser?.bidder._id.toString()) {
        notification = {
          user: bid.bidder._id,
          message: `You lost the auction for ${auction?.name}. The winning bid was ${winnerBid.bidAmount}`,
          type: "AUCTION_LOST",
          auction: auctionId,
          link: `/single-auction-detail/${auctionId}`,
        };
        await new Notification({ ...notification }).save();
      }
    });
  }

  try {
    // Find all bids for the auction
    const bids = await Bid.find({ auction: auctionId });

    // Get all unique user IDs from the bids
    const userIds = new Set(bids.map((bid) => bid.bidder.toString()));

    // Add the owner of the item to the user IDs
    userIds.add(auction.seller.toString());

    // Create a notification for each user ID
    userIds.forEach(async (id) => {
      notification.message = `${
        id === req?.user?._id.toString() ? "you" : req?.user?.fullName
<<<<<<< HEAD
      } placed a ${newBidAmount} bid on  ${auction?.name}`;
=======
      } placed a ${newBidAmount}₹ bid on  ${auction?.name}`;
>>>>>>> fa7afd1ece47dda72de1848f6b84f48475595cf5

      await new Notification({ ...notification, user: id }).save();
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Notification sent successfully"));
  } catch (error) {
    // Handle the error
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});


// @desc Get all notifications for a user
// @route GET /api/v1/notifications/get-notification/:userId
// @access Private
const getUserNotifications = asyncHandler(async (req, res) => {
  if (!req?.user?._id) {
    return res.status(400).json(new ApiResponse(400, "User ID is required"));
  }
  try {
    const notifications = await Notification.find({
      user: req?.user?._id,
    })
    .sort({ createdAt: -1 })
    .populate("auction", "name image")
    .populate({
      path: "auction",
      populate: {
        path: "bids",
        model: "Bid",
      },
    
    })

    if (!notifications) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Notifications not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Notifications found", notifications));
  } catch (error) {
    // Handle the error
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});


// @desc mark notification as read
// @route PUT /api/v1/notifications/mark-as-read/:id
// @access Private

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req?.params?.id);

  if (!notification) {
    return res.status(404).json(new ApiResponse(404, "Notification not found"));
  }

  notification.isRead = true;
  await notification.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Notification marked as read"));
});


// @desc mark all notification as read
// @route PUT /api/v1/notifications/mark-all-as-read
// @access Private

const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req?.user?._id },
    { $set: { isRead: true } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "All notifications marked as read"));
});




export { 
  sendNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
