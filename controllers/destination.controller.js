const Destination = require("../models/destination.model");

async function createTravelDestination(destinationData) {
  try {
    const newDestination = new Destination(destinationData);
    const savedDestination = await newDestination.save();
    console.log("New Destination Added :", savedDestination);
    return savedDestination;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getTravelDestinationByName(destinationName) {
  try {
    const foundDestination = await Destination.findOne({
      name: destinationName,
    });
    if (foundDestination) {
      console.log("Destination by name : ", foundDestination);
      return foundDestination;
    } else {
      console.log(`Destination with name "${destinationName}" not found`);
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function readAllTravelDestinations() {
  try {
    const allDestinations = await Destination.find();

    if (allDestinations.length > 0) {
      console.log("All Travel Destinations:", allDestinations);
      return allDestinations;
    } else {
      console.log("No travel destinations found.");
      return null;
    }
  } catch (error) {
    console.error("Error reading all travel destinations:", error.message);
    throw error;
  }
}

async function readTravelDestinationsByLocation(location) {
  try {
    const destinationsInLocation = await Destination.find({
      location: { $regex: new RegExp(location, "i") },
    });

    if (destinationsInLocation.length > 0) {
      console.log(
        `Travel Destinations in ${location}:`,
        destinationsInLocation,
      );
      return destinationsInLocation;
    } else {
      console.log(`No travel destinations found in ${location}.`);
      return null;
    }
  } catch (error) {
    console.error(
      "Error reading travel destinations by location:",
      error.message,
    );
    throw error;
  }
}

// Create a function readTravelDestinationsByRating that retrieves all travel destinations from the database and sorts them in descending order based on their ratings.

async function readTravelDestinationsByRating() {
  try {
    const sortedDestinations = await Destination.find().sort({ rating: -1 });

    if (sortedDestinations.length > 0) {
      console.log("Travel Destinations sorted by rating:", sortedDestinations);
      return sortedDestinations;
    } else {
      console.log("No travel destinations found.");
      return null;
    }
  } catch (error) {
    console.error(
      "Error reading travel destinations by rating:",
      error.message,
    );
    throw error;
  }
}

async function updateTravelDestination(destinationId, updatedData) {
  try {
    const updatedDestination = await Destination.findByIdAndUpdate(
      destinationId,
      updatedData,
      { new: true },
    );
    if (updatedDestination) {
      console.log("Updated Restaurant : ", updatedDestination);
      return updatedDestination;
    } else {
      console.log("Destination not found");
      throw new Error("Destination not found");
    }
  } catch (error) {
    console.error("Error while updating destination:", error.message);
    throw error;
  }
}

async function deleteTravelDestination(destinationId) {
  try {
    const deletedDestination = await Destination.findByIdAndDelete({
      _id: destinationId,
    });
    if (deletedDestination) {
      console.log("Deleted Destination:", deletedDestination);
      return deletedDestination;
    } else {
      console.log("Destination not deleted");
      throw new Error("Destination not deleted");
    }
  } catch (error) {
    console.error("Error while deleting destination :", error.message);
    throw error;
  }
}

async function filterDestinationsByRating(minimumRating) {
  try {
    const filteredDestinations = await Destination.find({
      rating: { $gte: minimumRating },
    });

    if (filteredDestinations.length > 0) {
      console.log(
        `Travel Destinations with a rating of ${minimumRating} or higher:`,
        filteredDestinations,
      );
      return filteredDestinations;
    } else {
      console.log(
        `No travel destinations found with a rating of ${minimumRating} or higher.`,
      );
      throw new Error(
        `No travel destinations found with a rating of ${minimumRating} or higher.`,
      );
    }
  } catch (error) {
    console.error("Error filtering travel destinations by rating:", error);
    throw error;
  }
}

//  Updating Travel Destination Model with User Ratings and Reviews#
// Update the Travel Destination Model to include a reviews field:
// Create a function to add a review to a travel destination:

async function addReviewToDestination(destinationId, { reviewData }) {
  try {
    const destination = await Destination.findById(destinationId);

    if (!destination) {
      console.log("No travel destination found with the provided ID.");
      return null;
    }

    const newReview = reviewData;

    destination.reviews.push(newReview);

    // const newRating = (destination.rating * (destination.reviews.length - 1) + newReview.rating) / destination.reviews.length;
    // destination.rating = newRating;

    const updatedDestination = await destination.save();

    console.log("Review added to travel destination:", updatedDestination);
    return updatedDestination;
  } catch (error) {
    console.error("Error adding review to travel destination:", error.message);
    throw error;
  }
}

async function getDestinationReviewsWithUserDetails(destinationId) {
  try {
    const destinationWithReviews = await Destination.findById(
      destinationId,
    ).populate({
      path: "reviews",
      options: { limit: 3 },
      populate: { path: "user", select: "username" },
    });

    if (!destinationWithReviews) {
      console.log("No travel destination found with the provided ID.");
      return null;
    }

    const reviews = destinationWithReviews.reviews;

    console.log(
      "First 3 reviews of the travel destination with user details:",
      reviews,
    );
    return reviews;
  } catch (error) {
    console.error(
      "Error retrieving reviews of travel destination:",
      error.message,
    );
    throw error;
  }
}

module.exports = {
  createTravelDestination,
  getTravelDestinationByName,
  readAllTravelDestinations,
  readTravelDestinationsByLocation,
  readTravelDestinationsByRating,
  updateTravelDestination,
  deleteTravelDestination,
  filterDestinationsByRating,
  addReviewToDestination,
  getDestinationReviewsWithUserDetails,
};
