import mongoose from 'mongoose';
import { mongoConnectionStr } from './../config.js';

export function connectToDB(){
    return new Promise((resolve, reject) => {
        try {
            mongoose.connect(mongoConnectionStr)
            resolve(console.log('Connected to Database'))
        } catch (error) {
            reject(
                console.error(`Can't Connect to Database: ${error}`)
            )
        }
    })
}

