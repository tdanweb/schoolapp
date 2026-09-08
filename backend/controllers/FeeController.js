import Fee from "../models/Fee.js";

export const SetTermFee = async (req, res) => {
    //always get term and session from backend Admin setting in this case
    const {classId} = req.body

    try {
        const fee = await Fee.updateMany()
    } catch (error) {
        
    }
}