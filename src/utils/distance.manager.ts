import * as distance from 'google-distance-matrix';
import {DIRECTION_MATRIX_API_KEY} from "../config/app.config";
import axios, {AxiosRequestConfig, AxiosPromise} from 'axios';
import {LocationNotFound} from "../shared/filters/throwable.not.found";

distance.key(DIRECTION_MATRIX_API_KEY);
distance.units('metric');

export class DistanceManager {
    private static modes = ['driving', 'walking', 'bicycling', 'transit'];
    private static AddressBaseURL = 'http://maps.googleapis.com/maps/api/geocode/json?';

    public static async calculate(origin: string, destination: string): Promise<{ kilometer: string, total_time: string }> {
        try {
            const result: any = await new Promise(async (resolve, reject) => {
                distance.matrix([origin], [destination], (error, res) => error ? reject(error) : resolve(res)); // accepts only single array of value to avoid too many payloads
            });
            if (!(result.status.toUpperCase() === 'OK')) return null;
            const element = result.rows[0].elements[0];
            if (!(element.status.toUpperCase() === 'OK')) return null;
            return {kilometer: element.distance.text, total_time: element.duration.text};
        } catch (e) {
            throw new LocationNotFound();
        }
    }

    public static async getAddress(latitude, longitude) {
        const address = await axios.get(`${DistanceManager.AddressBaseURL}latlng=${latitude},${longitude}&sensor=true`);
        console.log({address});
        return address;
    }
}