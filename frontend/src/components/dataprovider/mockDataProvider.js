import axios from "axios";
import { API_URL } from "../../App";

export const getMockData = async () => {
    try {
        const response = await axios
            .get(API_URL + "/getMockExamples/");
        return (response.data);
    } catch (error) {
        console.log(error);
    }
}