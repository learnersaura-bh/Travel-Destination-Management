const express = require("express");

const {
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
} = require("../controllers/destination.controller");

const destinationRouter = express.Router();

destinationRouter.post("/", async (req, res) => {
  try {
    const destinationData = req.body;
    const savedDestination = await createTravelDestination(destinationData);

    if (savedDestination) {
      res.status(201).json({
        error: null,
        message: "Destination saved successfully",
        savedDestination,
      });
    } else {
      res.status(400).json({
        error: "Failed to save destination",
        message: null,
        savedDestination: null,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: null, savedDestination: null });
  }
});

destinationRouter.get("/", async (req, res) => {
  try {
    const allDestinations = await readAllTravelDestinations();
    if (allDestinations.length > 0) {
      res.status(200).json({
        message: "Destinations successfully fetched",
        destinations: allDestinations,
      });
    } else {
      res.status(404).json({ error: "Failed to fetch destinations" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error while fetching destinations : ${error.message} ` });
  }
});

destinationRouter.get("/rating", async (req, res) => {
  try {
    const destinations = await readTravelDestinationsByRating();
    if (destinations.length > 0) {
      res.status(200).json({
        message: "Destinations successfully fetched based on ratings",
        destinations: destinations,
      });
    } else {
      res.status(404).json({ error: "Failed to fetch destinations" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error while fetching destinations : ${error.message} ` });
  }
});

destinationRouter.get("/filter/:minRating", async (req, res) => {
  try {
    const minRating = parseFloat(req.params.minRating);
    const filteredDestinations = await filterDestinationsByRating(minRating);

    if (filteredDestinations.length > 0) {
      res.status(200).json({
        message: `Destinations with a rating of ${minRating} or higher fetched successfully`,
        filteredDestinations,
      });
    } else {
      res
        .status(404)
        .json({ error: "No destinations found with the specified rating" });
    }
  } catch (error) {
    console.error("Error filtering destinations by rating:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

destinationRouter.get("/location/:location", async (req, res) => {
  try {
    const locationName = req.params.location;
    const destinationsByLocation =
      await readTravelDestinationsByLocation(locationName);
    if (destinationsByLocation.length > 0) {
      res.status(200).json({
        message: "Destination by location fetched successfully",
        destinations: destinationsByLocation,
      });
    } else {
      res.status(404).json({ error: "Failed to fetch destinations" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

destinationRouter.post("/:destinationId", async (req, res) => {
  try {
    const destinationId = req.params.destinationId;
    const updatedData = req.body;
    const updatedDestination = await updateTravelDestination(
      destinationId,
      updatedData,
    );
    if (updatedDestination) {
      res.status(201).json({
        error: null,
        message: "Destination updated successfully",
        updatedDestination,
      });
    } else {
      res.status(400).json({
        error: "Failed to update destination",
        message: null,
        updatedDestination: null,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

destinationRouter.post('/:destinationId/reviews', async (req, res) => {
  try {
    const { userId, reviewText } = req.body;
    const updatedDestination = await addReviewToDestination(req.params.destinationId, userId, reviewText);
    if (updatedDestination) {
      res.status(201).json({ message: 'Review added successfully to destination', updatedDestination })
    } else {
      res.status(404).json({ error: 'Destination or user not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review to destination' })
  }
})

destinationRouter.get("/:name", async (req, res) => {
  try {
    const destinationName = req.params.name;
    const requestedDestination =
      await getTravelDestinationByName(destinationName);

    if (requestedDestination) {
      res.status(200).json({
        message: "Requested Destination fetched successfully",
        requestedDestination,
      });
    } else {
      res.status(404).json({ error: "Requested Destination not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

destinationRouter.get("/:destinationId/reviews", async (req, res) => {
  try {
    const destinationId = req.params.destinationId;

    const destinationReviews =
      await getDestinationReviewsWithUserDetails(destinationId);

    if (destinationReviews.length > 0) {
      res.status(200).json({
        message: `Reviews for destination ${destinationId} fetched successfully`,
        reviews: destinationReviews,
      });
    } else {
      res
        .status(404)
        .json({ error: "No reviews found for the specified destination" });
    }
  } catch (error) {
    console.error("Error retrieving reviews for destination:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

destinationRouter.delete("/:destinationId", async (req, res) => {
  try {
    const destinationId = req.params.destinationId;

    const deletedDestination = await deleteTravelDestination(destinationId);

    if (deletedDestination) {
      console.log(deletedDestination);
      res.status(200).json({
        message: "Destination deleted successfully",
        deletedDestination,
      });
    } else {
      res.status(404).json({ error: "Destination not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = destinationRouter;
