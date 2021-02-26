import axios from "axios";
const uploadData = async (
  endpoint,
  authtoken,
  frmData,
  cancelToken,
  progresscb
) => {
  try {
    const result = await axios.post(endpoint, frmData, {
      cancelToken: cancelToken.token,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `basic ${authtoken}`,
      },
      onUploadProgress: progresscb,
    });
    return result.data;
  } catch (e) {
    return false;
  }
};

export default {
  uploadData,
};
