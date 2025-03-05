import axios from "axios";
import configVariables from "../../../server/config";
import responseData from "../../../common/constants/responseData.json";
import responseStatus from "../../../common/constants/responseStatus.json";

export async function getDistance(req, res) {
  try {
    const origins = req.body.origins;
    const destinations = req.body.destinations;

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        params: {
          origins,
          destinations,
          key: configVariables.GMAP_ID,
          mode: "driving", // Add mode parameter
          units: "metric", // Add units parameter
        },
      }
    );

    const address = response.data.origin_addresses[0];

    // Extract the distance value
    const distanceValue = response.data.rows[0].elements[0].distance.value;

    // Return the distance value in the response
    return res.status(responseStatus.STATUS_SUCCESS_OK).json({
      status: responseData.SUCCESS,
      data: { distance: distanceValue / 1000, address: address }
    });
  } catch (error) {
    logger.error(error);
    return res.status(responseStatus.INTERNAL_SERVER_ERROR).json({
      status: responseData.ERROR,
      error: "An error occurred while fetching distance."
    });
  }
}

// API to get distance using pincode
export async function getDistanceByPincode(req, res) {
  try {
    const { pincode, destinations } = req.body;

    if (!pincode || !destinations) {
      return res.status(responseStatus.BAD_REQUEST).json({
        status: responseData.ERROR,
        error: "Pincode and destinations are required."
      });
    }

    // Step 1: Convert Pincode to Location
    const geocodeResponse = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: pincode,
        key: configVariables.GMAP_ID,
      },
    });

    // Check if valid response
    if (geocodeResponse.data.status !== "OK") {
      return res.status(responseStatus.BAD_REQUEST).json({
        status: responseData.ERROR,
        error: "Invalid pincode or no location found."
      });
    }

    // Extract formatted address & location
    const location = geocodeResponse.data.results[0].formatted_address;
    const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
    const origin = `${lat},${lng}`;

    // Step 2: Get Distance
    const distanceResponse = await axios.get("https://maps.googleapis.com/maps/api/distancematrix/json", {
      params: {
        origins: origin,
        destinations,
        key: configVariables.GMAP_ID,
        mode: "driving",
        units: "metric",
      },
    });

    // Check distance API response
    const distanceData = distanceResponse.data;
    if (distanceData.status !== "OK" || distanceData.rows[0].elements[0].status !== "OK") {
      return res.status(responseStatus.BAD_REQUEST).json({
        status: responseData.ERROR,
        error: "Failed to get distance information."
      });
    }

    // Extract distance and address
    const distanceValue = distanceData.rows[0].elements[0].distance.value; // In meters
    const distanceKm = distanceValue / 1000; // Convert to kilometers
    const address = distanceData.origin_addresses[0];

    // Step 3: Send Response
    return res.status(responseStatus.STATUS_SUCCESS_OK).json({
      status: responseData.SUCCESS,
      data: {
        distance: distanceKm,
        address: address || location,
      }
    });

  } catch (error) {
    logger.error(error);
    return res.status(responseStatus.INTERNAL_SERVER_ERROR).json({
      status: responseData.ERROR,
      error: "An error occurred while fetching distance."
    });
  }
}