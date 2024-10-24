import axios from "axios";

export const filterPaginationData = async ({ state, data, page, countRoute, data_to_send, create_new_array = false, }) => {
    let obj;

    if (state !== null && create_new_array) {
        obj = { ...state, result: [...state.result, ...data], page: page }
    }
    else {
        await axios.post(process.env.REACT_APP_URL + "/blog/" + countRoute, data_to_send)
            .then(({ data: { totalDocs } }) => {
                obj = { results: data, page: 1, totalDocs }
            })
            .catch(err => {
                console.log(err)
            })
    }


    return obj
}